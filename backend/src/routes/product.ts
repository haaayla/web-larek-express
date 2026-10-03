import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../controllers/product';
import auth from '../middlewares/auth';
import {
  validateProductBody,
  validateProductId,
  validateUpdateProductBody,
} from '../middlewares/validators';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.post('/', auth, validateProductBody, createProduct);
productRouter.patch('/:productId', auth, validateProductId, validateUpdateProductBody, updateProduct);
productRouter.delete('/:productId', auth, validateProductId, deleteProduct);

export default productRouter;
