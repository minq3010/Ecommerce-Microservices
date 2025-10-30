import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Card, Row, Col, message, Spin, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { login, setLoading, setError } from '../redux/slices/authSlice';
import { loginUser } from '../services/authService';
import { apiClient } from '../redux/apiClient';
import '../styles/login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  const [form] = Form.useForm();
  const [isRegister, setIsRegister] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values) => {
    dispatch(setLoading(true));
    try {
      const { user, token } = await loginUser(values.email, values.password);
      dispatch(login({ user, token }));
      
      // Fetch full user data from /me to get complete roles
      try {
        const meResponse = await apiClient.get('/users/me');
        if (meResponse.data.success) {
          const updatedUser = meResponse.data.data;
          dispatch(login({ user: updatedUser, token }));
          console.log('✅ User data updated with roles from /me:', updatedUser.roles);
        }
      } catch (meError) {
        console.warn('Failed to fetch user profile from /me, using initial user data');
      }
      
      message.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Login failed';
      dispatch(setError(errorMessage));
      message.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRegister = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    dispatch(setLoading(true));
    try {
      const { user, token } = await loginUser(values.email, values.password);
      dispatch(login({ user, token }));
      
      // Fetch full user data from /me to get complete roles
      try {
        const meResponse = await apiClient.get('/users/me');
        if (meResponse.data.success) {
          const updatedUser = meResponse.data.data;
          dispatch(login({ user: updatedUser, token }));
          console.log('✅ User data updated with roles from /me:', updatedUser.roles);
        }
      } catch (meError) {
        console.warn('Failed to fetch user profile from /me, using initial user data');
      }
      
      message.success('Registration successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Registration failed';
      dispatch(setError(errorMessage));
      message.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loginFormLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  return (
    <div className="login-container">
      <Row justify="center" align="middle" style={{ minHeight: '100vh', width: '100%' }}>
        <Col xs={22} sm={20} md={10} lg={8} xl={6}>
          <Card
            className="login-card"
            title={
              <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 600 }}>
                ECommerce Admin
              </div>
            }
            bordered={false}
          >
            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: '12px',
                  marginBottom: '16px',
                  backgroundColor: '#fff1f0',
                  border: '1px solid #ffccc7',
                  borderRadius: '4px',
                  color: '#cf1322',
                }}
              >
                {error}
              </div>
            )}

            {/* Login / Register toggle (compact) */}
            <div style={{ marginBottom: '12px', textAlign: 'center' }}>
              <Space split={<span style={{ color: '#e6e6e6' }}>|</span>}>
                <a
                  href="#login"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsRegister(false);
                    form.resetFields();
                  }}
                  style={{ fontWeight: !isRegister ? 600 : 400 }}
                >
                  Login
                </a>
                <a
                  href="#register"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsRegister(true);
                    form.resetFields();
                  }}
                  style={{ fontWeight: isRegister ? 600 : 400 }}
                >
                  Register
                </a>
              </Space>
            </div>

            {/* Login Form */}
            {!isRegister ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleLogin}
                {...loginFormLayout}
              >
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Invalid email format' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Enter your email"
                    size="large"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please enter your password' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                    size="large"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <a href="#forgot">Forgot password?</a>
                </div>
              </Form>
            ) : (
              /* Register Form */
              <Form
                form={form}
                layout="vertical"
                onFinish={handleRegister}
                {...loginFormLayout}
              >
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your full name"
                    size="large"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Invalid email format' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Enter your email"
                    size="large"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please enter your password' },
                    { min: 6, message: 'Password must be at least 6 characters' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter password (min 6 characters)"
                    size="large"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  rules={[{ required: true, message: 'Please confirm your password' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Confirm your password"
                    size="large"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </Button>
                </Form.Item>
              </Form>
            )}

            {/* Demo Credentials */}
            <div style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '20px' }}>
              <p style={{ marginBottom: '4px' }}>📝 Demo Credentials:</p>
              <p style={{ marginBottom: '4px' }}>Email: admin@example.com</p>
              <p>Password: password123</p>
            </div>
          </Card>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '24px', color: '#666' }}>
            <p>© 2024 ECommerce Platform. All rights reserved.</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
