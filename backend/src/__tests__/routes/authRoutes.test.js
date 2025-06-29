const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/authRoutes.js');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Configurar o mock do db para retornar dados padrão
    db.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      gt: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lt: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      like: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      and: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: null, error: null }),
      catch: jest.fn()
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock bcrypt hash
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      // Mock database response
      db.from().select().eq().then.mockResolvedValue({ data: null, error: null }); // User doesn't exist
      db.from().insert().select().single().then.mockResolvedValue({ 
        data: { id: 1, ...userData, password: 'hashedPassword' }, 
        error: null 
      });

      const response = await request(app)
        .post('/auth/register')
        .send(userData);
      
      expect(response.status).toBe(201);
    });

    it('should return 400 for invalid input', async () => {
      const invalidData = { email: 'invalid-email' };
      const validationErrors = [
        { msg: 'Email inválido', param: 'email', location: 'body' }
      ];
      
      // Mock validation result with errors
      validationResult.mockReturnValue({ 
        isEmpty: () => false, 
        array: () => validationErrors 
      });

      const response = await request(app)
        .post('/auth/register')
        .send(invalidData);
      
      expect(response.status).toBe(400);
    });

    it('should return 400 when user already exists', async () => {
      const userData = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response - user already exists
      db.from().select().eq().then.mockResolvedValue({ 
        data: { id: 1, ...userData }, 
        error: null 
      });

      const response = await request(app)
        .post('/auth/register')
        .send(userData);
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().select().eq().single().then.mockResolvedValue({ data: mockUser, error: null });
      
      // Mock bcrypt compare
      bcrypt.compare.mockResolvedValue(true);
      
      // Mock jwt sign
      jwt.sign.mockReturnValue('mockToken');

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);
      
      expect(response.status).toBe(200);
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };
      
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().select().eq().single().then.mockResolvedValue({ data: mockUser, error: null });
      
      // Mock bcrypt compare - wrong password
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);
      
      expect(response.status).toBe(401);
    });

    it('should return 400 for validation errors', async () => {
      const invalidData = { email: 'invalid-email' };
      const validationErrors = [
        { msg: 'Email inválido', param: 'email', location: 'body' }
      ];
      
      // Mock validation result with errors
      validationResult.mockReturnValue({ 
        isEmpty: () => false, 
        array: () => validationErrors 
      });

      const response = await request(app)
        .post('/auth/login')
        .send(invalidData);
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/social-login', () => {
    it('should login existing user via social login', async () => {
      const socialData = {
        email: 'test@example.com',
        name: 'Test User',
        provider: 'google'
      };
      
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().select().eq().single().then.mockResolvedValue({ data: mockUser, error: null });
      
      // Mock jwt sign
      jwt.sign.mockReturnValue('mockToken');

      const response = await request(app)
        .post('/auth/social-login')
        .send(socialData);
      
      expect(response.status).toBe(200);
    });

    it('should create new user via social login', async () => {
      const socialData = {
        email: 'new@example.com',
        name: 'New User',
        provider: 'google'
      };
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response - user doesn't exist
      db.from().select().eq().single().then.mockResolvedValue({ data: null, error: null });
      
      // Mock database insert
      db.from().insert().select().single().then.mockResolvedValue({ 
        data: { id: 1, ...socialData }, 
        error: null 
      });
      
      // Mock jwt sign
      jwt.sign.mockReturnValue('mockToken');

      const response = await request(app)
        .post('/auth/social-login')
        .send(socialData);
      
      expect(response.status).toBe(201);
    });

    it('should return 400 when email is missing', async () => {
      const socialData = {
        name: 'Test User',
        provider: 'google'
      };
      
      const validationErrors = [
        { msg: 'Email é obrigatório', param: 'email', location: 'body' }
      ];
      
      // Mock validation result with errors
      validationResult.mockReturnValue({ 
        isEmpty: () => false, 
        array: () => validationErrors 
      });

      const response = await request(app)
        .post('/auth/social-login')
        .send(socialData);
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout user successfully', async () => {
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });

      const response = await request(app).post('/auth/logout');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /auth/profile', () => {
    it('should return user profile when authenticated', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().select().eq().single().then.mockResolvedValue({ data: mockUser, error: null });

      const response = await request(app).get('/auth/profile');
      expect(response.status).toBe(200);
    });

    it('should return 404 when user not found', async () => {
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response - user not found
      db.from().select().eq().single().then.mockResolvedValue({ data: null, error: null });

      const response = await request(app).get('/auth/profile');
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /auth/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        username: 'updateduser',
        email: 'updated@example.com'
      };
      
      const updatedUser = {
        id: 1,
        ...updateData
      };
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().update().eq().select().single().then.mockResolvedValue({ data: updatedUser, error: null });

      const response = await request(app)
        .put('/auth/profile')
        .send(updateData);
      
      expect(response.status).toBe(200);
    });

    it('should return validation errors when input is invalid', async () => {
      const invalidData = { email: 'invalid-email' };
      const validationErrors = [
        { msg: 'Email inválido', param: 'email', location: 'body' }
      ];
      
      // Mock validation result with errors
      validationResult.mockReturnValue({ 
        isEmpty: () => false, 
        array: () => validationErrors 
      });

      const response = await request(app)
        .put('/auth/profile')
        .send(invalidData);
      
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /auth/change-password', () => {
    it('should change password successfully', async () => {
      const passwordData = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword'
      };
      
      const mockUser = {
        id: 1,
        password: 'hashedOldPassword'
      };
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().select().eq().single().then.mockResolvedValue({ data: mockUser, error: null });
      
      // Mock bcrypt compare
      bcrypt.compare.mockResolvedValue(true);
      
      // Mock bcrypt hash
      bcrypt.hash.mockResolvedValue('hashedNewPassword');
      
      // Mock database update
      db.from().update().eq().then.mockResolvedValue({ data: null, error: null });

      const response = await request(app)
        .put('/auth/change-password')
        .send(passwordData);
      
      expect(response.status).toBe(200);
    });

    it('should return error for wrong current password', async () => {
      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword'
      };
      
      const mockUser = {
        id: 1,
        password: 'hashedOldPassword'
      };
      
      // Mock validation result
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
      
      // Mock database response
      db.from().select().eq().single().then.mockResolvedValue({ data: mockUser, error: null });
      
      // Mock bcrypt compare - wrong password
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .put('/auth/change-password')
        .send(passwordData);
      
      expect(response.status).toBe(401);
    });
  });
}); 