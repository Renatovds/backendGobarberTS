import { Response, Request } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.body;
    const listProviderMonthAvailabilityService = container.resolve(
      ListProviderMonthAvailabilityService,
    );
    const availabilityDays = await listProviderMonthAvailabilityService.execute(
      {
        provider_id,
        month,
        year,
      },
    );
    return response.json(availabilityDays);
  }
}

export default ProviderMonthAvailabilityController;
