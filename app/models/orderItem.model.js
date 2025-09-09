module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("order_items", {
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prix_unitaire: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return OrderItem;
};
