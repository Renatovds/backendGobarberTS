import { Router } from 'express';
import appointmentRouter from './appointments.routes';
import userRouter from './users.routes';
import sessionRouter from './sessions.routes';

const router = Router();

router.use('/appointments', appointmentRouter);
router.use('/users', userRouter);
router.use('/sessions', sessionRouter);

export default router;
