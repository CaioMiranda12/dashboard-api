import { Router } from 'express';
import {
  createUser,
  deleteUser,
  findAllUsers,
  findOneUser,
  updateUser,
} from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth';

const routes = new Router();

routes.get('/', findAllUsers);
routes.get('/:id', findOneUser);
routes.post('/', createUser);
routes.delete('/:id', deleteUser);
routes.patch('/:id', authMiddleware, updateUser);

export default routes;
