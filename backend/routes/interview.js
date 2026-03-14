const express = require("express");
const {
  start,
  answer,
  end,
  getActiveSession,
    getInterviewHistory,
  getSummary,
  adminStats
} = require("../controllers/interview");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Interview flow
router.post("/start", authMiddleware, start);
router.post("/answer", authMiddleware, answer);
router.post("/end", authMiddleware, end);

// 🔹 Resume interview
router.get("/active", authMiddleware, getActiveSession);

// 🔹 Interview summary
router.get("/summary/:id", authMiddleware, getSummary);

// 🔹 Admin analytics (later add admin middleware)
router.get("/admin/stats", authMiddleware, adminStats);
router.get("/history", authMiddleware, getInterviewHistory);

module.exports = router;
