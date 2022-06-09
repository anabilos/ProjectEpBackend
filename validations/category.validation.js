const { body } = require("express-validator");

const categoryNameValidate = {
  name: {
    exists: {
      errorMessage: "Name is required",
    },
    isString: { errorMessage: "Name should be string" },
  },
};

module.exports = {
  categoryNameValidate,
};
