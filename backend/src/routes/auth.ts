import { Router } from 'express';
import {
  getCurrentUser,
  login,
  logout,
  refreshAccessToken,
  register,
} from '../controllers/auth';
import auth from '../middlewares/auth';
import { validateLoginBody, validateRegisterBody } from '../middlewares/validators';

const authRouter = Router();

authRouter.post('/login', validateLoginBody, login);
authRouter.post('/register', validateRegisterBody, register);
authRouter.get('/token', refreshAccessToken);
authRouter.get('/logout', logout);
authRouter.get('/user', auth, getCurrentUser);

export default authRouter;
