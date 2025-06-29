import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../../middlewares/authMiddleware.js';

// Mock do jwt
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

// Mock do handleError
jest.mock('../../utils/handleError.js', () => ({
  handleError: jest.fn((res, error) => {
    res.status(500).json({ error: 'Algo deu errado, tente novamente mais tarde.' });
  })
}));

const app = express();
app.use(express.json());

// Rota de teste protegida
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Access granted', 
    userId: req.user.userId 
  });
});

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should allow access with valid token', async () => {
      const mockUser = { userId: 1, email: 'test@example.com' };
      
      // Mock jwt verify
      jwt.verify.mockReturnValue(mockUser);

      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Access granted');
      expect(response.body).toHaveProperty('userId', 1);
    });

    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .get('/protected');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token não fornecido');
    });

    it('should return 401 when token format is invalid', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'InvalidFormat token123');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Formato de token inválido');
    });

    it('should return 403 when token is invalid', async () => {
      // Mock jwt verify to throw error
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Token inválido');
    });

    it('should return 403 when token is expired', async () => {
      // Mock jwt verify to throw TokenExpiredError
      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer expired-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Token expirado');
    });
  });
}); 