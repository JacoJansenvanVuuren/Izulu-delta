import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    headers: { 'x-my-custom-header': 'my-app-name' },
    fetch: (...args) => fetch(...args),
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
