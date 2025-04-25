import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";
import { createPlaylist, 
        editPlaylist, 
        deletePlaylist, 
        searchPlaylistByName, 
        getSongsFromPlaylist, 
        addMusicToPlaylist, 
        removeMusicFromPlaylist,  
        getTotalMusics, 
        getDuration, 
        getPlaylistInfo, 
        findMusicById, 
        findMusicByTitle, 
        getPlaylistById} from "../controllers/playlistController.js";

const router = express.Router();

router.post("/", authenticateToken, createPlaylist);
router.put("/:playlistId", editPlaylist);
router.delete("/:playlistId", deletePlaylist);
router.get("/", searchPlaylistByName);
router.get("/:playlistId", getPlaylistById);
router.get("/:playlistId/songs", getSongsFromPlaylist);
router.post("/:playlistId/songs", addMusicToPlaylist);
router.delete("/:playlistId/songs", removeMusicFromPlaylist);
router.get('/:playlistId/total', getTotalMusics);
router.get('/:playlistId/duration', getDuration);
router.get('/:playlistId/info', getPlaylistInfo);
router.get('/:playlistId/songs/:songId', findMusicById);
router.get('/:playlistId/search', findMusicByTitle);

export default router;