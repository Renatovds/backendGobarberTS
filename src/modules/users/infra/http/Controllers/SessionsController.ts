import { Response, Request } from 'express';
import AuthSessionService from '@modules/users/services/AuthSessionService';
import { container } from 'tsyringe';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authSessionService = container.resolve(AuthSessionService);
    const { token, user } = await authSessionService.execute({
      email,
      password,
    });
    delete user.password;
    return response.json({ user, token });
  }
}

export default SessionsController;
