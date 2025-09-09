const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("roles", {
    role_id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    name:{
        type:DataTypes.STRING
    }
  });

  return Role;
};
