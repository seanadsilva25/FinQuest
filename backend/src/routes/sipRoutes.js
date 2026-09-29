const express = require("express");
const router = express.Router();
const { calculateSIP } = require("../controllers/sipController");

// POST /api/sip/calculate
router.post("/calculate", calculateSIP);

module.exports = router;
