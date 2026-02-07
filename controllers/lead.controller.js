const Lead = require("../modals/lead.modal");
const sendEmail = require("../utils/sendEmail");

const otpMap = new Map(); // In-memory OTP store

/* ============================
   SEND OTP
=============================== */
exports.sendOTP = async (req, res) => {
  const { name, email, phone, message, services } = req.body;

  try {
    // Check if email already exists
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return res.status(400).json({
        message: "Email already exists. Please use another email ID.",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP + lead data
    otpMap.set(email, {
      otp,
      data: { name, email, phone, message, services },
      time: Date.now(),
    });

    // Send OTP Email
    await sendEmail({
      to: email,
      subject: "Your OTP - Bigwig Media",
      html: `
        <p>Hello ${name},</p>
        <p>Your OTP is: <strong>${otp}</strong></p>
      `,
    });

    res.status(200).json({ message: "OTP sent to email." });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Server error while sending OTP." });
  }
};

/* ============================
   VERIFY OTP & SAVE LEAD
=============================== */
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = otpMap.get(email);
  if (!record) {
    return res.status(400).json({ message: "OTP expired or not found." });
  }

  if (parseInt(otp) !== record.otp) {
    return res.status(400).json({ message: "Invalid OTP." });
  }

  try {
    // Save lead
    const newLead = new Lead({
      ...record.data,
      verified: true,
    });

    await newLead.save();
    otpMap.delete(email);

    // User confirmation email
    await sendEmail({
      to: email,
      subject: "We've received your query - Bigwig Media Digital",
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: auto;">
          <h2>Hello ${record.data.name},</h2>
          <p>Thank you for contacting <strong>Bigwig Media Digital</strong>.</p>
          <p>We will connect with you within 24–48 hours.</p>
        </div>
      `,
    });

    // Internal notification
    await sendEmail({
      to: "chandangomia2812@gmail.com",
      subject: "New Lead Captured - Bigwig Media",
      html: `
        <h3>New Lead Details</h3>
        <p><strong>Name:</strong> ${record.data.name}</p>
        <p><strong>Email:</strong> ${record.data.email}</p>
        <p><strong>Phone:</strong> ${record.data.phone}</p>
        <p><strong>Selected Services:</strong> ${record.data.services.join(", ")}</p>
        <p><strong>Message:</strong><br /> ${record.data.message}</p>
      `,
    });

    res.status(200).json({
      message: "Lead captured, confirmation sent, HR notified.",
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "Server error while saving lead." });
  }
};

/* ============================
   GET ALL LEADS
=============================== */
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Server error while fetching leads." });
  }
};

/* ============================
   MARK LEAD AS TRUE
=============================== */
exports.markLead = async (req, res) => {
  const { id } = req.params;
  const { marked } = req.body;

  try {
    if (typeof marked !== "boolean") {
      return res.status(400).json({
        message: "Marked value must be boolean",
      });
    }

    const lead = await Lead.findByIdAndUpdate(id, { marked }, { new: true });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    res.status(200).json({
      message: "Lead updated successfully.",
      lead,
    });
  } catch (err) {
    console.error("Error updating lead:", err);
    res.status(500).json({
      message: "Server error while updating lead.",
    });
  }
};

/* ============================
   DELETE LEAD
=============================== */
exports.deleteLead = async (req, res) => {
  const { id } = req.params;

  try {
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    res.status(200).json({ message: "Lead deleted successfully." });
  } catch (err) {
    console.error("Error deleting lead:", err);
    res.status(500).json({ message: "Server error while deleting lead." });
  }
};
