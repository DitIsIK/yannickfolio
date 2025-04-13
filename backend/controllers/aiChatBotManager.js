// controllers/aiChatBotManager.js
const fs = require("fs");
const path = require("path");
const {
  opensearchClient,
  waitForOpenSearchConnection,
} = require("../config/opensearch");
// const { openaiClient } = require("../config/openai");
const { getDeepseekResponse } = require("../config/deepseek");

const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const {
  MIN_DB,
  MAX_DB,
  MIN_GITHUB,
  MAX_GITHUB,
  MIN_RESUME,
  MAX_RESUME,
  MAX_PROMPT_CHARS,
  DB_WEIGHT,
  GH_WEIGHT,
  RES_WEIGHT,
} = require("../config/constants");

// File paths for context data and cache.
const DB_FILE = path.join(__dirname, "../data/db-context.json");
const GITHUB_FILE = path.join(__dirname, "../data/github-context.json");
const RESUME_FILE = path.join(__dirname, "../data/resume-context.json");
const CACHE_FILE = path.join(__dirname, "../data/cache.json");
const INDEX_NAME = process.env.INDEX_NAME || "context-index";

/**
 * Waits for the specified index in OpenSearch to have a healthy status.
 */
async function waitForIndexReadiness(
  indexName,
  desiredStatus = "yellow",
  timeout = 60000
) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const healthResponse = await opensearchClient.cluster.health({
        index: indexName,
      });
      const indexStatus = healthResponse.body.status;
      console.log(
        `[${new Date().toISOString()}] Index [${indexName}] health status: ${indexStatus}`
      );
      if (indexStatus === "yellow" || indexStatus === "green") {
        console.log(
          `[${new Date().toISOString()}] Index [${indexName}] is ready.`
        );
        return;
      }
    } catch (err) {
      console.warn(
        `[${new Date().toISOString()}] Error checking index health: ${
          err.message
        }`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error(
    `Index [${indexName}] did not reach '${desiredStatus}' state within ${timeout} ms.`
  );
}

/**
 * Loads JSON data from files and breaks it into chunks.
 */
async function loadAndChunkData() {
  console.log(
    `[${new Date().toISOString()}] Loading and chunking context data...`
  );
  const dbData = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  const githubData = JSON.parse(fs.readFileSync(GITHUB_FILE, "utf8"));
  const resumeData = JSON.parse(fs.readFileSync(RESUME_FILE, "utf8"));

  const chunks = [];
  // Chunk DB data.
  Object.entries(dbData).forEach(([tableName, entries]) => {
    if (!Array.isArray(entries)) return;
    entries.forEach((entry) => {
      let titleKey = Object.keys(entry).find((k) =>
        k.toLowerCase().includes("title")
      );
      let title = titleKey ? entry[titleKey] : "";
      let contentParts = [];
      let taglineKey = Object.keys(entry).find((k) =>
        k.toLowerCase().includes("tagline")
      );
      let paragraphsKey = Object.keys(entry).find((k) =>
        k.toLowerCase().includes("paragraphs")
      );
      if (taglineKey && entry[taglineKey]) contentParts.push(entry[taglineKey]);
      if (paragraphsKey && Array.isArray(entry[paragraphsKey]))
        contentParts.push(...entry[paragraphsKey]);
      if (contentParts.length === 0) {
        if (entry.description) contentParts.push(entry.description);
        if (entry.skillDescription) contentParts.push(entry.skillDescription);
      }
      const content = contentParts.join(" ");
      chunks.push({ source: "db", section: tableName, title, content });
    });
  });

  // Chunk GitHub data.
  if (Array.isArray(githubData)) {
    githubData.forEach((repo) => {
      const title = repo.name || repo.full_name || "";
      let contentParts = [];
      if (repo.description) contentParts.push(repo.description);
      if (repo.language) contentParts.push(`Language: ${repo.language}`);
      const content = contentParts.join(" | ");
      chunks.push({ source: "github", title, content });
    });
  }

  // Chunk Resume data.
  if (resumeData.resume_text) {
    const lines = resumeData.resume_text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l);
    let currentSection = "General";
    let sectionContent = { General: [] };
    lines.forEach((line) => {
      if (/^[A-Z][A-Z0-9 &\-]+$/.test(line)) {
        currentSection = line;
        sectionContent[currentSection] = [];
      } else {
        sectionContent[currentSection].push(line);
      }
    });
    Object.entries(sectionContent).forEach(([section, lines]) => {
      if (lines.length > 0) {
        chunks.push({
          source: "resume",
          section,
          title: section,
          content: lines.join(" "),
        });
      }
    });
  }

  console.log(
    `[${new Date().toISOString()}] Created ${chunks.length} chunks from data.`
  );
  return chunks;
}

