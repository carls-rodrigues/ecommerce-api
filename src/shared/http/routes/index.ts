import { Router } from 'express';
import productsRouter from '../../../modules/products/routes/products.routes';
import passwordRouter from '../../../modules/users/routes/password.routes';
import profileRouter from '../../../modules/users/routes/profile.routes';
import sessionRoutes from '../../../modules/users/routes/sessions.routes';
import usersRouter from '../../../modules/users/routes/users.routes';

const routes = Router();

routes.use('/products', productsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionRoutes);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

export default routes;
