import React, { useState } from 'react';
import { Card, Form, Input, Select, Switch, Button, Tabs, Row, Col, Divider, message, Space, InputNumber, Tooltip } from 'antd';
import { SaveOutlined, ReloadOutlined, SettingOutlined, ShopOutlined, BankOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';
import AdminLayout from '../layout/AdminLayout';

const AdminSettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'ECommerce Store',
    storeUrl: 'https://store.example.com',
    storeEmail: 'support@example.com',
    storePhone: '+1-800-123-4567',
    currency: 'USD',
    timezone: 'UTC',
    language: 'en',
    description: 'Your awesome ecommerce store'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeKey: 'pk_live_xxxxx',
    paypalEmail: 'business@paypal.com',
    enableStripe: true,
    enablePaypal: true,
    enableCreditCard: true
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@example.com',
    smtpPassword: '••••••••',
    enableEmailNotifications: true,
    enableOrderNotifications: true,
    enableCustomerNotifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    enableSSL: true,
    sessionTimeout: 30,
    passwordMinLength: 8,
    enableAPIKey: true,
    enableRateLimiting: true
  });

  const handleSaveStore = async (values) => {
    setLoading(true);
    try {
      setTimeout(() => {
        setStoreSettings(values);
        message.success('Store settings saved successfully!');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Failed to save settings');
      setLoading(false);
    }
  };

  const handleSavePayment = async (values) => {
    setLoading(true);
    try {
      setTimeout(() => {
        setPaymentSettings(values);
        message.success('Payment settings saved successfully!');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Failed to save settings');
      setLoading(false);
    }
  };

  const handleSaveEmail = async (values) => {
    setLoading(true);
    try {
      setTimeout(() => {
        setEmailSettings(values);
        message.success('Email settings saved successfully!');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Failed to save settings');
      setLoading(false);
    }
  };

  const handleSaveSecurity = async (values) => {
    setLoading(true);
    try {
      setTimeout(() => {
        setSecuritySettings(values);
        message.success('Security settings saved successfully!');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Failed to save settings');
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info('Form reset');
  };

  const storeForm = (
    <Form
      form={form}
      layout="vertical"
      initialValues={storeSettings}
      onFinish={handleSaveStore}
    >
      <Form.Item
        label="Store Name"
        name="storeName"
        rules={[{ required: true, message: 'Please enter store name' }]}
      >
        <Input placeholder="Your store name" size="large" />
      </Form.Item>

      <Form.Item
        label="Store URL"
        name="storeUrl"
        rules={[{ required: true, type: 'url', message: 'Please enter valid URL' }]}
      >
        <Input placeholder="https://store.example.com" size="large" />
      </Form.Item>

      <Form.Item
        label="Support Email"
        name="storeEmail"
        rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}
      >
        <Input placeholder="support@example.com" size="large" />
      </Form.Item>

      <Form.Item
        label="Support Phone"
        name="storePhone"
        rules={[{ required: true }]}
      >
        <Input placeholder="+1-800-123-4567" size="large" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Currency"
            name="currency"
            rules={[{ required: true }]}
          >
            <Select size="large">
              <Select.Option value="USD">USD ($)</Select.Option>
              <Select.Option value="EUR">EUR (€)</Select.Option>
              <Select.Option value="GBP">GBP (£)</Select.Option>
              <Select.Option value="VND">VND (₫)</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Timezone"
            name="timezone"
            rules={[{ required: true }]}
          >
            <Select size="large">
              <Select.Option value="UTC">UTC</Select.Option>
              <Select.Option value="EST">EST (UTC-5)</Select.Option>
              <Select.Option value="PST">PST (UTC-8)</Select.Option>
              <Select.Option value="JST">JST (UTC+9)</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Language"
        name="language"
        rules={[{ required: true }]}
      >
        <Select size="large">
          <Select.Option value="en">English</Select.Option>
          <Select.Option value="vi">Tiếng Việt</Select.Option>
          <Select.Option value="es">Español</Select.Option>
          <Select.Option value="fr">Français</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Store Description"
        name="description"
      >
        <Input.TextArea placeholder="Describe your store..." rows={4} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large">
            Save Settings
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset} size="large">
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const paymentForm = (
    <Form
      layout="vertical"
      initialValues={paymentSettings}
      onFinish={handleSavePayment}
    >
      <Form.Item label="Payment Methods">
        <Card style={{ backgroundColor: '#fafafa', borderRadius: '8px' }}>
          <Form.Item
            label="Enable Stripe"
            name="enableStripe"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="Stripe API Key"
            name="stripeKey"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="pk_live_..." size="large" />
          </Form.Item>

          <Divider />

          <Form.Item
            label="Enable PayPal"
            name="enablePaypal"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="PayPal Business Email"
            name="paypalEmail"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder="business@paypal.com" size="large" />
          </Form.Item>

          <Divider />

          <Form.Item
            label="Enable Credit Card Payments"
            name="enableCreditCard"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Card>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large">
            Save Payment Settings
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const emailForm = (
    <Form
      layout="vertical"
      initialValues={emailSettings}
      onFinish={handleSaveEmail}
    >
      <Form.Item
        label="SMTP Host"
        name="smtpHost"
        rules={[{ required: true }]}
      >
        <Input placeholder="smtp.gmail.com" size="large" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="SMTP Port"
            name="smtpPort"
            rules={[{ required: true }]}
          >
            <InputNumber placeholder="587" size="large" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="SMTP User"
            name="smtpUser"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder="noreply@example.com" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="SMTP Password"
        name="smtpPassword"
        rules={[{ required: true }]}
      >
        <Input.Password placeholder="••••••••" size="large" />
      </Form.Item>

      <Divider>Notification Settings</Divider>

      <Form.Item
        label="Enable Email Notifications"
        name="enableEmailNotifications"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Send Order Notifications"
        name="enableOrderNotifications"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Send Customer Notifications"
        name="enableCustomerNotifications"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large">
            Save Email Settings
          </Button>
          <Button ghost onClick={() => message.info('Test email sent!')}>
            Send Test Email
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const securityForm = (
    <Form
      layout="vertical"
      initialValues={securitySettings}
      onFinish={handleSaveSecurity}
    >
      <Form.Item
        label="Enable Two-Factor Authentication"
        name="enableTwoFactor"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Enable SSL/HTTPS"
        name="enableSSL"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Session Timeout (minutes)"
            name="sessionTimeout"
            rules={[{ required: true }]}
          >
            <InputNumber placeholder="30" size="large" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Password Min Length"
            name="passwordMinLength"
            rules={[{ required: true }]}
          >
            <InputNumber placeholder="8" size="large" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Enable API Key Authentication"
        name="enableAPIKey"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Enable Rate Limiting"
        name="enableRateLimiting"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large">
            Save Security Settings
          </Button>
          <Tooltip title="Regenerate API keys and reset security settings">
            <Button danger ghost>
              Reset Security
            </Button>
          </Tooltip>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <AdminLayout>
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
            <SettingOutlined style={{ marginRight: '12px', color: '#667eea' }} />
            System Settings
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Configure your store settings, payments, emails, and security options
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          items={[
            {
              key: 'store',
              label: <span><ShopOutlined /> Store Settings</span>,
              children: (
                <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  {storeForm}
                </Card>
              )
            },
            {
              key: 'payment',
              label: <span><BankOutlined /> Payment Methods</span>,
              children: (
                <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  {paymentForm}
                </Card>
              )
            },
            {
              key: 'email',
              label: <span><BellOutlined /> Email Configuration</span>,
              children: (
                <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  {emailForm}
                </Card>
              )
            },
            {
              key: 'security',
              label: <span><LockOutlined /> Security</span>,
              children: (
                <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  {securityForm}
                </Card>
              )
            }
          ]}
          style={{ marginTop: '16px' }}
        />

        {/* Info Box */}
        <Card
          style={{
            marginTop: '24px',
            backgroundColor: '#e6f7ff',
            borderRadius: '8px',
            borderLeft: '4px solid #1890ff'
          }}
        >
          <p style={{ fontSize: '14px', color: '#0050b3', marginBottom: '8px' }}>
            <strong>💡 Tip:</strong> Save your settings frequently to ensure they are persisted.
          </p>
          <p style={{ fontSize: '14px', color: '#0050b3', marginBottom: '0' }}>
            For security reasons, sensitive information like API keys and passwords are encrypted and not displayed in full.
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
