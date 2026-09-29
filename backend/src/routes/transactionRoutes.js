const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  buyStock,
  sellStock,
  getTransactions
} = require("../controllers/transactionController");

router.post("/buy", authMiddleware, buyStock);
router.post("/sell", authMiddleware, sellStock);
router.get("/", authMiddleware, getTransactions);

module.exports = router;