import { Response, Request } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year, day } = request.query;
    const listProviderDayAvailabilityService = container.resolve(
      ListProviderDayAvailabilityService,
    );
    const availabilityHours = await listProviderDayAvailabilityService.execute({
      day: Number(day),
      month: Number(month),
      provider_id,
      year: Number(year),
    });
    return response.json(availabilityHours);
  }
}

export default ProviderDayAvailabilityController;
