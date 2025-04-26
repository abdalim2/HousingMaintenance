import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with proper Supabase URL and key
const supabaseUrl = 'https://mticvmyfrdmciaeipfxu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10aWN2bXlmcmRtY2lhZWlwZnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODc1OTMsImV4cCI6MjA1NjY2MzU5M30.6iudxBl6js0heW1mhoSmcXegTIN_lAN2GiFeA3plSIo';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Store PostgreSQL direct connection URL for database initialization scripts
export const postgresUrl = 'postgresql://HousingMaintenance_owner:npg_fC8S4bpZLsJw@ep-weathered-meadow-a44a1v3i-pooler.us-east-1.aws.neon.tech/HousingMaintenance?sslmode=require';