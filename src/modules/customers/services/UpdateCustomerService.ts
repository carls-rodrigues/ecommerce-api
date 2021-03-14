import { compare, hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppError';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
  name: string;
  email: string;
}

class UpdateCustomerService {
  public async execute({ id, name, email }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const costumer = await customersRepository.findById(id);

    if (!costumer) {
      throw new AppError('costumer not found');
    }
    const costumerUpdateEmail = await customersRepository.findByEmail(email);

    if (costumerUpdateEmail && costumerUpdateEmail.id !== id) {
      throw new AppError('This is already taken');
    }
    costumer.name = name;
    costumer.email = email;

    await customersRepository.save(costumer);

    return costumer;
  }
}

export default UpdateCustomerService;
