const express = require("express");
const { checkSchema } = require("express-validator");
const { authJwt } = require("../middleware");
const { upload } = require("../lib/multer");
const router = express.Router();
const {
  create,
  deleteOne,
  getAll,
  update,
} = require("../controllers/categories.controller");

const { categoryNameValidate } = require("../validations/category.validation");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories of products
 * definitions:
 *   Category:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 *         descripton: name of category
 *
 */

/**
 *@swagger
 * /categories:
 *   get:
 *     summary: Returns all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: the list of the categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Category'
 *       500:
 *         description: internal server error
 */
router.get("/categories", getAll);

/**
 * @swagger
 * /categories:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Creates new category
 *     tags: [Categories]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - icon
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: the category was successfully created
 *       500:
 *         description: internal server error
 */

router.post(
  "/categories",
  upload.single("icon"),
  [authJwt.verifyToken, authJwt.isAdmin, checkSchema(categoryNameValidate)],
  create
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates existing category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category id
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - icon
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: the category was successfully updated
 *       404:
 *         description: category not found
 *       500:
 *         description: internal server error
 */

router.put(
  "/categories/:id",
  upload.single("icon"),
  [authJwt.verifyToken, authJwt.isAdmin, checkSchema(categoryNameValidate)],
  update
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *        security:
 *          - bearerAuth: []
 *        summary: Deletes a category by id
 *        tags: [Categories]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: The category id
 *        responses:
 *          200:
 *            description: delete was successful
 *          404:
 *            description: category not found
 *          500:
 *            description: internal server error
 */

router.delete(
  "/categories/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  deleteOne
);
module.exports = router;
