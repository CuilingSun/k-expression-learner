const express = require("express");
const {
  getAllExpressions,
  getExpressionById,
  getExpressionByKorean,
  getRandomExpression,
  getNextExpression,
  getStats,
  saveNote,
  updateExpressionStatus,
} = require("./db");
const { getRewriteFeedback } = require("./ollamaClient");

const router = express.Router();

function sendError(response, error) {
  const statusCode = error.statusCode || 500;
  const message =
    statusCode === 500 ? "Something went wrong while processing the request." : error.message;

  response.status(statusCode).json({ error: message });
}

router.get("/next", async (_request, response) => {
  try {
    const item = await getNextExpression();
    const stats = await getStats();
    response.json({ item, stats });
  } catch (error) {
    sendError(response, error);
  }
});

router.get("/random", async (_request, response) => {
  try {
    const item = await getRandomExpression();
    const stats = await getStats();
    response.json({ item, stats });
  } catch (error) {
    sendError(response, error);
  }
});

router.get("/", async (request, response) => {
  try {
    const page = request.query.page || 1;
    const limit = request.query.limit || 50;
    const status = request.query.status || null;
    const result = await getAllExpressions(page, limit, status);
    const stats = await getStats();

    response.json({
      items: result.items,
      pagination: result.pagination,
      stats,
    });
  } catch (error) {
    sendError(response, error);
  }
});

router.get("/lookup", async (request, response) => {
  try {
    const { korean } = request.query;
    if (!korean) {
      response.status(400).json({ error: "korean query param required" });
      return;
    }
    const item = await getExpressionByKorean(korean);
    if (!item) {
      response.status(404).json({ error: "Expression not found" });
      return;
    }
    const stats = await getStats();
    response.json({ item, stats });
  } catch (error) {
    sendError(response, error);
  }
});

router.get("/:id", async (request, response) => {
  try {
    const item = await getExpressionById(request.params.id);

    if (!item) {
      response.status(404).json({ error: "Expression not found" });
      return;
    }

    const stats = await getStats();
    response.json({ item, stats });
  } catch (error) {
    sendError(response, error);
  }
});

router.put("/:id/status", async (request, response) => {
  try {
    const item = await updateExpressionStatus(request.params.id, request.body.status);
    const stats = await getStats();
    response.json({ item, stats });
  } catch (error) {
    sendError(response, error);
  }
});

router.put("/:id/note", async (request, response) => {
  try {
    const item = await saveNote(request.params.id, request.body.note);
    const stats = await getStats();
    response.json({ item, stats });
  } catch (error) {
    sendError(response, error);
  }
});

router.post("/:id/feedback", async (request, response) => {
  try {
    const item = await getExpressionById(request.params.id);

    if (!item) {
      response.status(404).json({ error: "Expression not found" });
      return;
    }

    const { userSentence } = request.body;

    if (!userSentence || !userSentence.trim()) {
      response.status(400).json({ error: "请先输入你的练习句子" });
      return;
    }

    const feedback = await getRewriteFeedback({
      korean: item.korean,
      chinese: item.chinese,
      rewriteScenario: item.rewrite_scenario,
      userSentence: userSentence.trim(),
    });

    response.json({ feedback });
  } catch (error) {
    sendError(response, error);
  }
});

module.exports = router;
