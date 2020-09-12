import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to show the providers except the logged one', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '12345678',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'jonhtre@gmail.com',
      password: '12345678',
    });
    const loggedUser = await fakeUsersRepository.create({
      name: 'John',
      email: 'jonh@gmail.com',
      password: '12345678',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
  it('should be able to show all the providers ', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '12345678',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'jonhtre@gmail.com',
      password: '12345678',
    });
    const loggedUser = await fakeUsersRepository.create({
      name: 'John',
      email: 'jonh@gmail.com',
      password: '12345678',
    });

    const providers = await listProvidersService.execute({});

    expect(providers).toEqual([user1, user2, loggedUser]);
  });
});
