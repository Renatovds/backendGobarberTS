import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  year: number;
  month: number;
}
type IResponde = Array<{
  day: number;
  available: boolean;
}>;
@injectable()
class ListProvidersMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponde> {
    const appointments = await this.appointmentsRepository.findAllMonthAvailableAppointments(
      { provider_id, month, year },
    );
    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const arrayOfDays = Array.from(
      { length: daysInMonth },
      (_, index) => index + 1,
    );

    const availability = arrayOfDays.map(day => {
      const compareDay = new Date(year, month - 1, day, 23, 59, 59);
      const appointmentsInADay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );
      return {
        day,
        available:
          isAfter(compareDay, new Date()) && appointmentsInADay.length < 10,
      };
    });
    return availability;
  }
}

export default ListProvidersMonthAvailabilityService;
