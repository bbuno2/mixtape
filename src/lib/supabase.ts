import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqgchivagwlkptnjdpvz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZ2NoaXZhZ3dsa3B0bmpkcHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODkzMDMsImV4cCI6MjA4OTk2NTMwM30.VF0CnWd_dRCPIu3X29TgJcUE70l7f12ieo-JrxvvgJU';

export const supabase = createClient(supabaseUrl, supabaseKey);
