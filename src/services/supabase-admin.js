import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            persistSession: false,  
            autoRefreshToken: false,
        }
    }
);