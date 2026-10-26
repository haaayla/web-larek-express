import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Error as MongooseError, isValidObjectId } from 'mongoose';
import { AUTH_REFRESH_TOKEN_SECRET } from '../config';
import { SALT_ROUNDS } from '../constants';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';
import User, { IUser } from '../models/user';
import {
  clearCookieOptions,
  generateTokens,
  REFRESH_TOKEN_COOKIE,
  refreshCookieOptions,
  verifyToken,
} from '../utils/tokens';

type LoginBody = Pick<IUser, 'email' | 'password'>;
type RegisterBody = LoginBody & Partial<Pick<IUser, 'name'>>;

const USER_NOT_FOUND = 'Пользователь по заданному id отсутствует в базе';
const INVALID_TOKEN = 'Не валидный токен';
const WRONG_CREDENTIALS = 'Неправильные почта или пароль';

const sendAuthResponse = (
  res: Response,
  status: number,
  user: Pick<IUser, 'email' | 'name'>,
  tokens: ReturnType<typeof generateTokens>,
) => {
  res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, refreshCookieOptions);
  return res.status(status).send({
    user: { email: user.email, name: user.name },
    success: true,
    accessToken: tokens.accessToken,
  });
};

export const register = async (
  req: Request<unknown, unknown, RegisterBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ name, email, password: hash });
    const tokens = generateTokens(user._id.toString());

    user.tokens = [{ token: tokens.refreshToken }];
    await user.save();

    return sendAuthResponse(res, 201, user, tokens);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(error);
  }
};

export const login = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password +tokens');
    if (!user) {
      return next(new UnauthorizedError(WRONG_CREDENTIALS));
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new UnauthorizedError(WRONG_CREDENTIALS));
    }

    const tokens = generateTokens(user._id.toString());

    user.tokens.push({ token: tokens.refreshToken });
    await user.save();

    return sendAuthResponse(res, 200, user, tokens);
  } catch (error) {
    return next(error);
  }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const { _id } = verifyToken(refreshToken, AUTH_REFRESH_TOKEN_SECRET);

    const user = await User.findById(_id).select('+tokens');
    if (!user) {
      return next(new NotFoundError(USER_NOT_FOUND));
    }
    if (!user.tokens.some(({ token }) => token === refreshToken)) {
      return next(new UnauthorizedError(INVALID_TOKEN));
    }

    const tokens = generateTokens(_id);

    user.tokens = user.tokens.filter(({ token }) => token !== refreshToken);
    user.tokens.push({ token: tokens.refreshToken });
    await user.save();

    return sendAuthResponse(res, 200, user, tokens);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError(INVALID_TOKEN));
    }
    return next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const { _id } = verifyToken(refreshToken, AUTH_REFRESH_TOKEN_SECRET);
    if (!isValidObjectId(_id)) {
      return next(new BadRequestError('Передан не валидный ID пользователя'));
    }

    const user = await User.findById(_id).select('+tokens');
    if (!user) {
      return next(new NotFoundError(USER_NOT_FOUND));
    }

    user.tokens = user.tokens.filter(({ token }) => token !== refreshToken);
    await user.save();

    res.clearCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions);
    return res.send({ success: true });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError(INVALID_TOKEN));
    }
    return next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(new NotFoundError(USER_NOT_FOUND));
    }

    return res.send({ user: { email: user.email, name: user.name }, success: true });
  } catch (error) {
    return next(error);
  }
};
