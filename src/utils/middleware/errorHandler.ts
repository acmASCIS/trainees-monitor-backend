import { ApiError } from './../ApiError';
import { Request, Response, NextFunction } from 'express';

export function errorHandler(error: ApiError, req: Request, res: Response, next: NextFunction) {
  // TODO: log using logger
  console.log(error);
  res.status(error.status).json({ message: error.message, body: error.body });
}
