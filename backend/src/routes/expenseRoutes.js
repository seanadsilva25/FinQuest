
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addExpense,
    getExpenses,
    deleteExpense
} = require("../controllers/expenseController");

// Add a new expense
router.post("/", authMiddleware, addExpense);

// Get all expenses
router.get("/", authMiddleware, getExpenses);

// Delete an expense
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;