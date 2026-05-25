import type { ErrorRequestHandler, RequestHandler } from 'express';

export const notFoundMiddleware: RequestHandler = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    message: 'Internal server error'
  });
};
