import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xilbmvzyuxdcechnmeko.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbGJtdnp5dXhkY2VjaG5tZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODgyNzYsImV4cCI6MjA2NTc2NDI3Nn0.P9p4sbQtUHR_yCxEIqych-76OdrmZTZEXtFPqaX4QYs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
