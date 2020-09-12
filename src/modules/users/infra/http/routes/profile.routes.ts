import { Router } from 'express';
import AuthenticationMiddleware from '@modules/users/infra/http/middleware/AuthenticationMiddleware';
import ProfileController from '../Controllers/ProfileController';

const profilesRouter = Router();
const profilesController = new ProfileController();
profilesRouter.use(AuthenticationMiddleware);
profilesRouter.post('/', profilesController.update);
profilesRouter.get('/', profilesController.show);

export default profilesRouter;
