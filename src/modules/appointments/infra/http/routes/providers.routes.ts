import { Router } from 'express';
import AuthenticationMiddleware from '@modules/users/infra/http/middleware/AuthenticationMiddleware';

import { celebrate, Joi, Segments } from 'celebrate';
import ProvidersController from '../Controllers/ProvidersController';
import ProviderDayAvailabilityController from '../Controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../Controllers/ProviderMonthAvailabilityController';

const providerRouter = Router();
const providersController = new ProvidersController();
const providerMonthController = new ProviderMonthAvailabilityController();
const providerDayController = new ProviderDayAvailabilityController();
providerRouter.use(AuthenticationMiddleware);

providerRouter.get('/', providersController.index);
providerRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().required().uuid(),
    },
  }),
  providerMonthController.index,
);
providerRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().required().uuid(),
    },
  }),

  providerDayController.index,
);

export default providerRouter;
