const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Categorie = sequelize.define("categories", {
    categorie_id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Categorie;
};
