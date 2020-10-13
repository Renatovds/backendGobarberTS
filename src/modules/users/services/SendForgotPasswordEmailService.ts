import { inject, injectable } from 'tsyringe';
import IMailProvider from '@shared/Container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import path from 'path';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequest {
  email: string;
}
@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokenProvider')
    private tokenProvider: IUserTokenRepository,
  ) {}

  public async execute(data: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError('User does not exist');
    }
    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'ForgotEmailTemplate.hbs',
    );
    const { token } = await this.tokenProvider.generate(user.id);
    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
