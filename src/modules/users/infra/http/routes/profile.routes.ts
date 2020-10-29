import { Router } from 'express';
import AuthenticationMiddleware from '@modules/users/infra/http/middleware/AuthenticationMiddleware';
import { celebrate, Joi, Segments } from 'celebrate';
import ProfileController from '../Controllers/ProfileController';

const profilesRouter = Router();
const profilesController = new ProfileController();
profilesRouter.use(AuthenticationMiddleware);
profilesRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.when('old_password', {
        is: Joi.exist(),
        then: Joi.string().required(),
      }),
      password_confirmation: Joi.when('password', {
        is: Joi.exist(),
        then: Joi.string().required().valid(Joi.ref('password')),
      }),
    },
  }),
  profilesController.update,
);
profilesRouter.get('/', profilesController.show);

export default profilesRouter;
