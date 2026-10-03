import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import {
  AUTH_ACCESS_TOKEN_EXPIRY,
  AUTH_ACCESS_TOKEN_SECRET,
  AUTH_REFRESH_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_SECRET,
} from '../config';

export interface ITokenPayload {
  _id: string;
}

export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  maxAge: ms(AUTH_REFRESH_TOKEN_EXPIRY),
  path: '/',
};

export const clearCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  path: '/',
};

export const generateTokens = (_id: string) => ({
  accessToken: jwt.sign(
    { _id },
    AUTH_ACCESS_TOKEN_SECRET,
    { expiresIn: AUTH_ACCESS_TOKEN_EXPIRY },
  ),
  refreshToken: jwt.sign(
    { _id },
    AUTH_REFRESH_TOKEN_SECRET,
    { expiresIn: AUTH_REFRESH_TOKEN_EXPIRY },
  ),
});

export const verifyToken = (token: string, secret: string): ITokenPayload => {
  const payload = jwt.verify(token, secret);
  if (typeof payload === 'string' || typeof payload._id !== 'string') {
    throw new jwt.JsonWebTokenError('invalid payload');
  }
  return { _id: payload._id };
};
