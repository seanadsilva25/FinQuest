const mongoose = require("mongoose");

const cashFlowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Salary",
        "Freelance",
        "Investments",
        "Food & Essentials",
        "Utilities",
        "Rent",
        "Entertainment",
        "Shopping",
        "Other",
      ],
      default: "Other",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const CashFlow = mongoose.model("CashFlow", cashFlowSchema);

module.exports = CashFlow;
