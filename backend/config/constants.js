// config/constants.js
module.exports = {
  // Hard minimum and soft maximum limits per source.
  MIN_DB: 3,
  MAX_DB: 7,
  MIN_GITHUB: 1,
  MAX_GITHUB: 5,
  MIN_RESUME: 1,
  MAX_RESUME: 5,

  // Overall prompt character budget (to control tokens for later use)
  MAX_PROMPT_CHARS: 15000,

  // Optional weight multipliers for scores per source (to prioritize DB over others, etc.)
  DB_WEIGHT: 1.2,
  GH_WEIGHT: 1.0,
  RES_WEIGHT: 1.0,
};
