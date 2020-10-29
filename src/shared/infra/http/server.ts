import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';

import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import rateLimiter from '@shared/infra/http/middlewares/RateLimiter';
import routes from './routes';
import '@shared/infra/typeorm';
import '@shared/Container/index';

const server = express();

server.use(cors());

server.use(express.json());

server.use(errors());
server.use('/files', express.static(uploadConfig.uploadsFolder));
server.use(rateLimiter);
server.use(routes);
server.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      response.status(err.statusCode).json(err.message);
    }

    console.log(err);
    response.status(500).json('Internal Server Error');
  },
);

server.listen(3333, () => console.log('🚀  Servidor iniciado na porta 3333! '));
