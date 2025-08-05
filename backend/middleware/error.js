const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error
  let error = {
    success: false,
    message: "Internal Server Error",
  };

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error.message = "Invalid ID format";
    return res.status(400).json(error);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field} already exists`;
    return res.status(400).json(error);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.message = messages.join(", ");
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token";
    return res.status(401).json(error);
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expired";
    return res.status(401).json(error);
  }

  res.status(500).json(error);
};

module.exports = { errorHandler };
