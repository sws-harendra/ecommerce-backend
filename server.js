require("dotenv").config();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
var logger = require("morgan");
const path = require("path");
const express = require("express");
const cors = require("cors");
require("./config/db");
const { connectRedis } = require("./config/redis_config");

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://168.231.126.20:3001", // Vite dev server
  "https://heritagehand.in",
];

app.use(
  cors({
    origin: allowedOrigins, // or your frontend URL
    credentials: true, // allow sending cookies/headers
  })
);
app.use(express.json());
app.use(cookieParser());
(async () => {
  await connectRedis(); // Initialize Redis connection
})();

app.use(morgan("dev")); // Shows :method :url :status :response-time ms

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use("/api", routes); // All routes prefixed with /api
app.use("/user", require("./routes/user.route")); // /api/user/login
app.use("/products", require("./routes/product.route"));
app.use("/category", require("./routes/category.route"));
app.use("/cart", require("./routes/cart.route"));
app.use("/banners", require("./routes/banner.route"));
app.use("/order", require("./routes/order.route"));
app.use("/dashboard", require("./routes/dashboard.route"));
app.use("/section", require("./routes/section.route"));
app.use("/razorpay", require("./routes/razorpay.route"));

app.get("/", (req, res) => {
  res.json("hello from backend");
});

let port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

module.exports = app;
