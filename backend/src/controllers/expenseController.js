
const Expense = require("../models/Expense");

// Add a new expense
const addExpense = async (req, res) => {
    try {
        const { amount, category, description, type, trigger, date } = req.body;

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                message: "Please enter a valid amount"
            });
        }

        if (!category) {
            return res.status(400).json({
                message: "Please select a category"
            });
        }

        const expense = await Expense.create({
            userId: req.user.id,
            amount: Number(amount),
            category,
            description,
            type: type || "Planned",
            trigger: trigger || "",
            date: date || new Date()
        });

        res.status(201).json({
            message: "Expense added successfully",
            expense
        });

    } catch (error) {
        console.error("Add expense error:", error);

        res.status(500).json({
            message: "Failed to add expense"
        });
    }
};

// Get all expenses for the logged-in user
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({
            userId: req.user.id
        }).sort({ date: -1 });

        res.status(200).json({
            count: expenses.length,
            expenses
        });

    } catch (error) {
        console.error("Get expenses error:", error);

        res.status(500).json({
            message: "Failed to fetch expenses"
        });
    }
};

// Delete an expense
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.error("Delete expense error:", error);

        res.status(500).json({
            message: "Failed to delete expense"
        });
    }
};

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense
};