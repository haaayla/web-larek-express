import { celebrate, Segments } from 'celebrate';
import Joi from 'joi';
import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../constants';
import { imageFileNamePattern } from '../utils/files';

const imageSchema = Joi.object().keys({
  fileName: Joi.string().pattern(imageFileNamePattern).required(),
  originalName: Joi.string().required(),
});

export const validateProductBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH),
    image: imageSchema.required(),
    category: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().allow(null),
  }),
});

export const validateUpdateProductBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH),
    image: imageSchema,
    category: Joi.string(),
    description: Joi.string(),
    price: Joi.number().allow(null),
  }),
});

export const validateProductId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    productId: Joi.string().hex().length(24).required(),
  }),
});

export const validateOrderBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  }),
});

export const validateRegisterBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
    email: Joi.string().email().required(),
    password: Joi.string().min(PASSWORD_MIN_LENGTH).required(),
  }),
});

export const validateLoginBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
