import type { ErrorRequestHandler, RequestHandler } from 'express';

import { AppError } from '../utils/app-error.js';

export const notFoundMiddleware: RequestHandler = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    message: 'Internal server error'
  });
};
