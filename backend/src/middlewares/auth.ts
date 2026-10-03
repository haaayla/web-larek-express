import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_ACCESS_TOKEN_SECRET } from '../config';
import UnauthorizedError from '../errors/unauthorized-error';
import { ITokenPayload, verifyToken } from '../utils/tokens';

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}

const AUTH_REQUIRED = 'Необходима авторизация';

const auth = (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization?.startsWith('Bearer ')) {
    return next(new UnauthorizedError(AUTH_REQUIRED));
  }

  try {
    req.user = verifyToken(authorization.replace('Bearer ', ''), AUTH_ACCESS_TOKEN_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Истек срок действия токена'));
    }
    return next(new UnauthorizedError(AUTH_REQUIRED));
  }

  return next();
};

export default auth;
