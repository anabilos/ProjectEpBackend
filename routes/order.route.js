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

router.post(
  "/orders",
  authJwt.verifyToken,
  checkSchema(addOrderValidate),
  create
);
router.get("/orders", authJwt.verifyToken, getMyOrders);
router.get("/orders/:id", authJwt.verifyToken, getMyOrdersDetails);
router.get(
  "/get-product-orders/:productId",
  authJwt.verifyToken,
  authJwt.isProvider,
  getAllOrdersBasedOnProductId
);
router.put(
  "/update-status-order-taken",
  [authJwt.verifyToken, authJwt.isProvider],
  checkSchema(updateOrderStatusValidate),
  updateOrderStatusToTaken
);

module.exports = router;
