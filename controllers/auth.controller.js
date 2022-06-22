const db = require("../models");
const User = db.User;
const Role = db.Role;
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// username, email, address, password, confPass, phone, photo, description
exports.signup = async (req, res) => {
  const { username, email, address, confPass, phone, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    let photo = "";
    if (req.file != null) {
      photo = req.file.path;
    }
    if (req.body.password !== confPass)
      return res.status(400).send({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    User.create({
      Username: username,
      Email: email,
      Hashed_password: bcrypt.hashSync(req.body.password, 8),
      Address: address,
      Phone: phone,
      Description: description,
      Photo: photo,
    })
      .then((user) => {
        if (req.body.roles) {
          Role.findAll({
            where: {
              Name: {
                [Op.or]: req.body.roles,
              },
            },
          }).then((roles) => {
            user.setRoles(roles).then(() => {
              res.status(200).send({
                success: true,
                message: "User registered successfully!",
              });
            });
          });
        } else {
          // user role by default
          user.setRoles([1]).then(() => {
            res.status(200).send({
              success: true,
              message: "User registered successfully!",
            });
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: err.message || "Some error occurred while creating user!",
        });
      });
  }
};

// email, password
exports.signin = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    User.findOne({
      where: {
        Email: email,
      },
    })
      .then((user) => {
        if (!user)
          return res.status(404).send({
            success: false,
            message: "User with that email doesnt exist!",
          });

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.Hashed_password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            success: false,
            message: "Invalid Password!",
          });
        }

        var authorities = [];
        user.getRoles().then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push(roles[i].Name);
          }
          console.log(authorities);
          const token = jwt.sign(
            {
              id: user.Id,
              username: user.Username,
              email: user.Email,
              role: authorities,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: 86400,
            }
          );
          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          res.status(200).send({
            id: user.Id,
            username: user.Username,
            email: user.Email,
            address: user.Address,
            roles: authorities,
            accessToken: token,
          });
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
};

exports.logout = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(204);
  res.clearCookie("token");
  return res.sendStatus(200);
};

// email
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    User.findOne({
      where: {
        Email: email,
      },
    })
      .then((user) => {
        if (!user)
          return res.status(404).send({
            success: false,
            message: "User with this email does not exist!",
          });

        const token = jwt.sign(
          { id: user.Id },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: "20m",
          }
        );
        const sent = sendEmail(email, token);
        if (sent != "0") {
          user
            .update({ ResetLink: token })
            .then(() => {
              return res.status(200).send({
                success: true,
                message: "Email has been sent, kindly follow the instructions.",
              });
            })
            .catch((err) => {
              return res.status(400).json({
                success: false,
                message: "Error updating user!",
              });
            });
        } else {
          return res.status(500).send({
            success: false,
            message: "Something goes to wrong. Please try again",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: err.message,
        });
      });
  }
};

// resetLink (token from url), newPass
exports.resetPassword = (req, res) => {
  const { resetLink } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    if (resetLink) {
      jwt.verify(
        resetLink,
        process.env.JWT_RESET_PASSWORD,
        function (error, decodedData) {
          if (error) {
            return res.status(401).send({
              success: false,
              message: "Incorrect token or it is expired.",
            });
          }
          User.findOne({
            where: {
              ResetLink: resetLink,
            },
          })
            .then((user) => {
              if (!user)
                return res.status(404).send({
                  success: false,
                  message: "User with this token does not exist!",
                });
              user
                .update({
                  Hashed_password: bcrypt.hashSync(req.body.newPass, 8),
                  ResetLink: "",
                })
                .then(() => {
                  return res.status(200).send({
                    success: true,
                    message: "Your password has been changed successfully!",
                  });
                })
                .catch((err) => {
                  return res.status(400).json({
                    success: false,
                    message: "Error updating user!",
                  });
                });
            })
            .catch((err) => {
              res.status(500).send({
                success: false,
                message: "Error retrieving user with given reset link!",
              });
            });
        }
      );
    } else {
      return res.status(401).send({ success: false, message: "Unauthorized!" });
    }
  }
};

// email, currPass, newPass, confNewPass
exports.changePassword = (req, res) => {
  const { email, confNewPass } = req.body;
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
        var passwordIsValid = bcrypt.compareSync(
          req.body.currPass,
          user.Hashed_password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            success: false,
            message: "Current password incorrect!",
          });
        }

        if (req.body.newPass !== confNewPass)
          return res.status(400).send({
            success: false,
            message: "New password and confirm password do not match",
          });
        user
          .update({ Hashed_password: bcrypt.hashSync(req.body.newPass, 8) })
          .then(() => {
            res.status(200).send({
              success: true,
              message: "Password changed successfully!",
            });
          })
          .catch((err) => {
            res.status(500).send({
              success: false,
              message: "Error updating user!",
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

//  username, address, email, phone, photo, description
exports.editAccount = (req, res) => {
  const { username, address, email, phone, description } = req.body;
  let photo = "";
  if (!req.file == null) {
    photo = req.file.path;
  }
  console.log(photo);
  const id = req.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    User.findByPk(id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            success: false,
            message: "User with this id does not exist!",
          });
        }
        user
          .update({
            Username: username,
            Address: address,
            Email: email,
            Phone: phone,
            Description: description,
            Photo: photo,
          })
          .then(() => {
            return res.status(200).send({
              success: true,
              message: "Account updated successfully.",
            });
          })
          .catch((err) => {
            res.status(500).send({
              success: false,
              message: "Error updating user!",
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

exports.getCurrentUser = (req, res) => {
  const user = {
    Id: req.id,
    Username: req.username,
    Email: req.email,
    Role: req.role,
  };

  return res.status(200).send(user);
};

function sendEmail(email, token) {
  var email = email;
  var token = token;

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
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Password Link ",
    html: ` <h1>Please use the following link to reset your password</h1>
      <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
      <hr />
      <p>This email may contain sensetive information</p>`,
  };

  mail.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(0);
    }
  });
}
