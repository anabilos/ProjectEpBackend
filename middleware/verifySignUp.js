const db = require("../models");
const ROLES = db.ROLES;
const User = db.User;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  const { username, email } = req.body;

  // Username

  User.findOne({
    where: {
      Username: username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        success: false,
        message: "Failed! Username is already in use!",
      });

      return;
    }

    // Email

    User.findOne({
      where: {
        Email: email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          success: false,
          message: "Failed! Email is already in use!",
        });
        return;
      }
      next();
    });
  });
};
checkRolesExisted = (req, res, next) => {
  const { roles } = req.body;
  if (roles) {
    for (let i = 0; i < roles.length; i++) {
      if (!ROLES.includes(roles[i])) {
        res.status(400).send({
          success: false,
          message: "Failed! Role does not exist = " + roles[i],
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkRolesExisted: checkRolesExisted,
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
