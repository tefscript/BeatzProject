export const handleError = (res, error) => {
  console.error(error);

  // Tratamento específico para diferentes tipos de erro
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: error.errors || []
    });
  }

  if (error.name === 'DatabaseError') {
    return res.status(500).json({
      error: 'Erro no banco de dados'
    });
  }

  if (error.name === 'AuthenticationError') {
    return res.status(401).json({
      error: 'Erro de autenticação'
    });
  }

  if (error.name === 'AuthorizationError') {
    return res.status(403).json({
      error: 'Acesso negado'
    });
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Recurso não encontrado'
    });
  }

  if (error.name === 'ConflictError') {
    return res.status(409).json({
      error: 'Conflito de dados'
    });
  }

  // Erro genérico
  return res.status(500).json({ 
    error: 'Algo deu errado, tente novamente mais tarde.' 
  });
};
