const sql = require("mssql");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("ep-projekt", "user1", "lozinka5", {
  host: "localhost",
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: true,
    },
  },
});
sequelize
  .authenticate()
  .then((err) => {
    console.log("Connection successful", err);
  })
  .catch((err) => {
    console.log("Unable to connect to database", err);
  });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require("../models/user.model")(sequelize, Sequelize);
db.Role = require("../models/role.model")(sequelize, Sequelize);
db.Category = require("../models/category.model")(sequelize, Sequelize);
db.Product = require("../models/product.model")(sequelize, Sequelize);
db.Order = require("../models/order.model")(sequelize, Sequelize);
db.Role.belongsToMany(db.User, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.User.belongsToMany(db.Role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.Category.hasMany(db.Product);
db.Product.belongsTo(db.Category);
db.User.hasMany(db.Product);
db.Product.belongsTo(db.User);
db.Product.hasMany(db.Order);
db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);
db.Order.belongsTo(db.Product);

db.ROLES = ["user", "admin", "provider"];

module.exports = db;
