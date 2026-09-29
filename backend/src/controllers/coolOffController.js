
const CoolOff = require("../models/CoolOff");

// Create a new cool-off purchase request
const createCoolOff = async (req, res) => {
  try {
    const { productName, amount, category, reason } = req.body;

    if (!productName || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Product name and a valid amount are required",
      });
    }

    // Set the cooling-off period to 24 hours
    const cooldownUntil = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    const coolOff = await CoolOff.create({
      userId: req.user.id,
      productName,
      amount: Number(amount),
      category: category || "Shopping",
      reason: reason || "",
      cooldownUntil,
    });

    res.status(201).json({
      message: "Purchase added to the cool-off period",
      coolOff,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create cool-off request",
      error: error.message,
    });
  }
};

// Get all cool-off requests for the logged-in user
const getCoolOffs = async (req, res) => {
  try {
    const coolOffs = await CoolOff.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(coolOffs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cool-off requests",
      error: error.message,
    });
  }
};

// Update purchase decision
const updateCoolOff = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Purchased", "Avoided"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Purchased or Avoided",
      });
    }

    const coolOff = await CoolOff.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!coolOff) {
      return res.status(404).json({
        message: "Cool-off request not found",
      });
    }

    if (coolOff.status !== "Pending") {
      return res.status(400).json({
        message: "This purchase has already been decided",
      });
    }

    if (new Date() < coolOff.cooldownUntil) {
      return res.status(400).json({
        message: "Please wait until the cooling-off period ends",
        cooldownUntil: coolOff.cooldownUntil,
      });
    }

    coolOff.status = status;
    coolOff.decidedAt = new Date();

    await coolOff.save();

    res.status(200).json({
      message: "Purchase decision updated successfully",
      coolOff,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update purchase decision",
      error: error.message,
    });
  }
};

module.exports = {
  createCoolOff,
  getCoolOffs,
  updateCoolOff,
};