import 'reflect-metadata';
import FakeCacheProvider from '@shared/Container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeCreateAppointmentsRepository from '../repositories/fakes/FakeCreateAppointmentsRepository';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeCreateAppointmentsRepository: FakeCreateAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeCreateAppointmentsRepository = new FakeCreateAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeCreateAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list appointments of a specific day', async () => {
    const appointment1 = await fakeCreateAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });
    const appointment2 = await fakeCreateAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 13, 0, 0),
    });

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: 'provider_id',
      month: 5,
      year: 2020,
      day: 20,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
