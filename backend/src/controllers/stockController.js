const Stock = require("../models/Stock");

// Get all active stocks
const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({ isActive: true }).sort({
      symbol: 1,
    });

    res.status(200).json({
      message: "Stocks fetched successfully",
      count: stocks.length,
      stocks,
    });
  } catch (error) {
    console.error("Get stocks error:", error);

    res.status(500).json({
      message: "Server error while fetching stocks",
    });
  }
};

module.exports = { getStocks };