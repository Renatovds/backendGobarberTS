import { getRepository, Repository, Raw } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDto from '@modules/appointments/dtos/ICreateAppointmentDto';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindByDate from '@modules/appointments/dtos/IFindByDateDTO';

class AppointmentRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(data: IFindByDate): Promise<Appointment | undefined> {
    const { date, provider_id } = data;
    const findAppointment = await this.ormRepository.findOne({
      where: { provider_id, date },
    });

    return findAppointment || undefined;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDto): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findAllMonthAvailableAppointments({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const monthAppointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName},'MM-YYYY') ='${parsedMonth}-${year}'`,
        ),
      },
    });
    return monthAppointments;
  }

  public async findAllDaysAvailableAppointments({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    console.log(day, month, year);
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');
    console.log(parsedDay, parsedMonth);
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName},'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });
    return appointments;
  }
}

export default AppointmentRepository;
