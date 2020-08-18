import { hash } from 'bcrypt';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../infra/repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}
class CreateUserService {
  constructor(private userRepository: IUsersRepository) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExist = await this.userRepository.findByEmail(email);

    if (checkUserExist) {
      throw new AppError('The email is already used');
    }
    const hashPassword = await hash(password, 8);
    const user = await this.userRepository.create({
      name,
      email,
      password: hashPassword,
    });

    return user;
  }
}

export default CreateUserService;
