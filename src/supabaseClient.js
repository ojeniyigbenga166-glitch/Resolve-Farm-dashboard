import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initializes the Supabase client.
// Falls back to empty values so the application doesn't crash if environment keys are missing.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
