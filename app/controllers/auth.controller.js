const db = require("../models");
const { user, role, tokenBlacklist } = db;

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const sendMail = require("../config/SendEmail");

const { emailTemplate } = require("../config/EmailTemplate");
const { EmailResetPassword } = require("../config/EmailResetPassword");
const { where, Op } = require("sequelize");

require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const requestFields = [
      "username",
      "email",
      "password",
      "telephone",
      "adresse",
      "role_Id",
    ];

    for (const field of requestFields) {
      if (!req.body[field]) {
        return res.status(400).send({
          message: `Le champ ${field} est vide`,
        });
      }
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const NewUser = await user.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      telephone: req.body.telephone,
      adresse: req.body.adresse,
      verificationToken,
      verificationCode,
      is_verified: false,
      role_Id: req.body.role_Id,
    });

    const verificationLink = `http://localhost:4200/verify-email?token=${verificationToken}`;

    const htmlContent = emailTemplate(
      NewUser.username,
      verificationLink,
      verificationCode
    );

    await sendMail(NewUser.email, "verification email", htmlContent);

    return res.status(200).send({
      message:
        "Inscription réussie ! verifier votre email pour active vore compte",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.VerifEmail = async (req, res) => {
  try {
    const { verificationCode, verificationToken } = req.body;

    if (!verificationCode || !verificationToken) {
      return res
        .status(400)
        .send({ message: "verificationCode or verificationToken are empty" });
    }

    const user = await User.findOne({
      where: { verificationToken },
    });

    if (!user) {
      return res
        .status(400)
        .send({ message: " verificationToken is not valid" });
    }

    if (user.verificationCode != verificationCode) {
      return res
        .status(400)
        .send({ message: " verificationCode is not valid" });
    }

    user.verificationCode = null;
    user.verificationToken = null;
    user.is_verified = true;
    await user.save();

    return res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "email or password are required" });
    }

    const loginuser = await user.findOne({
      attributes: [
        "user_id",
        "username",
        "password",
        "is_active",
        "is_verified",
      ],
      where: { email },
      include: [{ model: role, attributes: ["name"] }],
    });

    if (!loginuser) {
      return res
        .status(400)
        .send({ message: "Email or password are inccorect" });
    }

    if (!bcrypt.compareSync(password, loginuser.password)) {
      return res
        .status(400)
        .send({ message: "Email or password are inccorect" });
    }

    if (!loginuser.is_verified) {
      return res.status(400).send({ message: "Email is not verified" });
    }
    if (!loginuser.is_active) {
      return res.status(400).send({ message: "Email is not active" });
    }

    const token = jwt.sign(
      {
        id: loginuser.user_id,
        username: loginuser.username,
        role: loginuser?.role?.name,
      },
      process.env.SecretKeyToken,
      { expiresIn: 86400 }
    );

    return res
      .status(200)
      .send({ user: loginuser, token: token, role: loginuser?.role?.name });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.signout = async (req, res) => {
  try {
    const { token, user_id } = req.body;

    if (!token || !user_id) {
      return res.status(400).send({ message: "token or user_id is missing" });
    }

    const tokenuser = await user.findByPk(user_id, {
      attributes: ["user_id"],
    });

    if (!tokenuser) {
      return res.status(400).send({ message: "user not found" });
    }

    const tokenBlackListEntry = await tokenBlacklist.findOne({
      where: { token },
    });

    if (!tokenBlackListEntry) {
      await tokenBlacklist.create({
        token,
      });

      return res.status(200).send({ message: "Déconnexion réussie" });
    } else {
      return res.status(401).send({ message: "Token déja sur la liste noire" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const users = await user.findOne({
      attributes:["username","user_id","email","resetToken","resetTokenExpiry"],
      where: { email },
    });

    if (!users) {
      return res.status(400).send({ message: "user not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    users.resetToken = resetToken;
    users.resetTokenExpiry = resetTokenExpiry;

    await users.save();

    const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;
    const subject = "Demande de réinitialisation du mot de passe";

    const htmlContent = EmailResetPassword(users.username, resetLink);

    await sendMail(users.email, subject, htmlContent);

    return res
      .status(200)
      .send({ message: "Demande de réinitialisation envoyée" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.ResetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password)
      return res
        .status(400)
        .send({ message: "Token ou mot de passe manquant" });

    const users = await user.findOne({
      attributes:["user_id","resetToken","resetTokenExpiry","password"],
      where: { resetToken: token, resetTokenExpiry: { [Op.gt]: new Date() } },
    });

    if (!users) {
      return res.status(400).send({ message: "Token invalide ou expiré" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.password = hashedPassword;
    users.resetToken = null;
    users.resetTokenExpiry = null;

    await users.save();
    return res.status(200).send({ message: "Mot de passe réinitialisé" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
