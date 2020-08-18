import { Router } from 'express';
import AuthSessionService from '@modules/users/services/AuthSessionService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const sessionRouter = Router();
sessionRouter.post('/', async (request, response) => {
  const usersRepository = new UsersRepository();
  const { email, password } = request.body;

  const authSessionService = new AuthSessionService(usersRepository);
  const { token, user } = await authSessionService.execute({
    email,
    password,
  });
  delete user.password;
  return response.json({ user, token });
});

export default sessionRouter;
