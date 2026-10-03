import { Router } from 'express';
import uploadFile from '../controllers/upload';
import auth from '../middlewares/auth';
import uploadSingleFile from '../middlewares/file';

const uploadRouter = Router();

uploadRouter.post('/', auth, uploadSingleFile, uploadFile);

export default uploadRouter;
