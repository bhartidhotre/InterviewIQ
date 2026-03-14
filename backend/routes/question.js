const express = require("express");
const { question, randomQuestion } = require("../controllers/question");
const authMiddleware = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Admin only → add question
router.post("/", authMiddleware, isAdmin, question);

// Authenticated users → get random question
router.get("/random", authMiddleware, randomQuestion);

module.exports = router;
