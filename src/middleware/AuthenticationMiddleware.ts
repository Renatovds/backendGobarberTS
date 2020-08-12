import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

function AuthenticationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
  }
  const authToken = request.headers.authorization;
  if (!authToken) {
    throw new AppError('Token JWT is missing', 401);
  }
  const [, token] = authToken.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    console.log(decoded);

    const { sub } = decoded as TokenPayload;
    request.user = { id: sub };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
export default AuthenticationMiddleware;
