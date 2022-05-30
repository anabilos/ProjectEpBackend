const db = require("../models");
const User = db.User;
const Op = db.Sequelize.Op;
exports.getUsers = async (req, res) => {
  try {
    await User.findAll({
      raw: true,
      nest: true,
      include: [db.Role],
    }).then((users) => {
      res.status(200).send(users);
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
