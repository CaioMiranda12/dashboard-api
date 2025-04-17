import { Router } from 'express';
import { loginUser } from '../controllers/auth.controller';

const routes = new Router();

routes.post('/', loginUser);

export default routes;
