import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/Container/providers/fakes/FakeStorageProvider';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import UpdateAvatarService from './UpdateAvatarService';

describe('UpdateAvatarService', () => {
  it('should be able to update user avatar', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeuserRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(
      fakeuserRepository,
      fakeHashProvider,
    );

    const fakestorageProvider = new FakeStorageProvider();
    const updateAvatarService = new UpdateAvatarService(
      fakeuserRepository,
      fakestorageProvider,
    );

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '12345678',
    });

    const updateUser = await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });
    expect(updateUser.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update the avatar without a valid user', async () => {
    const fakeuserRepository = new FakeUsersRepository();
    const fakestorageProvider = new FakeStorageProvider();
    const updateAvatarService = new UpdateAvatarService(
      fakeuserRepository,
      fakestorageProvider,
    );

    expect(
      updateAvatarService.execute({
        user_id: 'any-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to remove old avatar updating the new one', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeuserRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(
      fakeuserRepository,
      fakeHashProvider,
    );

    const fakestorageProvider = new FakeStorageProvider();
    const deleteFile = jest.spyOn(fakestorageProvider, 'deleteFile');

    const updateAvatarService = new UpdateAvatarService(
      fakeuserRepository,
      fakestorageProvider,
    );

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '12345678',
    });

    await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });
    const updateUser = await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(updateUser.avatar).toBe('avatar2.jpg');
  });
});
