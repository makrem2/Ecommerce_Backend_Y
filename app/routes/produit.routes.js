const AuthJwt = require("../middleware/authJwt");
const produitController = require("../controllers/produit.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token,Origin,Content-TypeError,Accept"
    );
    next();
  });

  app.post(
    "/api/produit/createProduit",
    produitController.upload,
    produitController.createProduit
  );

  app.get("/api/produit/getAllProduits", produitController.getAllProduits);

  app.get("/api/produit/getProduitById/:id", produitController.getProduitById);

  app.get(
    "/api/produit/getAllProduitsbyCategorie/:id",
    produitController.getAllProduitsbyCategorie
  );

  app.put(
    "/api/produit/updateProduit/:id",
    [AuthJwt.verifyToken, AuthJwt.isAdmin],
    produitController.upload,
    produitController.updateProduit
  );

  app.delete(
    "/api/produit/deleteProduit/:id",
    [AuthJwt.verifyToken, AuthJwt.isAdmin],
    produitController.deleteProduit
  );
};
