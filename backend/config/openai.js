// src/config/openai.js
// const { Configuration, OpenAIApi } = require("openai");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

// Ensure that your package version of openai supports the Configuration constructor.
// If you see an error (e.g. "Configuration is not a constructor"), make sure you are using a compatible version.
const configuration = { apiKey: process.env.OPENAI_API_KEY || "test" };

// Create the OpenAI client instance.
const openaiClient = new OpenAI(configuration);

module.exports = { openaiClient };
