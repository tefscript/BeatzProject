import db from '../config/db.js';
import { handleError } from '../utils/handleError.js';

export const createPlaylist = async (req, res) => {
  const {name, cover_url} = req.body; 
  const userId = req.user?.id;

  if(!userId) return res.status(401).json({error: 'Usuário não autenticado'});
  if(!name) return res.status(400).json({error: 'Nome é obrigatório'});

  const {data, error} = await db.from('playlists').insert([{name, cover_url, user_id: userId}]).select().maybeSingle();

  if (error) return handleError(res, error);

  res.status(201).json({ playlist: data });
};

export const editPlaylist = async (req, res) => {
  const {playlistId} = req.params;
  const {name, cover_url} = req.body;
  const userId = req.user?.id;

  if(!userId) return res.status(401).json({error: 'Usuário não autenticado'});
  if(!name) return res.status(400).json({error: 'Nome é obrigatório'});

  const {data, error} = await db.from('playlists').update({name, cover_url}).eq('id', playlistId).select().maybeSingle();

  if (error) return handleError(res, error);
  if(!data) return res.status(404).json({error: 'Playlist nao encontrada'});

  res.status(200).json({playlist: data});
};

export const deletePlaylist = async (req, res) => {
  const {playlistId} = req.params;
  const userId = req.user?.id;

  if(!userId) return res.status(401).json({error: 'Usuário não autenticado'});

  const {data, error} = await db.from('playlists').delete().match({id: playlistId, user_id: userId}).select().maybeSingle();

  if (error) return handleError(res, error);
  if(!data) return res.status(404).json({error: 'Playlist nao encontrada'});

  res.status(200).json({playlist: data});
};

export const getPlaylistById = async (req, res) => {
  const {playlistId} = req.params;
  const userId = req.user?.id;

  if(!userId) return res.status(401).json({error: 'Usuário não autenticado'});

  const {data, error} = await db.from('playlists').select().match({id: playlistId, user_id: userId}).maybeSingle();

  if (error) return handleError(res, error);
  if(!data) return res.status(404).json({error: 'Playlist nao encontrada'});

  res.status(200).json({playlist: data});
};

export const searchPlaylistByName = async (req, res) => {
  const {name} = req.query;
  const userId = req.user?.id;

  if(!userId) return res.status(401).json({error: 'Usuário não autenticado'});
  if(!name) return res.status(400).json({error: 'Nome é obrigatório'});

  const {data, error} = await db.from('playlists').select().ilike('name', `%${name}%`).match({user_id: userId});

  if (error) return handleError(res, error);

  if(data.length === 0) return res.status(404).json({error: 'Playlist nao encontrada'});

  res.status(200).json({playlists: data});

};

export const addMusicToPlaylist = async (req, res) => {
  const {playlistId} = req.params;
  const {songId} = req.body;
  const userId = req.user?.id;

  if(!userId) return res.status(401).json({error: 'Usuário não autenticado'});
  if(!songId) return res.status(400).json({error: 'Id da musica é obrigatório'});

  const { error } = await db.from('playlists_songs').insert({ playlist_id: playlistId, song_id: songId });

  if (error) return handleError(res, error);

  res.status(201).json({ message: 'Música adicionada à playlist' });

};

export const removeMusicFromPlaylist = async (req, res) => {
  const {playlistId} = req.params;
  const {songId} = req.body;
  const userId = req.user?.id;

  if(!userId) return res.status(401).json({error: 'Usuário não autenticado'});  

  const { error } = await db.from('playlists_songs').delete().match({ playlist_id: playlistId, song_id: songId });
    
  if (error) return handleError(res, error);

  res.status(200).json({message: 'Música removida da playlist'});
};

export const getSongsFromPlaylist = async (req, res) => {
  const {playlistId} = req.params;
  const userId = req.user?.id;

  if(!userId) return res.status(401).json({error: 'Usuário não autenticado'});

  const {data: playlist, error: playlistError} = await db.from('playlists').select().match({id: playlistId, user_id: userId}).maybeSingle();

  if(playlistError) return res.status(500).json({error: playlistError.message});
  if(!playlist) return res.status(404).json({error: 'Playlist nao encontrada'});

  const { data: songs, error: error} = await db.from('playlists_songs').select('songs(*)').eq('playlist_id', playlistId);

  if (error) return handleError(res, error);

  res.status(200).json({songs: songs.map(item => item.songs)});

};


export const getTotalMusics = async (req, res) => {
  const { playlistId } = req.params;
  
  const { count, error } = await db.from('playlists_songs').select('*', { count: 'exact', head: true }).eq('playlist_id', playlistId);
  
  if (error) return handleError(res, error);
  
  res.status(200).json({ total: count });
};

export const getDuration = async (req, res) => {
  const { playlistId } = req.params;
  
  const { data, error } = await db.from('playlists_songs').select('songs(duration)').eq('playlist_id', playlistId);
  
  if (error) return handleError(res, error);
  
  const totalDuration = data.reduce((sum, item) => sum + (item.songs?.duration || 0), 0);
   
  res.status(200).json({ duration: totalDuration });
};

export const getPlaylistInfo = async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user?.id;
  
  if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' });
  
  const { data: playlist, error: playlistError } = await db.from('playlists').select().match({ id: playlistId, user_id: userId }).maybeSingle();
  
  if (playlistError) return res.status(500).json({ error: playlistError.message });
  if (!playlist) return res.status(404).json({ error: 'Playlist não encontrada' });
  
  const { data: songsData, error: error} = await db.from('playlists_songs').select('songs(duration)').eq('playlist_id', playlistId);
  
  if (error) return handleError(res, error);
  
  const totalMusics = songsData.length;
  const totalDuration = songsData.reduce((sum, item) => sum + (item.songs?.duration || 0), 0);
  
  res.status(200).json({
    id: playlist.id,
    name: playlist.name,
    cover_url: playlist.cover_url,
    totalMusics,
    totalDuration
  });
};
  
export const findMusicById = async (req, res) => {
  const { playlistId, songId } = req.params;
  
  const { data, error } = await db.from('playlists_songs').select('songs(*)').eq('playlist_id', playlistId).eq('song_id', songId).maybeSingle();
  
  if (error) return handleError(res, error);
  if (!data) return res.status(404).json({ error: 'Música não encontrada na playlist' });
  
  res.status(200).json({ music: data.songs });
};
  
export const findMusicByTitle = async (req, res) => {
  const { playlistId } = req.params;
  const { title } = req.query;
  
  if (!title) return res.status(400).json({ error: 'Título é obrigatório' });
  
  const { data, error } = await db.from('playlists_songs').select('songs(*)').eq('playlist_id', playlistId).ilike('songs.title', `%${title}%`);
  
  if (error) return handleError(res, error);
  if (data.length === 0) return res.status(404).json({ error: 'Nenhuma música encontrada' });
  
  const songs = data.map(entry => entry.songs);
  res.status(200).json({ songs });
};
  
export const getCoverPhoto = async (req, res) => {
  const { playlistId } = req.params;
  
  const { data, error } = await db.from('playlists').select('cover_url').eq('id', playlistId).maybeSingle();
  
  if (error) return handleError(res, error);
  if (!data) return res.status(404).json({ error: 'Playlist não encontrada' });
  
  res.status(200).json({ cover_url: data.cover_url });
};
  
  
