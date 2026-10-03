import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

interface IOrder {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const createOrder = async (
  req: Request<unknown, unknown, IOrder>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items, total } = req.body;
    const products = await Product.find({ _id: { $in: items } });

    const missingId = items.find(
      (id) => !products.some((product) => product._id.toString() === id),
    );
    if (missingId) {
      return next(new BadRequestError(`Товар с id ${missingId} не найден`));
    }

    const notForSale = products.find((product) => product.price === null);
    if (notForSale) {
      return next(new BadRequestError(`Товар с id ${notForSale._id} не продается`));
    }

    const prices = new Map(products.map((product) => [product._id.toString(), product.price ?? 0]));
    const sum = items.reduce((acc, id) => acc + (prices.get(id) ?? 0), 0);
    if (sum !== total) {
      return next(new BadRequestError('Неверная сумма заказа'));
    }

    return res.send({ id: faker.string.uuid(), total });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
