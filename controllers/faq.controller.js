const Faq = require("../modals/faq.modal");

// ➕ Create Multiple FAQs
exports.createFaqs = async (req, res) => {
  try {
    let faqs = req.body;

    // 🔥 If single object → convert to array
    if (!Array.isArray(faqs)) {
      faqs = [faqs];
    }

    const createdFaqs = await Faq.insertMany(faqs);

    res.status(201).json({
      success: true,
      data: createdFaqs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get All FAQs
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ order: 1 });

    res.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update FAQ
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedFaq = await Faq.findByIdAndUpdate(id, req.body, { new: true });

    res.json({
      success: true,
      data: updatedFaq,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    await Faq.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
