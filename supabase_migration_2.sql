-- Migration 2: Add missing fields and Karigar History table

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS karigar_delivered_date date,
ADD COLUMN IF NOT EXISTS cancel_reason text,
ADD COLUMN IF NOT EXISTS cancel_date date,
ADD COLUMN IF NOT EXISTS added_by text;

CREATE TABLE IF NOT EXISTS order_karigar_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  karigar_id uuid REFERENCES karigars(id) ON DELETE SET NULL,
  process_name text,
  action_type text, -- 'Assigned' or 'Received'
  action_date date, -- The date it was assigned or received
  expected_date date, -- The expected receiving date (if applicable)
  created_at timestamp with time zone DEFAULT now()
);
