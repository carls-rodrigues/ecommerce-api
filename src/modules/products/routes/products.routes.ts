import { Router } from 'express';
import ProductsController from '../controllers/ProductsController';

const productsRouter = Router();

const prouctsController = new ProductsController();

productsRouter.get('/', prouctsController.index);
productsRouter.get('/:id', prouctsController.show);
productsRouter.post('/', prouctsController.create);
productsRouter.put('/:id', prouctsController.update);
productsRouter.delete('/:id', prouctsController.delete);

export default productsRouter;
