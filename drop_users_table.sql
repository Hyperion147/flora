-- Run this in Supabase SQL Editor to remove the custom users table
-- We're now getting user data directly from auth.users

DROP TABLE IF EXISTS public.users CASCADE;