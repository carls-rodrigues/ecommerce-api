import { getCustomRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppError';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UsersTokenRepository from '../typeorm/repositories/UsersTokensRepository';
import EtherealMail from '../../../config/mail/EtherealMail';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokenRepository = getCustomRepository(UsersTokenRepository);

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists');
    }
    const { token } = await userTokenRepository.generate(user.id);

    await EtherealMail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      from: {
        name: 'Carlos Rodrigues',
        email: 'cerf@furg.br',
      },
      subject: 'Redefinir Senha',
      templateData: {
        template: `Olá {{name}}: {{token}}`,
        variables: {
          name: user.name,
          token,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
