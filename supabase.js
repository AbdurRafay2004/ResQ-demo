// Use the lowercase 'supabase' namespace as provided by the Supabase client library
const SUPABASE_URL = 'https://cldqvnrdwrkauvufvrua.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZHF2bnJkd3JrYXV2dWZ2cnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDI0NDMsImV4cCI6MjA2MjE3ODQ0M30.AtxeMw2u1woYDvOxddr4CzZprapg6J5HxydJzyddmlo';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); // Note the lowercase 'supabase'

console.log('Supabase client initialized:', supabase);