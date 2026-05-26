import { createClient } from '@supabase/supabase-js';
const VITE_SUPABASE_URL="https://znymbscieqgfwnchrgyr.supabase.co";
const VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_wfUC90mbx5RlI58Bq9A4Xw_WQdGL8K7";

const supabaseUrl = VITE_SUPABASE_URL;
const supabaseKey = VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const { data, error } = supabase.auth.signUp({
	email: "mindempowered@gmail.com",
	password: "Admin123!",
	options: {
		data: {
			firstName: "Test",
			lastName: "Admin",
			phone: "8281800172",
			role: "ADMIN"
		}
	}
});

if (error) console.log("An error has occured: ", error);
else console.log("Success: ", data);