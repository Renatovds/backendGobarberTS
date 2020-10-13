import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ForgotPasswordEmailController from '../Controllers/ForgotPasswordEmailController';
import ResetPasswordController from '../Controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPasswordEmailController = new ForgotPasswordEmailController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  celebrate({ [Segments.BODY]: { email: Joi.string().email().required() } }),
  forgotPasswordEmailController.create,
);
passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetPasswordController.create,
);

export default passwordRouter;
