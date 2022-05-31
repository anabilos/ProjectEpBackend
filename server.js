const express = require("express");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./models");

require("dotenv").config({
  path: "./config/config.env",
});

const app = express();

app.use(bodyparser.json());
app.use(cookieParser());

const Role = db.Role;
db.sequelize.sync().then(() => {
  console.log("Drop and Resync Db");
});

if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(morgan("dev"));
}
require("./routes/auth.route")(app);

const userRoute = require("./routes/users.route");
const categoryRoute = require("./routes/category.route");
const productRoute = require("./routes/product.route");

app.use("/api", productRoute);
app.use("/api", userRoute);
app.use("/api", categoryRoute);

app.use((req, res, next) => {
  res.status(404).json({
    succcess: false,
    message: "Page not found",
  });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

function initial() {
  Role.create({
    Id: 1,
    Name: "user",
  });

  Role.create({
    Id: 2,
    Name: "organizer",
  });

  Role.create({
    Id: 3,
    Name: "admin",
  });
}

module.exports = app;
