import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";
import * as playlistController from "../controllers/playlistController.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", playlistController.createPlaylist);
router.put("/:playlistId", playlistController.editPlaylist);
router.delete("/:playlistId", playlistController.deletePlaylist);
router.get("/", playlistController.searchPlaylistByName);
router.get("/:playlistId", playlistController.getPlaylistById);
router.get("/:playlistId/songs", playlistController.getSongsFromPlaylist);
router.post("/:playlistId/songs", playlistController.addMusicToPlaylist);
router.delete("/:playlistId/songs", playlistController.removeMusicFromPlaylist);
router.get('/:playlistId/total', playlistController.getTotalMusics);
router.get('/:playlistId/duration', playlistController.getDuration);
router.get('/:playlistId/info', playlistController.getPlaylistInfo);
router.get('/:playlistId/songs/:songId', playlistController.findMusicById);
router.get('/:playlistId/search', playlistController.findMusicByTitle);

export default router;