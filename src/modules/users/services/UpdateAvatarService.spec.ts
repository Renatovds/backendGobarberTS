import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/Container/providers/StorageProvider/fakes/FakeStorageProvider';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import UpdateAvatarService from './UpdateAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;
let fakeHashProvider: FakeHashProvider;
let fakestorageProvider: FakeStorageProvider;
let updateAvatarService: UpdateAvatarService;
describe('UpdateAvatarService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakestorageProvider = new FakeStorageProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    updateAvatarService = new UpdateAvatarService(
      fakeUsersRepository,
      fakestorageProvider,
    );
  });

  it('should be able to update user avatar', async () => {
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
    await expect(
      updateAvatarService.execute({
        user_id: 'any-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to remove old avatar updating the new one', async () => {
    const deleteFile = jest.spyOn(fakestorageProvider, 'deleteFile');

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
