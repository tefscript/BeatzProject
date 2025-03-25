const app = require('./src/app');
const supabase = require('./src/config/db'); 

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));

supabase
    .from('users')  
    .select()
    .then(response => {
        if (response.error) {
            console.log('Erro ao conectar com o Supabase: ', response.error);
        } else {
            console.log('Conexão com o Supabase está ok! \n TABELA USERS', response.data);
        }
    })
    .catch(err => console.log('Erro ao conectar com o Supabase: ', err)); 