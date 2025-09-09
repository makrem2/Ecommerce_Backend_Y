const usercontroller = require("../controllers/user.controller");

const AuthJwt = require("../middleware/authJwt");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token,Origin,Content-TypeError,Accept"
    );
    next();
  });

  app.put(
    "/api/user/updateUser/:id",
    [AuthJwt.verifyToken, AuthJwt.isAdminOrClient],
    usercontroller.upload,
    usercontroller.updateUser
  );
};
