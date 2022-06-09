const db = require("../models");
const Category = db.Category;
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");

// name
exports.create = (req, res) => {
  const { name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    Category.create({ Name: name })
      .then(() => {
        res.status(200).send({
          success: true,
          message: "Category created successfully!",
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message:
            err.message || "Some error occurred while creating category!",
        });
      });
  }
};

exports.getAll = (req, res) => {
  Category.findAll()
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

// name
exports.update = (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    Category.update(
      { Name: name },
      {
        where: { Id: id },
      }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message: "Category updated successfully!",
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: err.message,
        });
      });
  }
};

exports.deleteOne = (req, res) => {
  const { id } = req.params;

  Category.destroy({
    where: { Id: id },
  })
    .then(() => {
      res.status(200).send({
        success: true,
        message: "Category deleted successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};
