const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getBills,
  createBill,
  updateBill,
  deleteBill,
  markBillAsPaid,
} = require("../controllers/billController");

// All bill routes require authentication
router.use(authMiddleware);

router.get("/", getBills);
router.post("/", createBill);
router.put("/:id", updateBill);
router.delete("/:id", deleteBill);
router.patch("/:id/pay", markBillAsPaid);

module.exports = router;
