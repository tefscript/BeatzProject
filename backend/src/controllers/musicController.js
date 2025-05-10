import db from '../config/db.js';
import { handleError } from '../utils/handleError.js';

export const getMusicInfo = async (req, res) => {
  const { musicId } = req.params;

  const { data, error } = await db.from('songs').select('*').eq('id', musicId).single();

  if (error) return handleError(res, error);

  return res.json(data);
};

export const getDurationFormatted = async (req, res) => {
  const { musicId } = req.params;

  const { data, error } = await db.from('songs').select('duration').eq('id', musicId).single();

  if (error) return handleError(res, error);

  if (!data) return res.status(404).json({ error: 'Música nao encontrada' });

  const totalSeconds = data.duration;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return res.json({ duration: formatted });
};

export const setUrlAudio = async (req, res) => {
  const { musicId } = req.params;
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'Url do audio é obrigatório.' });

  const { error } = await db.from('songs').update({ url }).eq('id', musicId);

  if (error) return handleError(res, error);

  return res.json({ message: 'Url do audio atualizada com sucesso!' });
};
