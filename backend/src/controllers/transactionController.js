
const Wallet = require("../models/Wallet");
const Stock = require("../models/Stock");
const Portfolio = require("../models/Portfolio");
const Transaction = require("../models/Transaction");

// BUY STOCK
const buyStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const userId = req.user.id;

    // Validate quantity
    if (!stockId || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Please provide a valid stock and quantity"
      });
    }

    // Find stock
    const stock = await Stock.findById(stockId);

    if (!stock || !stock.isActive) {
      return res.status(404).json({
        message: "Stock not found or inactive"
      });
    }

    // Calculate purchase amount
    const totalAmount = stock.currentPrice * quantity;

    // Find wallet
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found"
      });
    }

    // Check wallet balance
    if (wallet.balance < totalAmount) {
      return res.status(400).json({
        message: "Insufficient wallet balance"
      });
    }

    // Find or create portfolio
    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      portfolio = new Portfolio({
        userId,
        holdings: []
      });
    }

    // Check if stock already exists in portfolio
    const holding = portfolio.holdings.find(
      (item) => item.stockId.toString() === stockId
    );

    if (holding) {
      const oldQuantity = holding.quantity;
      const newQuantity = oldQuantity + quantity;

      // Calculate weighted average purchase price
      holding.averageBuyPrice =
        ((holding.averageBuyPrice * oldQuantity) + totalAmount) /
        newQuantity;

      holding.quantity = newQuantity;
    } else {
      portfolio.holdings.push({
        stockId,
        quantity,
        averageBuyPrice: stock.currentPrice
      });
    }

    // Deduct amount from wallet
    wallet.balance -= totalAmount;

    // Save wallet and portfolio
    await wallet.save();
    await portfolio.save();

    // Record transaction
    const transaction = await Transaction.create({
      userId,
      stockId,
      type: "BUY",
      quantity,
      price: stock.currentPrice,
      totalAmount
    });

    res.status(201).json({
      message: "Stock purchased successfully",
      transaction,
      walletBalance: wallet.balance,
      portfolio
    });

  } catch (error) {
    console.error("Buy stock error:", error);
    res.status(500).json({
      message: "Server error while purchasing stock"
    });
  }
};

// SELL STOCK
const sellStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const userId = req.user.id;

    // Validate quantity
    if (!stockId || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Please provide a valid stock and quantity"
      });
    }

    // Find stock
    const stock = await Stock.findById(stockId);

    if (!stock || !stock.isActive) {
      return res.status(404).json({
        message: "Stock not found or inactive"
      });
    }

    // Find portfolio
    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(404).json({
        message: "Portfolio not found"
      });
    }

    // Find holding
    const holding = portfolio.holdings.find(
      (item) => item.stockId.toString() === stockId
    );

    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({
        message: "Insufficient shares to sell"
      });
    }

    // Calculate sale amount
    const totalAmount = stock.currentPrice * quantity;

    // Find wallet
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found"
      });
    }

    // Update portfolio
    holding.quantity -= quantity;

    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter(
        (item) => item.stockId.toString() !== stockId
      );
    }

    // Add sale amount to wallet
    wallet.balance += totalAmount;

    // Save changes
    await portfolio.save();
    await wallet.save();

    // Record transaction
    const transaction = await Transaction.create({
      userId,
      stockId,
      type: "SELL",
      quantity,
      price: stock.currentPrice,
      totalAmount
    });

    res.status(201).json({
      message: "Stock sold successfully",
      transaction,
      walletBalance: wallet.balance,
      portfolio
    });

  } catch (error) {
    console.error("Sell stock error:", error);
    res.status(500).json({
      message: "Server error while selling stock"
    });
  }
};

// GET TRANSACTION HISTORY
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ userId })
      .populate("stockId", "name symbol")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Transaction history fetched successfully",
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error("Get transactions error:", error);

    res.status(500).json({
      message: "Server error while fetching transaction history"
    });
  }
};

module.exports = {
  buyStock,
  sellStock,
  getTransactions
};