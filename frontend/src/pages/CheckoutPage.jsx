import React, { useState } from 'react';
import { Form, Input, Button, Card, Row, Col, Select, Steps, message, Spin, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { apiClient } from '../redux/apiClient';
import { formatVND } from '../utils/formatters';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const { items: cart } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    message.error('Please login first');
    navigate('/login');
    return null;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    message.error('Cart is empty');
    navigate('/');
    return null;
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
  const tax = Number((subtotal * 0.1).toFixed(2));
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleShippingSubmit = (values) => {
    setCurrent(1);
  };

  const handlePaymentSubmit = async (values) => {
    setLoading(true);
    try {
      // Create order
      const orderData = {
        items: cart,
        shippingCost: shipping,
        taxAmount: tax,
        shippingAddress: form.getFieldValue('address'),
        phoneNumber: form.getFieldValue('phone'),
        notes: form.getFieldValue('notes'),
      };

      const orderResponse = await apiClient.post(
        '/orders',
        orderData
      );

      if (orderResponse.data.success) {
        const orderId = orderResponse.data.data.id;

        // Create payment
        const paymentResponse = await apiClient.post(
          '/payments',
          {
            orderId: orderId,
            amount: total,
            paymentMethod: values.paymentMethod,
          }
        );

        if (paymentResponse.data.success) {
          const paymentId = paymentResponse.data.data.id;

          // Process payment
          await apiClient.post(
            `/payments/${paymentId}/process`,
            {}
          );

          message.success('Order placed successfully!');
          dispatch(clearCart());
          navigate(`/orders`);
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Shipping',
      content: 'Shipping Information',
    },
    {
      title: 'Payment',
      content: 'Payment Details',
    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>
        💳 Checkout
      </h1>

      <Row gutter={[24, 24]}>
        {/* Checkout Form */}
        <Col xs={24} lg={16}>
          <Card>
            <Steps current={current} items={steps} style={{ marginBottom: '30px' }} />

            <Form
              form={form}
              layout="vertical"
              onFinish={current === 0 ? handleShippingSubmit : handlePaymentSubmit}
            >
              {current === 0 && (
                <>
                  {/* Shipping Information */}
                  <div>
                    <h3 style={{ marginBottom: '20px', fontWeight: 'bold' }}>Shipping Information</h3>

                    <Form.Item
                      name="address"
                      label="Shipping Address"
                      rules={[{ required: true, message: 'Please enter shipping address' }]}
                    >
                      <Input.TextArea rows={3} placeholder="Enter your full address" />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      rules={[{ required: true, message: 'Please enter phone number' }]}
                    >
                      <Input placeholder="e.g. +1-234-567-8900" />
                    </Form.Item>

                    <Form.Item
                      name="notes"
                      label="Special Instructions (Optional)"
                    >
                      <Input.TextArea rows={2} placeholder="Any special instructions for delivery?" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block size="large">
                      Continue to Payment
                    </Button>
                  </div>
                </>
              )}

              {current === 1 && (
                <>
                  {/* Payment Information */}
                  <div>
                    <h3 style={{ marginBottom: '20px', fontWeight: 'bold' }}>Payment Method</h3>

                    <Form.Item
                      name="paymentMethod"
                      label="Select Payment Method"
                      rules={[{ required: true, message: 'Please select payment method' }]}
                    >
                      <Select
                        placeholder="Choose payment method"
                        options={[
                          { label: '💳 Credit Card', value: 'CREDIT_CARD' },
                          { label: '🏦 Debit Card', value: 'DEBIT_CARD' },
                          { label: '🅿️ PayPal', value: 'PAYPAL' },
                        ]}
                      />
                    </Form.Item>

                    <Divider />

                    <div style={{ marginTop: '20px' }}>
                      <Button onClick={() => setCurrent(0)} style={{ marginRight: '8px' }}>
                        Back
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ background: '#52c41a', borderColor: '#52c41a' }}
                      >
                        Place Order
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Form>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <Card
            title="Order Summary"
            style={{
              position: 'sticky',
              top: 80,
            }}
          >
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {cart.items.map((item) => (
                <div key={item.productId} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{item.productName}</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {formatVND(Number(item.price || 0) * item.quantity)}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {item.quantity} × {formatVND(Number(item.price || 0))}
                  </div>
                </div>
              ))}
            </div>

            <Divider />

            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <span>{formatVND(subtotal)}</span>
            </div>

            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax (10%):</span>
              <span>{formatVND(tax)}</span>
            </div>

            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping:</span>
              <span>{shipping === 0 ? '🎉 FREE' : formatVND(shipping)}</span>
            </div>

            <Divider />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#ff4d4f',
            }}>
              <span>Total:</span>
              <span>{formatVND(total)}</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
