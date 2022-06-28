module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("Category", {
    Id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    Icon: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Category;
};
