const config = require("../config/db.config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.produit = require("./produit.model")(sequelize, Sequelize);
db.categorie = require("./categorie.model")(sequelize, Sequelize);
db.panier = require("./panier.model")(sequelize, Sequelize);
db.cartItem = require("./cartItem.model")(sequelize, Sequelize);
db.commande = require("./commande.model")(sequelize, Sequelize);
db.orderItem = require("./orderItem.model")(sequelize, Sequelize);

db.tokenBlacklist = require("./tokenBlacklist.model")(sequelize, Sequelize);

//

db.role.hasMany(db.user, { foreignKey: "role_Id" });
db.user.belongsTo(db.role, { foreignKey: "role_Id" });

db.categorie.hasMany(db.produit, { foreignKey: "categorie_Id" });
db.produit.belongsTo(db.categorie, { foreignKey: "categorie_Id" });

db.user.hasOne(db.panier, { foreignKey: "user_Id" });
db.panier.belongsTo(db.user, { foreignKey: "user_Id" });

db.panier.hasMany(db.cartItem, { foreignKey: "panier_Id" });
db.cartItem.belongsTo(db.panier, { foreignKey: "panier_Id" });


db.produit.hasMany(db.cartItem, { foreignKey: "produit_Id" });
db.cartItem.belongsTo(db.produit, { foreignKey: "produit_Id" });


db.user.hasMany(db.commande, { foreignKey: "user_Id" });
db.commande.belongsTo(db.user, { foreignKey: "user_Id" });

db.commande.hasMany(db.orderItem, { foreignKey: "commande_Id" });
db.orderItem.belongsTo(db.commande, { foreignKey: "commande_Id" });


db.produit.hasMany(db.orderItem, { foreignKey: "produit_Id" });
db.orderItem.belongsTo(db.produit, { foreignKey: "produit_Id" });


module.exports = db;
