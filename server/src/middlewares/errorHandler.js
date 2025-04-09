function errorHandler(err, req, res, next) {
  console.error(err.stack, "<<< error stack");

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    message = "Email already exists";
  }

  if (err.name === "SequelizeDatabaseError") {
    statusCode = 400;
    message = "Invalid input";
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    statusCode = 400;
    message = "Invalid input";
  }

  if (err.name === "ValidationErrorItem") {
    statusCode = 400;
    message = err.message;
  }

  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = err.errors[0].message;
  }

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
