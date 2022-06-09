const express = require("express");
const { checkSchema } = require("express-validator");
const router = express.Router();
const { verifySignUp, authJwt } = require("../middleware");
const {
  addToOrganizer,
  getAllUsers,
  deleteOne,
} = require("../controllers/users.controller");

router.get("/users", [authJwt.verifyToken, authJwt.isAdmin], getAllUsers);
router.delete("/users/:id", [authJwt.verifyToken, authJwt.isAdmin], deleteOne);
router.put(
  "/addtoorganizer",
  [authJwt.verifyToken, authJwt.isAdmin],
  addToOrganizer
);
module.exports = router;
