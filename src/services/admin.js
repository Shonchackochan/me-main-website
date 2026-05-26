// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// export const createSupabaseConnection = () => {
// 	if (!supabaseUrl || !supabaseKey) {
// 		throw new Error('Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
// 	}

// 	return createClient(supabaseUrl, supabaseKey);
// };

// export const adminSupabase = createSupabaseConnection();

// export const signUpAdmin = async ({ email, password, profile = {} }) => {
// 	return adminSupabase.auth.signUp({
// 		email,
// 		password,
// 		options: {
// 			data: {
// 				...profile,
// 				role: 'ADMIN'
// 			}
// 		}
// 	});
// };
