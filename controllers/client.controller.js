const Client = require("../modals/client.modal");

/* ============================
   CREATE CLIENT
=============================== */
exports.createClient = async (req, res) => {
  try {
    const { name, active } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Client name is required",
      });
    }

    // 🔒 Safe image extraction
    let image = null;

    if (req.file) {
      if (req.file.secure_url) {
        image = req.file.secure_url; // Cloudinary
      } else if (req.file.path) {
        image = req.file.path; // Local
      } else {
        return res.status(400).json({
          message: "Image upload failed (no path or URL)",
        });
      }
    } else {
      return res.status(400).json({
        message: "Client image is required",
      });
    }

    const client = new Client({
      name,
      image,
      active,
    });

    await client.save();

    return res.status(201).json({
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    console.error("CREATE CLIENT ERROR:", error);
    return res.status(500).json({
      message: error.message || "Failed to create client",
    });
  }
};

/* ============================
   GET ALL CLIENTS
=============================== */
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });

    return res.status(200).json(clients);
  } catch (error) {
    console.error("GET CLIENTS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch clients",
    });
  }
};

/* ============================
   UPDATE CLIENT
=============================== */
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, active } = req.body;

    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    // Update fields
    if (name !== undefined) client.name = name;
    if (active !== undefined) client.active = active;

    // 🔒 Safe image update
    if (req.file) {
      if (req.file.secure_url) {
        client.image = req.file.secure_url;
      } else if (req.file.path) {
        client.image = req.file.path;
      } else {
        return res.status(400).json({
          message: "Image upload failed (no path or URL)",
        });
      }
    }

    await client.save();

    return res.status(200).json({
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    console.error("UPDATE CLIENT ERROR:", error);
    return res.status(500).json({
      message: error.message || "Failed to update client",
    });
  }
};

/* ============================
   DELETE CLIENT
=============================== */
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    return res.status(200).json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CLIENT ERROR:", error);
    return res.status(500).json({
      message: error.message || "Failed to delete client",
    });
  }
};
