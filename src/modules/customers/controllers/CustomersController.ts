import { Request, Response } from 'express';
import CreateCustomerService from '../services/CreateCustomerService';
import DeleteCustomerService from '../services/DeleteCostumerService';
import ListCustomerService from '../services/ListCustomerService';
import ShowCustomerService from '../services/ShowCustumerService';
import UpdateCustomerService from '../services/UpdateCustomerService';

export default class CustomersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const listCustomers = new ListCustomerService();

    const products = await listCustomers.execute();

    return res.status(200).json(products);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const showCustomer = new ShowCustomerService();

    const product = await showCustomer.execute({ id });

    return res.status(200).json(product);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email } = req.body;

    const createCustomer = new CreateCustomerService();

    const customer = await createCustomer.execute({ name, email });

    return res.status(201).json(customer);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email } = req.body;
    const { id } = req.params;

    const updateCostumer = new UpdateCustomerService();
    const customer = await updateCostumer.execute({
      id,
      name,
      email,
    });

    return res.status(200).json(customer);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deletecustomer = new DeleteCustomerService();

    await deletecustomer.execute({ id });

    return res.status(200).json({});
  }
}
