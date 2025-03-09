const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:Beatz22Beatz@db.nqhypbfhiqbriyiqxmml.supabase.co:5432/postgres',
    ssl: {rejectUnauthorized: false}
});

client.connect()
    .then(() => console.log('Conectado ao Supabase'))
    .catch(error => console.error('Erro ao conectar ao Supabase', error));

module.exports = client;