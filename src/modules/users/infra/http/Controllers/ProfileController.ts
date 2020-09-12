import { Response, Request } from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateUserProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const showProfileService = container.resolve(ShowProfileService);
    const user = await showProfileService.execute({ user_id });
    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateProfileService = container.resolve(UpdateProfileService);
    const user_id = request.user.id;
    const { name, email, password, old_password } = request.body;

    const user = await updateProfileService.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });
    delete user.password;
    return response.json(user);
  }
}

export default ProfileController;
