const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://nqhypbfhiqbriyiqxmml.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaHlwYmZoaXFicml5aXF4bW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjAwNjIsImV4cCI6MjA1Njc5NjA2Mn0.Cybqe0UMbhMfq0W_CUyjPeEkQ0cvleUlwFLfIypBcHo"
;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;