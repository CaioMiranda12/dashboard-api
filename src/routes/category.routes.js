import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getAllUserCategories,
  updateCategory,
} from '../controllers/category.controller';
import authMiddleware from '../middlewares/auth';

const routes = new Router();

routes.use(authMiddleware);
routes.get('/', getAllUserCategories);
routes.post('/', createCategory);
routes.delete('/:id', deleteCategory);
routes.patch('/:id', updateCategory);

export default routes;
