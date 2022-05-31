const { body } = require("express-validator");

const categoryNameValidate = {
  username: {
    exists: {
      errorMessage: "Name is required",
    },
    isString: { errorMessage: "Name should be string" },
  },
};

module.exports = {
  categoryNameValidate,
};
