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
            {/* Removed - showing only login form */}

            {/* Login Form */}
            {true ? (
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
            ) : null}

            {/* Demo Credentials */}
            <div style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '20px' }}>
              <p style={{ marginBottom: '4px' }}>📝 Demo Credentials:</p>
              <p style={{ marginBottom: '4px' }}>Email: root@nnson128.io.vn</p>
              <p>Password: root@nnson128.io.vn</p>
            </div>
          </Card>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '24px', color: '#666' }}>
            <p>© {new Date().getFullYear()} ECommerce Platform. All rights reserved.</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
