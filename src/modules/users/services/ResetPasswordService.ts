import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';
import IUsersRepository from '../repositories/IUsersRepository';
import IUsersTokenRepository from '../repositories/IUserTokenRepository';
import IHashProvider from '../providers/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
  password_confirmation: string;
}
@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokenProvider')
    private usersTokensRepository: IUsersTokenRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    token,
    password,
    password_confirmation,
  }: IRequest): Promise<void> {
    if (password !== password_confirmation) {
      throw new AppError('Password and password_confirmation does not match.');
    }
    const userToken = await this.usersTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User token does not exist');
    }
    const tokenCreatedAtDate = addHours(userToken.created_at, 2);

    if (isAfter(Date.now(), tokenCreatedAtDate)) {
      throw new AppError('Token is expired');
    }
    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    user.password = await this.hashProvider.hashGenerate(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
