import React from 'react';
import { Layout } from 'antd';
import AppHeader from '../components/AppHeader';

const { Content, Footer } = Layout;

const AppLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />
      <Content 
        style={{ 
          flex: 1,
          padding: '40px 24px', 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: 'calc(100vh - 64px - 70px)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </div>
      </Content>
      <Footer 
        style={{ 
          textAlign: 'center', 
          background: '#1f1f1f',
          color: '#ffffff',
          padding: '20px 24px',
          marginTop: 'auto',
        }}
      >
        <div>© 2024 ShopHub. All rights reserved.</div>
        <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
          Premium E-Commerce Platform
        </div>
      </Footer>
    </Layout>
  );
};

export default AppLayout;
