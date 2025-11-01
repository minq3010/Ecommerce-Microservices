import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined, FileTextOutlined, LogoutOutlined, UserOutlined, DashboardOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UnorderedListOutlined, GiftOutlined, BarChartOutlined, BookOutlined, SettingOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import '../styles/layout.css';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getSelectedKey = () => {
    if (location.pathname.includes('products')) return 'products';
    if (location.pathname.includes('categories')) return 'categories';
    if (location.pathname.includes('users')) return 'users';
    if (location.pathname.includes('orders')) return 'orders';
    if (location.pathname.includes('carts')) return 'carts';
    if (location.pathname.includes('payments')) return 'payments';
    if (location.pathname.includes('promotions')) return 'promotions';
    if (location.pathname.includes('reports')) return 'reports';
    if (location.pathname.includes('blog')) return 'blog';
    if (location.pathname.includes('settings')) return 'settings';
    return 'dashboard';
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined style={{ fontSize: '16px' }} />,
      label: 'Dashboard',
      onClick: () => navigate('/admin/dashboard'),
    },
    {
      type: 'divider',
    },
    {
      key: 'products',
      icon: <ShoppingOutlined style={{ fontSize: '16px' }} />,
      label: 'Products',
      onClick: () => navigate('/admin/products'),
    },
    {
      key: 'categories',
      icon: <UnorderedListOutlined style={{ fontSize: '16px' }} />,
      label: 'Categories',
      onClick: () => navigate('/admin/categories'),
    },
    {
      key: 'carts',
      icon: <ShoppingCartOutlined style={{ fontSize: '16px' }} />,
      label: 'Carts',
      onClick: () => navigate('/admin/carts'),
    },
    {
      key: 'orders',
      icon: <FileTextOutlined style={{ fontSize: '16px' }} />,
      label: 'Orders',
      onClick: () => navigate('/admin/orders'),
    },
    {
      key: 'payments',
      icon: <DollarOutlined style={{ fontSize: '16px' }} />,
      label: 'Payments',
      onClick: () => navigate('/admin/payments'),
    },
    {
      type: 'divider',
    },
    {
      key: 'users',
      icon: <UserOutlined style={{ fontSize: '16px' }} />,
      label: 'Users',
      onClick: () => navigate('/admin/users'),
    },
    {
      key: 'promotions',
      icon: <GiftOutlined style={{ fontSize: '16px' }} />,
      label: 'Voucher Management',
      onClick: () => navigate('/admin/promotions'),
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '18px',
              width: '44px',
              height: '44px',
              color: 'white',
              border: 'none',
            }}
          />
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '1px',
            }}
          >
            🛍️ ECommerce Admin
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer', color: 'white' }}>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
              <span>{user?.username || 'Admin'}</span>
            </Space>
          </Dropdown>
        </div>
      </Header>

      <Layout style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={220}
          style={{
            background: 'linear-gradient(180deg, #fff 0%, #fafafa 100%)',
            borderRight: '1px solid #f0f0f0',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div
            style={{
              padding: '20px 16px',
              textAlign: 'center',
              borderBottom: '2px solid #f0f0f0',
              marginBottom: '8px',
            }}
          >
            {!collapsed && (
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#667eea',
                  letterSpacing: '0.5px',
                }}
              >
                Main Menu
              </div>
            )}
          </div>
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
            }}
            theme="light"
          />
        </Sider>

        <Layout>
          <Content
            style={{
              margin: '24px',
              padding: '24px',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              overflow: 'auto',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
