import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '@modules/users/services/CreateUserService';
import uploadConfig from '@config/upload';
import AuthenticationMiddleware from '@modules/users/infra/http/middleware/AuthenticationMiddleware';
import UsersController from '../Controllers/UsersController';
import UsersAvatarController from '../Controllers/UsersAvatarController';

const userRouter = Router();
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

const upload = multer(uploadConfig);
userRouter.post('/', usersController.create);

userRouter.patch(
  '/avatar',
  AuthenticationMiddleware,
  upload.single('avatar'),
  usersAvatarController.update,
);

export default userRouter;
