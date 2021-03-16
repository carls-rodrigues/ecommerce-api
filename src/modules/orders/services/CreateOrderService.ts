import { getCustomRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppError';
import CustomersRepository from '../../customers/typeorm/repositories/CustomersRepository';
import ProductRepository from '../../products/typeorm/repositories/ProductsRepository';
import Order from '../typeorm/entities/Order';
import OrderRepository from '../typeorm/repositories/OrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrderRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepositoy = getCustomRepository(ProductRepository);

    const customerExists = await customersRepository.findById(customer_id);
    if (!customerExists) {
      throw new AppError('Could not find any customer');
    }

    const existsProducts = await productsRepositoy.findAllById(products);
    if (!existsProducts.length) {
      throw new AppError('Could not find any product with those ids');
    }

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );
    if (checkInexistentProducts.length) {
      throw new AppError(
        `'Could not find any product ${checkInexistentProducts[0].id}`,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `'Could not find any product ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await ordersRepository.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    const { orders_products } = order;

    const updatedProductQuantity = orders_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));
    await productsRepositoy.save(updatedProductQuantity);
    return order;
  }
}

export default CreateOrderService;
