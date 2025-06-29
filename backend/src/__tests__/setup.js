// Setup global para testes
const dotenv = require('dotenv');

// Carrega variáveis de ambiente para testes
dotenv.config({ path: '.env.test' });

// Mock do bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn()
}));

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

// Mock do Supabase mais robusto
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => {
    const mockChain = {
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
      then: jest.fn().mockImplementation((callback) => {
        return Promise.resolve({ data: null, error: null }).then(callback);
      }),
      catch: jest.fn().mockImplementation((callback) => {
        return Promise.resolve({ data: null, error: null }).catch(callback);
      })
    };
    
    return {
      from: jest.fn(() => mockChain)
    };
  })
}));

// Mock do db.js para ES modules
jest.mock('../config/db.js', () => {
  const mockChain = {
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
    then: jest.fn().mockImplementation((callback) => {
      return Promise.resolve({ data: null, error: null }).then(callback);
    }),
    catch: jest.fn().mockImplementation((callback) => {
      return Promise.resolve({ data: null, error: null }).catch(callback);
    })
  };
  
  return {
    __esModule: true,
    default: {
      from: jest.fn(() => mockChain)
    }
  };
});

// Mock do express-validator
jest.mock('express-validator', () => {
  const chain = {
    isEmail: () => chain,
    isLength: () => chain,
    matches: () => chain,
    notEmpty: () => chain,
    optional: () => chain,
    isString: () => chain,
    isInt: () => chain,
    isDate: () => chain,
    withMessage: () => chain,
    run: jest.fn().mockResolvedValue({
      isEmpty: () => true,
      array: () => []
    })
  };
  
  const mockValidationResult = jest.fn().mockReturnValue({
    isEmpty: () => true,
    array: () => []
  });
  
  return {
    body: () => chain,
    param: () => chain,
    query: () => chain,
    validationResult: mockValidationResult
  };
});

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockToken'),
  verify: jest.fn().mockReturnValue({ userId: 1, email: 'test@example.com' })
}));

// Configuração global para os testes
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Configurações globais do Jest
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.resetAllMocks();
}); 