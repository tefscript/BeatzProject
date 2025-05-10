import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
import * as albumController from '../controllers/albumController.js';

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Álbum
 *   description: Rotas relacionadas aos álbuns
 */

/**
 * @swagger
 * /api/albums/{albumId}:
 *   get:
 *     summary: Obter informações do álbum
 *     tags: [Álbum]
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         description: ID do álbum
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informações do álbum
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 cover_url:
 *                   type: string
 *       404:
 *         description: Álbum não encontrado
 */

/**
 * @swagger
 * /api/albums/{albumId}/songs:
 *   get:
 *     summary: Obter músicas do álbum
 *     tags: [Álbum]
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         description: ID do álbum
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de músicas do álbum
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
 *                   artist:
 *                     type: string
 *       404:
 *         description: Álbum não encontrado
 */

/**
 * @swagger
 * /api/albums/{albumId}/songs:
 *   post:
 *     summary: Adicionar música ao álbum
 *     tags: [Álbum]
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         description: ID do álbum
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - musicId
 *             properties:
 *               musicId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Música adicionada com sucesso
 *       400:
 *         description: ID da música não fornecido
 *       404:
 *         description: Álbum não encontrado
 */

/**
 * @swagger
 * /api/albums/{albumId}/songs:
 *   delete:
 *     summary: Remover música do álbum
 *     tags: [Álbum]
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         description: ID do álbum
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - musicId
 *             properties:
 *               musicId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Música removida com sucesso
 *       400:
 *         description: ID da música não fornecido
 *       404:
 *         description: Álbum ou música não encontrados
 */

/**
 * @swagger
 * /api/albums/{albumId}/cover:
 *   patch:
 *     summary: Atualizar capa do álbum
 *     tags: [Álbum]
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         description: ID do álbum
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
 *                 format: uri
 *     responses:
 *       200:
 *         description: Capa do álbum atualizada com sucesso
 *       400:
 *         description: URL da imagem não fornecida
 *       404:
 *         description: Álbum não encontrado
 */

router.use(authenticateToken);

router.get('/:albumId', albumController.getAlbumInfo);
router.get('/:albumId/songs', albumController.getMusicsFromAlbum);
router.post('/:albumId/songs', albumController.addMusicToAlbum);
router.delete('/:albumId/songs', albumController.removeMusicFromAlbum);
router.patch('/:albumId/cover', albumController.setCoverPhoto);

export default router;

