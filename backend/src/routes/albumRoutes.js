import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
import * as albumController from '../controllers/albumController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/:albumId', albumController.getAlbumInfo);
router.get('/:albumId/songs', albumController.getMusicsFromAlbum);
router.post('/:albumId/songs', albumController.addMusicToAlbum);
router.delete('/:albumId/songs', albumController.removeMusicFromAlbum);
router.patch('/:albumId/cover', albumController.setCoverPhoto);

export default router;