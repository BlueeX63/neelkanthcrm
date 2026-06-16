-- Migration 3: Add received_date to history for better tracking

ALTER TABLE order_karigar_history 
ADD COLUMN IF NOT EXISTS received_date date;
