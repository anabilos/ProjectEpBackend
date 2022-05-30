const { verifySignUp, authJwt } = require("../middleware");
const { checkSchema } = require("express-validator");
const {
  signup,
  signin,
  logout,
  forgotPassword,
  resetPassword,
  addToOrganizer,
  changePassword,
  editAccount,
  getCurrentUser,
} = require("../controllers/auth.controller");

const {
  userSignUpValidate,
  userSignInValidate,
  userForgotPassValidate,
  userResetPassValidate,
  userChangePassValidate,
  userEditAccountValidate,
} = require("../validations/user.validation");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/signup",
    [
      checkSchema(userSignUpValidate),
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    signup
  );
  app.post("/api/signin", [checkSchema(userSignInValidate)], signin);
  app.get("/api/logout", [authJwt.verifyToken], logout);
  app.get("/api/getcurrentuser", [authJwt.verifyToken], getCurrentUser);
  app.put(
    "/api/forgot-password",
    [checkSchema(userForgotPassValidate)],
    forgotPassword
  );
  app.put(
    "/api/reset-password",
    [checkSchema(userResetPassValidate)],
    resetPassword
  );
  app.put(
    "/api/addtoorganizer",
    [authJwt.verifyToken, authJwt.isAdmin],
    addToOrganizer
  );
  app.put(
    "/api/change-password",
    [authJwt.verifyToken, checkSchema(userChangePassValidate)],
    changePassword
  );
  app.put(
    "/api/edit-account",
    [authJwt.verifyToken, checkSchema(userEditAccountValidate)],
    editAccount
  );
};
