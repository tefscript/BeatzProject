import express from 'express';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Rotas de login e registro
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login do usuário
 *      tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - email
 *              - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *            password:
 *               type: string
 *    responses:
 *      200:
 *        description: Login bem-sucedido
 *        content:          
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *    401:
 *      description: Erro ao fazer login
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Autenticação]
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
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */

router.post('/login', login);
router.post('/register', register);

export default router;
