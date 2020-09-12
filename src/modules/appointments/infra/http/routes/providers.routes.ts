import { Router } from 'express';
import AuthenticationMiddleware from '@modules/users/infra/http/middleware/AuthenticationMiddleware';

import ProvidersController from '../Controllers/ProvidersController';

const providerRouter = Router();
const providersController = new ProvidersController();
providerRouter.use(AuthenticationMiddleware);

providerRouter.get('/', providersController.index);

export default providerRouter;
