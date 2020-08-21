import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDto from '@modules/appointments/dtos/ICreateAppointmentDto';
import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import Appointment from '../../infra/typeorm/entities/Appointment';

class FakeAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );
    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDto): Promise<Appointment> {
    const appointment = new Appointment();
    appointment.id = uuid();
    appointment.provider_id = provider_id;
    appointment.date = date;

    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointmentRepository;
