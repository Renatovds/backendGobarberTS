import { Router } from 'express';

import AuthenticationMiddleware from '@modules/users/infra/http/middleware/AuthenticationMiddleware';
import AppointmentController from '@modules/appointments/infra/http/Controllers/AppointmentController';

const appointmentRouter = Router();
appointmentRouter.use(AuthenticationMiddleware);
const appointmentController = new AppointmentController();

/* appointmentRouter.get('/', async (request, response) => {
  const appointments = await appointmentsRepository.find();
  return response.json(appointments);
});
 */
appointmentRouter.post('/', appointmentController.create);
export default appointmentRouter;
