// routes/aiRoutes.js
const { getAnswer } = require("../controllers/aiChatBotManager");

async function aiRoutes(fastify, options) {
  fastify.post("/ask-chat", async (request, reply) => {
    try {
      const { query } = request.body;
      if (!query || query.trim().length === 0) {
        return reply.code(400).send({ message: "Query cannot be empty." });
      }
      const result = await getAnswer(query);
      reply.send(result);
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });
}

module.exports = aiRoutes;
