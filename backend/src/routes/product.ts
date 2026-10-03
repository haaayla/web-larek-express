import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/product';
import { validateProductBody } from '../middlewares/validators';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.post('/', validateProductBody, createProduct);

export default productRouter;
