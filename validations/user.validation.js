const { body } = require("express-validator");

const userSignUpValidate = {
  username: {
    exists: {
      errorMessage: "Username is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Username should be string" },
  },
  password: {
    exists: { errorMessage: "Password is required" },
    isString: { errorMessage: "Password should be string" },
    isLength: {
      options: { min: 5 },
      errorMessage: "Password should be at least 5 characters",
    },
  },
  confPass: {
    exists: { errorMessage: "Confirm password is required" },
    isString: { errorMessage: "Password should be string" },
  },
  email: {
    exists: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Please provide valid email" },
  },
  address: {
    isString: { errorMessage: "Address should be string" },
  },
  phone: {
    exists: { errorMessage: "Phone is required" },
    isString: { errorMessage: "Phone should be string" },
  },
};

const userSignInValidate = {
  email: {
    exists: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Please provide valid email" },
  },
  password: {
    exists: { errorMessage: "Password is required" },
    isString: { errorMessage: "Password should be string" },
  },
};
const userForgotPassValidate = {
  email: {
    exists: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Please provide valid email" },
  },
};

const userResetPassValidate = {
  newPass: {
    exists: { errorMessage: "New Password is required" },
    isString: { errorMessage: "New Password should be string" },
    isLength: {
      options: { min: 5 },
      errorMessage: "New Password should be at least 5 characters",
    },
  },
};

const userChangePassValidate = {
  email: {
    exists: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Please provide valid email" },
  },
  currPass: {
    exists: { errorMessage: "Current password is required" },
    isString: { errorMessage: "Current password should be string" },
  },
  newPass: {
    exists: { errorMessage: "New password is required" },
    isString: { errorMessage: "New password should be string" },
    isLength: {
      options: { min: 5 },
      errorMessage: "New password should be at least 5 characters",
    },
  },
  confNewPass: {
    exists: { errorMessage: "Confirm new password is required" },
    isString: { errorMessage: "Confirm new password should be string" },
  },
};

const userEditAccountValidate = {
  username: {
    exists: {
      errorMessage: "Username is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Username should be string" },
  },
  email: {
    exists: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Please provide valid email" },
  },
  phone: {
    exists: { errorMessage: "Phone is required" },
    isString: { errorMessage: "Phone should be string" },
  },
  address: {
    isString: { errorMessage: "Address should be string" },
  },
};
module.exports = {
  userSignUpValidate,
  userSignInValidate,
  userForgotPassValidate,
  userResetPassValidate,
  userChangePassValidate,
  userEditAccountValidate,
};
