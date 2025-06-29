import { handleError } from '../../utils/handleError.js';

describe('HandleError Utils', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('handleError', () => {
    it('should handle generic errors', () => {
      const error = new Error('Test error');
      
      handleError(mockRes, error);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Algo deu errado, tente novamente mais tarde.'
      });
    });

    it('should handle validation errors', () => {
      const validationError = {
        name: 'ValidationError',
        message: 'Validation failed',
        errors: [
          { field: 'email', message: 'Email is required' }
        ]
      };
      
      handleError(mockRes, validationError);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Dados inválidos',
        details: validationError.errors
      });
    });

    it('should handle database errors', () => {
      const dbError = {
        name: 'DatabaseError',
        message: 'Connection failed',
        code: 'CONNECTION_ERROR'
      };
      
      handleError(mockRes, dbError);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro no banco de dados'
      });
    });

    it('should handle authentication errors', () => {
      const authError = {
        name: 'AuthenticationError',
        message: 'Invalid credentials'
      };
      
      handleError(mockRes, authError);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro de autenticação'
      });
    });

    it('should handle authorization errors', () => {
      const authError = {
        name: 'AuthorizationError',
        message: 'Insufficient permissions'
      };
      
      handleError(mockRes, authError);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Acesso negado'
      });
    });

    it('should handle not found errors', () => {
      const notFoundError = {
        name: 'NotFoundError',
        message: 'Resource not found'
      };
      
      handleError(mockRes, notFoundError);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Recurso não encontrado'
      });
    });

    it('should handle conflict errors', () => {
      const conflictError = {
        name: 'ConflictError',
        message: 'Resource already exists'
      };
      
      handleError(mockRes, conflictError);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Conflito de dados'
      });
    });

    it('should handle unknown error types', () => {
      const unknownError = {
        name: 'UnknownError',
        message: 'Something went wrong'
      };
      
      handleError(mockRes, unknownError);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Algo deu errado, tente novamente mais tarde.'
      });
    });

    it('should handle errors without name property', () => {
      const simpleError = {
        message: 'Simple error message'
      };
      
      handleError(mockRes, simpleError);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Algo deu errado, tente novamente mais tarde.'
      });
    });

    it('should handle string errors', () => {
      const stringError = 'String error message';
      
      handleError(mockRes, stringError);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Algo deu errado, tente novamente mais tarde.'
      });
    });
  });
}); 