const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Beatz está funcionando' });
});

const userRoutes = require ('./routes/userRoutes');
app.use('/users', userRoutes);

module.exports = app;