
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getWallet } = require("../controllers/walletController");

// Protected wallet endpoint
router.get("/", authMiddleware, getWallet);

module.exports = router;