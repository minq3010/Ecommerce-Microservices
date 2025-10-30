import React, { useState } from 'react';
import { Layout, Button, Badge, Dropdown, Space, Tooltip, Avatar, message } from 'antd';
import { ShoppingCartOutlined, LoginOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../store';

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const { cart } = useCartStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    message.success('Logged out successfully');
    navigate('/');
  };

  const cartCount = cart?.items?.length || 0;
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const userMenu = [
    {
      key: 'profile',
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'orders',
      label: 'My Orders',
      onClick: () => navigate('/orders'),
    },
    ...(isAdmin ? [
      { type: 'divider' },
      {
        key: 'admin',
        label: '📊 Admin Dashboard',
        onClick: () => navigate('/admin/dashboard'),
      },
      {
        key: 'admin-products',
        label: '📦 Manage Products',
        onClick: () => navigate('/admin/products'),
      },
      {
        key: 'admin-orders',
        label: '📋 Manage Orders',
        onClick: () => navigate('/admin/orders'),
      },
    ] : []),
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        height: 64,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onClick={() => navigate('/')}
      >
        <span>🛍️</span>
        <span>ShopHub</span>
      </div>

      {/* Right Section */}
      <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
        {/* Cart Button */}
        <Tooltip title="Shopping Cart">
          <Button
            type="text"
            icon={<ShoppingCartOutlined style={{ fontSize: '18px' }} />}
            onClick={() => navigate('/cart')}
            style={{ color: 'white', fontSize: '16px' }}
          >
            <Badge count={cartCount} offset={[-5, 5]}>
              Cart
            </Badge>
          </Button>
        </Tooltip>

        {/* Auth Buttons */}
        {token ? (
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <Button type="text" style={{ color: 'white', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar 
                style={{ backgroundColor: '#87d068' }} 
                icon={<UserOutlined />}
                size={32}
              />
              <span>{user?.username}</span>
            </Button>
          </Dropdown>
        ) : (
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={() => navigate('/login')}
            style={{ background: '#fff', color: '#667eea', fontWeight: 'bold' }}
          >
            Login
          </Button>
        )}
      </Space>
    </Header>
  );
};

export default AppHeader;
