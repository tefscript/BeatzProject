import db from "../config/db.js";
import { handleError } from "../utils/handleError.js";
import { body, validationResult } from 'express-validator';

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

export const createAlbum = async (req, res) => {
  await body('title').notEmpty().withMessage('Título é obrigatório').run(req);
  await body('artist_id').optional().isInt().withMessage('ID do artista deve ser um número').run(req);
  await body('release_date').optional().isDate().withMessage('Data de lançamento inválida').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { title, artist_id, release_date, cover_url } = req.body;

  const { data: newAlbum, error } = await db
    .from('albums')
    .insert([{ title, artist_id, release_date, cover_url }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating album'
    });
  }

  res.status(201).json({
    success: true,
    message: 'Album created successfully',
    data: newAlbum
  });
};

export const updateAlbum = async (req, res) => {
  const { id } = req.params;

  await body('title').optional().isString().withMessage('Título deve ser uma string').run(req);
  await body('artist_id').optional().isInt().withMessage('ID do artista deve ser um número').run(req);
  await body('release_date').optional().isDate().withMessage('Data de lançamento inválida').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { title, artist_id, release_date, cover_url } = req.body;
  const updateData = {};

  if (title) updateData.title = title;
  if (artist_id) updateData.artist_id = artist_id;
  if (release_date) updateData.release_date = release_date;
  if (cover_url) updateData.cover_url = cover_url;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No data to update'
    });
  }

  const { data: updatedAlbum, error } = await db
    .from('albums')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating album'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Album updated successfully',
    data: updatedAlbum
  });
};

export const deleteAlbum = async (req, res) => {
  const { id } = req.params;

  const { error } = await db
    .from('albums')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting album'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Album deleted successfully'
  });
};

export const getAllAlbums = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const offset = (page - 1) * limit;

  let query = db.from('albums').select('*, artist:artists(name)');

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  query = query.range(offset, offset + limit - 1);

  const { data: albums, error } = await query;

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching albums'
    });
  }

  res.status(200).json({
    success: true,
    data: albums
  });
};
