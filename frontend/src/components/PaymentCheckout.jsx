import React, { useState } from 'react';
import { Form, Input, Button, Card, Row, Col, Select, message, Spin, Steps, Divider, Alert, Space } from 'antd';
import { ShoppingCartOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { apiClient } from '../redux/apiClient';

const PaymentCheckout = ({ orderId, totalAmount, onPaymentSuccess, onPaymentCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const paymentMethods = [
    { label: '💳 Credit Card', value: 'CREDIT_CARD' },
    { label: '💳 Debit Card', value: 'DEBIT_CARD' },
    { label: '🅿️ PayPal', value: 'PAYPAL' },
    { label: '🏦 Bank Transfer', value: 'BANK_TRANSFER' },
    { label: '📱 Mobile Wallet', value: 'MOBILE_WALLET' },
    { label: '🇻🇳 VNPay', value: 'VNPAY' },
  ];

  const handleCreatePayment = async (values) => {
    setLoading(true);
    try {
      const paymentRequest = {
        orderId: orderId,
        amount: totalAmount,
        paymentMethod: values.paymentMethod,
        description: values.description || `Payment for order ${orderId}`,
      };

      const response = await apiClient.post('/payments', paymentRequest);

      if (response.data.success) {
        const payment = response.data.data;
        setPaymentId(payment.id);
        setPaymentStatus('CREATED');
        setPaymentStep(1);
        message.success('Payment created successfully');
      }
    } catch (error) {
      message.error('Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/payments/${paymentId}/process`);

      if (response.data.success) {
        const payment = response.data.data;
        setPaymentStatus(payment.status);

        if (payment.status === 'COMPLETED') {
          setPaymentStep(2);
          message.success('Payment completed successfully! ✅');
          setTimeout(() => {
            if (onPaymentSuccess) {
              onPaymentSuccess(payment);
            }
          }, 2000);
        } else if (payment.status === 'FAILED') {
          message.error('Payment failed! Please try again.');
        }
      }
    } catch (error) {
      message.error('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/payments/${paymentId}/retry`);

      if (response.data.success) {
        setPaymentStatus('PENDING');
        setPaymentStep(1);
        message.success('Payment retry initiated');
      }
    } catch (error) {
      message.error('Failed to retry payment');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Payment Info',
      description: 'Enter payment details',
    },
    {
      title: 'Process Payment',
      description: 'Confirm and process',
    },
    {
      title: 'Success',
      description: 'Payment completed',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title={
          <Space>
            <CreditCardOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            <span>Payment Checkout</span>
          </Space>
        }
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        {/* Order Summary */}
        <Card
          type="inner"
          title="📋 Order Summary"
          style={{ marginBottom: '20px', backgroundColor: '#f5f5f5' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ color: '#999', marginBottom: '5px' }}>Order ID</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{orderId}</div>
            </Col>
            <Col span={12}>
              <div style={{ color: '#999', marginBottom: '5px' }}>Total Amount</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                ${totalAmount?.toFixed(2)}
              </div>
            </Col>
          </Row>
        </Card>

        {/* Steps */}
        <Steps current={paymentStep} items={steps} style={{ marginBottom: '30px' }} />

        {/* Step 0: Payment Info */}
        {paymentStep === 0 && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreatePayment}
            style={{ marginBottom: '20px' }}
          >
            <Form.Item
              label="Payment Method"
              name="paymentMethod"
              rules={[{ required: true, message: 'Please select payment method' }]}
            >
              <Select
                placeholder="Choose payment method"
                options={paymentMethods}
              />
            </Form.Item>

            <Form.Item
              label="Description (Optional)"
              name="description"
            >
              <Input.TextArea
                placeholder="Enter payment description"
                rows={3}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                Create Payment
              </Button>
              <Button
                style={{ width: '100%' }}
                onClick={onPaymentCancel}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* Step 1: Process Payment */}
        {paymentStep === 1 && (
          <div>
            <Alert
              message={`Payment Status: ${paymentStatus}`}
              type={paymentStatus === 'PENDING' ? 'warning' : paymentStatus === 'FAILED' ? 'error' : 'success'}
              showIcon
              style={{ marginBottom: '20px' }}
            />

            <Card
              type="inner"
              title="💳 Payment Details"
              style={{ marginBottom: '20px' }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ color: '#999', marginBottom: '5px' }}>Payment ID</div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    {paymentId?.substring(0, 20)}...
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ color: '#999', marginBottom: '5px' }}>Status</div>
                  <div>
                    <span style={{
                      padding: '5px 10px',
                      borderRadius: '4px',
                      backgroundColor: paymentStatus === 'PENDING' ? '#faad14' : paymentStatus === 'FAILED' ? '#ff7875' : '#95de64',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {paymentStatus}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card>

            <Divider />

            {paymentStatus === 'PENDING' && (
              <>
                <Alert
                  message="Please confirm to process the payment"
                  type="info"
                  showIcon
                  style={{ marginBottom: '20px' }}
                />
                <Space style={{ width: '100%', display: 'flex', gap: '10px' }}>
                  <Button
                    type="primary"
                    danger
                    style={{ flex: 1 }}
                    onClick={onPaymentCancel}
                  >
                    Cancel Payment
                  </Button>
                  <Button
                    type="primary"
                    loading={loading}
                    style={{ flex: 1 }}
                    onClick={handleProcessPayment}
                  >
                    Confirm & Process Payment
                  </Button>
                </Space>
              </>
            )}

            {paymentStatus === 'FAILED' && (
              <>
                <Alert
                  message="Payment processing failed"
                  description="Please try again or use a different payment method"
                  type="error"
                  showIcon
                  style={{ marginBottom: '20px' }}
                />
                <Space style={{ width: '100%', display: 'flex', gap: '10px' }}>
                  <Button
                    style={{ flex: 1 }}
                    onClick={onPaymentCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    loading={loading}
                    style={{ flex: 1 }}
                    onClick={handleRetryPayment}
                  >
                    Retry Payment
                  </Button>
                </Space>
              </>
            )}

            {paymentStatus === 'COMPLETED' && (
              <Alert
                message="Processing payment..."
                type="loading"
                showIcon
              />
            )}
          </div>
        )}

        {/* Step 2: Success */}
        {paymentStep === 2 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircleOutlined style={{ fontSize: '60px', color: '#52c41a', marginBottom: '20px' }} />
            <h2 style={{ color: '#52c41a', marginBottom: '10px' }}>Payment Successful! ✅</h2>
            <p style={{ color: '#999', marginBottom: '20px' }}>
              Your payment has been processed successfully.
            </p>
            <Card type="inner" style={{ backgroundColor: '#f5f5f5' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ color: '#999', marginBottom: '5px' }}>Amount Paid</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                    ${totalAmount?.toFixed(2)}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ color: '#999', marginBottom: '5px' }}>Payment ID</div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    {paymentId?.substring(0, 20)}...
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentCheckout;
