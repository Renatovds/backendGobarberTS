import { Response, Request } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year, day } = request.body;
    const listProviderDayAvailabilityService = container.resolve(
      ListProviderDayAvailabilityService,
    );
    const availabilityHours = await listProviderDayAvailabilityService.execute({
      day,
      month,
      provider_id,
      year,
    });
    return response.json(availabilityHours);
  }
}

export default ProviderDayAvailabilityController;
