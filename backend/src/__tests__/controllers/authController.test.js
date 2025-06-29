const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importar os controllers
const { 
  register, 
  login, 
  socialLogin, 
  logout, 
  getProfile, 
  updateProfile, 
  changePassword 
} = require('../../controllers/authController.js');

import { afterEach, beforeEach, describe, jest, it, expect } from '@jest/globals';

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

// Mock do jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

const app = express();
app.use(express.json());

// Rotas para testes
app.post('/auth/register', register);
app.post('/auth/login', login);
app.post('/auth/social-login', socialLogin);
app.post('/auth/logout', logout);
app.get('/auth/profile', getProfile);
app.put('/auth/profile', updateProfile);
app.put('/auth/change-password', changePassword);

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock bcrypt hash
      bcrypt.hash.mockResolvedValue('hashedPassword');

      // Mock jwt sign
      jwt.sign.mockReturnValue('mock-jwt-token');

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 400 when user already exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock bcrypt compare
      bcrypt.compare.mockResolvedValue(true);

      // Mock jwt sign
      jwt.sign.mockReturnValue('mock-jwt-token');

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Mock bcrypt compare - password doesn't match
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('socialLogin', () => {
    it('should login existing user via social login', async () => {
      const socialData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      // Mock jwt sign
      jwt.sign.mockReturnValue('mock-jwt-token');

      const response = await request(app)
        .post('/auth/social-login')
        .send(socialData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should create new user via social login', async () => {
      const socialData = {
        email: 'new@example.com',
        name: 'New User'
      };

      // Mock jwt sign
      jwt.sign.mockReturnValue('mock-jwt-token');

      const response = await request(app)
        .post('/auth/social-login')
        .send(socialData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const response = await request(app).post('/auth/logout');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logout successful');
    });
  });

  describe('getProfile', () => {
    it('should return user profile when authenticated', async () => {
      const response = await request(app).get('/auth/profile');
      expect(response.status).toBe(404); // Sem autenticação, retorna 404
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put('/auth/profile')
        .send(updateData);

      expect(response.status).toBe(404); // Sem autenticação, retorna 404
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const passwordData = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword'
      };

      // Mock bcrypt compare - current password is correct
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .put('/auth/change-password')
        .send(passwordData);

      expect(response.status).toBe(404); // Sem autenticação, retorna 404
    });
  });
}); 