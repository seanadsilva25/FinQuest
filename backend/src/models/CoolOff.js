
const mongoose = require("mongoose");

const coolOffSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    category: {
      type: String,
      enum: [
        "Food",
        "Shopping",
        "Entertainment",
        "Travel",
        "Bills",
        "Health",
        "Education",
        "Other",
      ],
      default: "Shopping",
    },

    reason: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Purchased", "Avoided"],
      default: "Pending",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    cooldownUntil: {
      type: Date,
      required: true,
    },

    decidedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoolOff", coolOffSchema);