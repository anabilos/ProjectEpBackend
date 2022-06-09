const db = require("../models");
const User = db.User;
const Role = db.Role;
const Op = db.Sequelize.Op;

exports.getAllUsers = (req, res) => {
  User.findAll({
    attributes: ["Username", "Email", "Address", "Phone"],
    include: [Role],
  })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

// email
exports.addToOrganizer = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    User.findOne({
      where: { Email: email },
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            success: false,
            message: "User with this email does not exist!",
          });
        }

        let role = [];
        user.getRoles().then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            role.push(roles[i].Name);
          }
          if (role.includes("organizer")) {
            return res
              .status(422)
              .send({ success: false, message: "Already in role!" });
          }
          user
            .setRoles([2])
            .then(() => {
              res.status(200).send({
                success: true,
                message: "User added as organizer!",
              });
            })
            .catch((err) => {
              res.status(500).send({
                success: false,
                message: "Error setting user role!",
              });
            });
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: "Error retrieving user with given id!",
        });
      });
  }
};

exports.deleteOne = (req, res) => {
  const { id } = req.params;

  User.destroy({
    where: { Id: id },
  })
    .then(() => {
      res.status(200).send({
        success: true,
        message: "User deleted successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};
