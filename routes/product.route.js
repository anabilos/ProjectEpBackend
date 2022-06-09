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
} = require("../controllers/products.controller");
const { productValidate } = require("../validations/product.validation");

router.post(
  "/products",
  upload.single("productImage"),
  [authJwt.verifyToken, authJwt.isProvider, checkSchema(productValidate)],
  create
);
router.get("/products", getAll);
router.get("/products/:id", getOne);
router.get(
  "/search-product-for-category/:idCategory",
  [authJwt.verifyToken],
  searchProductsForCategory
);
router.put(
  "/products/:id",
  upload.single("productImage"),
  [authJwt.verifyToken, authJwt.isProvider, checkSchema(productValidate)],
  update
);
router.put(
  "/change-product-status/:idProduct",
  [authJwt.verifyToken, authJwt.isProvider],
  updateProductStatus
);
router.delete(
  "/products/:id",
  [authJwt.verifyToken, authJwt.isProvider],
  deleteOne
);

module.exports = router;
