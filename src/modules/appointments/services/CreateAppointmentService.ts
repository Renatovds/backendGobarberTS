import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/Container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    date,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const hour = getHours(appointmentDate);
    const oldDate = isBefore(appointmentDate, Date.now());
    if (oldDate) {
      throw new AppError(" You can't create an appointment in a past date");
    }

    if (provider_id === user_id) {
      throw new AppError(" You can't create an appointment to yourself.");
    }
    if (hour < 8 || hour > 17) {
      throw new AppError(' Your appointment is outside working hours.');
    }
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      { date: appointmentDate, provider_id },
    );
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });
    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'hs'");
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${dateFormatted}.`,
    });
    await this.cacheProvider.invalidade(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );
    return appointment;
  }
}

export default CreateAppointmentService;
