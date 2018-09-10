import { ApiError } from './../ApiError';
import { Request, Response, NextFunction } from 'express';

/**
 * Error Handler Middleware
 *
 * @param {ApiError} error
 */
export function errorHandler(error: ApiError, req: Request, res: Response, next: NextFunction) {
  // TODO: log using logger
  console.log(error);

  if (!error.status) {
    error = new ApiError();
  }
  res.status(error.status).json({ message: error.message, body: error.body });
}
