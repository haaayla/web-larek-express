import winston from 'winston';
import expressWinston from 'express-winston';

const SECRET_HEADERS = ['authorization', 'cookie'];

export const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
  headerBlacklist: SECRET_HEADERS,
});

export const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
  headerBlacklist: SECRET_HEADERS,
});

export const appLogger = winston.createLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});
