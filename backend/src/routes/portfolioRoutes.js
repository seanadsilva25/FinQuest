
const express = require("express");
const router = express.Router();

const { getPortfolio } = require("../controllers/portfolioController");
const authMiddleware = require("../middleware/authMiddleware");

// Get logged-in user's portfolio
router.get("/", authMiddleware, getPortfolio);

module.exports = router;