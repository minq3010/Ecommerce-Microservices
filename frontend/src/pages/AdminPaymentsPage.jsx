import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Space, Tag, Card, Row, Col, Statistic, Empty, Drawer, Descriptions, Select, Popconfirm } from 'antd';
import { ReloadOutlined, EyeOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined, UndoOutlined } from '@ant-design/icons';
import { apiClient } from '../redux/apiClient';
import AdminLayout from '../layout/AdminLayout';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });

  useEffect(() => {
    fetchPayments();
    fetchStatistics();
    fetchRevenueData();
  }, [filterStatus, pagination.page, pagination.size]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let endpoint;
      if (filterStatus) {
        endpoint = `/payments/admin/status/${filterStatus}`;
      } else {
        endpoint = `/payments/admin/all?page=${pagination.page}&size=${pagination.size}`;
      }

      const response = await apiClient.get(endpoint);

      if (response.data.success) {
        const data = response.data.data;
        if (data.content) {
          setPayments(data.content);
          setPagination(prev => ({
            ...prev,
            total: data.totalElements
          }));
        } else if (Array.isArray(data)) {
          setPayments(data);
        }
      }
    } catch (error) {
      message.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await apiClient.get('/payments/admin/statistics');
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch statistics');
    }
  };

  const fetchRevenueData = async () => {
    try {
      const response = await apiClient.get('/payments/admin/revenue/by-method');
      if (response.data.success) {
        setRevenueData(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch revenue data');
    }
  };

  const handleViewPayment = (record) => {
    setSelectedPayment(record);
    setDrawerVisible(true);
  };

  const handleProcessPayment = async (paymentId) => {
    try {
      await apiClient.post(`/payments/${paymentId}/process`);
      message.success('Payment processed successfully');
      fetchPayments();
      fetchStatistics();
    } catch (error) {
      message.error('Failed to process payment');
    }
  };

  const handleRefundPayment = async (paymentId) => {
    try {
      await apiClient.post(`/payments/${paymentId}/refund`);
      message.success('Payment refunded successfully');
      fetchPayments();
      fetchStatistics();
    } catch (error) {
      message.error('Failed to refund payment');
    }
  };

  const handleRetryPayment = async (paymentId) => {
    try {
      await apiClient.post(`/payments/${paymentId}/retry`);
      message.success('Payment retry initiated successfully');
      fetchPayments();
      fetchStatistics();
    } catch (error) {
      message.error('Failed to retry payment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'processing',
      'COMPLETED': 'success',
      'FAILED': 'error',
      'REFUNDED': 'warning'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'FAILED':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      case 'REFUNDED':
        return <UndoOutlined style={{ color: '#faad14' }} />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: '💳 Payment ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      ellipsis: true,
      render: (id) => <code style={{ fontSize: 11 }}>{id.substring(0, 12)}...</code>,
    },
    {
      title: '📋 Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
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
      title: '💰 Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount) => <strong>${amount?.toFixed(2)}</strong>,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '💳 Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (method) => <Tag color="blue">{method}</Tag>,
    },
    {
      title: '📊 Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Space>
          {getStatusIcon(status)}
          <Tag color={getStatusColor(status)}>{status}</Tag>
        </Space>
      ),
    },
    {
      title: '🔍 Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 120,
      ellipsis: true,
      render: (id) => <code style={{ fontSize: 10 }}>{id?.substring(0, 10)}...</code>,
    },
    {
      title: '⚙️ Actions',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewPayment(record)}
          >
            View
          </Button>
          {record.status === 'PENDING' && (
            <Button
              type="success"
              size="small"
              onClick={() => handleProcessPayment(record.id)}
            >
              Process
            </Button>
          )}
          {record.status === 'FAILED' && (
            <Button
              type="warning"
              size="small"
              onClick={() => handleRetryPayment(record.id)}
            >
              Retry
            </Button>
          )}
          {record.status === 'COMPLETED' && (
            <Popconfirm
              title="Refund Payment"
              description="Are you sure you want to refund this payment?"
              onConfirm={() => handleRefundPayment(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger size="small">Refund</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '20px' }}>
        {/* Stats Cards */}
        {statistics && (
          <Row gutter={16} style={{ marginBottom: '20px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="💳 Total Payments"
                  value={statistics.totalPayments}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="✅ Completed"
                  value={statistics.completedCount}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="❌ Failed"
                  value={statistics.failedCount}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="💰 Total Amount"
                  value={`$${statistics.totalAmount?.toFixed(2)}`}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="💵 Completed Amount"
                  value={`$${statistics.completedAmount?.toFixed(2)}`}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="📈 Success Rate"
                  value={`${statistics.successRate?.toFixed(1)}%`}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Revenue by Payment Method */}
        {revenueData.length > 0 && (
          <Card
            title="💰 Revenue by Payment Method"
            style={{ marginBottom: '20px' }}
          >
            <Table
              dataSource={revenueData}
              columns={[
                {
                  title: 'Payment Method',
                  dataIndex: 'paymentMethod',
                  key: 'paymentMethod',
                  render: (method) => <Tag color="blue">{method}</Tag>,
                },
                {
                  title: 'Revenue',
                  dataIndex: 'revenue',
                  key: 'revenue',
                  render: (revenue) => <strong>${revenue?.toFixed(2)}</strong>,
                  sorter: (a, b) => a.revenue - b.revenue,
                },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        )}

        {/* Payments Table */}
        <Card
          title="💳 All Payments"
          extra={
            <Space>
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 150 }}
                options={[
                  { label: 'PENDING', value: 'PENDING' },
                  { label: 'COMPLETED', value: 'COMPLETED' },
                  { label: 'FAILED', value: 'FAILED' },
                  { label: 'REFUNDED', value: 'REFUNDED' },
                ]}
                onChange={(value) => {
                  setFilterStatus(value);
                  setPagination({ ...pagination, page: 0 });
                }}
              />
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => {
                  fetchPayments();
                  fetchStatistics();
                  fetchRevenueData();
                }}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          }
          style={{ marginBottom: '20px' }}
        >
          {payments.length === 0 ? (
            <Empty description="No payments found" />
          ) : (
            <Table
              columns={columns}
              dataSource={payments}
              loading={loading}
              pagination={{
                pageSize: pagination.size,
                total: pagination.total,
                current: pagination.page + 1,
                onChange: (page) => setPagination({ ...pagination, page: page - 1 }),
                showSizeChanger: true,
                onShowSizeChange: (current, size) => setPagination({ ...pagination, size }),
              }}
              scroll={{ x: 1200 }}
              bordered
              rowKey="id"
            />
          )}
        </Card>
      </div>

      {/* Payment Details Drawer */}
      <Drawer
        title="💳 Payment Details"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={600}
      >
        {selectedPayment && (
          <>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Payment ID">{selectedPayment.id}</Descriptions.Item>
              <Descriptions.Item label="Order ID">{selectedPayment.orderId}</Descriptions.Item>
              <Descriptions.Item label="User ID">{selectedPayment.userId}</Descriptions.Item>
              <Descriptions.Item label="Amount">
                <strong className="text-success">${selectedPayment.amount?.toFixed(2)}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                <Tag color="blue">{selectedPayment.paymentMethod}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Space>
                  {getStatusIcon(selectedPayment.status)}
                  <Tag color={getStatusColor(selectedPayment.status)}>
                    {selectedPayment.status}
                  </Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Transaction ID">
                <code>{selectedPayment.transactionId}</code>
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedPayment.description || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(selectedPayment.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {new Date(selectedPayment.updatedAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            {/* Action Buttons */}
            <div style={{ marginTop: '20px' }}>
              <Space>
                {selectedPayment.status === 'PENDING' && (
                  <Button
                    type="primary"
                    onClick={() => handleProcessPayment(selectedPayment.id)}
                  >
                    Process Payment
                  </Button>
                )}
                {selectedPayment.status === 'FAILED' && (
                  <Button
                    type="warning"
                    onClick={() => handleRetryPayment(selectedPayment.id)}
                  >
                    Retry Payment
                  </Button>
                )}
                {selectedPayment.status === 'COMPLETED' && (
                  <Button
                    danger
                    onClick={() => {
                      Modal.confirm({
                        title: 'Refund Payment',
                        content: 'Are you sure you want to refund this payment?',
                        okText: 'Yes',
                        cancelText: 'No',
                        onOk: () => handleRefundPayment(selectedPayment.id),
                      });
                    }}
                  >
                    Refund Payment
                  </Button>
                )}
              </Space>
            </div>
          </>
        )}
      </Drawer>
    </AdminLayout>
  );
};

export default AdminPaymentsPage;
