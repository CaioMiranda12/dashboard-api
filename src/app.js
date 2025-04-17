import express from 'express';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

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
  }
}

export default new App().app;
