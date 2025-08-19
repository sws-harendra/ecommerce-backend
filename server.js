require("dotenv").config();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
var logger = require("morgan");

const express = require("express");
const cors = require("cors");
require("./config/db");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // or your frontend URL
    credentials: true, // allow sending cookies/headers
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev")); // Shows :method :url :status :response-time ms
// app.use("/api", routes); // All routes prefixed with /api
app.use("/user", require("./routes/user.route")); // /api/user/login
app.use("/products", require("./routes/product.route"));
app.use("/category", require("./routes/category.route"));
app.use("/cart", require("./routes/cart.route"));

app.get("/", (req, res) => {
  res.json("hello from backend");
});

let port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

module.exports = app;
