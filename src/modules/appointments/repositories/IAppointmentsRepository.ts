import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDto from '@modules/appointments/dtos/ICreateAppointmentDto';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDto): Promise<Appointment>;
  findByDate(data: Date): Promise<Appointment | undefined>;
}
