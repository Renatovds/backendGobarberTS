import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDto from '@modules/appointments/dtos/ICreateAppointmentDto';
import IFindAllMonthAvaliableAppointmentsDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindByDate from '../dtos/IFindByDateDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDto): Promise<Appointment>;
  findByDate(data: IFindByDate): Promise<Appointment | undefined>;
  findAllMonthAvailableAppointments(
    data: IFindAllMonthAvaliableAppointmentsDTO,
  ): Promise<Appointment[]>;
  findAllDaysAvailableAppointments(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
