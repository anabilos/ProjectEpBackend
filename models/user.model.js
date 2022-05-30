module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    Id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Username: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    Email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    Hashed_password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Address: {
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true,
    },
    ResetLink: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
  });

  return User;
};
