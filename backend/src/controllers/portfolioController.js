
const Portfolio = require("../models/Portfolio");

// Get logged-in user's portfolio
const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find portfolio and populate stock details
    const portfolio = await Portfolio.findOne({ userId })
      .populate("holdings.stockId", "name symbol currentPrice");

    // If user has no portfolio yet
    if (!portfolio) {
      return res.status(200).json({
        message: "Portfolio is empty",
        holdings: []
      });
    }

    res.status(200).json({
      message: "Portfolio fetched successfully",
      holdings: portfolio.holdings
    });

  } catch (error) {
    console.error("Get portfolio error:", error);

    res.status(500).json({
      message: "Server error while fetching portfolio"
    });
  }
};

module.exports = { getPortfolio };