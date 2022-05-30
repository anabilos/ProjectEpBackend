const { getUsers } = require("../controllers/users.controller");
const { authJwt } = require("../middleware");
const express = require("express");
const router = express.Router();

router.get("/users", [authJwt.verifyToken, authJwt.isAdmin], getUsers);

module.exports = router;
