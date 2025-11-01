-- Insert Sample Payments (for payment-service database)
-- These should match with orders from order-service
INSERT INTO payments (id, order_id, user_id, amount, payment_method, status, transaction_id, description, created_at, updated_at)
VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '8497bf87-dea4-4171-970b-a7aaa2f4fbd5', 2658000.00, 'VNPAY', 'COMPLETED', 'TXN20241015103001', 'Payment for Order #650e8400', '2024-10-15 10:35:00', '2024-10-15 10:40:00'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '8497bf87-dea4-4171-970b-a7aaa2f4fbd5', 5300000.00, 'CREDIT_CARD', 'COMPLETED', 'TXN20241020141501', 'Payment for Order #650e8400-2', '2024-10-20 14:20:00', '2024-10-20 14:25:00'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '8497bf87-dea4-4171-970b-a7aaa2f4fbd5', 7500000.00, 'DEBIT_CARD', 'COMPLETED', 'TXN20241101080001', 'Payment for Order #650e8400-3', '2024-11-01 08:05:00', '2024-11-01 08:10:00'),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', '8497bf87-dea4-4171-970b-a7aaa2f4fbd5', 1200000.00, 'VNPAY', 'PENDING', NULL, 'Payment pending for Order #650e8400-4', '2024-11-01 15:50:00', '2024-11-01 15:50:00');
