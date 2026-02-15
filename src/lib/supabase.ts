
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Safe client creation for SSR/Edge environments
export const createSupabaseClient = () => {
    if (!supabaseUrl || !supabaseKey) {
        if (typeof window !== "undefined") {
            console.warn("Supabase URL and Key are missing. Please add them to your .env.local file.");
        }
        return null;
    }
    return createClient(supabaseUrl, supabaseKey);
};

export const supabase = createSupabaseClient();
