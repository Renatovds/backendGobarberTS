import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import AuthenticationMiddleware from '../middleware/AuthenticationMiddleware';
import uploadConfig from '../config/upload';
import UpdateAvatarService from '../services/UpdateAvatarService';

const userRouter = Router();
const createUserService = new CreateUserService();

const upload = multer(uploadConfig);
userRouter.post('/', async (request, response) => {
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
    const updateAvatarService = new UpdateAvatarService();

    const user = await updateAvatarService.execute({
      user_id: request.user.id,
      filename: request.file.filename,
    });

    delete user.password;
    return response.json(user);
  },
);

export default userRouter;
