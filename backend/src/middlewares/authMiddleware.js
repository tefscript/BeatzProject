import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Token não fornecido' });

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Erro na verificação do token:', err.message);
            return res.status(403).json({ error: 'Token inválido' });
        }

        if (!decoded?.userId) return res.status(403).json({ error: 'Token sem ID de usuário' });

        req.user = { id: decoded.userId, email: decoded.email }; 
        next();
    });
};

export default authenticateToken;
