// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Կարդում ենք API բանալիները .env ֆայլից
// Ուշադրություն: VITE-ի պես գործիքները .env-ի փոփոխականները տալիս են import.meta.env-ի միջոցով
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // Այս սխալը կհայտնվի կոնսոլում, եթե .env ֆայլը բացակայի կամ բանալիները սխալ լինեն
    console.error("Supabase API keys are missing in the .env file! Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

// Ստեղծում ենք Supabase client-ի ինստանսը
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage-ի bucket-ի անունը, որը ստեղծել եք Փուլ 2-ում
export const productImagesBucket = 'product-images';