import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthSessionService from './AuthSessionService';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';

describe('AuthSessionService', () => {
  it('should be able to athenticate a user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authSessionService = new AuthSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    await createUserService.execute({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    const response = await authSessionService.execute({
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
  });
  it('should not be able to athenticate a with a user that not exist', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authSessionService = new AuthSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    expect(
      authSessionService.execute({
        email: 'jonhdoe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should  not be able to athenticate with a wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authSessionService = new AuthSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    await createUserService.execute({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    expect(
      authSessionService.execute({
        email: 'jonhdoe@gmail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
