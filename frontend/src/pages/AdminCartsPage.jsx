import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Space, Tag, Card, Row, Col, Statistic, Empty, Drawer, Descriptions, Image, InputNumber, Popconfirm } from 'antd';
import { DeleteOutlined, EyeOutlined, ReloadOutlined, ClearOutlined } from '@ant-design/icons';
import { apiClient } from '../redux/apiClient';
import AdminLayout from '../layout/AdminLayout';

const AdminCartsPage = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchAllCarts();
  }, []);

  // Get all carts from all users
  const fetchAllCarts = async () => {
    setLoading(true);
    try {
      // First get all users, then fetch their carts
      const usersResponse = await apiClient.get('/users?page=0&size=100');
      if (usersResponse.data.success) {
        const users = usersResponse.data.data.content || usersResponse.data.data || [];
        
        // Fetch carts for each user using admin endpoint
        const cartPromises = users.map(user =>
          apiClient.get(`/carts/admin/${user.id}`)
            .then(res => ({
              userId: user.id,
              userName: `${user.firstname || ''} ${user.lastname || ''}`,
              userEmail: user.email,
              ...res.data.data,
              key: user.id
            }))
            .catch(() => ({
              userId: user.id,
              userName: `${user.firstname || ''} ${user.lastname || ''}`,
              userEmail: user.email,
              items: [],
              totalPrice: 0,
              totalItems: 0,
              key: user.id
            }))
        );

        const cartResults = await Promise.all(cartPromises);
        // Show all carts (including empty ones)
        setCarts(cartResults.filter(c => c !== null));
      }
    } catch (error) {
      message.error('Failed to fetch carts');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCart = (record) => {
    setSelectedCart(record);
    setDrawerVisible(true);
  };

  const handleRemoveItem = async (userId, productId) => {
    try {
      await apiClient.delete(`/carts/admin/${userId}/items/${productId}`);
      message.success('Item removed successfully');
      fetchAllCarts();
    } catch (error) {
      message.error('Failed to remove item');
    }
  };

  const handleClearCart = async (userId) => {
    try {
      await apiClient.delete(`/carts/admin/${userId}`);
      message.success('Cart cleared successfully');
      fetchAllCarts();
    } catch (error) {
      message.error('Failed to clear cart');
    }
  };

  const handleUpdateQuantity = async () => {
    if (!editingItem || !selectedCart) return;
    try {
      await apiClient.put(
        `/carts/admin/${selectedCart.userId}/items/${editingItem.productId}?quantity=${editQuantity}`
      );
      message.success('Item quantity updated successfully');
      fetchAllCarts();
      setModalVisible(false);
      setEditingItem(null);
    } catch (error) {
      message.error('Failed to update quantity');
    }
  };

  // Items column for nested table
  const itemColumns = [
    {
      title: '📷 Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (url) => (
        url ? <Image src={url} width={50} height={50} style={{ objectFit: 'cover' }} /> : <span>N/A</span>
      ),
    },
    {
      title: '📦 Product Name',
      dataIndex: 'productName',
      key: 'productName',
      flex: 1,
      ellipsis: true,
    },
    {
      title: '💵 Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => <strong>${price?.toFixed(2)}</strong>,
    },
    {
      title: '📊 Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (qty) => <Tag color="blue">{qty}</Tag>,
    },
    {
      title: '💰 Subtotal',
      key: 'subtotal',
      width: 100,
      render: (_, record) => (
        <strong>${(record.price * record.quantity)?.toFixed(2)}</strong>
      ),
    },
    {
      title: '⚙️ Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setEditingItem(record);
              setEditQuantity(record.quantity);
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Remove Item"
            description="Are you sure you want to remove this item?"
            onConfirm={() => handleRemoveItem(selectedCart.userId, record.productId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columns = [
    {
      title: '👤 User Name',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: '📧 Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
      width: 200,
      ellipsis: true,
    },
    {
      title: '🛒 Items Count',
      key: 'itemsCount',
      width: 100,
      render: (_, record) => (
        <Tag color="processing">{record.totalItems || record.items?.length || 0}</Tag>
      ),
    },
    {
      title: '💰 Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      render: (price) => <strong className="text-success">${price?.toFixed(2)}</strong>,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: '🔍 Status',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Tag color={record.items && record.items.length > 0 ? 'processing' : 'default'}>
          {record.items && record.items.length > 0 ? 'Active' : 'Empty'}
        </Tag>
      ),
    },
    {
      title: '⚙️ Actions',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewCart(record)}
          >
            View
          </Button>
          <Popconfirm
            title="Clear Cart"
            description="Are you sure you want to clear this user's cart?"
            onConfirm={() => handleClearCart(record.userId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<ClearOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '20px' }}>
        {/* Stats Cards */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="🛒 Active Carts"
                value={carts.length}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="📦 Total Items"
                value={carts.reduce((sum, c) => sum + (c.totalItems || c.items?.length || 0), 0)}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="💰 Total Value"
                value={`$${carts.reduce((sum, c) => sum + (c.totalPrice || 0), 0).toFixed(2)}`}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="🔄 Avg Items/Cart"
                value={(carts.length > 0 ? carts.reduce((sum, c) => sum + (c.totalItems || c.items?.length || 0), 0) / carts.length : 0).toFixed(1)}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card
          title="🛍️ All User Carts"
          extra={
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={fetchAllCarts}
              loading={loading}
            >
              Refresh
            </Button>
          }
          style={{ marginBottom: '20px' }}
        >
          {carts.length === 0 ? (
            <Empty description="No active carts found" />
          ) : (
            <Table
              columns={columns}
              dataSource={carts}
              loading={loading}
              pagination={{ pageSize: 10, showSizeChanger: true }}
              scroll={{ x: 1000 }}
              bordered
            />
          )}
        </Card>
      </div>

      {/* Cart Details Drawer */}
      <Drawer
        title={`Cart Details - ${selectedCart?.userName}`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={700}
      >
        {selectedCart && (
          <>
            {/* User Info */}
            <Descriptions column={1} bordered style={{ marginBottom: '20px' }}>
              <Descriptions.Item label="User ID">{selectedCart.userId}</Descriptions.Item>
              <Descriptions.Item label="User Name">{selectedCart.userName}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedCart.userEmail}</Descriptions.Item>
              <Descriptions.Item label="Total Items">
                <Tag color="processing">{selectedCart.totalItems || selectedCart.items?.length || 0}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Price">
                <strong className="text-success">${selectedCart.totalPrice?.toFixed(2)}</strong>
              </Descriptions.Item>
            </Descriptions>

            {/* Cart Items Table */}
            <h3>📦 Cart Items</h3>
            {selectedCart.items && selectedCart.items.length > 0 ? (
              <Table
                columns={itemColumns}
                dataSource={selectedCart.items.map((item, idx) => ({ ...item, key: idx }))}
                pagination={false}
                size="small"
                bordered
              />
            ) : (
              <Empty description="No items in cart" />
            )}

            {/* Summary */}
            <Card style={{ marginTop: '20px', backgroundColor: '#f5f5f5' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Total Items"
                    value={selectedCart.totalItems || selectedCart.items?.length || 0}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Total Price"
                    value={`$${selectedCart.totalPrice?.toFixed(2)}`}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>
            </Card>
          </>
        )}
      </Drawer>

      {/* Edit Quantity Modal */}
      <Modal
        title={`Edit Quantity - ${editingItem?.productName}`}
        open={modalVisible}
        onOk={handleUpdateQuantity}
        onCancel={() => {
          setModalVisible(false);
          setEditingItem(null);
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <strong>Product:</strong> {editingItem?.productName}
          <br />
          <strong>Price:</strong> ${editingItem?.price?.toFixed(2)}
        </div>
        <div>
          <label>Quantity:</label>
          <InputNumber
            min={1}
            value={editQuantity}
            onChange={setEditQuantity}
            style={{ width: '100%', marginTop: '10px' }}
          />
          <div style={{ marginTop: '10px', color: '#999' }}>
            Subtotal: ${(editQuantity * (editingItem?.price || 0))?.toFixed(2)}
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCartsPage;
