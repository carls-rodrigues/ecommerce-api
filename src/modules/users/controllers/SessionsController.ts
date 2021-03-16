import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import CreateSessionsSerices from '../services/CreateSessionsService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const createSession = new CreateSessionsSerices();

    const user = await createSession.execute({ email, password });

    return res.json(classToClass(user));
  }
}
