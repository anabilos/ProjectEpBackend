const express = require("express");
const { checkSchema } = require("express-validator");
const { upload } = require("../lib/multer");
const { authJwt } = require("../middleware");

const router = express.Router();
const {
  getAll,
  create,
  getOne,
  update,
  deleteOne,
  updateProductStatus,
  searchProductsForCategory,
  getMyProducts,
} = require("../controllers/products.controller");
const { productValidate } = require("../validations/product.validation");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 * definitions:
 *   Product:
 *     type: object
 *     required:
 *       - name
 *       - itemsLeft
 *       - description
 *       - categoryId
 *       - productImage
 *       - expire
 *     properties:
 *       id:
 *         type: integer
 *         description: The Auto-generated id of a category
 *       name:
 *         type: string
 *         descripton: name of product
 *       description:
 *         type: string
 *         descripton: description of product
 *       itemsLeft:
 *         type: integer
 *         descripton: the number of product left in stock
 *       productImage:
 *         type: string
 *         descripton: picture of product
 *       expire:
 *         type: string
 *         format: date
 *         descripton: Expire of product
 *       categoryId:
 *         type: integer
 *         descripton: category of product
 *       status:
 *         type: boolean
 *         descripton: Product available yes/no
 *       userId:
 *         type: integer
 *         descripton: owner of product
 *       createdAt:
 *         type: string
 *         format: date-time
 *         descripton: date of category creation
 *       updateAt:
 *         type: string
 *         format: date-time
 *         descripton: date of category update
 *
 *
 */

/**
 *@swagger
 * /products:
 *   get:
 *     summary: Returns all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: the list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Product'
 *       500:
 *         description: internal server error
 */

router.get("/products", getAll);

/**
 * @swagger
 * /products/{id}:
 *     get:
 *       summary: Gets a product by id
 *       tags: [Products]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: The product id
 *       responses:
 *         200:
 *           description: Order details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/Product'
 *         404:
 *           description: product not found
 *         500:
 *            description: internal server error
 */

router.get("/products/:id", getOne);

/**
 *@swagger
 * /my-products:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns provider products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: the list of provider products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Product'
 *       500:
 *         description: internal server error
 */

router.get(
  "/my-products",
  [authJwt.verifyToken, authJwt.isProvider],
  getMyProducts
);

/**
 * @swagger
 * /search-product-by-category/{idCategory}:
 *     get:
 *       summary: Gets a products by category id
 *       tags: [Products]
 *       parameters:
 *         - in: path
 *           name: idCategory
 *           schema:
 *             type: integer
 *           required: true
 *           description: The category id
 *       responses:
 *         200:
 *           description: the list of products by category
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/Product'
 *         404:
 *           description: no products from that category
 *         500:
 *            description: internal server error
 */

router.get(
  "/search-product-by-category/:idCategory",
  searchProductsForCategory
);

/**
 * @swagger
 * /products:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Creates new product
 *     tags: [Products]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - itemsLeft
 *               - description
 *               - categoryId
 *               - productImage
 *               - expire
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               expire:
 *                 type: date
 *               itemsLeft:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               productImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: the product was successfully created
 *       500:
 *         description: internal server error
 */
router.post(
  "/products",
  upload.single("productImage"),
  [authJwt.verifyToken, checkSchema(productValidate)],
  create
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - itemsLeft
 *               - description
 *               - categoryId
 *               - productImage
 *               - expire
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               expire:
 *                 type: date
 *               itemsLeft:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               productImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: the product was successfully updated
 *       404:
 *         description: product not found
 *       500:
 *         description: internal server error
 */

router.put(
  "/products/:id",
  upload.single("productImage"),
  [authJwt.verifyToken, authJwt.isProvider, checkSchema(productValidate)],
  update
);
/**
 * @swagger
 * /change-product-status/{idProduct}:
 *     put:
 *       security:
 *         - bearerAuth: []
 *       summary: Changes product status (available yes/no)
 *       tags: [Products]
 *       parameters:
 *         - in: path
 *           name: idProduct
 *           schema:
 *             type: integer
 *           required: true
 *           description: The product id
 *       responses:
 *         200:
 *           description: status changed successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/Product'
 *         404:
 *           description: product not found
 *         500:
 *            description: internal server error
 */
router.put(
  "/change-product-status/:idProduct",
  [authJwt.verifyToken, authJwt.isProvider],
  updateProductStatus
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *        security:
 *          - bearerAuth: []
 *        summary: Deletes a product by id
 *        tags: [Products]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: The product id
 *        responses:
 *          200:
 *            description: delete was successful
 *          404:
 *            description: product not found
 *          500:
 *            description: internal server error
 */

router.delete("/products/:id", [authJwt.verifyToken], deleteOne);

module.exports = router;
