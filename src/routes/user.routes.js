import { Router } from 'express';
import {
  createUser,
  deleteUser,
  findAllUsers,
  findOneUser,
  updateUser,
} from '../controllers/user.controller';

const routes = new Router();

routes.get('/', findAllUsers);
routes.get('/:id', findOneUser);
routes.post('/', createUser);
routes.delete('/:id', deleteUser);
routes.patch('/:id', updateUser);

export default routes;
