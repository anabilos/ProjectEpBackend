const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const {
  create,
  getMyOrders,
  getAllOrdersBasedOnProductId,
  updateOrderStatusToTaken,
  getMyOrdersDetails,
} = require("../controllers/orders.controller");
const {
  addOrderValidate,
  updateOrderStatusValidate,
} = require("../validations/order.validation");
const { authJwt } = require("../middleware");
const { isProvider } = require("../middleware/authJwt");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 * definitions:
 *   Order:
 *     type: object
 *     required:
 *       - product
 *     properties:
 *       product:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             descripton: id of product
 *           quantity:
 *             type: integer
 *             descripton: quantity of product
 *
 */

/**
 *@swagger
 * /orders:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns users orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: the list of user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Order'
 *       500:
 *         description: internal server error
 */

router.get("/orders", authJwt.verifyToken, getMyOrders);

/**
 * @swagger
 * /orders/{id}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Gets a order by id
 *       tags: [Orders]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: The order id
 *       responses:
 *         "200":
 *           description: order details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/Order'
 *         "404":
 *           description: order not found
 *         "500":
 *            description: internal server error
 */

router.get("/orders/:id", authJwt.verifyToken, getMyOrdersDetails);

/**
 * @swagger
 * /get-product-orders/{productId}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Gets all orders associated to specific product
 *       tags: [Orders]
 *       parameters:
 *         - in: path
 *           name: productId
 *           schema:
 *             type: integer
 *           required: true
 *           description: The product id
 *       responses:
 *         "200":
 *           description: List of orders associated to specific product
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/Order'
 *         "500":
 *            description: internal server error
 */

router.get(
  "/get-product-orders/:productId",
  authJwt.verifyToken,
  getAllOrdersBasedOnProductId
);

/**
 * @swagger
 * /orders:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Creates new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *           schema:
 *             $ref: '#/definitions/Order'
 *     responses:
 *       200:
 *         description: the order was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Order'
 *       404:
 *         description: product with given id doesnt exist
 *       500:
 *         description: internal server error
 */

router.post(
  "/orders",
  authJwt.verifyToken,
  checkSchema(addOrderValidate),
  create
);

/**
 * @swagger
 * /update-status-order-taken/{orderId}:
 *     put:
 *       security:
 *         - bearerAuth: []
 *       summary: Changes order status (taken yes)
 *       tags: [Orders]
 *       parameters:
 *         - in: path
 *           name: orderId
 *           schema:
 *             type: integer
 *           required: true
 *           description: The order id
 *       responses:
 *         200:
 *           description: Order taken successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/Order'
 *         404:
 *           description: order not found
 *         500:
 *            description: internal server error
 */

router.put(
  "/update-status-order-taken/:orderId",
  [authJwt.verifyToken, authJwt.isProvider],
  checkSchema(updateOrderStatusValidate),
  updateOrderStatusToTaken
);

module.exports = router;
