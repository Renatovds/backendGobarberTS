import path from 'path';
import fs from 'fs';
import User from '@modules/users/infra/typeorm/entities/User';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  filename: string;
}
@injectable()
class UpdateAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, filename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

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
    await this.usersRepository.save(user);
    return user;
  }
}

export default UpdateAvatarService;
