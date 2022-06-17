const { verifySignUp, authJwt } = require("../middleware");
const { checkSchema } = require("express-validator");
const {
  signup,
  signin,
  logout,
  forgotPassword,
  resetPassword,
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

  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: API for authorization
   * definitions:
   *   User:
   *     type: object
   *     required:
   *       - username
   *       - address
   *       - phone
   *       - email
   *       - password
   *       - confPass
   *     properties:
   *       username:
   *         type: string
   *         descripton: user username
   *       address:
   *         type: string
   *         descripton: user address
   *       phone:
   *         type: string
   *         descripton: user phone
   *       email:
   *         type: string
   *         format: email
   *         descripton: user email
   *       password:
   *         type: string
   *         format: password
   *         descripton: user password
   *       confPass:
   *         type: string
   *         format: password
   *         descripton: user confirm password
   *
   */

  /**
   * @swagger
   * /signup:
   *   post:
   *     summary: Register new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *          application/json:
   *           schema:
   *             $ref: '#/definitions/User'
   *     responses:
   *       200:
   *         description: user registered successfully
   *       500:
   *         description: internal server error
   */

  app.post(
    "/signup",
    [
      checkSchema(userSignUpValidate),
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    signup
  );

  /**
   * @swagger
   * /signin:
   *   post:
   *       summary: User login
   *       tags: [Auth]
   *       requestBody:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                email:
   *                  type: string
   *                  format: "email"
   *                password:
   *                  type: string
   *                  format: password
   *       responses:
   *         200:
   *           description: logged user
   *         500:
   *           description: internal server error
   */
  app.post("/signin", [checkSchema(userSignInValidate)], signin);

  /**
   *@swagger
   * /logout:
   *   get:
   *     summary: User logout
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: logout successful
   *       500:
   *         description: internal server error
   */

  app.get("/logout", [authJwt.verifyToken], logout);

  /**
   *@swagger
   * /getcurrentuser:
   *   get:
   *     summary: Details about logged user
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: user details
   *       500:
   *         description: internal server error
   */

  app.get("/getcurrentuser", [authJwt.verifyToken], getCurrentUser);

  /**
   * @swagger
   * /forgot-password:
   *   put:
   *       summary: Forgot password
   *       tags: [Auth]
   *       requestBody:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                email:
   *                  type: string
   *                  format: "email"
   *       responses:
   *         200:
   *           description: success
   *         404:
   *           description: user not found
   *         500:
   *           description: internal server error
   */

  app.put(
    "/forgot-password",
    [checkSchema(userForgotPassValidate)],
    forgotPassword
  );

  /**
   * @swagger
   * /reset-password:
   *   put:
   *       summary: Reset password
   *       tags: [Auth]
   *       requestBody:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                resetLink:
   *                  type: string
   *                newPass:
   *                  type: string
   *                  format: password
   *       responses:
   *         200:
   *           description: success
   *         401:
   *           description: unauthorized
   *         404:
   *           description: user not found
   *         500:
   *           description: internal server error
   */

  app.put(
    "/reset-password",
    [checkSchema(userResetPassValidate)],
    resetPassword
  );

  /**
   * @swagger
   * /change-password:
   *   put:
   *       security:
   *         - bearerAuth: []
   *       summary: Change password
   *       tags: [Auth]
   *       requestBody:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                email:
   *                  type: string
   *                  format: email
   *                currPass:
   *                  type: string
   *                  format: password
   *                newPass:
   *                  type: string
   *                  format: password
   *                confNewPass:
   *                  type: string
   *                  format: password
   *       responses:
   *         200:
   *           description: success
   *         404:
   *           description: user not found
   *         500:
   *           description: internal server error
   */

  app.put(
    "/change-password",
    [authJwt.verifyToken, checkSchema(userChangePassValidate)],
    changePassword
  );
  /**
   * @swagger
   * /edit-account:
   *   put:
   *       security:
   *         - bearerAuth: []
   *       summary: Edit account
   *       tags: [Auth]
   *       requestBody:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                username:
   *                  type: string
   *                address:
   *                  type: string
   *                email:
   *                  type: string
   *                  format: email
   *                phone:
   *                  type: string
   *       responses:
   *         200:
   *           description: success
   *         404:
   *           description: user not found
   *         500:
   *           description: internal server error
   */

  app.put(
    "/edit-account",
    [authJwt.verifyToken, checkSchema(userEditAccountValidate)],
    editAccount
  );
};
