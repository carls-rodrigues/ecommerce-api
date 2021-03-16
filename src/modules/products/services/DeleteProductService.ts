import { getCustomRepository } from 'typeorm';
import RedisCache from '../../../shared/cache/RedisCache';
import AppError from '../../../shared/errors/AppError';
import ProductsRepository from '../typeorm/repositories/ProductsRepository';

interface IRequest {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductsRepository);

    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found');
    }
    const redisCache = new RedisCache();

    await productsRepository.remove(product);

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');
  }
}

export default DeleteProductService;
