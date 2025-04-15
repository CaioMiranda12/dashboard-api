import { Router } from 'express';
import { findAllUsers, findOneUser } from '../controllers/user.controller';

const routes = new Router();

routes.get('/', findAllUsers);
routes.get('/:id', findOneUser);

export default routes;
