-- Migration script to add Shiprocket shipment storage to the orders table.
-- Run this in the Supabase SQL Editor.

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipment_id TEXT;

-- Update comments for documentation
COMMENT ON COLUMN orders.shipment_id IS 'Shiprocket shipment ID';
COMMENT ON COLUMN orders.shipping_tracking_id IS 'Shiprocket tracking/AWB number';
COMMENT ON COLUMN orders.shipping_status IS 'Shipping status synced from Shiprocket';
