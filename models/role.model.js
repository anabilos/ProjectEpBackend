module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("Roles", {
    Id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    Name: {
      type: Sequelize.STRING,
    },
  });

  return Role;
};
