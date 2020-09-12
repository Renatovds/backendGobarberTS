import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';
import FakeCreateAppointmentsRepository from '../repositories/fakes/FakeCreateAppointmentsRepository';

let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;
let fakeCreateAppointmentsRepository: FakeCreateAppointmentsRepository;
describe('ListProviderDayAvailabilityService', () => {
  beforeEach(() => {
    fakeCreateAppointmentsRepository = new FakeCreateAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeCreateAppointmentsRepository,
    );
  });

  it('should be able to show the provider day availability', async () => {
    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });
    await fakeCreateAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 10).getTime();
    });
    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'user_id',
      month: 5,
      year: 2020,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: true },
        { hour: 12, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
      ]),
    );
  });
});
