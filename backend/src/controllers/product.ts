import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product, { IProduct } from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import { copyImageFromTemp } from '../utils/files';

const PRODUCT_NOT_FOUND = 'Нет товара по заданному id';
const PRODUCT_TITLE_EXISTS = 'Товар с таким заголовком уже существует';

const handleProductError = (error: unknown, next: NextFunction) => {
  if (error instanceof MongooseError.ValidationError) {
    return next(new BadRequestError(error.message));
  }
  if (error instanceof Error && error.message.includes('E11000')) {
    return next(new ConflictError(PRODUCT_TITLE_EXISTS));
  }
  return next(error);
};

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Product.find({});
    return res.send({ items, total: items.length });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (
  req: Request<unknown, unknown, IProduct>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title, image, category, description, price,
    } = req.body;
    await copyImageFromTemp(image.fileName);
    const product = await Product.create({
      title, image, category, description, price,
    });
    return res.status(201).send(product);
  } catch (error) {
    return handleProductError(error, next);
  }
};

export const updateProduct = async (
  req: Request<Record<string, string>, unknown, Partial<IProduct>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    if (req.body.image) {
      await copyImageFromTemp(req.body.image.fileName);
    }
    const product = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { runValidators: true, new: true },
    );
    if (!product) {
      return next(new NotFoundError(PRODUCT_NOT_FOUND));
    }
    return res.send(product);
  } catch (error) {
    return handleProductError(error, next);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) {
      return next(new NotFoundError(PRODUCT_NOT_FOUND));
    }
    return res.send(product);
  } catch (error) {
    return next(error);
  }
};
