import dotenv from 'dotenv';
import type { StringValue } from 'ms';

dotenv.config({ quiet: true });

const getEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Переменная окружения ${name} не задана`);
  }
  return value;
};

const isDuration = (value: string): value is StringValue => /^\d+(\.\d+)? ?(ms|s|m|h|d|w|y)?$/.test(value);

const getDurationEnv = (name: string): StringValue => {
  const value = getEnv(name);
  if (!isDuration(value)) {
    throw new Error(`Переменная окружения ${name} задана неверно: ожидается срок вида 10m или 7d`);
  }
  return value;
};

export const PORT = getEnv('PORT');
export const DB_ADDRESS = getEnv('DB_ADDRESS');
export const ORIGIN_ALLOW = getEnv('ORIGIN_ALLOW');
export const AUTH_ACCESS_TOKEN_SECRET = getEnv('AUTH_ACCESS_TOKEN_SECRET');
export const AUTH_REFRESH_TOKEN_SECRET = getEnv('AUTH_REFRESH_TOKEN_SECRET');
export const AUTH_ACCESS_TOKEN_EXPIRY = getDurationEnv('AUTH_ACCESS_TOKEN_EXPIRY');
export const AUTH_REFRESH_TOKEN_EXPIRY = getDurationEnv('AUTH_REFRESH_TOKEN_EXPIRY');
export const UPLOAD_PATH = getEnv('UPLOAD_PATH');
export const UPLOAD_PATH_TEMP = getEnv('UPLOAD_PATH_TEMP');
