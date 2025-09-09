const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Panier = sequelize.define("paniers", {
    panier_id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    est_commande: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Panier;
};
