import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AuthenticationMiddleware from '@modules/users/infra/http/middleware/AuthenticationMiddleware';

const appointmentRouter = Router();
appointmentRouter.use(AuthenticationMiddleware);
const appointmentsRepository = new AppointmentsRepository();

/* appointmentRouter.get('/', async (request, response) => {
  const appointments = await appointmentsRepository.find();
  return response.json(appointments);
});
 */
appointmentRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;
  const parsedDate = parseISO(date);
  const createAppointment = new CreateAppointmentService(
    appointmentsRepository,
  );
  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  });

  return response.json(appointment);
});

export default appointmentRouter;
