const AuthJwt = require("../middleware/authJwt");
const panierController = require("../controllers/panier.controller");
const { panier } = require("../models");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token,Origin,Content-TypeError,Accept"
    );
    next();
  });

  app.post(
    "/api/panier/addToCart",
    [AuthJwt.verifyToken, AuthJwt.isAdminOrClient],
    panierController.addToCart
  );

  app.get(
    "/api/panier/GetUserCart/:id",
    [AuthJwt.verifyToken, AuthJwt.isAdminOrClient],

    panierController.GetUserCart
  );

  app.post(
    "/api/panier/removeCartItem/:id",
    [AuthJwt.verifyToken, AuthJwt.isAdminOrClient],
    panierController.removeCartItem
  );

  app.post(
    "/api/panier/clearCart/:id",
    [AuthJwt.verifyToken, AuthJwt.isAdminOrClient],
    panierController.clearCart
  );

  app.post(
    "/api/panier/getNombreProduitsDansPanier/:id",
    [AuthJwt.verifyToken, AuthJwt.isAdminOrClient],

    panierController.getNombreProduitsDansPanier
  );
};
