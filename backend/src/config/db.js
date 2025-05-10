import dotenv from 'dotenv';

import { createClient } from '@supabase/supabase-js';

dotenv.config();

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default db;
