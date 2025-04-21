import dotenv from 'dotenv';
import app from './src/app.js';
import {supabase} from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

