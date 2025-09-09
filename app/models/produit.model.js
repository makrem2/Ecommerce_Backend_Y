const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Produit = sequelize.define("produits", {
    produit_id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    est_disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return Produit;
};
