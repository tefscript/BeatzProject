import db from '../config/db.js';
import { handleError } from '../utils/handleError.js';

export const getArtistInfo = async (req, res) => {
  const { artistId } = req.params;

  const { data, error } = await db.from('artists').select('*').eq('id', artistId).single();

  if (error) return handleError(res, error);

  return res.json(data);
};

export const updateArtistName = async (req, res) => {
  const { artistId } = req.params;
  const { newName } = req.body;

  if (!newName) return res.status(400).json({ error: 'Novo nome é obrigatório.' });

  const { error } = await db.from('artists').update({ name: newName }).eq('id', artistId);

  if (error) return handleError(res, error);

  return res.json({ message: 'Nome do artista atualizado com sucesso!' });
};

export const getFollowers = async (req, res) => {
  const { artistId } = req.params;

  const { count, error } = await db.from('followers').select('*', { count: 'exact', head: true }).eq('artist_id', artistId);

  if (error) return handleError(res, error);

  return res.json({ followers: count });
};

export const getMusics = async (req, res) => {
  const { artistId } = req.params;

  const { data, error } = await db.from('songs').select('*').eq('artist_id', artistId);

  if (error) return handleError(res, error);

  return res.json(data);
};
