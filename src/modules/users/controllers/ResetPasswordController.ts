import { Request, Response } from 'express';
import ResetPassowrdService from '../services/ResetPassowrdService';

export default class ResetPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { password, token } = req.body;

    const resetPassowrdService = new ResetPassowrdService();

    await resetPassowrdService.execute({ password, token });

    return res.status(204).json();
  }
}
