import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
import * as playlistController from '../controllers/playlistController.js';

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Playlist
 *   description: Rotas relacionadas às playlists
 */

/**
 * @swagger
 * /playlists:
 *   post:
 *     summary: Cria uma nova playlist
 *     tags: [Playlist]
 *     responses:
 *       201:
 *         description: Playlist criada com sucesso
 */

/**
 * @swagger
 * /playlists/{playlistId}:
 *   put:
 *     summary: Atualiza uma playlist existente
 *     tags: [Playlist]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: ID da playlist
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Playlist atualizada com sucesso
 */

/**
 * @swagger
 * /playlists/{playlistId}:
 *   delete:
 *     summary: Deleta uma playlist
 *     tags: [Playlist]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: ID da playlist
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Playlist deletada com sucesso
 */

/**
 * @swagger
 * /playlists:
 *   get:
 *     summary: Lista todas as playlists
 *     tags: [Playlist]
 *     responses:
 *       200:
 *         description: Lista de playlists retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 */

/**
 * @swagger
 * /playlists/{playlistId}:
 *   get:
 *     summary: Recupera uma playlist específica
 *     tags: [Playlist]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: ID da playlist
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Playlist encontrada com sucesso
 *       404:
 *         description: Playlist não encontrada
 */

/**
 * @swagger
 * /playlists/{playlistId}/songs:
 *   get:
 *     summary: Recupera todas as músicas de uma playlist
 *     tags: [Playlist]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: ID da playlist
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de músicas da playlist retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /playlists/{playlistId}/songs:
 *   post:
 *     summary: Adiciona uma música à playlist
 *     tags: [Playlist]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: ID da playlist
 *         schema:
 *           type: integer
 *       - name: song
 *         in: body
 *         required: true
 *         description: Dados da música a ser adicionada
 *         schema:
 *           $ref: '#/components/schemas/Song'
 *     responses:
 *       201:
 *         description: Música adicionada à playlist com sucesso
 */

/**
 * @swagger
 * /playlists/{playlistId}/songs:
 *   delete:
 *     summary: Remove uma música da playlist
 *     tags: [Playlist]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: ID da playlist
 *         schema:
 *           type: integer
 *       - name: songId
 *         in: query
 *         required: true
 *         description: ID da música a ser removida
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Música removida da playlist com sucesso
 */

/**
 * @swagger
 * /playlists/{playlistId}/total:
 *   get:
 *     summary: Recupera o total de músicas na playlist
 *     tags: [Playlist]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: ID da playlist
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Total de músicas na playlist retornado com sucesso
 */

/**
 * @swagger
 * /playlists/{playlistId}/duration:
 *   get:
 *     summary: Recupera a duração total da playlist
 *     tags: [Playlist]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: ID da playlist
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Duração total da playlist retornada com sucesso
 */

/**
 * @swagger
 * /playlists/{playlistId}/info:
 *   get:
 *     summary: Recupera as informações detalhadas de uma playlist
 *     tags: [Playlist]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: ID da playlist
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Informações detalhadas da playlist retornadas com sucesso
 */

/**
 * @swagger
 * /playlists/{playlistId}/songs/{songId}:
 *   get:
 *     summary: Recupera uma música específica de uma playlist
 *     tags: [Playlist]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: ID da playlist
 *         schema:
 *           type: integer
 *       - name: songId
 *         in: path
 *         required: true
 *         description: ID da música
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Música encontrada com sucesso
 *       404:
 *         description: Música não encontrada
 */

/**
 * @swagger
 * /playlists/{playlistId}/search:
 *   get:
 *     summary: Busca por música dentro de uma playlist
 *     tags: [Playlist]
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: ID da playlist
 *         schema:
 *           type: integer
 *       - name: title
 *         in: query
 *         required: true
 *         description: Título da música
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Música encontrada na playlist
 *       404:
 *         description: Música não encontrada
 */




router.post('/', playlistController.createPlaylist);
router.put('/:playlistId', playlistController.editPlaylist);
router.delete('/:playlistId', playlistController.deletePlaylist);
router.get('/', playlistController.searchPlaylistByName);
router.get('/:playlistId', playlistController.getPlaylistById);
router.get('/:playlistId/songs', playlistController.getSongsFromPlaylist);
router.post('/:playlistId/songs', playlistController.addMusicToPlaylist);
router.delete('/:playlistId/songs', playlistController.removeMusicFromPlaylist);
router.get('/:playlistId/total', playlistController.getTotalMusics);
router.get('/:playlistId/duration', playlistController.getDuration);
router.get('/:playlistId/info', playlistController.getPlaylistInfo);
router.get('/:playlistId/songs/:songId', playlistController.findMusicById);
router.get('/:playlistId/search', playlistController.findMusicByTitle);

export default router;
