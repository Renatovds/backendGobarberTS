import path from 'path';
import fs from 'fs';
import User from '@modules/users/infra/typeorm/entities/User';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../infra/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  filename: string;
}
class UpdateAvatarService {
  constructor(private userRepository: IUsersRepository) {}

  public async execute({ user_id, filename }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change the avatar', 401);
    }
    if (user.avatar) {
      const filePath = path.join(uploadConfig.fileDirectory, user.avatar);
      const avatarExist = await fs.promises.stat(filePath);
      if (avatarExist) {
        await fs.promises.unlink(filePath);
      }
    }
    user.avatar = filename;
    await this.userRepository.save(user);
    return user;
  }
}

export default UpdateAvatarService;
