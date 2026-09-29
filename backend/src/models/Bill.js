const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ["Utilities", "Rent", "Subscriptions", "Credit Card", "Education", "Insurance", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["unpaid", "paid", "overdue"],
      default: "unpaid",
    },
    recurrence: {
      type: String,
      enum: ["none", "monthly", "weekly", "yearly"],
      default: "none",
    },
    paidDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
