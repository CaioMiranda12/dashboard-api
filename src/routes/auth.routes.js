import { Router } from 'express';
import { loginUser } from '../controllers/auth.controller';

const routes = new Router();

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Realiza login com e-mail e senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */

routes.post('/', loginUser);

export default routes;
