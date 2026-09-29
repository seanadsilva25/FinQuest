const express = require("express");
const router = express.Router();

const { getStocks } = require("../controllers/stockController");

// GET /api/stocks
router.get("/", getStocks);

module.exports = router;