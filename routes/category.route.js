const express = require("express");
const { checkSchema } = require("express-validator");
const router = express.Router();
const {
  create,
  deleteOne,
  getAll,
  getOne,
  update,
} = require("../controllers/categories.controller");

const { categoryNameValidate } = require("../validations/category.validation");

router.post("/categories", [checkSchema(categoryNameValidate)], create);
router.get("/categories", getAll);
router.put("/categories/:id", [checkSchema(categoryNameValidate)], update);
router.delete("/categories/:id", deleteOne);
module.exports = router;
