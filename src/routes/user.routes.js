import { Router } from 'express';
import { findAllUsers } from '../controllers/user.controller';

const routes = new Router();

routes.get('/', findAllUsers);

export default routes;
