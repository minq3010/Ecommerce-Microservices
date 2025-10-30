import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Modal, Empty, Spin, message, Space, Statistic, Row, Col } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuthStore } from '../store';

const OrdersPage = () => {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/orders?page=0&size=100', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.success) {
        const data = response.data.data.content || response.data.data;
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      message.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    Modal.confirm({
      title: 'Cancel Order',
      content: 'Are you sure you want to cancel this order?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`/api/v1/orders/${orderId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          message.success('Order cancelled successfully');
          fetchOrders();
        } catch (error) {
          message.error('Failed to cancel order');
        }
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'blue',
      'CONFIRMED': 'cyan',
      'SHIPPED': 'purple',
      'DELIVERED': 'green',
      'CANCELLED': 'red',
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'PENDING': 'orange',
      'COMPLETED': 'green',
      'FAILED': 'red',
      'REFUNDED': 'purple',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{id.substring(0, 8)}...</span>,
      width: 100,
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => <span style={{ fontWeight: 'bold', color: '#ff4d4f' }}>${Number(price || 0).toFixed(2)}</span>,
      width: 100,
    },
    {
      title: 'Items',
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 60,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      width: 100,
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => <Tag color={getPaymentStatusColor(status)}>{status}</Tag>,
      width: 100,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      width: 100,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setModalVisible(true);
            }}
          >
            View
          </Button>
          {record.status === 'PENDING' && (
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleCancelOrder(record.id)}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
      width: 150,
    },
  ];

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
    deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
  };

  if (!token) {
    return (
      <Empty 
        description="Please login to view your orders"
      />
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        📦 My Orders
      </h1>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              valueStyle={{ color: '#667eea' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Spent"
              value={stats.totalSpent}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Delivered"
              value={stats.deliveredOrders}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pendingOrders}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Orders Table */}
      <Card title="Order History">
        <Spin spinning={loading}>
          {orders.length === 0 ? (
            <Empty description="No orders yet" />
          ) : (
            <Table
              columns={columns}
              dataSource={orders.map((order, idx) => ({
                ...order,
                key: order.id || idx,
              }))}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
              bordered
            />
          )}
        </Spin>
      </Card>

      {/* Order Details Modal */}
      <Modal
        title="Order Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedOrder && (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col xs={24} sm={12}>
                <div>
                  <p style={{ color: '#999', marginBottom: '4px' }}>Order ID</p>
                  <p style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{selectedOrder.id}</p>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <p style={{ color: '#999', marginBottom: '4px' }}>Order Date</p>
                  <p style={{ fontWeight: 'bold' }}>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </Col>
            </Row>

            <h4 style={{ marginBottom: '12px', fontWeight: 'bold' }}>Status</h4>
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={12}>
                <div>
                  <p style={{ color: '#999', marginBottom: '4px' }}>Order Status</p>
                  <Tag color={getStatusColor(selectedOrder.status)} style={{ fontSize: '12px' }}>
                    {selectedOrder.status}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <p style={{ color: '#999', marginBottom: '4px' }}>Payment Status</p>
                  <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)} style={{ fontSize: '12px' }}>
                    {selectedOrder.paymentStatus}
                  </Tag>
                </div>
              </Col>
            </Row>

            <h4 style={{ marginBottom: '12px', fontWeight: 'bold' }}>Items</h4>
            {selectedOrder.items?.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>{item.productName}</span>
                  <span style={{ fontWeight: 'bold' }}>${Number(item.subtotal || 0).toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {item.quantity} × ${Number(item.price || 0).toFixed(2)}
                </div>
              </div>
            ))}

            <h4 style={{ marginBottom: '12px', fontWeight: 'bold' }}>Shipping Information</h4>
            <p>{selectedOrder.shippingAddress}</p>
            <p>Phone: {selectedOrder.phoneNumber}</p>
            {selectedOrder.notes && <p>Notes: {selectedOrder.notes}</p>}

            <h4 style={{ marginBottom: '12px', fontWeight: 'bold' }}>Total</h4>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <span>${(Number(selectedOrder.totalPrice || 0) - Number(selectedOrder.taxAmount || 0) - Number(selectedOrder.shippingCost || 0)).toFixed(2)}</span>
            </div>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax:</span>
              <span>${Number(selectedOrder.taxAmount || 0).toFixed(2)}</span>
            </div>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping:</span>
              <span>${Number(selectedOrder.shippingCost || 0).toFixed(2)}</span>
            </div>
            <div style={{ paddingTop: '12px', borderTop: '2px solid #eee', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span style={{ color: '#ff4d4f' }}>${Number(selectedOrder.totalPrice || 0).toFixed(2)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
