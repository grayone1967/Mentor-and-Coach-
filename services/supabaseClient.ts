import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/schema';

const SUPABASE_URL = 'https://joruoofijkqlrfnryvsv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcnVvb2ZpamtxbHJmbnJ5dnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTQwMTIsImV4cCI6MjA1OTc5MDAxMn0.5XuXmqRlZscDA6Jbw26kdPt3GBlV3N4NSd1o4Pbspf4';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);