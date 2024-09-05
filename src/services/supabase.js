import {createClient} from '@supabase/supabase-js';
export const supabaseUrl = 'https://ruiowckywnhnciytayld.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1aW93Y2t5d25obmNpeXRheWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3NzE2NzMsImV4cCI6MjAyOTM0NzY3M30.Haps_--xrlGFV3jGH_JXIzG6WwN7c6Jhb9BDcGWp_MI";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
