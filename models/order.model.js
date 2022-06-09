module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("Order", {
    Id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ProductQuantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    Status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    Address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Order;
};
