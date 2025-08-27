const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const { User, Shop } = require("../models"); // Sequelize models index.js should export them
const catchAsyncErrors = require("../middleware/catchError");

// Check if user is authenticated
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findByPk(decoded.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  req.user = user;
  next();
});

// Check if seller is authenticated
exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies;
  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

  const seller = await Shop.findByPk(decoded.id);

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  req.seller = seller;
  next();
});

// Check if user has admin role
exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} cannot access this resource!`, 403)
      );
    }
    next();
  };
};
