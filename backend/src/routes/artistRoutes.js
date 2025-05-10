import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
import * as artistController from '../controllers/artistController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Artista
 *   description: Rotas relacionadas aos artistas
 */

/**
 * @swagger
 * /api/artists/{artistId}:
 *   get:
 *     summary: Obter informações do artista
 *     tags: [Artista]
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         description: ID do artista
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informações do artista
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 genre:
 *                   type: string
 *       404:
 *         description: Artista não encontrado
 */

/**
 * @swagger
 * /api/artists/{artistId}:
 *   patch:
 *     summary: Atualizar nome do artista
 *     tags: [Artista]
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         description: ID do artista
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newName
 *             properties:
 *               newName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nome do artista atualizado com sucesso
 *       400:
 *         description: Novo nome não fornecido
 *       404:
 *         description: Artista não encontrado
 */

/**
 * @swagger
 * /api/artists/{artistId}/followers:
 *   get:
 *     summary: Obter número de seguidores do artista
 *     tags: [Artista]
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         description: ID do artista
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Número de seguidores do artista
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followers:
 *                   type: integer
 *       404:
 *         description: Artista não encontrado
 */

/**
 * @swagger
 * /api/artists/{artistId}/songs:
 *   get:
 *     summary: Obter músicas do artista
 *     tags: [Artista]
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         description: ID do artista
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de músicas do artista
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   album:
 *                     type: string
 *       404:
 *         description: Artista não encontrado
 */

router.use(authenticateToken);

router.get('/:artistId', artistController.getArtistInfo);
router.patch('/:artistId', artistController.updateArtistName);
router.get('/:artistId/followers', artistController.getFollowers);
router.get('/:artistId/songs', artistController.getMusics);

export default router;

