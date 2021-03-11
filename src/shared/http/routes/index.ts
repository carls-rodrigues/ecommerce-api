import { Request, Response, Router } from 'express';
import productsRouter from '../../../modules/products/routes/products.routes';

const routes = Router();

routes.use('/products', productsRouter);

routes.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Hello Dev',
  });
});

export default routes;
