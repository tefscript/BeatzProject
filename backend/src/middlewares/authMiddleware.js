import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded?.userId) {
      return res.status(403).json({ error: 'Token sem ID de usuário' });
    }

    req.user = { userId: decoded.userId, email: decoded.email }; 
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado' });
    }
    
    return res.status(403).json({ error: 'Token inválido' });
  }
};

export { authenticateToken };
