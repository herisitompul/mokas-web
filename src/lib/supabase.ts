import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Deteksi apakah konfigurasi masih menggunakan placeholder default
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') && 
  !supabaseAnonKey.includes('your-project-anon-key');

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase URL dan Anon Key belum dikonfigurasi di .env.local.\n' +
    'Aplikasi akan secara otomatis menggunakan data mock lokal (fallback) sebagai contoh.'
  );
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);
