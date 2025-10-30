import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Space, Popconfirm, Card, Row, Col, Statistic, Empty, Tooltip, Spin, Tag, DatePicker, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined, GiftOutlined, CopyOutlined } from '@ant-design/icons';
import AdminLayout from '../layout/AdminLayout';
import dayjs from 'dayjs';

const AdminPromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, used: 0, totalSavings: 0 });
  const [activeTab, setActiveTab] = useState('coupons');

  useEffect(() => {
    fetchPromotions();
    fetchStats();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const mockPromotions = [
        {
          id: '1',
          code: 'SUMMER2024',
          type: 'PERCENTAGE',
          discount: 20,
          description: 'Summer Sale 20% off',
          startDate: '2024-10-01',
          endDate: '2024-12-31',
          usageLimit: 1000,
          usageCount: 345,
          minPurchase: 50,
          maxDiscount: 500,
          status: 'active',
          createdAt: '2024-10-01T10:00:00Z'
        },
        {
          id: '2',
          code: 'WELCOME50',
          type: 'FIXED',
          discount: 50,
          description: 'Welcome discount $50 off on first order',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          usageLimit: 500,
          usageCount: 150,
          minPurchase: 200,
          maxDiscount: null,
          status: 'active',
          createdAt: '2024-01-01T10:00:00Z'
        },
        {
          id: '3',
          code: 'FLASH10',
          type: 'PERCENTAGE',
          discount: 10,
          description: 'Flash sale 10% off',
          startDate: '2024-10-15',
          endDate: '2024-10-30',
          usageLimit: 2000,
          usageCount: 1890,
          minPurchase: 0,
          maxDiscount: null,
          status: 'active',
          createdAt: '2024-10-15T10:00:00Z'
        },
        {
          id: '4',
          code: 'EXPIRED99',
          type: 'PERCENTAGE',
          discount: 25,
          description: 'Past promotion',
          startDate: '2024-09-01',
          endDate: '2024-09-30',
          usageLimit: 1000,
          usageCount: 1000,
          minPurchase: 0,
          maxDiscount: null,
          status: 'expired',
          createdAt: '2024-09-01T10:00:00Z'
        },
        {
          id: '5',
          code: 'BLACKFRIDAY',
          type: 'PERCENTAGE',
          discount: 30,
          description: 'Black Friday 30% off everything',
          startDate: '2024-11-29',
          endDate: '2024-12-02',
          usageLimit: 5000,
          usageCount: 0,
          minPurchase: 100,
          maxDiscount: 1000,
          status: 'scheduled',
          createdAt: '2024-10-30T10:00:00Z'
        }
      ];
      setPromotions(mockPromotions);
    } catch (error) {
      message.error('Failed to fetch promotions');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStats({
        total: 5,
        active: 3,
        used: 2385,
        totalSavings: 125430
      });
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleShowModal = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      form.setFieldsValue({
        ...promo,
        startDate: dayjs(promo.startDate),
        endDate: dayjs(promo.endDate)
      });
    } else {
      setEditingPromo(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSave = async (values) => {
    try {
      if (editingPromo) {
        const newPromotions = promotions.map(p =>
          p.id === editingPromo.id ? { ...p, ...values, startDate: values.startDate.format('YYYY-MM-DD'), endDate: values.endDate.format('YYYY-MM-DD') } : p
        );
        setPromotions(newPromotions);
        message.success('Promotion updated successfully!');
      } else {
        const newPromo = {
          id: Date.now().toString(),
          ...values,
          startDate: values.startDate.format('YYYY-MM-DD'),
          endDate: values.endDate.format('YYYY-MM-DD'),
          usageCount: 0,
          status: 'active',
          createdAt: new Date().toISOString()
        };
        setPromotions([...promotions, newPromo]);
        message.success('Promotion created successfully!');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingPromo(null);
      fetchStats();
    } catch (error) {
      message.error(error.message || 'Failed to save promotion');
    }
  };

  const handleDelete = async (promoId) => {
    try {
      const newPromotions = promotions.filter(p => p.id !== promoId);
      setPromotions(newPromotions);
      message.success('Promotion deleted successfully!');
      fetchStats();
    } catch (error) {
      message.error('Failed to delete promotion');
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    message.success(`Code "${code}" copied to clipboard!`);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredPromotions = promotions.filter(promo =>
    promo.code.toLowerCase().includes(searchText.toLowerCase()) ||
    promo.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      'active': 'green',
      'expired': 'red',
      'scheduled': 'blue'
    };
    return colors[status] || 'default';
  };

  const getDiscountDisplay = (type, discount) => {
    return type === 'PERCENTAGE' ? `${discount}%` : `$${discount}`;
  };

  const columns = [
    {
      title: 'Coupon Code',
      dataIndex: 'code',
      key: 'code',
      width: '15%',
      render: (text) => (
        <Space>
          <span style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: 'monospace' }}>
            {text}
          </span>
          <Tooltip title="Copy code">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(text)}
            />
          </Tooltip>
        </Space>
      ),
      sorter: (a, b) => a.code.localeCompare(b.code)
    },
    {
      title: 'Discount',
      dataIndex: ['type', 'discount'],
      key: 'discount',
      width: '12%',
      render: (_, record) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a', fontSize: '16px' }}>
          {getDiscountDisplay(record.type, record.discount)}
        </span>
      ),
      sorter: (a, b) => a.discount - b.discount
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip title={description}>{description}</Tooltip>
      ),
    },
    {
      title: 'Usage',
      dataIndex: ['usageCount', 'usageLimit'],
      key: 'usage',
      width: '12%',
      render: (_, record) => (
        <Tooltip title={`${record.usageCount} / ${record.usageLimit} used`}>
          <div style={{ fontSize: '12px' }}>
            <div>{record.usageCount} / {record.usageLimit}</div>
            <div style={{ width: '100px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
              <div
                style={{
                  width: `${(record.usageCount / record.usageLimit * 100)}%`,
                  backgroundColor: record.usageCount / record.usageLimit > 0.8 ? '#ff4d4f' : '#52c41a',
                  height: '4px',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Valid Period',
      dataIndex: 'startDate',
      key: 'period',
      width: '15%',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>{record.startDate}</div>
          <div style={{ color: '#999' }}>to {record.endDate}</div>
        </div>
      ),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleShowModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Promotion"
            description="Are you sure to delete this promotion?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
            <GiftOutlined style={{ marginRight: '12px', color: '#667eea' }} />
            Promotions & Coupons
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Create and manage discount codes, promotional campaigns, and special offers
          </p>
        </div>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Promotions"
                value={stats.total}
                prefix={<GiftOutlined />}
                valueStyle={{ color: '#667eea', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active"
                value={stats.active}
                suffix={`of ${stats.total}`}
                valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Used"
                value={stats.used}
                suffix="times"
                valueStyle={{ color: '#faad14', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Savings"
                value={(stats.totalSavings / 1000).toFixed(0)}
                suffix="K"
                prefix="$"
                valueStyle={{ color: '#ff7a45', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Controls */}
        <Card style={{ marginBottom: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Input.Search
                placeholder="Search by code or description..."
                prefix={<SearchOutlined />}
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                size="large"
                allowClear
                style={{ borderRadius: '6px' }}
              />
            </Col>
            <Col>
              <Space>
                <Tooltip title="Refresh">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchPromotions}
                    loading={loading}
                    size="large"
                  />
                </Tooltip>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleShowModal()}
                  size="large"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}
                >
                  Create Promotion
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Card
          style={{
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          <Spin spinning={loading}>
            {filteredPromotions.length > 0 ? (
              <Table
                columns={columns}
                dataSource={filteredPromotions}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} promotions`,
                  pageSizeOptions: ['5', '10', '20', '50']
                }}
                bordered
                size="middle"
              />
            ) : (
              <Empty description="No promotions found" style={{ padding: '50px 0' }} />
            )}
          </Spin>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        title={editingPromo ? 'Edit Promotion' : 'Create New Promotion'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingPromo(null);
        }}
        onOk={() => form.submit()}
        width={700}
        okText={editingPromo ? 'Update' : 'Create'}
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            label="Coupon Code"
            name="code"
            rules={[
              { required: true, message: 'Please enter coupon code' },
              { min: 3, message: 'Code must be at least 3 characters' }
            ]}
          >
            <Input placeholder="e.g., SUMMER2024" size="large" disabled={!!editingPromo} style={{ fontFamily: 'monospace' }} />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea placeholder="Describe this promotion..." rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Discount Type"
                name="type"
                rules={[{ required: true }]}
              >
                <Select size="large" placeholder="Select type">
                  <Select.Option value="PERCENTAGE">Percentage (%)</Select.Option>
                  <Select.Option value="FIXED">Fixed Amount ($)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Discount Value"
                name="discount"
                rules={[{ required: true, message: 'Please enter discount value' }]}
              >
                <InputNumber size="large" placeholder="0" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true }]}
              >
                <DatePicker size="large" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End Date"
                name="endDate"
                rules={[{ required: true }]}
              >
                <DatePicker size="large" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Usage Limit"
                name="usageLimit"
                rules={[{ required: true }]}
              >
                <InputNumber size="large" placeholder="0" min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Min Purchase"
                name="minPurchase"
              >
                <InputNumber size="large" placeholder="0" min={0} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminPromotionsPage;
