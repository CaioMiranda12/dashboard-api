import { Router } from 'express';
import {
  createUser,
  deleteUser,
  findAllUsers,
  findOneUser,
  updateUser,
} from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth';

const routes = new Router();

routes.get('/', findAllUsers);
routes.get('/:id', findOneUser);
routes.post('/', createUser);
routes.delete('/:id', authMiddleware, deleteUser);
routes.patch('/:id', authMiddleware, updateUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário por ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: teste
 *               email:
 *                 type: string
 *                 format: email
 *                 example: teste@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: 123123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou e-mail já cadastrado
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário por ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário não encontrado
 */

export default routes;
