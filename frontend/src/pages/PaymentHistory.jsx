import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Statistic, Button, Space, Tag, Empty, Drawer, Descriptions, message, Spin, Modal } from 'antd';
import { ReloadOutlined, EyeOutlined, UndoOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { apiClient } from '../redux/apiClient';
import { formatVND } from '../utils/formatters';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });
  const [statistics, setStatistics] = useState({
    totalPayments: 0,
    completedCount: 0,
    failedCount: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, [pagination.page, pagination.size]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/payments?page=${pagination.page}&size=${pagination.size}`
      );

      if (response.data.success) {
        const data = response.data.data;
        setPayments(data.content || []);
        setPagination(prev => ({
          ...prev,
          total: data.totalElements || 0
        }));

        // Calculate statistics
        if (data.content && data.content.length > 0) {
          const completed = data.content.filter(p => p.status === 'COMPLETED').length;
          const failed = data.content.filter(p => p.status === 'FAILED').length;
          const total = data.content.reduce((sum, p) => sum + (p.amount || 0), 0);

          setStatistics({
            totalPayments: data.totalElements || 0,
            completedCount: completed,
            failedCount: failed,
            totalAmount: total,
          });
        }
      }
    } catch (error) {
      message.error('Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayment = (record) => {
    setSelectedPayment(record);
    setDrawerVisible(true);
  };

  const handleRetryPayment = async (paymentId) => {
    try {
      await apiClient.post(`/payments/${paymentId}/retry`);
      message.success('Payment retry initiated');
      fetchPayments();
    } catch (error) {
      message.error('Failed to retry payment');
    }
  };

  const handleRefundPayment = async (paymentId) => {
    Modal.confirm({
      title: 'Request Refund',
      content: 'Are you sure you want to request a refund for this payment?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await apiClient.post(`/payments/${paymentId}/refund`);
          message.success('Refund requested successfully');
          fetchPayments();
          setDrawerVisible(false);
        } catch (error) {
          message.error('Failed to request refund');
        }
      },
    });
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
      render: (id) => <code style={{ fontSize: 11 }}>{id?.substring(0, 12)}...</code>,
    },
    {
      title: '📋 Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
      ellipsis: true,
      render: (id) => <code style={{ fontSize: 11 }}>{id?.substring(0, 12)}...</code>,
    },
    {
      title: '💰 Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount) => <strong>{formatVND(amount)}</strong>,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '💳 Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 110,
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
      title: '📅 Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    },
    {
      title: '⚙️ Actions',
      key: 'actions',
      width: 150,
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
            <Button
              danger
              size="small"
              onClick={() => handleRefundPayment(record.id)}
            >
              Refund
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* Statistics */}
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
              title="✅ Successful"
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
              title="💰 Total Paid"
              value={statistics.totalAmount}
              formatter={(value) => formatVND(value)}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Payments Table */}
      <Card
        title="💳 Payment History"
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchPayments}
            loading={loading}
          >
            Refresh
          </Button>
        }
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
            scroll={{ x: 1000 }}
            bordered
            rowKey="id"
          />
        )}
      </Card>

      {/* Payment Details Drawer */}
      <Drawer
        title="💳 Payment Details"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        {selectedPayment && (
          <>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Payment ID">
                {selectedPayment.id}
              </Descriptions.Item>
              <Descriptions.Item label="Order ID">
                {selectedPayment.orderId}
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                <strong className="text-success">{formatVND(selectedPayment.amount)}</strong>
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
                <code style={{ fontSize: '12px' }}>{selectedPayment.transactionId}</code>
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
                {selectedPayment.status === 'FAILED' && (
                  <Button
                    type="primary"
                    onClick={() => handleRetryPayment(selectedPayment.id)}
                  >
                    Retry Payment
                  </Button>
                )}
                {selectedPayment.status === 'COMPLETED' && (
                  <Button
                    danger
                    onClick={() => handleRefundPayment(selectedPayment.id)}
                  >
                    Request Refund
                  </Button>
                )}
              </Space>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default PaymentHistory;
