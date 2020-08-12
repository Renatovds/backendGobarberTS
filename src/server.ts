import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import router from './routes';
import './database';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

const server = express();
server.use(cors());
server.use(express.json());

server.use(router);
server.use('/files', express.static(uploadConfig.fileDirectory));
router.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      response.status(err.statusCode).json(err.message);
    }

    console.log(err);
    response.status(500).json('Internal Server Error');
  },
);

server.listen(3333, () => console.log('🚀  Servidor iniciado na porta 3333! '));