/**
 * Indexes chunks into OpenSearch using the bulk API.
 */
async function indexChunks(chunks) {
  console.log(
    `[${new Date().toISOString()}] Indexing chunks into OpenSearch...`
  );
  try {
    const exists = await opensearchClient.indices.exists({ index: INDEX_NAME });
    if (exists.body) {
      await opensearchClient.indices.delete({ index: INDEX_NAME });
      console.log(
        `[${new Date().toISOString()}] Deleted old index '${INDEX_NAME}'.`
      );
    }
  } catch (err) {
    console.error("Error checking/deleting index:", err);
  }
  try {
    await opensearchClient.indices.create({
      index: INDEX_NAME,
      body: {
        mappings: {
          properties: {
            source: { type: "keyword" },
            section: { type: "keyword" },
            title: { type: "text" },
            content: { type: "text" },
          },
        },
      },
    });
    console.log(`[${new Date().toISOString()}] Created index '${INDEX_NAME}'.`);
  } catch (err) {
    console.error("Error creating index:", err);
    return;
  }
  const bulkBody = [];
  chunks.forEach((chunk, idx) => {
    bulkBody.push({ index: { _index: INDEX_NAME, _id: idx + 1 } });
    bulkBody.push(chunk);
  });
  try {
    const bulkResponse = await opensearchClient.bulk({
      refresh: true,
      body: bulkBody,
    });
    if (bulkResponse.body.errors) {
      console.error("Bulk indexing errors:", bulkResponse.body);
    } else {
      console.log(
        `[${new Date().toISOString()}] Successfully indexed ${
          chunks.length
        } chunks.`
      );
    }
  } catch (err) {
    console.error("Error during bulk indexing:", err);
  }
}

/**
 * Dynamically searches for context chunks per source with field-level weighting and dynamic limits.
 */
async function dynamicSearchChunks(query) {
  const fields = ["title^2", "content"];
  // Base multi_match query.
  function baseQuery() {
    return { multi_match: { query, fields, type: "best_fields" } };
  }
  // Searches a given source.
  async function searchSource(source, size) {
    const body = {
      query: {
        bool: {
          must: baseQuery(),
          filter: { term: { source } },
        },
      },
    };
    const result = await opensearchClient.search({
      index: INDEX_NAME,
      size,
      body,
    });
    return result.body.hits.hits;
  }

  // Retrieve hits per source (up to the soft maximum).
  const [dbHits, ghHits, resHits] = await Promise.all([
    searchSource("db", MAX_DB),
    searchSource("github", MAX_GITHUB),
    searchSource("resume", MAX_RESUME),
  ]);

  // Helper: select hits with a hard minimum and then extras, applying a weight.
  function selectHits(hits, min, max, weight) {
    const selected = [];
    const initial = hits.slice(0, min);
    selected.push(...initial);
    const extras = hits.slice(min).map((hit) => {
      hit.adjustedScore = hit._score * weight;
      return hit;
    });
    extras.sort((a, b) => b.adjustedScore - a.adjustedScore);
    for (const hit of extras) {
      if (selected.length < max) {
        selected.push(hit);
      } else break;
    }
    return selected;
  }

  const selectedDB = selectHits(dbHits, MIN_DB, MAX_DB, DB_WEIGHT);
  const selectedGH = selectHits(ghHits, MIN_GITHUB, MAX_GITHUB, GH_WEIGHT);
  const selectedRES = selectHits(resHits, MIN_RESUME, MAX_RESUME, RES_WEIGHT);

  // Merge results and sort by original score.
  const merged = [...selectedDB, ...selectedGH, ...selectedRES];
  merged.sort((a, b) => b._score - a._score);

  // Enforce a global character budget.
  let totalChars = 0;
  const finalHits = [];
  for (const hit of merged) {
    const contentLength = (hit._source.content || "").length;
    if (totalChars + contentLength <= MAX_PROMPT_CHARS) {
      finalHits.push(hit);
      totalChars += contentLength;
    } else {
      break;
    }
  }
  console.log(
    `[${new Date().toISOString()}] Selected ${
      finalHits.length
    } final hits with total character count ${totalChars}.`
  );
  return finalHits;
}

