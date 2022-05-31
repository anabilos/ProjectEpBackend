const { body } = require("express-validator");

const productValidate = {
  name: {
    exists: {
      errorMessage: "Name is required",
    },
    isString: { errorMessage: "Name should be string" },
  },
  quantity: {
    exists: {
      errorMessage: "Quantity is required",
    },
    isInt: { errorMessage: "Quantity should be int" },
  },
  measure: {
    exists: {
      errorMessage: "Measure is required",
    },
    isString: { errorMessage: "Measure should be string" },
  },
  categoryId: {
    exists: {
      errorMessage: "CategoryId is required",
    },
    isInt: { errorMessage: "CategoryId should be int" },
  },
};

module.exports = {
  productValidate,
};
