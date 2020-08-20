import { Response, Request } from 'express';
import UpdateAvatarService from '@modules/users/services/UpdateAvatarService';

import { container } from 'tsyringe';

class UsersAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatarService = container.resolve(UpdateAvatarService);

    const user = await updateAvatarService.execute({
      user_id: request.user.id,
      filename: request.file.filename,
    });

    delete user.password;
    return response.json(user);
  }
}

export default UsersAvatarController;
