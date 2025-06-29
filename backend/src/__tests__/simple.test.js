import { describe, it, expect, beforeEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Teste mínimo para diagnosticar timeout
describe('Simple Test', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Rota simples sem validação
    app.get('/test', (req, res) => {
      res.json({ message: 'Test successful' });
    });
  });

  it('should return success message', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Test successful');
  });
}); 