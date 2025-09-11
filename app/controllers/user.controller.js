const db = require("../models");

const { user, role } = db;

const { Op } = require("sequelize");

const bcrypt = require("bcryptjs");

const path = require("path");

const multer = require("multer");

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const { username, email, password, telephone, adresse } = req.body;

    const photo_profil = req.file ? req.file.path : null;

    if (!id) {
      return res.status(400).send({ message: "id is required" });
    }

    const users = await user.findByPk(id);

    if (!users) {
      return res.status(404).send({ message: "user not found" });
    }

    if (password) {
      const hasdpasswd = await bcrypt.hashSync(password, 10);
      users.password = hasdpasswd || users.password;
    }

    if (photo_profil) {
      users.photo_profil = photo_profil;
    }

    users.username = username || users.username;
    users.email = email || users.email;
    users.telephone = telephone || users.telephone;
    users.adresse = adresse || users.adresse;

    await users.save();

    return res
      .status(200)
      .send({ message: "Utilisateur mis a jour avec succes" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const users = await user.findAll({
      limit: limit,
      offset: offset,
    });
    const totalUsers = await user.count({});
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found for the specified role",
      });
    }

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total: totalUsers,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching users by role.",
      error: error.message,
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({ message: "ID requis." });
    }
    const user_s = await user.findByPk(id);
    if (!user_s)
      return res.status(404).send({ message: "Utilisateur non trouvé." });

    await user_s.destroy();
    res.send({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.getOneUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({ message: "ID requis." });
    }
    const user_s = await user.findByPk(id);
    if (!user_s)
      return res.status(404).send({ message: "Utilisateur non trouvé." });

    res.send(user_s);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.toggleUserStatus = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({ message: "ID requis." });
    }
    const user_s = await user.findByPk(id);
    if (!user_s)
      return res.status(404).send({ message: "Utilisateur non trouvé." });

    user_s.is_active = !user_s.is_active;
    await user_s.save();

    res.send({
      message: `Utilisateur ${
        user_s.is_active ? "activé" : "désactivé"
      } avec succès.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

exports.upload = multer({
  storage: storage,
  limits: { fileSize: "10000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("give proper file formate (jpeg|jpg|png) to upload");
  },
}).single("photo_profil");
