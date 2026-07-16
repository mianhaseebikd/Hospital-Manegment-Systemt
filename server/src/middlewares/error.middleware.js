import { ApiResponse } from "../utils/ApiResponse.js";

export const notFoundHandler = (req, res) => {
  return res.status(404).json(new ApiResponse(404, null, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  return res.status(statusCode).json({
    statusCode,
    data: null,
    message,
    success: false,
    errors: err.error || err.errors || []
  });
};
