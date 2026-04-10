-- Migration script to add NimbusPost shipping tracking columns to the orders table.
-- Run this in the Supabase SQL Editor.

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipping_tracking_id TEXT,
ADD COLUMN IF NOT EXISTS shipping_label_url TEXT,
ADD COLUMN IF NOT EXISTS shipping_status TEXT DEFAULT 'pending';

-- Optional: Update comment for documentation
COMMENT ON COLUMN orders.shipping_tracking_id IS 'NimbusPost tracking ID';
COMMENT ON COLUMN orders.shipping_label_url IS 'URL to the shipping label PDF';
COMMENT ON COLUMN orders.shipping_status IS 'Shipping status synced from NimbusPost';
