import { NextFunction, Request, Response } from 'express';

interface IHttpError extends Error {
  statusCode?: number;
  type?: string;
}

const getMessage = (err: IHttpError, statusCode: number) => {
  if (statusCode === 500) {
    return 'На сервере произошла ошибка';
  }
  if (err.type === 'entity.parse.failed') {
    return 'Некорректный JSON в теле запроса';
  }
  return err.message;
};

const errorHandler = (
  err: IHttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { statusCode = 500 } = err;

  res.status(statusCode).send({ message: getMessage(err, statusCode) });
};

export default errorHandler;
