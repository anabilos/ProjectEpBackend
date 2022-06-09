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
    ItemsLeft: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    Photo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Expire: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    Status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  return Product;
};
