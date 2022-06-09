const db = require("../models");
const Product = db.Product;
const Category = db.Category;
const User = db.User;
const { Sequelize } = require("sequelize");
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");

// name, itemsLeft, categoryId, productImage
exports.create = (req, res) => {
  const { name, itemsLeft, categoryId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    Product.create({
      Name: name,
      ItemsLeft: itemsLeft,
      CategoryId: categoryId,
      Photo: req.file.path,
      UserId: req.id,
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

//provider products
exports.getMyProducts = (req, res) => {
  Product.findAll({ where: { UserId: req.id }, include: [Category] })
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
  Product.findOne({ where: { Id: id }, include: [Category, User] })
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
exports.getAll = (req, res) => {
  Product.findAll({ include: [Category, User] })
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

// name, itemsLeft, categoryId, productImage
exports.update = (req, res) => {
  const { name, itemsLeft, categoryId } = req.body;
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    Product.update(
      {
        Name: name,
        ItemsLeft: itemsLeft,
        CategoryId: categoryId,
        UserId: req.id,
        Photo: req.file.path,
      },
      {
        where: { Id: id },
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
  const { idProduct } = req.params;

  Product.destroy({
    where: { Id: idProduct },
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

exports.updateProductStatus = (req, res) => {
  const { id } = req.body;

  Product.findOne({ where: { Id: id } })
    .then((data) => {
      data
        .update({ Status: !data.Status })
        .then(() => {
          res.status(200).send({
            success: true,
            message: "Status changed successfully!",
          });
        })
        .catch((err) => {
          res.status(500).send({
            success: false,
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

exports.searchProductsForCategory = (req, res) => {
  const { idCategory } = req.params;
  Product.findAll({
    where: { CategoryId: idCategory },
    include: [
      {
        model: Category,
        attributes: ["Name"],
      },
      {
        model: User,
        attributes: ["Username", "Address"],
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
