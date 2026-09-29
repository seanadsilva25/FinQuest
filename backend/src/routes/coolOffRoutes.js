
const express = require("express");
const router = express.Router();

const {
  createCoolOff,
  getCoolOffs,
  updateCoolOff,
} = require("../controllers/coolOffController");

const authMiddleware = require("../middleware/authMiddleware");

// Create a cool-off request
router.post("/", authMiddleware, createCoolOff);

// Get all cool-off requests
router.get("/", authMiddleware, getCoolOffs);

// Update purchase decision
router.patch("/:id", authMiddleware, updateCoolOff);

module.exports = router;