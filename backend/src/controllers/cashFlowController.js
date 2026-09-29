const CashFlow = require("../models/CashFlow");

/**
 * GET /api/cashflow
 * Retrieves all cash flow entries (income & expenses) for the authenticated user
 */
const getCashFlowEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await CashFlow.find({ userId }).sort({ date: -1 });

    return res.status(200).json({ entries });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch cash flow entries." });
  }
};

/**
 * POST /api/cashflow
 * Creates a new income or expense cash flow entry
 */
const createCashFlowEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, type, category, date } = req.body;

    if (!title || !amount || !type) {
      return res.status(400).json({ message: "Please provide title, amount, and type (income/expense)." });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0." });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'income' or 'expense'." });
    }

    const entry = await CashFlow.create({
      userId,
      title,
      amount: numericAmount,
      type,
      category: category || "Other",
      date: date ? new Date(date) : new Date(),
    });

    return res.status(201).json({ message: "Cash flow entry created successfully", entry });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create cash flow entry." });
  }
};

/**
 * DELETE /api/cashflow/:id
 * Deletes a cash flow entry for the authenticated user
 */
const deleteCashFlowEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const entry = await CashFlow.findOneAndDelete({ _id: id, userId });
    if (!entry) {
      return res.status(404).json({ message: "Cash flow entry not found." });
    }

    return res.status(200).json({ message: "Cash flow entry deleted successfully", id });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete cash flow entry." });
  }
};

/**
 * GET /api/cashflow/summary
 * Calculates total income, total expenses, net balance, and expense category breakdown
 */
const getCashFlowSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    let query = { userId };

    if (month && year) {
      const startOfMonth = new Date(Number(year), Number(month) - 1, 1);
      const endOfMonth = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    }

    const entries = await CashFlow.find(query);

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryBreakdown = {};

    entries.forEach((e) => {
      if (e.type === "income") {
        totalIncome += e.amount;
      } else if (e.type === "expense") {
        totalExpenses += e.amount;
        const cat = e.category || "Other";
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + e.amount;
      }
    });

    const netBalance = totalIncome - totalExpenses;

    return res.status(200).json({
      summary: {
        totalIncome,
        totalExpenses,
        netBalance,
        categoryBreakdown,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch cash flow summary." });
  }
};

module.exports = {
  getCashFlowEntries,
  createCashFlowEntry,
  deleteCashFlowEntry,
  getCashFlowSummary,
};
