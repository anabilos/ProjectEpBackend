const db = require("../models");
const User = db.User;
const Role = db.Role;
const Op = db.Sequelize.Op;
const Product = db.Product;
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const { Category } = require("../models");
const sequlize = require("sequelize");

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

exports.getAllProviders = (req, res) => {
  User.findAll({
    attributes: ["Id", "Username", "Email", "Address", "Phone", "Photo"],
    include: [
      {
        model: Role,
        where: { Name: "provider" },
        attributes: ["Name"],
      },
    ],
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

exports.getProvidersDetails = (req, res) => {
  const { id } = req.params;
  User.findOne({
    attributes: [
      "Username",
      "Email",
      "Address",
      "Phone",
      "Photo",
      "Description",
    ],
    where: {
      Id: id,
    },
    include: [
      { model: Product, include: [{ model: Category, attributes: ["Name"] }] },
    ],
  })
    .then((user) => {
      if (!user)
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

exports.searchProvidersByCategory = (req, res) => {
  const { idCategory } = req.params;
  User.findAll({
    attributes: ["Username", "Email", "Address", "Phone", "Photo"],
    include: [
      {
        model: Product,
        attributes: [],
        where: { CategoryId: idCategory },
      },
    ],
  })
    .then((data) => {
      if (data.length == 0) {
        res.status(404).send({
          success: false,
          message: "No providers from that category!",
        });
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

// email
exports.addToProvider = (req, res) => {
  const { email } = req.body;
  console.log(email);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    User.findOne({
      where: { Email: email },
    })
      .then((user) => {
        console.log(user);
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
          message: "Error retrieving user with given email!",
        });
      });
  }
};

exports.deleteOne = (req, res) => {
  const { id } = req.params;

  User.destroy({
    where: { Id: id },
  })
    .then((data) => {
      if (data == 0) {
        res.status(404).send({
          success: false,
          message: "User not found!",
        });
      } else {
        res.status(200).send({
          success: true,
          message: "User deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

exports.sendMailToAdmin = (req, res) => {
  const sent = sendEmail(req.id, req.username, req.email);
  if (sent != "0") {
    return res.status(200).send({
      success: true,
      message: "Email has been sent to admin.",
    });
  } else {
    return res.status(500).send({
      success: false,
      message: "Something went wrong. Please try again",
    });
  }
};

function sendEmail(id, username, email) {
  var email = email;
  var id = id;
  var username = username;

  var mail = nodemailer.createTransport({
    port: 587,
    secure: false,
    requireTLS: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  var mailOptions = {
    from: { name: username, address: email },
    to: process.env.EMAIL_FROM,
    subject: "Role update",
    html: ` 
      <p>Request from user ${username} with id ${id} to update his role to organizer.</p>
      <hr />
      <p>Thanks in advance!</p>`,
  };

  mail.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(0);
    }
  });
}
