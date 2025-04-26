export const handleError = (res, error) => {
    console.error(error);
    return res.status(500).json({ error: 'Algo deu errado, tente novamente mais tarde.' });
};