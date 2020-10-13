import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/Container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import ShowProfileService from './ShowProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;
let fakeHashProvider: FakeHashProvider;
let showProfileService: ShowProfileService;
let fakeCacheProvider: FakeCacheProvider;
describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    showProfileService = new ShowProfileService(fakeUsersRepository);
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to show the profile', async () => {
    const { id } = await createUserService.execute({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '12345678',
    });

    const profile = await showProfileService.execute({ user_id: id });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('jonhdoe@gmail.com');
  });
  it('should not be able to show the profile of a non-existing user', async () => {
    await expect(
      showProfileService.execute({ user_id: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
