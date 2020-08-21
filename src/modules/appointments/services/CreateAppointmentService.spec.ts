import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeCreateAppointmentsRepository from '../repositories/fakes/FakeCreateAppointmentsRepository';

describe('CreateAppointmentService', () => {
  it('should be able to create a appointment', async () => {
    const fakeCreateAppointmentsRepository = new FakeCreateAppointmentsRepository();

    const createAppointmentService = new CreateAppointmentService(
      fakeCreateAppointmentsRepository,
    );

    const appointment = await createAppointmentService.execute({
      provider_id: '123123',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not able to create two appointments at the same date', async () => {
    const fakeCreateAppointmentsRepository = new FakeCreateAppointmentsRepository();

    const createAppointmentService = new CreateAppointmentService(
      fakeCreateAppointmentsRepository,
    );

    const appointmentDate = new Date(2020, 7, 21);

    await createAppointmentService.execute({
      provider_id: '123123',
      date: appointmentDate,
    });

    expect(
      await createAppointmentService.execute({
        provider_id: '123123',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
