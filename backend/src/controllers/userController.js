import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { handleError } from '../utils/handleError.js';

export const followArtist = async (req, res) => {
  const { artistId } = req.body;
  const userId = req.user.id;

  if (!artistId) return res.status(400).json({ error: 'Id do artista é obrigatório.' });

  const { error } = await db.from('followers').insert({ user_id: userId, artist_id: artistId });

  if (error) return handleError(res, error);
};

export const unfollowArtist = async (req, res) => {
  const { artistId } = req.params;
  const userId = req.user.id;

  const { error } = await db.from('followers').delete().eq('user_id', userId).eq('artist_id', artistId);

  if (error) return handleError(res, error);

  return res.json({ message: 'Artista removido com sucesso!' });
};

export const getPlaylists = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await db.from('playlists').select('*').eq('user_id', userId).order('created_at', { ascending: false });

  if (error) return handleError(res, error);

  return res.json(data);
};

export const getFollowing = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await db.from('followers').select('artist_id').eq('user_id', userId);

  if (error) return handleError(res, error);

  return res.json(data);
};

export const getInfo = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await db.from('users').select('*').eq('id', userId).single();

  if (error) return handleError(res, error);

  return res.json(data);
};

export const setProfilePhoto = async (req, res) => {
  const { url } = req.body;
  const userId = req.user.id;

  if (!url) return res.status(400).json({ error: 'Url da imagem é obrigatório.' });

  const { error } = await db.from('users').update({ profile_photo: url }).eq('id', userId);

  if (error) return handleError(res, error);

  return res.json({ message: 'Foto de perfil atualizada com sucesso!' });
};

export const getProfilePhoto = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await db.from('users').select('profile_photo').eq('id', userId).single();

  if (error) return handleError(res, error);

  return res.json(data);
};

export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { newPassword } = req.body;

  if (!newPassword) return res.status(400).json({ error: 'Digite uma nova senha.' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const { error } = await db.from('users').update({ password_hash: hashedPassword }).eq('id', userId);

  if (error) return handleError(res, error);

  return res.json({ message: 'Senha atualizada com sucesso!' });
};
