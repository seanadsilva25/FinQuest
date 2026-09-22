const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    currentPrice: {
      type: Number,
      required: true,
      min: 0
    },

    previousPrice: {
      type: Number,
      required: true,
      min: 0
    },

    priceChange: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Stock", stockSchema);