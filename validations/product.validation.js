const { body } = require("express-validator");

const productValidate = {
  name: {
    exists: {
      errorMessage: "Name is required",
    },
    isString: { errorMessage: "Name should be string" },
  },
  description: {
    exists: {
      errorMessage: "Description is required",
    },
    isString: { errorMessage: "Description should be string" },
  },
  itemsLeft: {
    exists: {
      errorMessage: "ItemsLeft is required",
    },
    isInt: { errorMessage: "ItemsLeft should be int" },
  },
  expire: {
    exists: {
      errorMessage: "Expire is required",
    },
    isDate: { errorMessage: "Expire should be date" },
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
