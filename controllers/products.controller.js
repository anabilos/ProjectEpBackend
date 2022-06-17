const db = require("../models");
const Product = db.Product;
const Category = db.Category;
const User = db.User;
const { Sequelize } = require("sequelize");
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");

// name, itemsLeft, categoryId, productImage, description, expire
exports.create = (req, res) => {
  const { name, itemsLeft, categoryId, description, expire } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    Product.create({
      Name: name,
      Expire: expire,
      ItemsLeft: itemsLeft,
      CategoryId: categoryId,
      Photo: req.file.path,
      UserId: req.id,
      Description: description,
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
  Product.findOne({
    where: { Id: id },
    include: [
      {
        model: Category,
        attributes: ["Name"],
      },
      {
        model: User,
        attributes: ["Username", "Address", "Email"],
      },
    ],
  })
    .then((data) => {
      if (data == null) {
        res.status(404).send({
          success: false,
          message: "Product not found!",
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
exports.getAll = (req, res) => {
  Product.findAll({
    include: [
      {
        model: Category,
        attributes: ["Id", "Name"],
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

// name, itemsLeft, categoryId, productImage, description, expire
exports.update = (req, res) => {
  const { id } = req.params;
  const { name, itemsLeft, categoryId, description, expire } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    Product.findByPk(id)
      .then((product) => {
        if (!product) {
          res.status(404).send({
            success: false,
            message: "Product not found!",
          });
        } else {
          product.update({
            Name: name,
            ItemsLeft: itemsLeft,
            CategoryId: categoryId,
            UserId: req.id,
            Photo: req.file.path,
            Description: description,
            Expire: expire,
          });
        }
      })
      .then(() =>
        res.status(200).send({
          success: true,
          message: "Product updated successfully!",
        })
      )
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
  })
    .then((data) => {
      if (data == 0) {
        res.status(404).send({
          success: false,
          message: "Product not found!",
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Product deleted successfully!",
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

exports.updateProductStatus = (req, res) => {
  const { idProduct } = req.params;

  Product.findOne({ where: { Id: idProduct } })
    .then((data) => {
      if (data == null) {
        res.status(404).send({
          success: false,
          message: "Product not found!",
        });
      } else {
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
      }
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
      if (data.length == 0) {
        res.status(404).send({
          success: false,
          message: "No products from that category!",
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
