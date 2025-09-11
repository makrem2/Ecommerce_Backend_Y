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
  app.delete(
    "/api/user/deleteUser/:id",
    [AuthJwt.verifyToken, AuthJwt.isAdmin],
    usercontroller.deleteUser
  );
  app.get(
    "/api/user/getAllUsers",
    [AuthJwt.verifyToken, AuthJwt.isAdmin],
    usercontroller.getAllUsers
  );
  app.get(
    "/api/user/getOneUser/:id",
    [AuthJwt.verifyToken, AuthJwt.isAdminOrClient],
    usercontroller.getOneUser
  );

  app.patch(
    "/api/user/toggleUserStatus/:id",
    [AuthJwt.verifyToken, AuthJwt.isAdmin],
    usercontroller.toggleUserStatus
  );
};
