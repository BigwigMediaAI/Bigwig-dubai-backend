const express = require("express");
const router = express.Router();

const {
  sendOTP,
  verifyOTP,
  getAllLeads,
  markLead,
  deleteLead,
  getLeadStats,
} = require("../controllers/lead.controller");

// OTP routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// Lead management
router.get("/", getAllLeads);
router.patch("/:id/mark", markLead);
router.delete("/:id", deleteLead);
router.get("/stats", getLeadStats);

module.exports = router;
