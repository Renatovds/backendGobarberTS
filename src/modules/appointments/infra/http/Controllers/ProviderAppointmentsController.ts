import { Response, Request } from 'express';
import { container } from 'tsyringe';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { month, year, day } = request.query;
    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );
    const appointments = await listProviderAppointments.execute({
      day: Number(day),
      month: Number(month),
      provider_id,
      year: Number(year),
    });
    return response.json(appointments);
  }
}

export default ProviderAppointmentsController;
