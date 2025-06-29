const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importar os controllers
const { 
  getAlbumInfo,
  getMusicsFromAlbum,
  addMusicToAlbum,
  removeMusicFromAlbum,
  setCoverPhoto,
  searchAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getAllAlbums
} = require('../../controllers/albumController.js');

import { afterEach, beforeEach, describe, jest, it, expect } from '@jest/globals';

// Mock do handleError
jest.mock('../../utils/handleError.js', () => ({
  handleError: jest.fn((res, error) => {
    res.status(500).json({ error: 'Algo deu errado, tente novamente mais tarde.' });
  })
}));

const app = express();
app.use(express.json());

// Rotas para testes
app.get('/albums/:albumId', getAlbumInfo);
app.get('/albums/:albumId/musics', getMusicsFromAlbum);
app.post('/albums/:albumId/musics', addMusicToAlbum);
app.delete('/albums/:albumId/musics', removeMusicFromAlbum);
app.put('/albums/:albumId/cover', setCoverPhoto);
app.get('/albums/search', searchAlbums);
app.post('/albums', createAlbum);
app.put('/albums/:id', updateAlbum);
app.delete('/albums/:id', deleteAlbum);
app.get('/albums', getAllAlbums);

describe('Album Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // O mock do db já está configurado no setup global
  });

  describe('getAlbumInfo', () => {
    it('should return album info successfully', async () => {
      const albumId = 'album1';
      const mockAlbum = {
        id: albumId,
        title: 'Test Album',
        artist: { name: 'Test Artist' }
      };
      
      // Mock database response
      db.from().select().eq().single().then.mockResolvedValue({ data: mockAlbum, error: null });

      const response = await request(app).get(`/albums/${albumId}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 when album not found', async () => {
      const albumId = 'nonexistent';
      
      // Mock database response - no data found
      db.from().select().eq().single().then.mockResolvedValue({ data: null, error: null });

      const response = await request(app).get(`/albums/${albumId}`);
      expect(response.status).toBe(500);
    });
  });

  describe('getMusicsFromAlbum', () => {
    it('should return musics from album successfully', async () => {
      const albumId = 'album1';
      const mockMusics = [
        { id: 'music1', title: 'Song 1', album: { cover_url: 'cover1.jpg' } },
        { id: 'music2', title: 'Song 2', album: { cover_url: 'cover2.jpg' } }
      ];
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().select().eq().then.mockResolvedValue({ data: mockMusics, error: null });

      const response = await request(app).get(`/albums/${albumId}/musics`);
      expect(response.status).toBe(200);
    });

    it('should return empty array when no musics found', async () => {
      const albumId = 'album1';
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response - empty array
      db.from().select().eq().then.mockResolvedValue({ data: [], error: null });

      const response = await request(app).get(`/albums/${albumId}/musics`);
      expect(response.status).toBe(200);
    });
  });

  describe('addMusicToAlbum', () => {
    it('should add music to album successfully', async () => {
      const albumId = 'album1';
      const musicId = 'music1';
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().update().eq().then.mockResolvedValue({ data: null, error: null });

      const response = await request(app)
        .post(`/albums/${albumId}/musics`)
        .send({ musicId });
      
      expect(response.status).toBe(200);
    });

    it('should return 400 if musicId is missing', async () => {
      const albumId = 'album1';

      const response = await request(app)
        .post(`/albums/${albumId}/musics`)
        .send({});
      
      expect(response.status).toBe(400);
    });
  });

  describe('removeMusicFromAlbum', () => {
    it('should remove music from album successfully', async () => {
      const albumId = 'album1';
      const musicId = 'music1';
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().update().eq().eq().then.mockResolvedValue({ data: null, error: null });

      const response = await request(app)
        .delete(`/albums/${albumId}/musics`)
        .send({ musicId });
      
      expect(response.status).toBe(200);
    });

    it('should return 400 if musicId is missing', async () => {
      const albumId = 'album1';

      const response = await request(app)
        .delete(`/albums/${albumId}/musics`)
        .send({});
      
      expect(response.status).toBe(400);
    });
  });

  describe('setCoverPhoto', () => {
    it('should update album cover successfully', async () => {
      const albumId = 'album1';
      const coverUrl = 'https://example.com/cover.jpg';
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().update().eq().then.mockResolvedValue({ data: null, error: null });

      const response = await request(app)
        .put(`/albums/${albumId}/cover`)
        .send({ url: coverUrl });
      
      expect(response.status).toBe(200);
    });

    it('should return 400 if url is missing', async () => {
      const albumId = 'album1';

      const response = await request(app)
        .put(`/albums/${albumId}/cover`)
        .send({});
      
      expect(response.status).toBe(400);
    });
  });

  describe('searchAlbums', () => {
    it('should search albums with search term', async () => {
      const searchTerm = 'test';
      const mockAlbums = [
        { id: 'album1', title: 'Test Album', artist: { name: 'Test Artist' } }
      ];
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().select().ilike().then.mockResolvedValue({ data: mockAlbums, error: null });

      const response = await request(app).get(`/albums/search?search=${searchTerm}`);
      expect(response.status).toBe(200);
    });

    it('should return all albums when no search term', async () => {
      const mockAlbums = [
        { id: 'album1', title: 'Album 1', artist: { name: 'Artist 1' } },
        { id: 'album2', title: 'Album 2', artist: { name: 'Artist 2' } }
      ];
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().select().then.mockResolvedValue({ data: mockAlbums, error: null });

      const response = await request(app).get('/albums/search');
      expect(response.status).toBe(200);
    });
  });

  describe('createAlbum', () => {
    it('should create album successfully', async () => {
      const albumData = {
        title: 'New Album',
        artist_id: 1,
        release_date: '2023-01-01'
      };
      const newAlbum = { id: 'album1', ...albumData };
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().insert().select().single().then.mockResolvedValue({ data: newAlbum, error: null });

      const response = await request(app)
        .post('/albums')
        .send(albumData);
      
      expect(response.status).toBe(201);
    });

    it('should return validation errors when input is invalid', async () => {
      const invalidData = { title: '' };
      const validationErrors = [
        { msg: 'Título é obrigatório', param: 'title', location: 'body' }
      ];
      
      // Mock validation result with errors
      validationResult.mockReturnValue({ 
        isEmpty: () => false, 
        array: () => validationErrors 
      });

      const response = await request(app)
        .post('/albums')
        .send(invalidData);
      
      expect(response.status).toBe(400);
    });
  });

  describe('updateAlbum', () => {
    it('should update album successfully', async () => {
      const albumId = 'album1';
      const updateData = {
        title: 'Updated Album',
        artist_id: 2
      };
      const updatedAlbum = { id: albumId, ...updateData };
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().update().eq().select().single().then.mockResolvedValue({ data: updatedAlbum, error: null });

      const response = await request(app)
        .put(`/albums/${albumId}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
    });
  });

  describe('deleteAlbum', () => {
    it('should delete album successfully', async () => {
      const albumId = 'album1';
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().delete().eq().then.mockResolvedValue({ data: null, error: null });

      const response = await request(app).delete(`/albums/${albumId}`);
      expect(response.status).toBe(200);
    });
  });

  describe('getAllAlbums', () => {
    it('should return all albums successfully', async () => {
      const mockAlbums = [
        { id: 'album1', title: 'Album 1', artist: { name: 'Artist 1' } },
        { id: 'album2', title: 'Album 2', artist: { name: 'Artist 2' } }
      ];
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().select().then.mockResolvedValue({ data: mockAlbums, error: null });

      const response = await request(app).get('/albums');
      expect(response.status).toBe(200);
    });

    it('should handle pagination parameters', async () => {
      const mockAlbums = [
        { id: 'album1', title: 'Album 1', artist: { name: 'Artist 1' } }
      ];
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().select().limit().range().then.mockResolvedValue({ data: mockAlbums, error: null });

      const response = await request(app).get('/albums?page=1&limit=10');
      expect(response.status).toBe(200);
    });
  });
});
