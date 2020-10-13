import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/Fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/Container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';
import FakeCreateAppointmentsRepository from '../repositories/fakes/FakeCreateAppointmentsRepository';

let fakeCreateAppointmentsRepository: FakeCreateAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeCreateAppointmentsRepository = new FakeCreateAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointmentService = new CreateAppointmentService(
      fakeCreateAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });
    const appointment = await createAppointmentService.execute({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2020, 4, 20, 12),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create two appointments at the same date', async () => {
    const appointmentDate = new Date(2020, 4, 20, 12);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 19, 12).getTime();
    });
    await createAppointmentService.execute({
      provider_id: '123123',
      user_id: '123456',
      date: appointmentDate,
    });

    await expect(
      createAppointmentService.execute({
        provider_id: '123123',
        user_id: '123456',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment on a past date', async () => {
    const appointmentDate = new Date(2020, 4, 20, 10);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: '123123',
        user_id: '123456',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment with the same user as provider', async () => {
    const appointmentDate = new Date(2020, 4, 20, 10);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 9).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'user_id',
        user_id: 'user_id',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

it('should not be able to create an appointment before 8am and after 5pm', async () => {
  jest.spyOn(Date, 'now').mockImplementationOnce(() => {
    return new Date(2020, 4, 20, 11).getTime();
  });

  await expect(
    createAppointmentService.execute({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2020, 4, 21, 7),
    }),
  ).rejects.toBeInstanceOf(AppError);

  await expect(
    createAppointmentService.execute({
      provider_id: '123123',
      user_id: '123456',
      date: new Date(2020, 4, 21, 18),
    }),
  ).rejects.toBeInstanceOf(AppError);
});
