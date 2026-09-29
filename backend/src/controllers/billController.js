const Bill = require("../models/Bill");
const CashFlow = require("../models/CashFlow");

/**
 * GET /api/bills
 * Retrieves all bills for the authenticated user, updating overdue statuses automatically
 */
const getBills = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Auto-update unpaid bills whose due date has passed to 'overdue'
    await Bill.updateMany(
      { userId, status: "unpaid", dueDate: { $lt: now } },
      { $set: { status: "overdue" } }
    );

    const bills = await Bill.find({ userId }).sort({ dueDate: 1 });

    return res.status(200).json({ bills });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch bills." });
  }
};

/**
 * POST /api/bills
 * Creates a new bill for the authenticated user
 */
const createBill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, amount, dueDate, category, recurrence } = req.body;

    if (!name || !amount || !dueDate) {
      return res.status(400).json({ message: "Please provide name, amount, and due date." });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Bill amount must be greater than 0." });
    }

    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({ message: "Please provide a valid due date." });
    }

    const now = new Date();
    const initialStatus = parsedDueDate < now ? "overdue" : "unpaid";

    const bill = await Bill.create({
      userId,
      name,
      amount: numericAmount,
      dueDate: parsedDueDate,
      category: category || "Other",
      recurrence: recurrence || "none",
      status: initialStatus,
    });

    return res.status(201).json({ message: "Bill created successfully", bill });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create bill." });
  }
};

/**
 * PUT /api/bills/:id
 * Updates an existing bill for the authenticated user
 */
const updateBill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, amount, dueDate, category, recurrence, status } = req.body;

    const bill = await Bill.findOne({ _id: id, userId });
    if (!bill) {
      return res.status(404).json({ message: "Bill not found." });
    }

    if (name !== undefined) bill.name = name;
    if (amount !== undefined) bill.amount = Number(amount);
    if (dueDate !== undefined) bill.dueDate = new Date(dueDate);
    if (category !== undefined) bill.category = category;
    if (recurrence !== undefined) bill.recurrence = recurrence;
    if (status !== undefined) {
      bill.status = status;
      if (status === "paid") bill.paidDate = new Date();
    }

    await bill.save();

    return res.status(200).json({ message: "Bill updated successfully", bill });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update bill." });
  }
};

/**
 * DELETE /api/bills/:id
 * Deletes a bill for the authenticated user
 */
const deleteBill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const bill = await Bill.findOneAndDelete({ _id: id, userId });
    if (!bill) {
      return res.status(404).json({ message: "Bill not found." });
    }

    return res.status(200).json({ message: "Bill deleted successfully", billId: id });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete bill." });
  }
};

/**
 * PATCH /api/bills/:id/pay
 * Marks a bill as paid and logs an expense cash flow transaction
 */
const markBillAsPaid = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const bill = await Bill.findOne({ _id: id, userId });
    if (!bill) {
      return res.status(404).json({ message: "Bill not found." });
    }

    if (bill.status === "paid") {
      return res.status(400).json({ message: "Bill is already marked as paid.", bill });
    }

    bill.status = "paid";
    bill.paidDate = new Date();
    await bill.save();

    // Auto-create CashFlow expense entry for bill payment
    await CashFlow.create({
      userId,
      title: `Bill Payment: ${bill.name}`,
      amount: bill.amount,
      type: "expense",
      category: bill.category || "Utilities",
      date: new Date(),
    });

    return res.status(200).json({ message: "Bill marked as paid", bill });
  } catch (error) {
    return res.status(500).json({ message: "Failed to mark bill as paid." });
  }
};

module.exports = {
  getBills,
  createBill,
  updateBill,
  deleteBill,
  markBillAsPaid,
};
