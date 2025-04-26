import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
import * as artistController from '../controllers/artistController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/:artistId', artistController.getArtistInfo);
router.patch('/:artistId', artistController.updateArtistName);
router.get('/:artistId/followers', artistController.getFollowers);
router.get('/:artistId/songs', artistController.getMusics);

export default router;