import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type StoryWord = {
  id: string;
  word: string;
  user_id: string;
  author_name: string;
  created_at: string;
};

export type Profile = {
  id: string;
  display_name: string;
  created_at: string;
};
