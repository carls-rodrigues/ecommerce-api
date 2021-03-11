import { compare, hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppError';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
  email: string;
  password: string;
}

// interface IResponse {
//   user: User;
// }

class CreateSessionsSerives {
  public async execute({ email, password }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password.', 401);
    }
    const passwordCompare = await compare(password, user.password);

    if (!passwordCompare) {
      throw new AppError('Incorrect email/password.', 401);
    }

    return user;
  }
}

export default CreateSessionsSerives;
