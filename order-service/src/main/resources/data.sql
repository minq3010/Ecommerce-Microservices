-- Insert Sample Vouchers
INSERT INTO vouchers (id, code, description, discount_type, discount_value, min_purchase, max_discount, usage_limit, usage_count, start_date, end_date, status, created_at, updated_at, created_by, updated_by)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'SUMMER2024', 'Summer Sale 20% off', 'PERCENTAGE', 20.00, 50.00, 500.00, 1000, 345, '2024-10-01 10:00:00', '2024-12-31 23:59:59', 'ACTIVE', NOW(), NOW(), 'admin', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'WELCOME50', 'Welcome discount $50 off on first order', 'FIXED', 50.00, 200.00, NULL, 500, 150, '2024-01-01 10:00:00', '2024-12-31 23:59:59', 'ACTIVE', NOW(), NOW(), 'admin', 'admin'),
('550e8400-e29b-41d4-a716-446655440003', 'FLASH10', 'Flash sale 10% off', 'PERCENTAGE', 10.00, 0.00, NULL, 2000, 1890, '2024-10-15 10:00:00', '2024-10-30 23:59:59', 'ACTIVE', NOW(), NOW(), 'admin', 'admin'),
('550e8400-e29b-41d4-a716-446655440004', 'BLACKFRIDAY', 'Black Friday 30% off everything', 'PERCENTAGE', 30.00, 100.00, 1000.00, 5000, 0, '2024-11-29 10:00:00', '2024-12-02 23:59:59', 'ACTIVE', NOW(), NOW(), 'admin', 'admin'),
('550e8400-e29b-41d4-a716-446655440005', 'NEWYEAR2025', 'New Year Special - 25% off', 'PERCENTAGE', 25.00, 75.00, 750.00, 3000, 0, '2025-01-01 10:00:00', '2025-01-31 23:59:59', 'ACTIVE', NOW(), NOW(), 'admin', 'admin');

-- Insert Sample Orders
INSERT INTO orders (id, user_id, total_price, shipping_cost, tax_amount, status, shipping_address, phone_number, notes, payment_status, payment_id, created_at, updated_at, item_count)
VALUES
('650e8400-e29b-41d4-a716-446655440001', '8497bf87-dea4-4171-970b-a7aaa2f4fbd5', 2658000.00, 25000.00, 265800.00, 'DELIVERED', '123 Nguyen Hue Street, District 1, HCMC', '0912345678', 'Delivered on time', 'COMPLETED', '750e8400-e29b-41d4-a716-446655440001', '2024-10-15 10:30:00', '2024-10-18 16:45:00', 1),
('650e8400-e29b-41d4-a716-446655440002', '8497bf87-dea4-4171-970b-a7aaa2f4fbd5', 5300000.00, 30000.00, 530000.00, 'DELIVERED', '123 Nguyen Hue Street, District 1, HCMC', '0912345678', 'Customer very satisfied', 'COMPLETED', '750e8400-e29b-41d4-a716-446655440002', '2024-10-20 14:15:00', '2024-10-23 09:20:00', 2),
('650e8400-e29b-41d4-a716-446655440003', '8497bf87-dea4-4171-970b-a7aaa2f4fbd5', 7500000.00, 35000.00, 750000.00, 'SHIPPED', '123 Nguyen Hue Street, District 1, HCMC', '0912345678', 'In transit', 'COMPLETED', '750e8400-e29b-41d4-a716-446655440003', '2024-11-01 08:00:00', '2024-11-01 20:30:00', 3),
('650e8400-e29b-41d4-a716-446655440004', '8497bf87-dea4-4171-970b-a7aaa2f4fbd5', 1200000.00, 20000.00, 120000.00, 'PENDING', '123 Nguyen Hue Street, District 1, HCMC', '0912345678', 'Waiting for payment confirmation', 'PENDING', NULL, '2024-11-01 15:45:00', '2024-11-01 15:45:00', 1);

-- Insert Sample OrderItems (for reference - adjust based on your actual cart items)
-- Note: You may need to add OrderItem entity and table if not already present

-- Insert Sample Payments
INSERT INTO payments (id, order_id, user_id, amount, payment_method, status, transaction_id, description, created_at, updated_at)
VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '8497bf87-dea4-4171-970b-a7aaa2f4fbd5', 2658000.00, 'VNPAY', 'COMPLETED', 'TXN20241015103001', 'Payment for Order #650e8400', '2024-10-15 10:35:00', '2024-10-15 10:40:00'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '8497bf87-dea4-4171-970b-a7aaa2f4fbd5', 5300000.00, 'CREDIT_CARD', 'COMPLETED', 'TXN20241020141501', 'Payment for Order #650e8400-2', '2024-10-20 14:20:00', '2024-10-20 14:25:00'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '8497bf87-dea4-4171-970b-a7aaa2f4fbd5', 7500000.00, 'DEBIT_CARD', 'COMPLETED', 'TXN20241101080001', 'Payment for Order #650e8400-3', '2024-11-01 08:05:00', '2024-11-01 08:10:00');
