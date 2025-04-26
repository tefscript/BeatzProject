import db from '../config/db.js';
import { handleError } from '../utils/handleError.js';

export const getAlbumInfo = async (req, res) => {
    const { albumId } = req.params;

    const { data, error } = await db .from('albums').select('*').eq('id', albumId).single();

    if (error) return handleError(res, error);

    return res.json(data);
}

export const getMusicsFromAlbum = async (req, res) => {
    const { albumId } = req.params;

    const { data, error} = await db.from('songs').select('*').eq('album_id', albumId);

    if(error) return handleError(res, error);

    return res.json(data);
}

export const addMusicToAlbum = async (req, res) => {
    const { albumId } = req.params;
    const { musicId } = req.body;

    if(!musicId) return res.status(400).json({error: 'Id da musica é obrigatório'});

    const { error } = await db.from('songs').update({album_id: albumId}).eq('id', musicId);

    if(error) return handleError(res, error);

    return res.json({ message: 'Música adicionada ao album com sucesso!' });

}

export const removeMusicFromAlbum = async (req, res) => {
    const { albumId } = req.params;
    const { musicId } = req.body;

    if(!musicId) return res.status(400).json({error: 'Id da musica é obrigatório'});

    const { error } = await db.from('songs').update({album_id: null}).eq('id', musicId).eq('album_id', albumId);

    if (error) return handleError(res, error);

    return res.json({ message: 'Música removida do album com sucesso!' });
}

export const setCoverPhoto = async (req, res) => {
    const { albumId } = req.params;
    const { url } = req.body;

    if(!url) return res.status(400).json({ error: 'Imagem é obrigatória.' });

    const {error} = await db.from('albums').update({ cover_url: url }).eq('id', albumId);

    if (error) return handleError(res, error);

    return res.json({ message: 'Capa do álbum atualizada com sucesso!' });

}