import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { ApiError } from './../ApiError';
import { Role } from '../../models/User/UserDTO';

/**
 * Authorization Middleware
 *
 * A higher order function, takes the minimum role allowed as a parameter,
 * checks for the Authorization token, checks for the role, and calls next
 * if the requirements match.
 * @param {Role} role - The minimum role allowed
 */
export const authorize = (role: Role) => (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) {
    throw new ApiError('Unauthenticated Access.', 401);
  }

  const user: any = getUserFromToken(token);

  if (user.role < role) {
    throw new ApiError('Unauthorized Access.', 403);
  }

  // attaching the user object to the request
  req.user = user;
  next();
};

const getUserFromToken = (token: string): any => {
  try {
    // token Should be in this format: 'Bearer ' + token
    token = token.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    // Token is invalid
    throw new ApiError('Unauthenticated Access.', 401);
  }
};
