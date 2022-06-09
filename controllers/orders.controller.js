const db = require("../models");
const Order = db.Order;
const Product = db.Product;
const User = db.User;
const OrderDetails = db.OrderDetails;
const { Sequelize } = require("sequelize");
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");
const { Category } = require("../models");

// product={ id, quantity }
exports.create = async (req, res) => {
  const { product } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ success: false, message: firstError });
  } else {
    let prod = await Product.findOne({ where: { Id: product.id } });
    if (prod.dataValues.ItemsLeft - product.quantity < 0) {
      res.status(500).send({
        success: false,
        message: "Required quantity is greater than the stock!",
      });
    }
    let user = await User.findOne({
      where: { Id: prod.UserId },
      attributes: ["Address"],
    });
    Order.create({
      UserId: req.id,
      ProductQuantity: product.quantity,
      ProductId: product.id,
      Address: user.Address,
    }).catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
    prod
      .update({ ItemsLeft: prod.dataValues.ItemsLeft - product.quantity })
      .then(() => {
        res.status(200).send({
          success: true,
          message: "Order made successfully!",
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
//for provider
exports.getAllOrdersBasedOnProductId = (req, res) => {
  const { productId } = req.params;
  Order.findAll({
    where: { ProductId: productId },
    include: [
      {
        model: User,
        attributes: ["Username", "Email"],
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
exports.updateOrderStatusToTaken = (req, res) => {
  const { orderId } = req.body;

  Order.findOne({ where: { Id: orderId } })
    .then((data) => {
      data
        .update({ Status: true })
        .then(() => {
          res.status(200).send({
            success: true,
            message: "Order taken successfully!",
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

exports.getMyOrders = (req, res) => {
  Order.findAll({
    where: { UserId: req.id },
    include: [
      {
        model: Product,
        attributes: ["Id", "Name"],
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

exports.getMyOrdersDetails = (req, res) => {
  const { id } = req.params;
  Order.findOne({
    where: { Id: id },
    include: [
      {
        model: Product,
        attributes: ["Id", "Name", "Photo", "Expire", "Description"],
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
