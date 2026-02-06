const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = require("../config/storage");
const upload = multer({ storage });

// Controller
const {
  createClient,
  getAllClients,
  updateClient,
  deleteClient,
} = require("../controllers/client.controller");

/* ============================
   CLIENT ROUTES
=============================== */

// CREATE client (image required)
router.post("/", upload.single("image"), createClient);

// GET all clients
router.get("/", getAllClients);

// UPDATE client (image optional)
router.put("/:id", upload.single("image"), updateClient);

// DELETE client
router.delete("/:id", deleteClient);

module.exports = router;
