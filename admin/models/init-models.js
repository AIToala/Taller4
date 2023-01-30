var DataTypes = require("sequelize").DataTypes;
var _roles = require("./roles");
var _roles_users = require("./roles_users");
var _users = require("./users");

function initModels(sequelize) {
  var roles = _roles(sequelize, DataTypes);
  var roles_users = _roles_users(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  roles.belongsToMany(users, { as: 'user_id_users', through: roles_users, foreignKey: "role_id", otherKey: "user_id" });
  users.belongsToMany(roles, { as: 'role_id_roles', through: roles_users, foreignKey: "user_id", otherKey: "role_id" });
  roles_users.belongsTo(roles, { as: "role", foreignKey: "role_id"});
  roles.hasMany(roles_users, { as: "roles_users", foreignKey: "role_id"});
  roles_users.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(roles_users, { as: "roles_users", foreignKey: "user_id"});

  return {
    roles,
    roles_users,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
