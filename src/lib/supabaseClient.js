import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://thupcivpdtfqgocfgcpu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodXBjaXZwZHRmcWdvY2ZnY3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzIxNDIsImV4cCI6MjA2MzUwODE0Mn0.JMLLoEWy-Ga06ABE85kap3YZCPxqV6d2xf1EvdmUI6M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);