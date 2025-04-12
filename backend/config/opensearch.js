// config/opensearch.js
const { Client } = require("@opensearch-project/opensearch");
const dotenv = require("dotenv");
dotenv.config();

const OPENSEARCH_URL = process.env.OPENSEARCH_URL || "http://localhost:9200";
const OPENSEARCH_USERNAME = process.env.OPENSEARCH_USERNAME || "admin";
const OPENSEARCH_INITIAL_ADMIN_PASSWORD =
  process.env.OPENSEARCH_INITIAL_ADMIN_PASSWORD || "admin";

const opensearchClient = new Client({
  node: OPENSEARCH_URL,
  auth: {
    username: OPENSEARCH_USERNAME,
    password: OPENSEARCH_INITIAL_ADMIN_PASSWORD,
  },
  ssl: { rejectUnauthorized: false },
});

/**
 * Polls the OpenSearch cluster health endpoint until a healthy state ("yellow" or "green")
 * is reached or a timeout occurs.
 */
async function waitForOpenSearchConnection(
  timeout = 60000,
  pollInterval = 2000
) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const health = await opensearchClient.cluster.health();
      const status = health.body.status;
      console.log(
        `[${new Date().toISOString()}] OpenSearch cluster health: ${status}`
      );
      if (status === "yellow" || status === "green") {
        console.log(
          `[${new Date().toISOString()}] OpenSearch connection established.`
        );
        return;
      }
    } catch (error) {
      console.warn(
        `[${new Date().toISOString()}] Waiting for OpenSearch connection... (${
          error.message
        })`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }
  throw new Error(
    `OpenSearch did not become available within ${timeout} milliseconds.`
  );
}

module.exports = { opensearchClient, waitForOpenSearchConnection };
