import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/follow', userController.followArtist);
router.delete('/unfollow', userController.unfollowArtist);
router.get('/playlists', userController.getPlaylists);
router.get('/following', userController.getFollowing);
router.get('/info', userController.getInfo);
router.get('/profilePhoto', userController.getProfilePhoto);
router.put('/profilePhoto', userController.setProfilePhoto);
router.patch('/change-password', userController.changePassword);

export default router;