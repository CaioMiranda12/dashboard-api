import { Router } from 'express';
import {
  createUser,
  findAllUsers,
  findOneUser,
} from '../controllers/user.controller';

const routes = new Router();

routes.get('/', findAllUsers);
routes.get('/:id', findOneUser);
routes.post('/', createUser);

export default routes;
