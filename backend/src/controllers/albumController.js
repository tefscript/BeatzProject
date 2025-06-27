import db from "../config/db.js";
import { handleError } from "../utils/handleError.js";

export const getAlbumInfo = async (req, res) => {
  const { albumId } = req.params;

  const { data, error } = await db
    .from("albums")
    .select("*, artist:artists(name)")
    .eq("id", albumId)
    .single();

  console.log('DEBUG ALBUM', { albumId, data, error });

  if (error) return handleError(res, error);

  const album = {
    ...data,
    artist_name: data.artist?.name || null
  };

  return res.json(album);
};

export const getMusicsFromAlbum = async (req, res) => {
  const { albumId } = req.params;

  const { data, error } = await db
    .from("songs")
    .select("*, album:albums(cover_url)")
    .eq("album_id", albumId);

  if (error) return handleError(res, error);

  const musics = (data || []).map((song) => ({
    ...song,
    cover_url: song.album?.cover_url || null,
  }));
  return res.json(musics);
};

export const addMusicToAlbum = async (req, res) => {
  const { albumId } = req.params;
  const { musicId } = req.body;

  if (!musicId)
    return res.status(400).json({ error: "Id da musica é obrigatório" });

  const { error } = await db
    .from("songs")
    .update({ album_id: albumId })
    .eq("id", musicId);

  if (error) return handleError(res, error);

  return res.json({ message: "Música adicionada ao album com sucesso!" });
};

export const removeMusicFromAlbum = async (req, res) => {
  const { albumId } = req.params;
  const { musicId } = req.body;

  if (!musicId)
    return res.status(400).json({ error: "Id da musica é obrigatório" });

  const { error } = await db
    .from("songs")
    .update({ album_id: null })
    .eq("id", musicId)
    .eq("album_id", albumId);

  if (error) return handleError(res, error);

  return res.json({ message: "Música removida do album com sucesso!" });
};

export const setCoverPhoto = async (req, res) => {
  const { albumId } = req.params;
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "Imagem é obrigatória." });

  const { error } = await db
    .from("albums")
    .update({ cover_url: url })
    .eq("id", albumId);

  if (error) return handleError(res, error);

  return res.json({ message: "Capa do álbum atualizada com sucesso!" });
};

export const searchAlbums = async (req, res) => {
  const { search } = req.query;
  let query = db.from("albums").select("*, artist:artists(name)");
  if (search) query = query.ilike("title", `%${search}%`);
  const { data, error } = await query;
  if (error) return handleError(res, error);
  res.json(data);
};
