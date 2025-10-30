import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, message, Space, Tag, Card, Row, Col, Statistic, Empty, Tooltip, Drawer, Descriptions, Badge } from 'antd';
import { FilterOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { apiClient } from '../redux/apiClient';
import AdminLayout from '../layout/AdminLayout';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, pagination.page, pagination.size]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let endpoint;
      if (filterStatus) {
        endpoint = `/orders/admin/status/${filterStatus}`;
      } else {
        endpoint = `/orders/admin/all?page=${pagination.page}&size=${pagination.size}`;
      }
      
      const response = await apiClient.get(endpoint);
      
      if (response.data.success) {
        const data = response.data.data;
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.content) {
          setOrders(data.content);
          setPagination(prev => ({
            ...prev,
            total: data.totalElements
          }));
        }
      }
    } catch (error) {
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiClient.put(
        `/orders/${orderId}/status?status=${newStatus}`,
        {}
      );
      message.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      message.error('Failed to update order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'processing',
      'CONFIRMED': 'processing',
      'SHIPPED': 'warning',
      'DELIVERED': 'success',
      'CANCELLED': 'error'
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'COMPLETED': 'success',
      'PENDING': 'processing',
      'FAILED': 'error'
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: '📋 Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      ellipsis: true,
      render: (id) => <code style={{ fontSize: 11 }}>{id.substring(0, 12)}...</code>,
    },
    {
      title: '👤 User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '💰 Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 100,
      render: (price) => <span style={{ fontWeight: 'bold', color: '#52c41a' }}>Đ{price.toFixed(0)}</span>,
    },
    {
      title: '📦 Items',
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 70,
      render: (count) => <Badge count={count} style={{ backgroundColor: '#1890ff' }} />,
    },
    {
      title: '📊 Order Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 130 }}
          size="small"
        >
          <Select.Option value="PENDING">⏳ Pending</Select.Option>
          <Select.Option value="CONFIRMED">✅ Confirmed</Select.Option>
          <Select.Option value="SHIPPED">📦 Shipped</Select.Option>
          <Select.Option value="DELIVERED">🚚 Delivered</Select.Option>
          <Select.Option value="CANCELLED">❌ Cancelled</Select.Option>
        </Select>
      ),
    },
    {
      title: '💳 Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 130,
      render: (status) => <Tag color={getPaymentStatusColor(status)}>{status}</Tag>,
    },
    {
      title: '📅 Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: '⚙️ Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setDrawerVisible(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice || 0), 0);
  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED').length;
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;

  return (
    <AdminLayout>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 24, fontSize: 28 }}>📋 Order Management System</h1>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix="📦"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
            <Statistic
              title="Confirmed"
              value={confirmedOrders}
              prefix="✅"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
            <Statistic
              title="Delivered"
              value={deliveredOrders}
              prefix="🚚"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix="Đ"
              precision={0}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>📊 All Orders</div>}
        extra={
          <Space>
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              allowClear
              onChange={setFilterStatus}
              size="large"
            >
              <Select.Option value="PENDING">⏳ Pending</Select.Option>
              <Select.Option value="CONFIRMED">✅ Confirmed</Select.Option>
              <Select.Option value="SHIPPED">📦 Shipped</Select.Option>
              <Select.Option value="DELIVERED">🚚 Delivered</Select.Option>
              <Select.Option value="CANCELLED">❌ Cancelled</Select.Option>
            </Select>
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => fetchOrders()}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        }
        style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}
      >
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page + 1,
            pageSize: pagination.size,
            total: pagination.total,
            onChange: (page, size) => setPagination({ page: page - 1, size, total: pagination.total }),
          }}
          scroll={{ x: 1400 }}
          locale={{
            emptyText: <Empty description="No orders found" />
          }}
          size="middle"
        />
      </Card>

      <Drawer
        title={<h2>📦 Order Details</h2>}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        {selectedOrder && (
          <>
            <Descriptions bordered column={1} size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="Order ID">
                <code>{selectedOrder.id}</code>
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                {selectedOrder.userId}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Price">
                <span style={{ fontSize: 16, fontWeight: 'bold', color: '#52c41a' }}>
                  Đ{selectedOrder.totalPrice.toFixed(0)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Shipping Cost">
                Đ{selectedOrder.shippingCost?.toFixed(0) || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Tax Amount">
                Đ{selectedOrder.taxAmount?.toFixed(0) || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Number of Items">
                {selectedOrder.itemCount}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping Address">
                {selectedOrder.shippingAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                {selectedOrder.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginBottom: 20 }}>
              <h3>📋 Order Items</h3>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <div style={{ background: '#fafafa', padding: 12, borderRadius: 4 }}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
                      <div><strong>{item.productName}</strong></div>
                      <div>Quantity: {item.quantity}</div>
                      <div>Price: Đ{item.price.toFixed(0)}</div>
                      <div>Subtotal: <span style={{ color: '#52c41a', fontWeight: 'bold' }}>Đ{item.subtotal.toFixed(0)}</span></div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description="No items" />
              )}
            </div>

            {selectedOrder.notes && (
              <div>
                <h3>📝 Notes</h3>
                <p style={{ background: '#fafafa', padding: 12, borderRadius: 4 }}>
                  {selectedOrder.notes}
                </p>
              </div>
            )}
          </>
        )}
      </Drawer>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
