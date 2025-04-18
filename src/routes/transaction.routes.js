import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getUserTransactions,
  updateTransaction,
} from '../controllers/transaction.controller';
import authMiddleware from '../middlewares/auth';

const routes = new Router();

routes.use(authMiddleware);
routes.get('/', getUserTransactions);
routes.post('/', createTransaction);
routes.delete('/:id', deleteTransaction);
routes.patch('/:id', updateTransaction);

export default routes;
