const AuthJwt = require("../middleware/authJwt");
const categorieController = require("../controllers/categorie.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token,Origin,Content-TypeError,Accept"
    );
    next();
  });


  app.post(
    "/api/categorie/createCategorie",
    [AuthJwt.verifyToken, AuthJwt.isAdmin],
    categorieController.createCategorie
  );

  app.get("/api/categorie/getAllCategories", categorieController.getAllCategories);

  app.get("/api/categorie/getCategorieById/:id", categorieController.getCategorieById);

  app.put("/api/categorie/updateCategorie/:id", [AuthJwt.verifyToken, AuthJwt.isAdmin], categorieController.updateCategorie);

  app.delete("/api/categorie/deleteCategorie/:id", [AuthJwt.verifyToken, AuthJwt.isAdmin], categorieController.deleteCategorie);

};
