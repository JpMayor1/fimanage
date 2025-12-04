import { AppError } from "@/utils/error/appError";
import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isDev = process.env.NODE_ENV === "development";
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong.";

  // Handle AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode; // Custom status code from AppError
    message = err.message; // Custom message from AppError
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(", ");
  }

  // Handle Mongoose cast errors (invalid ObjectId, etc.)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0];
    message = `${field} already exists`;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Log error details
  console.error(`[ERROR ${statusCode}]: ${message}`);
  if (isDev) {
    console.error("Stack:", err.stack);
    console.error("Request:", {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query,
    });
  }

  // Don't send response if headers already sent
  if (res.headersSent) {
    return _next(err);
  }

  // Send the response with the proper status code and message
  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
};
