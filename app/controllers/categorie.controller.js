const db = require("../models");
const Categorie = db.categorie;

exports.createCategorie = async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res
        .status(400)
        .send({ message: "Le nom de la catégorie est requis." });
    }

    const nouvelleCategorie = await Categorie.create({ nom });
    res.status(201).send({
      message: "Catégorie créée avec succès.",
      data: nouvelleCategorie,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll();
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.getCategorieById = async (req, res) => {
  try {
    const id = req.params.id;
    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).send({ message: "Catégorie non trouvée." });
    }

    res.status(200).send(categorie);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.updateCategorie = async (req, res) => {
  try {
    const id = req.params.id;
    const { nom } = req.body;

    const categorie = await Categorie.findByPk(id);
    if (!categorie) {
      return res.status(404).send({ message: "Catégorie non trouvée." });
    }

    categorie.nom = nom || categorie.nom;
    await categorie.save();

    res
      .status(200)
      .send({ message: "Catégorie mise à jour avec succès.", data: categorie });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.deleteCategorie = async (req, res) => {
  try {
    const id = req.params.id;
    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).send({ message: "Catégorie non trouvée." });
    }

    await categorie.destroy();
    res.status(200).send({ message: "Catégorie supprimée avec succès." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
