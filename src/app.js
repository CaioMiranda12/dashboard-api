import express from 'express';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import categoryRoutes from './routes/category.routes';
import summaryRoutes from './routes/summary.routes';
import { swaggerSpec } from './configs/swagger';

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use('/users', userRoutes);
    this.app.use('/auth', authRoutes);
    this.app.use('/transactions', transactionRoutes);
    this.app.use('/category', categoryRoutes);
    this.app.use('/summary', summaryRoutes);

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
}

export default new App().app;
