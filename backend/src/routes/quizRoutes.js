const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getQuizQuestions,
  submitQuizAttempt,
  getUserQuizStats
} = require("../controllers/quizController");

// Public route to fetch game questions (sanitized without correct answers)
router.get("/games/:gameId", getQuizQuestions);

// Protected routes requiring authentication
router.post("/submit", authMiddleware, submitQuizAttempt);
router.get("/stats", authMiddleware, getUserQuizStats);

module.exports = router;
