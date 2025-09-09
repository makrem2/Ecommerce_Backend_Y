const jwt = require("jsonwebtoken");

const db = require("../models");
const { where } = require("sequelize");

const { user, tokenBlacklist, role } = db;

require("dotenv").config();

verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  try {
    const tokenBlackListEntry = await tokenBlacklist.findOne({
      where: {token: token},
    });

    if (tokenBlackListEntry) {
      return res.status(403).send({
        message: "Token is blacklisted!",
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }

  jwt.verify(token, process.env.SecretKeyToken, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.user_id = decoded.id;
    req.role = decoded.role;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const role = req.role;
    const adminuser = await user.findByPk(req.user_id);

    if (!adminuser || role !== "admin") {
      return res.status(403).send({
        message: "You are not an admin!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({ message: "Erreur serveur." });
  }
};

isAdminOrClient = async (req, res, next) => {
  try {
    const role = req.role;
    const users = await user.findByPk(req.user_id);

    if (!users || (role !== "admin" && role !== "client")) {
      return res.status(403).send({
        message: " You are not an admin or a client! ",
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({ message: "Erreur serveur." });
  }
};

AuthJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isAdminOrClient: isAdminOrClient,
};

module.exports = AuthJwt;
