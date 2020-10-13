import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/Container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import UpdateUserProfileService from './UpdateUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;
let fakeHashProvider: FakeHashProvider;
let updateUserProfileService: UpdateUserProfileService;
let fakeCacheProvider: FakeCacheProvider;
describe('UpdateUserProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
    updateUserProfileService = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '12345678',
    });

    const updateUser = await updateUserProfileService.execute({
      user_id: user.id,
      name: 'John trê',
      email: 'jonhdoe@gmail.com',
    });
    expect(updateUser.name).toBe('John trê');
  });
  it('should not be able to update the profile without a valid user', async () => {
    await expect(
      updateUserProfileService.execute({
        user_id: 'non-existing-id',
        name: 'John trê',
        email: 'jonhdoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update using the same email of another', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '12345678',
    });

    const user = await createUserService.execute({
      name: 'Johny Doel',
      email: 'example@gmail.com',
      password: '12345678',
    });
    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: 'John trê',
        email: 'jonhdoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the password', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'example@gmail.com',
      password: '12345678',
    });
    const updatedUser = await updateUserProfileService.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'example@gmail.com',
      old_password: '12345678',
      password: '123123',
    });
    expect(updatedUser.password).toBe('123123');
  });
  it('should not be able to update the password without a old password', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'example@gmail.com',
      password: '12345678',
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: 'John trê',
        email: 'jonhdoe@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the password with a wrong old password', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'example@gmail.com',
      password: '12345678',
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: 'John trê',
        email: 'jonhdoe@gmail.com',
        old_password: 'wrong-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
