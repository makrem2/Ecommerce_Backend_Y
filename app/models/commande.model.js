const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Commande = sequelize.define("commandes", {
    commande_id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "en attente",
    },
    montant_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date_commande: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    adresse_livraison: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
  });

  return Commande;
};
