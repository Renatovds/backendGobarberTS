import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import AuthenticationMiddleware from '@modules/users/infra/http/middleware/AuthenticationMiddleware';
import { celebrate, Joi, Segments } from 'celebrate';
import UsersController from '../Controllers/UsersController';
import UsersAvatarController from '../Controllers/UsersAvatarController';

const userRouter = Router();
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

const upload = multer(uploadConfig);
userRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

userRouter.patch(
  '/avatar',
  AuthenticationMiddleware,
  upload.single('avatar'),
  usersAvatarController.update,
);

export default userRouter;
