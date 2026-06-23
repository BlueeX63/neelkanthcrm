-- Migration to rename the 'designing' column to 'cpx' in the 'orders' table
-- Run this script in your Supabase SQL Editor.

ALTER TABLE IF EXISTS orders 
RENAME COLUMN designing TO cpx;
