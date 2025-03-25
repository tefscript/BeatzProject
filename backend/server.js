const app = require('./src/app');
const supabase = require('./src/config/db'); 

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

