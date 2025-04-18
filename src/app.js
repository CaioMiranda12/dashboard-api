import express from 'express';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import categoryRoutes from './routes/category.routes';

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
  }
}

export default new App().app;
