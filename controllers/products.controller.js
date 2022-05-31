const db = require("../models");
const Product = db.Product;
const Category = db.Category;
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");

// name, quantity, measure, categoryId
exports.create = (req, res) => {
  const { name, quantity, measure, categoryId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    Product.create({
      Name: name,
      Quantity: quantity,
      Measure: measure,
      CategoryId: categoryId,
    })
      .then(() => {
        res.status(200).send({
          success: true,
          message: "Product created successfully!",
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: err.message || "Some error occurred while creating product!",
        });
      });
  }
};

exports.getAll = (req, res) => {
  Product.findAll({ include: Category })
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

exports.getOne = (req, res) => {
  const { id } = req.params;
  Product.findOne({ where: { Id: id }, include: Category })
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
// name, quantity, measure, categoryId
exports.update = (req, res) => {
  const { name, quantity, measure, categoryId } = req.body;
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    Product.update(
      {
        Name: name,
        Quantity: quantity,
        Measure: measure,
        CategoryId: categoryId,
      },
      {
        where: { Id: id },
        include: Category,
      }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message: "Product updated successfully!",
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

  Product.destroy({
    where: { Id: id },
    include: Category,
  })
    .then(() => {
      res.status(200).send({
        success: true,
        message: "Product deleted successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};
