const express = require("express");
const router = express.Router();

const {
  createFaqs,
  getAllFaqs,
  updateFaq,
  deleteFaq,
} = require("../controllers/faq.controller");

router.post("/", createFaqs);
router.get("/", getAllFaqs);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);

module.exports = router;
