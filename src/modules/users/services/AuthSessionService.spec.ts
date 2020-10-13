import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/Container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthSessionService from './AuthSessionService';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authSessionService: AuthSessionService;
let fakeCacheProvider: FakeCacheProvider;
describe('AuthSessionService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
    authSessionService = new AuthSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to athenticate a user', async () => {
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
    await expect(
      authSessionService.execute({
        email: 'jonhdoe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should  not be able to athenticate with a wrong password', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    await expect(
      authSessionService.execute({
        email: 'jonhdoe@gmail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
