const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCashFlowEntries,
  createCashFlowEntry,
  deleteCashFlowEntry,
  getCashFlowSummary,
} = require("../controllers/cashFlowController");

// All cashflow routes require authentication
router.use(authMiddleware);

router.get("/", getCashFlowEntries);
router.post("/", createCashFlowEntry);
router.delete("/:id", deleteCashFlowEntry);
router.get("/summary", getCashFlowSummary);

module.exports = router;
