// src/config/deepseek.js
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const DEEPSEEK_URL = process.env.DEEPSEEK_URL || "http://deepseek:8000";

/**
 * Sends a POST request to DeepSeek's /completion endpoint with the given prompt.
 * Adjust the endpoint and payload according to DeepSeek's API.
 */
async function getDeepseekResponse(prompt) {
  try {
    const response = await axios.post(`${DEEPSEEK_URL}/completion`, { prompt });
    // Assume DeepSeek returns a JSON object with an "answer" field.
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { getDeepseekResponse };
