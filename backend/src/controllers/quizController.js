const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");

/**
 * GET /api/quiz/games/:gameId
 * Fetches the quiz from MongoDB and returns questions WITHOUT correct answers
 */
const getQuizQuestions = async (req, res) => {
  try {
    const { gameId } = req.params;
    const quiz = await Quiz.findOne({ gameId });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz game not found in database." });
    }

    // Strip out correctAnswer from payload sent to client for security
    const sanitizedQuestions = quiz.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options
    }));

    return res.status(200).json({
      gameId: quiz.gameId,
      title: quiz.title,
      icon: quiz.icon,
      description: quiz.description,
      instructions: quiz.instructions,
      questions: sanitizedQuestions
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch quiz game from database." });
  }
};

/**
 * POST /api/quiz/submit
 * Fetches the quiz from MongoDB, evaluates user answers against stored correct answers,
 * saves QuizAttempt, and returns score & feedback
 */
const submitQuizAttempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameId, answers } = req.body;

    const quiz = await Quiz.findOne({ gameId });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz game not found in database." });
    }

    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({
        error: `Please provide answers for all ${quiz.questions.length} questions.`
      });
    }

    let score = 0;
    const results = quiz.questions.map((q, idx) => {
      const userAnswer = answers[idx];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) score += 1;

      return {
        questionId: q.id,
        question: q.question,
        options: q.options,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const pointsEarned = score * 20; // 20 points per correct question (max 100)

    // Save attempt in MongoDB
    const attempt = await QuizAttempt.create({
      userId,
      gameId,
      score,
      totalQuestions: quiz.questions.length,
      pointsEarned,
      completedAt: new Date()
    });

    return res.status(200).json({
      attemptId: attempt._id,
      gameId,
      score,
      totalQuestions: quiz.questions.length,
      pointsEarned,
      results
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to submit quiz attempt." });
  }
};

/**
 * GET /api/quiz/stats
 * Fetches user's total points and past quiz attempts from MongoDB
 */
const getUserQuizStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const attempts = await QuizAttempt.find({ userId }).sort({ completedAt: -1 });

    const totalPoints = attempts.reduce((acc, curr) => acc + (curr.pointsEarned || 0), 0);

    return res.status(200).json({
      totalPoints,
      totalAttempts: attempts.length,
      attempts
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch quiz stats." });
  }
};

module.exports = {
  getQuizQuestions,
  submitQuizAttempt,
  getUserQuizStats
};
