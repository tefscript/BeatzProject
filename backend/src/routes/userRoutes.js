import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Rotas relacionadas aos usuários
 */

/**
 * @swagger
 * /user/follow:
 *   post:
 *     summary: Segue um artista
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artistId:
 *                 type: integer
 *                 description: ID do artista a ser seguido
 *                 example: 1
 *     responses:
 *       201:
 *         description: Artista seguido com sucesso
 *       400:
 *         description: ID do artista é obrigatório
 */

/**
 * @swagger
 * /user/unfollow/{artistId}:
 *   delete:
 *     summary: Deixa de seguir um artista
 *     tags: [User]
 *     parameters:
 *       - name: artistId
 *         in: path
 *         required: true
 *         description: ID do artista a ser removido da lista de seguidos
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Artista removido com sucesso
 *       404:
 *         description: Artista não encontrado
 */

/**
 * @swagger
 * /user/playlists:
 *   get:
 *     summary: Recupera as playlists do usuário
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Playlists do usuário recuperadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 */

/**
 * @swagger
 * /user/following:
 *   get:
 *     summary: Recupera os artistas seguidos pelo usuário
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Artistas seguidos retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: integer
 *                 description: ID do artista
 *                 example: 1
 */

/**
 * @swagger
 * /user/info:
 *   get:
 *     summary: Recupera as informações do usuário
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Informações do usuário recuperadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nome do usuário
 *                   example: "João Silva"
 *                 email:
 *                   type: string
 *                   description: Email do usuário
 *                   example: "joao.silva@email.com"
 */

/**
 * @swagger
 * /user/profilePhoto:
 *   get:
 *     summary: Recupera a foto de perfil do usuário
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Foto de perfil do usuário recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile_photo:
 *                   type: string
 *                   description: URL da foto de perfil
 *                   example: "https://example.com/profile.jpg"
 */

/**
 * @swagger
 * /user/profilePhoto:
 *   put:
 *     summary: Atualiza a foto de perfil do usuário
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL da nova foto de perfil
 *                 example: "https://example.com/new-profile.jpg"
 *     responses:
 *       200:
 *         description: Foto de perfil atualizada com sucesso
 *       400:
 *         description: URL da foto é obrigatória
 */

/**
 * @swagger
 * /user/change-password:
 *   patch:
 *     summary: Atualiza a senha do usuário
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: Nova senha do usuário
 *                 example: "novaSenha123"
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Nova senha é obrigatória
 */


router.post('/follow', userController.followArtist);
router.delete('/unfollow', userController.unfollowArtist);
router.get('/playlists', userController.getPlaylists);
router.get('/following', userController.getFollowing);
router.get('/info', userController.getInfo);
router.get('/profilePhoto', userController.getProfilePhoto);
router.put('/profilePhoto', userController.setProfilePhoto);
router.patch('/change-password', userController.changePassword);

export default router;
