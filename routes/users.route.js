const express = require("express");
const { checkSchema } = require("express-validator");
const router = express.Router();
const { verifySignUp, authJwt } = require("../middleware");
const {
  addToProvider,
  getAllUsers,
  deleteOne,
  sendMailToAdmin,
  getAllProviders,
  getProvidersDetails,
  searchProvidersByCategory,
  getTopProviders,
} = require("../controllers/users.controller");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 *@swagger
 * /users:
 *   get:
 *     summary: Returns all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of the users
 *       500:
 *         description: internal server error
 */
router.get("/users", [authJwt.verifyToken, authJwt.isAdmin], getAllUsers);

/**
 *@swagger
 * /providers:
 *   get:
 *     summary: Returns all providers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of the providers
 *       500:
 *         description: internal server error
 */

router.get("/providers", getAllProviders);

/**
 * @swagger
 * /providers/{id}:
 *     get:
 *       summary: Provider details
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: The provider id
 *       responses:
 *         200:
 *           description: provider details
 *         404:
 *           description: provider not found
 *         500:
 *            description: internal server error
 */

router.get("/providers/:id", getProvidersDetails);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *        security:
 *          - bearerAuth: []
 *        summary: Deletes user by id
 *        tags: [Users]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: The user id
 *        responses:
 *          200:
 *            description: delete was successful
 *          404:
 *            description: user not found
 *          500:
 *            description: internal server error
 */

/**
 * @swagger
 * /search-providers-by-category/{idCategory}:
 *     get:
 *       summary: Gets all providers by category id
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: idCategory
 *           schema:
 *             type: integer
 *           required: true
 *           description: The category id
 *       responses:
 *         200:
 *           description: the list of providers by category
 *         404:
 *           description: no providers from that category
 *         500:
 *            description: internal server error
 */

router.get(
  "/search-providers-by-category/:idCategory",
  searchProvidersByCategory
);

router.delete("/users/:id", [authJwt.verifyToken, authJwt.isAdmin], deleteOne);

/**
 * @swagger
 * /addtoprovider:
 *   put:
 *       security:
 *         - bearerAuth: []
 *       summary: Assigning a provider role to a user
 *       tags: [Users]
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
 *           description: update was successful
 *         500:
 *           description: internal server error
 */

router.put(
  "/addtoprovider",
  [authJwt.verifyToken, authJwt.isAdmin],
  addToProvider
);

/**
 *@swagger
 * /top-providers:
 *   get:
 *     summary: Returns providers sorted by number of products
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of top providers
 *       500:
 *         description: internal server error
 */
router.get("/top-providers", getTopProviders);
/**
 *@swagger
 * /send-email-to-admin:
 *   get:
 *     summary: Sends mail to the admin to assign a new role to user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success. Email has been sent to admin!
 *       500:
 *         description: internal server error
 */

router.get("/send-email-to-admin", authJwt.verifyToken, sendMailToAdmin);
module.exports = router;
