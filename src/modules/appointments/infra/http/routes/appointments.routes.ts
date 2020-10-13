import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import AuthenticationMiddleware from '@modules/users/infra/http/middleware/AuthenticationMiddleware';
import AppointmentController from '@modules/appointments/infra/http/Controllers/AppointmentController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/Controllers/ProviderAppointmentsController';

const appointmentRouter = Router();
appointmentRouter.use(AuthenticationMiddleware);
const appointmentController = new AppointmentController();
const providerAppointmentController = new ProviderAppointmentsController();

appointmentRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().required().uuid(),
      date: Joi.date().required(),
    },
  }),
  appointmentController.create,
);
appointmentRouter.get('/me', providerAppointmentController.index);
export default appointmentRouter;
