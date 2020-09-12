import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeCreateAppointmentsRepository from '../repositories/fakes/FakeCreateAppointmentsRepository';

let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;
let fakeCreateAppointmentsRepository: FakeCreateAppointmentsRepository;
describe('ListProviderMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeCreateAppointmentsRepository = new FakeCreateAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeCreateAppointmentsRepository,
    );
  });

  it('should be able to show the provider month availability', async () => {
    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });
    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });
    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });
    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 20, 11, 0, 0),
    });
    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });
    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 20, 13, 0, 0),
    });
    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });
    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });
    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });
    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 21, 10, 0, 0),
    });

    const monthAvaliblesDays = await listProviderMonthAvailabilityService.execute(
      {
        provider_id: 'user_id',
        month: 5,
        year: 2020,
      },
    );
    expect(monthAvaliblesDays).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
