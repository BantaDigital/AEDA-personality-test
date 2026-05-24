import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://egsednfetxvhzptiptek.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnc2VkbmZldHh2aHpwdGlwdGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDczNjIsImV4cCI6MjA5NTIyMzM2Mn0.TqjwqxchRmhcybiEf-XPLXp7IT7l-kZYcPGaMGU8kHc';

export const supabase = createClient(supabaseUrl, supabaseKey);
