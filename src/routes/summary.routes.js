import { Router } from 'express';
import { getMonthlySummary } from '../controllers/summary.controller';
import authMiddleware from '../middlewares/auth';

const routes = new Router();

routes.use(authMiddleware);
routes.get('/', getMonthlySummary);

export default routes;
