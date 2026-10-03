import { errors } from 'celebrate';
import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, DB_ADDRESS } from './config';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import NotFoundError from './errors/not-found-error';
import errorHandler from './middlewares/error-handler';
import { requestLogger, errorLogger, appLogger } from './middlewares/logger';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(requestLogger);

app.use('/product', productRouter);
app.use('/order', orderRouter);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_ADDRESS)
  .then(() => app.listen(Number(PORT)))
  .catch((error) => {
    appLogger.error(error.message);
    process.exit(1);
  });
