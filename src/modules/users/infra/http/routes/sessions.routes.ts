import { Router } from 'express';
import AuthSessionService from '@modules/users/services/AuthSessionService';
import { container } from 'tsyringe';

const sessionRouter = Router();
sessionRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authSessionService = container.resolve(AuthSessionService);
  const { token, user } = await authSessionService.execute({
    email,
    password,
  });
  delete user.password;
  return response.json({ user, token });
});

export default sessionRouter;
