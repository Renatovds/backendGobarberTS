import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  year: number;
  month: number;
}
type IResponde = Array<{
  hour: number;
  available: boolean;
}>;
@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponde> {
    const appointments = await this.appointmentsRepository.findAllDaysAvailableAppointments(
      { provider_id, month, year, day },
    );

    const startHour = 8;
    const eachHourArray = Array.from({ length: 10 }, (_, index) => {
      return startHour + index;
    });
    const currentDate = new Date(Date.now());

    console.log(currentDate);
    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);
      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
