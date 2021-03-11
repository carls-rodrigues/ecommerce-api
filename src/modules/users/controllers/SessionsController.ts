import { Request, Response } from 'express';
import CreateSessionsSerives from '../services/CreateSessionsService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const createSession = new CreateSessionsSerives();

    const user = await createSession.execute({ email, password });

    return res.json(user);
  }
}
