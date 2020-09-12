import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to create a user', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '12345678',
    });
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a user with a same email', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '12345678',
    });

    await expect(
      createUserService.execute({
        name: 'John Doe',
        email: 'jonhdoe@gmail.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
