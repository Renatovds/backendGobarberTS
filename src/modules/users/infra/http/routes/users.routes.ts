import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '@modules/users/services/CreateUserService';
import uploadConfig from '@config/upload';
import UpdateAvatarService from '@modules/users/services/UpdateAvatarService';
import AuthenticationMiddleware from '@modules/users/infra/http/middleware/AuthenticationMiddleware';
import { container } from 'tsyringe';

const userRouter = Router();

const upload = multer(uploadConfig);
userRouter.post('/', async (request, response) => {
  const createUserService = container.resolve(CreateUserService);

  const { name, email, password } = request.body;

  const user = await createUserService.execute({ name, email, password });
  delete user.password;
  return response.json(user);
});
userRouter.patch(
  '/avatar',
  AuthenticationMiddleware,
  upload.single('avatar'),
  async (request, response) => {
    const updateAvatarService = container.resolve(UpdateAvatarService);

    const user = await updateAvatarService.execute({
      user_id: request.user.id,
      filename: request.file.filename,
    });

    delete user.password;
    return response.json(user);
  },
);

export default userRouter;
