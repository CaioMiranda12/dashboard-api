import { Router } from 'express';
import { getAllTransactions } from '../controllers/transaction.controller';

const routes = new Router();

routes.get('/', getAllTransactions);

export default routes;
