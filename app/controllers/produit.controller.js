const db = require("../models");
const Produit = db.produit;
const { Op, Model } = require("sequelize");

const multer = require("multer");
const path = require("path");

exports.createProduit = async (req, res) => {
  try {
    const { name, description, prix, stock, est_disponible, categorie_Id } =
      req.body;
    const image = req.file ? req.file.path : null;

    const produit = await Produit.create({
      name,
      description,
      prix,
      stock,
      est_disponible,
      image,
      categorie_Id,
    });

    res
      .status(201)
      .send({ message: "Produit créé avec succès.", data: produit });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.getAllProduits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const produits = await Produit.findAll({
      limit: limit,
      offset: offset,
      include: [
        {
          model: db.categorie,
          attributes: ["id", "nom"],
        },
      ],
    });

    const totalProduits = await Produit.count({});

    if (produits.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No produit found",
      });
    }

    return res.status(200).json({
      success: true,
      data: produits,
      pagination: {
        total: totalProduits,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalProduits / limit),
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit)
      return res.status(404).send({ message: "Produit non trouvé." });
    res.send(produit);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.updateProduit = async (req, res) => {
  try {
    const { name, description, prix, stock, est_disponible, categorieId } =
      req.body;
    const produit = await Produit.findByPk(req.params.id);
    if (!produit)
      return res.status(404).send({ message: "Produit non trouvé." });

    produit.name = name || produit.name;
    produit.description = description || produit.description;
    produit.prix = prix || produit.prix;
    produit.stock = stock || produit.stock;
    produit.categorieId = categorieId || produit.categorieId;
    produit.est_disponible = est_disponible ?? produit.est_disponible;
    if (req.file) produit.image = req.file.path;

    await produit.save();
    res.send({ message: "Produit mis à jour.", data: produit });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit)
      return res.status(404).send({ message: "Produit non trouvé." });

    await produit.destroy();
    res.send({ message: "Produit supprimé avec succès." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.getAllProduitsbyCategorie = async (req, res) => {
  try {
    const categorie_Id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const produits = await Produit.findAll({
      limit: limit,
      offset: offset,
      where: {
        categorie_Id,
      },
    });

    const totalProduits = await Produit.count({});
    if (produits.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No produit found",
      });
    }

    return res.status(200).json({
      success: true,
      data: produits,
      pagination: {
        total: totalProduits,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalProduits / limit),
      },
    });
  } catch (error) {
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
  limits: { fileSize: "1000000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("image");
