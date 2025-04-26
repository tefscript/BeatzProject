import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
import * as musicController from '../controllers/musicController.js';

const router = express.Router();

router.use (authenticateToken);

router.get('/:musicId', musicController.getMusicInfo);
router.patch('/:musicId/audio-url', musicController.setUrlAudio);
router.get('/:musicId/duration', musicController.getDurationFormatted);

export default router;