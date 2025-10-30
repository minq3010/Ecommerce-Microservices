import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Empty, Spin, Progress, Divider } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, ShopOutlined, UserOutlined, TrophyOutlined, RiseOutlined } from '@ant-design/icons';
import { apiClient } from '../redux/apiClient';
import AdminLayout from '../layout/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all data for dashboard using apiClient (with token auto-injection)
      const [ordersRes, productsRes] = await Promise.all([
        apiClient.get('/orders/admin/all?page=0&size=1000')
          .catch(() => ({data:{data:{content:[]}}})),
        apiClient.get('/products?page=0&size=1000')
          .catch(() => ({data:{data:{content:[]}}})),
      ]);

      const orders = ordersRes.data.data?.content || ordersRes.data.data || [];
      const products = productsRes.data.data?.content || productsRes.data.data || [];

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.totalPrice || 0), 0);
      const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
      const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED').length;
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
      const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;

      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.status === 'ACTIVE').length;
      const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

      setStats({
        totalOrders,
        totalRevenue,
        completedOrders,
        confirmedOrders,
        pendingOrders,
        cancelledOrders,
        totalProducts,
        activeProducts,
        totalStock,
        recentOrders: orders.slice(0, 10),
        orders,
        products,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin style={{ display: 'block', textAlign: 'center', marginTop: 50 }} size="large" />;

  const orderColumns = [
    { title: '📋 Order ID', dataIndex: 'id', key: 'id', width: 120, ellipsis: true, render: (id) => <code style={{ fontSize: 11 }}>{id.substring(0, 12)}...</code> },
    { title: '👤 User', dataIndex: 'userId', key: 'userId', width: 100, ellipsis: true },
    { title: '💰 Total', dataIndex: 'totalPrice', key: 'totalPrice', render: (v) => <span style={{ color: '#52c41a', fontWeight: 'bold' }}>Đ{v.toFixed(0)}</span> },
    { title: '📊 Status', dataIndex: 'status', key: 'status', render: (status) => <span style={{ padding: '4px 8px', borderRadius: 4, background: status === 'DELIVERED' ? '#f6ffed' : '#e6f7ff', color: status === 'DELIVERED' ? '#52c41a' : '#1890ff' }}>{status}</span> },
    { title: '📅 Date', dataIndex: 'createdAt', key: 'createdAt', render: (d) => new Date(d).toLocaleDateString('vi-VN') },
  ];

  const completionRate = stats?.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0;

  return (
    <AdminLayout>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 24, fontSize: 32, fontWeight: 'bold' }}>
        🎯 Admin Dashboard
      </h1>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Statistic
              title={<span style={{ color: '#fff', fontSize: 12 }}>📦 Total Orders</span>}
              value={stats?.totalOrders || 0}
              valueStyle={{ color: '#fff', fontSize: 28 }}
              icon={<ShoppingCartOutlined style={{ color: '#fff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Statistic
              title={<span style={{ color: '#fff', fontSize: 12 }}>💰 Total Revenue</span>}
              value={stats?.totalRevenue || 0}
              prefix="Đ"
              precision={0}
              valueStyle={{ color: '#fff', fontSize: 28 }}
              icon={<DollarOutlined style={{ color: '#fff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Statistic
              title={<span style={{ color: '#fff', fontSize: 12 }}>📦 Total Products</span>}
              value={stats?.totalProducts || 0}
              valueStyle={{ color: '#fff', fontSize: 28 }}
              icon={<ShopOutlined style={{ color: '#fff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <Statistic
              title={<span style={{ color: '#fff', fontSize: 12 }}>✅ Completion Rate</span>}
              value={completionRate}
              suffix="%"
              valueStyle={{ color: '#fff', fontSize: 28 }}
              icon={<TrophyOutlined style={{ color: '#fff' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
            <Statistic
              title="✅ Delivered"
              value={stats?.completedOrders || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
            <Statistic
              title="🔄 Confirmed"
              value={stats?.confirmedOrders || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
            <Statistic
              title="⏳ Pending"
              value={stats?.pendingOrders || 0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
            <Statistic
              title="❌ Cancelled"
              value={stats?.cancelledOrders || 0}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card 
            title={<h3>📊 Order Status Distribution</h3>}
            style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}
          >
            <div style={{ paddingBottom: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>✅ Delivered</span>
                  <span>{stats?.completedOrders || 0}</span>
                </div>
                <Progress percent={stats?.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0} strokeColor="#52c41a" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>🔄 Confirmed</span>
                  <span>{stats?.confirmedOrders || 0}</span>
                </div>
                <Progress percent={stats?.totalOrders > 0 ? Math.round((stats.confirmedOrders / stats.totalOrders) * 100) : 0} strokeColor="#1890ff" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>⏳ Pending</span>
                  <span>{stats?.pendingOrders || 0}</span>
                </div>
                <Progress percent={stats?.totalOrders > 0 ? Math.round((stats.pendingOrders / stats.totalOrders) * 100) : 0} strokeColor="#faad14" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>❌ Cancelled</span>
                  <span>{stats?.cancelledOrders || 0}</span>
                </div>
                <Progress percent={stats?.totalOrders > 0 ? Math.round((stats.cancelledOrders / stats.totalOrders) * 100) : 0} strokeColor="#ff4d4f" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card 
            title={<h3>📦 Product Inventory</h3>}
            style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}
          >
            <div style={{ paddingBottom: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>📦 Total Products</span>
                  <span style={{ fontWeight: 'bold' }}>{stats?.totalProducts || 0}</span>
                </div>
                <Progress percent={100} strokeColor="#1890ff" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>✅ Active Products</span>
                  <span style={{ fontWeight: 'bold' }}>{stats?.activeProducts || 0}</span>
                </div>
                <Progress percent={stats?.totalProducts > 0 ? Math.round((stats.activeProducts / stats.totalProducts) * 100) : 0} strokeColor="#52c41a" />
              </div>
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>📊 Total Stock Units</span>
                <span style={{ fontWeight: 'bold', fontSize: 18, color: '#faad14' }}>{stats?.totalStock || 0}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card 
        title={<h3>📋 Recent Orders</h3>}
        style={{ marginTop: 24, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}
      >
        {stats?.recentOrders?.length ? (
          <Table
            columns={orderColumns}
            dataSource={stats.recentOrders}
            rowKey="id"
            pagination={false}
            scroll={{ x: 800 }}
            size="small"
          />
        ) : (
          <Empty description="No recent orders" />
        )}
      </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
