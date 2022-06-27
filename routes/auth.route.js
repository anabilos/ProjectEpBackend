const { verifySignUp, authJwt } = require("../middleware");
const { checkSchema } = require("express-validator");
const { upload } = require("../lib/multer");
const {
  signup,
  signin,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser,
  editAccountUser,
  editAccountProvider,
} = require("../controllers/auth.controller");

const {
  userSignUpValidate,
  userSignInValidate,
  userForgotPassValidate,
  userResetPassValidate,
  userChangePassValidate,
  userEditAccountValidate,
  providerEditAccountValidate,
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
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - phone
   *               - password
   *               - confPass
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               address:
   *                 type: string
   *               phone:
   *                 type: string
   *               password:
   *                 type: string
   *                 format: password
   *               confPass:
   *                 type: string
   *                 format: password
   *               photo:
   *                 type: string
   *                 format: binary
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: user registered successfully
   *       500:
   *         description: internal server error
   */

  app.post(
    "/signup",

    upload.single("photo"),
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
   * /edit-account-user:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     summary: Edit account user
   *     tags: [Auth]
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - phone
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               address:
   *                 type: string
   *               phone:
   *                 type: string
   *     responses:
   *       200:
   *         description: success
   *       404:
   *         description: user not found
   *       500:
   *         description: internal server error
   */
  app.put(
    "/edit-account-user",
    [authJwt.verifyToken, checkSchema(userEditAccountValidate)],
    editAccountUser
  );

  /**
   * @swagger
   * /edit-account-provider:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     summary: Edit account provider
   *     tags: [Auth]
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - phone
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               address:
   *                 type: string
   *               phone:
   *                 type: string
   *               photo:
   *                 type: string
   *                 format: binary
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: success
   *       404:
   *         description: user not found
   *       500:
   *         description: internal server error
   */

  app.put(
    "/edit-account-provider",
    upload.single("photo"),
    [
      authJwt.verifyToken,
      authJwt.isProvider,
      checkSchema(providerEditAccountValidate),
    ],
    editAccountProvider
  );
};
