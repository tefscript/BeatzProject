import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
import * as musicController from '../controllers/musicController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Música
 *   description: Rotas relacionadas às músicas
 */

/**
 * @swagger
 * /api/musics/{musicId}:
 *   get:
 *     summary: Obter informações da música
 *     tags: [Música]
 *     parameters:
 *       - in: path
 *         name: musicId
 *         required: true
 *         description: ID da música
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informações da música
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 artist_id:
 *                   type: string
 *                 album_id:
 *                   type: string
 *                 duration:
 *                   type: integer
 *       404:
 *         description: Música não encontrada
 */

/**
 * @swagger
 * /api/musics/{musicId}/duration:
 *   get:
 *     summary: Obter duração da música formatada
 *     tags: [Música]
 *     parameters:
 *       - in: path
 *         name: musicId
 *         required: true
 *         description: ID da música
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Duração da música formatada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 duration:
 *                   type: string
 *       404:
 *         description: Música não encontrada
 */

/**
 * @swagger
 * /api/musics/{musicId}/audio-url:
 *   patch:
 *     summary: Atualizar URL do áudio da música
 *     tags: [Música]
 *     parameters:
 *       - in: path
 *         name: musicId
 *         required: true
 *         description: ID da música
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: URL do áudio atualizada com sucesso
 *       400:
 *         description: URL não fornecida
 *       404:
 *         description: Música não encontrada
 */

router.use(authenticateToken);

router.get('/:musicId', musicController.getMusicInfo);
router.patch('/:musicId/audio-url', musicController.setUrlAudio);
router.get('/:musicId/duration', musicController.getDurationFormatted);

export default router;

