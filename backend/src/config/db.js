const {Pool} = require('pg')
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

pool.query('SELECT NOW()')
    .then(() => console.log('Connected to supabase'))
    .catch(err => console.log('Erro ao conectar: ', err));

module.exports = pool;