const express = require("express");
const { checkSchema } = require("express-validator");
const router = express.Router();
const {
  getAll,
  create,
  getOne,
  update,
  deleteOne,
} = require("../controllers/products.controller");
const { productValidate } = require("../validations/product.validation");

router.post("/products", [checkSchema(productValidate)], create);
router.get("/products", getAll);
router.get("/products/:id", getOne);
router.put("/products/:id", [checkSchema(productValidate)], update);
router.delete("/products/:id", deleteOne);
module.exports = router;
