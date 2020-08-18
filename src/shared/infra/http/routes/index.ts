import { Router } from 'express';
import appointmentRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import userRouter from '@modules/users/infra/http/routes/users.routes';
import sessionRouter from '@modules/users/infra/http/routes/sessions.routes';

const router = Router();

router.use('/appointments', appointmentRouter);
router.use('/users', userRouter);
router.use('/sessions', sessionRouter);

export default router;
