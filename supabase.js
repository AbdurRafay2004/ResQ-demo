// supabase.js
// Wait for the Supabase library to load before initializing
document.addEventListener('DOMContentLoaded', () => {
    if (typeof supabase === 'undefined') {
        console.error('Supabase library not loaded. Check script inclusion.');
        return;
    }

    const SUPABASE_URL = 'https://cldqvnrdwrkauvufvrua.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZHF2bnJkd3JrYXV2dWZ2cnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDI0NDMsImV4cCI6MjA2MjE3ODQ0M30.AtxeMw2u1woYDvOxddr4CzZprapg6J5HxydJzyddmlo';
    window.mySupabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); // Use a custom global variable to avoid conflicts

    console.log('Supabase client initialized:', window.mySupabase);
});