import { Router } from 'express';
import {
  getMonthlySummary,
  getYearSummary,
} from '../controllers/summary.controller';
import authMiddleware from '../middlewares/auth';

const routes = new Router();

routes.use(authMiddleware);
routes.get('/', getMonthlySummary);
routes.get('/year', getYearSummary);

export default routes;
