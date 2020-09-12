import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '../providers/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}
@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    email,
    name,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found.');
    }
    const emailExist = await this.usersRepository.findByEmail(email);
    if (emailExist && emailExist.id !== user.id) {
      throw new AppError('E-mail already exists.');
    }
    user.name = name;
    user.email = email;
    if (password && !old_password) {
      throw new AppError('You have to inform the old password.');
    }
    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.hashCompare(
        old_password,
        user.password,
      );
      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }
      user.password = await this.hashProvider.hashGenerate(password);
    }
    await this.usersRepository.save(user);
    return user;
  }
}

export default UpdateUserProfileService;
