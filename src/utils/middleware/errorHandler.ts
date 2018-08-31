import { ApiError } from './../ApiError';
import { Request, Response, NextFunction } from 'express';

export function errorHandler(error: ApiError, req: Request, res: Response, next: NextFunction) {
  console.log(error);
  res.status(error.status).json({ message: error.message, body: error.body });
}
