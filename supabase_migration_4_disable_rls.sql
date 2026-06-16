-- Migration 4: Fix Row-Level Security issue on order_karigar_history

-- Option A: Disable RLS entirely for this table (Simplest fix, matches most default setups)
ALTER TABLE order_karigar_history DISABLE ROW LEVEL SECURITY;

-- Option B (If you prefer keeping RLS enabled):
-- CREATE POLICY "Allow all operations" ON order_karigar_history FOR ALL USING (true) WITH CHECK (true);
