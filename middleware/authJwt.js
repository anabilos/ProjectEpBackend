const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  let token;
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    token = bearerToken;
  } else {
    token = req.cookies["token"];
  }
  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No token provided!",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized!",
      });
    }
    req.id = decoded.id;
    req.username = decoded.username;
    req.email = decoded.email;
    req.role = decoded.role;
    next();
  });
};

isAdmin = (req, res, next) => {
  if (req.role.includes("admin")) {
    next();
    return;
  }
  res.status(403).send({
    success: false,
    message: "Require Admin Role!",
  });
  return;
};

isProvider = (req, res, next) => {
  if (req.role.includes("provider")) {
    next();
    return;
  }
  res.status(403).send({
    success: false,
    message: "Require Provider Role!",
  });
};

const authJwt = {
  isAdmin: isAdmin,
  isProvider: isProvider,
  verifyToken: verifyToken,
};

module.exports = authJwt;
