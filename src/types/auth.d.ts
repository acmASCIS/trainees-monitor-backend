/**
 * Extending the Request Interface to hold the user
 * in authenticated state.
 */
declare namespace Express {
  interface Request {
    user: {
      _id: string;
      handle: string;
      name: string;
      role: number;
    };
  }
}
