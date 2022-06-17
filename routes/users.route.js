const express = require("express");
const { checkSchema } = require("express-validator");
const router = express.Router();
const { verifySignUp, authJwt } = require("../middleware");
const {
  addToProvider,
  getAllUsers,
  deleteOne,
  sendMailToAdmin,
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
