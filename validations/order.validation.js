const { checkSchema } = require("express-validator");

const addOrderValidate = {
  product: {
    in: "body",
    exists: {
      errorMessage: "Product is required",
    },
    isObject: {
      errorMessage: "Product` must be an object",
    },
  },
  "product.id": {
    exists: {
      errorMessage: "Id of product is required",
    },
    isInt: {
      errorMessage: "Id of product must be a int",
    },
  },
  "product.quantity": {
    exists: {
      errorMessage: "Quantity of product is required",
    },
    isInt: {
      errorMessage: "Quantity of product must be a int",
    },
  },
};

const updateOrderStatusValidate = {
  orderId: {
    exists: {
      errorMessage: "Id of order is required",
    },
    isInt: {
      errorMessage: "Id of order must be a int",
    },
  },
};
module.exports = {
  addOrderValidate,
  updateOrderStatusValidate,
};
