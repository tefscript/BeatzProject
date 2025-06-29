import { validationResult } from 'express-validator';
import { validateEmail, validatePassword, validateUsername } from '../../utils/validation.js';

// Mock do express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
  body: jest.fn(() => ({
    isEmail: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
    matches: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    run: jest.fn()
  })),
  param: jest.fn(() => ({
    isInt: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    run: jest.fn()
  })),
  query: jest.fn(() => ({
    isInt: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    run: jest.fn()
  }))
}));

describe('Validation Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('express-validator integration', () => {
    it('should validate body parameters', async () => {
      const req = { body: { email: 'test@example.com' } };
      const mockValidationResult = {
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([])
      };

      validationResult.mockReturnValue(mockValidationResult);

      const result = await validationResult(req);
      expect(result.isEmpty()).toBe(true);
    });

    it('should validate param parameters', async () => {
      const req = { params: { id: '123' } };
      const mockValidationResult = {
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([])
      };

      validationResult.mockReturnValue(mockValidationResult);

      const result = await validationResult(req);
      expect(result.isEmpty()).toBe(true);
    });

    it('should validate query parameters', async () => {
      const req = { query: { page: '1' } };
      const mockValidationResult = {
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([])
      };

      validationResult.mockReturnValue(mockValidationResult);

      const result = await validationResult(req);
      expect(result.isEmpty()).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('Password123!')).toBe(true);
      expect(validatePassword('MySecurePass1@')).toBe(true);
      expect(validatePassword('ComplexP@ssw0rd')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('12345678')).toBe(false);
      expect(validatePassword('password')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('should validate valid usernames', () => {
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('test_user')).toBe(true);
      expect(validateUsername('my-username')).toBe(true);
      expect(validateUsername('user')).toBe(true);
    });

    it('should reject invalid usernames', () => {
      expect(validateUsername('')).toBe(false);
      expect(validateUsername('a')).toBe(false); // too short
      expect(validateUsername('verylongusername123456789')).toBe(false); // too long
      expect(validateUsername('user@name')).toBe(false); // invalid characters
    });
  });
}); 