import { Response, Request } from 'express';
import UpdateAvatarService from '@modules/users/services/UpdateAvatarService';
import { classToClass } from 'class-transformer';

import { container } from 'tsyringe';

class UsersAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatarService = container.resolve(UpdateAvatarService);

    const user = await updateAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    return response.json(classToClass(user));
  }
}

export default UsersAvatarController;
