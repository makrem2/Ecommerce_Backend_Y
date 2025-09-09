module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define("cart_items", {
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return CartItem;
};