/**
 * Builds a prompt using the selected chunks and the original query.
 */
function buildPrompt(chunks, userQuery) {
  let prompt = "Use the following information to answer the question:\n\n";
  for (const chunk of chunks) {
    let tag = "";
    if (chunk._source.source === "db") tag = "[DB]";
    else if (chunk._source.source === "github") tag = "[GitHub]";
    else if (chunk._source.source === "resume")
      tag = `[Resume - ${chunk._source.section}]`;
    prompt += `${tag} ${chunk._source.title}: ${chunk._source.content}\n\n`;
  }
  prompt += `Question: ${userQuery}\nAnswer:`;
  return prompt;
}

/**
 * Cache helper functions.
 */
function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const data = fs.readFileSync(CACHE_FILE, "utf8");
      return JSON.parse(data || "{}");
    } catch (err) {
      console.error("Error reading cache file:", err);
    }
  }
  return {};
}

function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (err) {
    console.error("Error writing cache file:", err);
  }
}

/**
 * Queries DeepSeek for a completion using the constructed prompt.
 */
async function queryDeepseek(prompt) {
  const cache = loadCache();
  if (cache[prompt]) {
    console.log(`[${new Date().toISOString()}] Cache hit for prompt.`);
    return cache[prompt];
  }
  console.log(
    `[${new Date().toISOString()}] Cache miss; sending prompt to DeepSeek.`
  );
  try {
    const response = await axios.post(
      `${process.env.DEEPSEEK_URL}/completion`,
      { prompt }
    );
    const answer = response.data.answer.trim();
    cache[prompt] = answer;
    saveCache(cache);
    return answer;
  } catch (err) {
    // Log additional error information, if available:
    if (err.response) {
      console.error("DeepSeek error response data:", err.response.data);
    }
    throw new Error("DeepSeek request failed: " + err.message);
  }
}

/**
 * Main interface: retrieves context, builds the prompt, and returns the prompt.
 */
async function getAnswer(userQuery) {
  const retrievedHits = await dynamicSearchChunks(userQuery);
  console.log(
    `[${new Date().toISOString()}] Retrieved hits: ${JSON.stringify(
      retrievedHits,
      null,
      2
    )}`
  );
  const prompt = buildPrompt(retrievedHits, userQuery);
  console.log(`[${new Date().toISOString()}] Final prompt:\n${prompt}\n`);
  const answer = await queryDeepseek(prompt);
  console.log(`[${new Date().toISOString()}] Answer:\n${answer}\n`);
  return answer;
  return prompt;
}

/**
 * Re-indexes all data: loads, chunks, and indexes documents.
 * Waits for OpenSearch to be ready before proceeding.
 */
async function reindexAll() {
  try {
    await waitForOpenSearchConnection();
    const chunks = await loadAndChunkData();
    await indexChunks(chunks);
    await waitForIndexReadiness(INDEX_NAME, "yellow", 60000);
    console.log(
      `[${new Date().toISOString()}] Re-indexing complete. The index is ready for processing.`
    );
    // Optionally, trigger further processing here.
  } catch (err) {
    console.error("Error during reindexAll:", err);
  }
}

// Initialization: wait for connection, then reindex data on startup.
async function initializeIndexWhenReady() {
  try {
    await waitForOpenSearchConnection();
    await reindexAll();
  } catch (err) {
    console.error("Error during index initialization:", err);
  }
}
initializeIndexWhenReady();

// Schedule re-indexing every hour.
setInterval(reindexAll, 3600 * 1000);

module.exports = { getAnswer, reindexAll };
