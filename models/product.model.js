module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("Product", {
    Id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    Quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    Measure: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
  });

  return Product;
};
