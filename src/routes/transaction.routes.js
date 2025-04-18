import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getOneTransaction,
  getUserTransactions,
  updateTransaction,
} from '../controllers/transaction.controller';
import authMiddleware from '../middlewares/auth';

const routes = new Router();

routes.use(authMiddleware);
routes.get('/', getUserTransactions);
routes.get('/:id', getOneTransaction);
routes.post('/', createTransaction);
routes.delete('/:id', deleteTransaction);
routes.patch('/:id', updateTransaction);

export default routes;
