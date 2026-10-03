import { NextFunction, Request, Response } from 'express';

interface IHttpError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: IHttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
};

export default errorHandler;
