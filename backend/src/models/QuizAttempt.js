const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gameId: {
      type: String,
      required: true,
      enum: ["pick_investment", "spot_scam", "sip_challenge"],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    totalQuestions: {
      type: Number,
      default: 5,
    },
    pointsEarned: {
      type: Number,
      required: true,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

module.exports = QuizAttempt;
