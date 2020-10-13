import { Request, Response } from 'express';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import { container } from 'tsyringe';

class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { password, password_confirmation, token } = request.body;

    const resetPasswordService = container.resolve(ResetPasswordService);
    await resetPasswordService.execute({
      password,
      password_confirmation,
      token,
    });
    return response.status(204).json();
  }
}

export default ResetPasswordController;
