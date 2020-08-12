import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  filename: string;
}
class UpdateAvatarService {
  public async execute({ user_id, filename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

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
    await userRepository.save(user);
    return user;
  }
}

export default UpdateAvatarService;
