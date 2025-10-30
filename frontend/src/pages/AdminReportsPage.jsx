import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Select, Button, Space, DatePicker, Tabs, Empty, message } from 'antd';
import { LineChartOutlined, BarChartOutlined, DownloadOutlined, ReloadOutlined, FileTextOutlined } from '@ant-design/icons';
import AdminLayout from '../layout/AdminLayout';

const AdminReportsPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 1250,
    totalRevenue: 85430,
    avgOrderValue: 68.34,
    conversionRate: 3.2,
    orderGrowth: 12.5,
    revenueGrowth: 18.3,
    newCustomers: 156,
    repeatCustomers: 89
  });

  const [monthlyData, setMonthlyData] = useState([
    { month: 'Oct 1', orders: 45, revenue: 3200, customers: 12 },
    { month: 'Oct 5', orders: 52, revenue: 3800, customers: 15 },
    { month: 'Oct 10', orders: 48, revenue: 3500, customers: 14 },
    { month: 'Oct 15', orders: 61, revenue: 4400, customers: 18 },
    { month: 'Oct 20', orders: 58, revenue: 4100, customers: 17 },
    { month: 'Oct 25', orders: 72, revenue: 5200, customers: 21 },
    { month: 'Oct 30', orders: 68, revenue: 4900, customers: 20 }
  ]);

  const [topProducts, setTopProducts] = useState([
    { id: 1, name: 'Wireless Laptop', sales: 245, revenue: 24500, growth: 15 },
    { id: 2, name: 'USB-C Cable', sales: 892, revenue: 4460, growth: 8 },
    { id: 3, name: 'Phone Case', sales: 634, revenue: 6340, growth: 22 },
    { id: 4, name: 'Screen Protector', sales: 512, revenue: 2560, growth: -5 },
    { id: 5, name: 'Charging Cable', sales: 678, revenue: 3390, growth: 12 }
  ]);

  const [categoryData, setCategoryData] = useState([
    { category: 'Electronics', sales: 8500, orders: 250, avgPrice: 34 },
    { category: 'Clothing', sales: 6200, orders: 420, avgPrice: 14.76 },
    { category: 'Books', sales: 4100, orders: 180, avgPrice: 22.78 },
    { category: 'Home & Garden', sales: 5400, orders: 140, avgPrice: 38.57 },
    { category: 'Sports', sales: 3200, orders: 95, avgPrice: 33.68 }
  ]);

  const handleExport = () => {
    message.success('Report exported as CSV!');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Data refreshed!');
    }, 1000);
  };

  const topProductsColumns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Sales',
      dataIndex: 'sales',
      key: 'sales',
      align: 'center',
      render: (val) => <span style={{ fontWeight: 'bold' }}>{val}</span>
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'center',
      render: (val) => <span style={{ color: '#52c41a', fontWeight: 'bold' }}>${val}</span>
    },
    {
      title: 'Growth',
      dataIndex: 'growth',
      key: 'growth',
      align: 'center',
      render: (val) => (
        <span style={{ color: val > 0 ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
          {val > 0 ? '↑' : '↓'} {Math.abs(val)}%
        </span>
      )
    }
  ];

  const categoryColumns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Revenue',
      dataIndex: 'sales',
      key: 'sales',
      align: 'center',
      render: (val) => <span style={{ color: '#667eea', fontWeight: 'bold' }}>${val}</span>
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
      align: 'center'
    },
    {
      title: 'Avg Price',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      align: 'center',
      render: (val) => `$${val.toFixed(2)}`
    }
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              <FileTextOutlined style={{ marginRight: '12px', color: '#667eea' }} />
              Analytics & Reports
            </h1>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Business intelligence and performance metrics
            </p>
          </div>
          <Space>
            <Select
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '150px' }}
              options={[
                { label: 'Last 7 Days', value: 'week' },
                { label: 'Last Month', value: 'month' },
                { label: 'Last Quarter', value: 'quarter' },
                { label: 'Last Year', value: 'year' }
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} />
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
              Export
            </Button>
          </Space>
        </div>

        {/* Key Metrics */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="Total Orders"
                value={stats.totalOrders}
                suffix={`(+${stats.orderGrowth}%)`}
                valueStyle={{ color: '#667eea', fontSize: '28px', fontWeight: 'bold' }}
                suffixStyle={{ color: '#52c41a', fontSize: '14px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="Total Revenue"
                value={stats.totalRevenue}
                prefix="$"
                suffix={`(+${stats.revenueGrowth}%)`}
                valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
                suffixStyle={{ color: '#52c41a', fontSize: '14px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="Avg Order Value"
                value={stats.avgOrderValue}
                prefix="$"
                valueStyle={{ color: '#faad14', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="Conversion Rate"
                value={stats.conversionRate}
                suffix="%"
                valueStyle={{ color: '#ff7a45', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} lg={12}>
            <Card
              title="Revenue Trend"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}
            >
              <div style={{ height: '300px', backgroundColor: '#fafafa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#999' }}>
                  <LineChartOutlined style={{ fontSize: '48px', marginBottom: '12px', color: '#667eea' }} />
                  <p>Revenue chart would display here</p>
                  <small style={{ color: '#ccc' }}>Last {dateRange === 'week' ? '7 days' : dateRange === 'month' ? '30 days' : dateRange === 'quarter' ? '90 days' : '365 days'}</small>
                </div>
              </div>
              <div style={{ marginTop: '16px', fontSize: '12px', color: '#999' }}>
                <div>Sample data: Daily revenue ranging from $3,200 to $5,200</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title="Orders By Category"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}
            >
              <div style={{ height: '300px', backgroundColor: '#fafafa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#999' }}>
                  <BarChartOutlined style={{ fontSize: '48px', marginBottom: '12px', color: '#667eea' }} />
                  <p>Orders chart would display here</p>
                  <small style={{ color: '#ccc' }}>Distribution by product category</small>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Tabs Section */}
        <Tabs
          items={[
            {
              key: 'products',
              label: '📊 Top Products',
              children: (
                <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                  <Table
                    columns={topProductsColumns}
                    dataSource={topProducts}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    bordered
                  />
                </Card>
              )
            },
            {
              key: 'categories',
              label: '📂 Sales by Category',
              children: (
                <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                  <Table
                    columns={categoryColumns}
                    dataSource={categoryData}
                    rowKey="category"
                    pagination={false}
                    bordered
                  />
                </Card>
              )
            },
            {
              key: 'customers',
              label: '👥 Customer Metrics',
              children: (
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Card>
                      <Statistic
                        title="New Customers"
                        value={stats.newCustomers}
                        valueStyle={{ color: '#667eea', fontSize: '28px', fontWeight: 'bold' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card>
                      <Statistic
                        title="Repeat Customers"
                        value={stats.repeatCustomers}
                        suffix={`(${(stats.repeatCustomers / (stats.newCustomers + stats.repeatCustomers) * 100).toFixed(1)}%)`}
                        valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
                      />
                    </Card>
                  </Col>
                </Row>
              )
            }
          ]}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
