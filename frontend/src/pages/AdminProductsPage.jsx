import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Popconfirm, Card, Row, Col, Statistic, Badge, Empty, Tooltip, Tabs, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { apiClient } from '../redux/apiClient';
import AdminLayout from '../layout/AdminLayout';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [pagination.page, pagination.size]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      if (response.data.success) {
        const data = response.data.data || [];
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Helper function to get image source with fallback
  const getImageSrc = (imageUrl, productId) => {
    if (!imageUrl || failedImages.has(productId)) {
      return 'https://via.placeholder.com/80?text=No+Image';
    }
    return imageUrl;
  };

  // Handle image load error
  const handleImageError = (productId) => {
    setFailedImages(prev => new Set(prev).add(productId));
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/products?page=${pagination.page}&size=${pagination.size}`
      );
      // Reset failed images when fetching new products
      setFailedImages(new Set());
      
      if (response.data.success) {
        const content = response.data.data?.content || [];
        setProducts(Array.isArray(content) ? content : []);
        setPagination(prev => ({
          ...prev,
          total: response.data.data?.totalElements || 0
        }));
      }
    } catch (error) {
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      // If editing, transform category object to categoryId for form
      const formValues = {
        ...product,
        categoryId: product.category?.id || product.categoryId
      };
      form.setFieldsValue(formValues);
    } else {
      setEditingProduct(null);
      form.resetFields();
    }
    setVisible(true);
  };

  const handleSave = async (values) => {
    try {
      if (editingProduct) {
        await apiClient.put(
          `/products/${editingProduct.id}`,
          values
        );
        message.success('Product updated successfully!');
      } else {
        await apiClient.post(
          `/products`,
          values
        );
        message.success('Product created successfully!');
      }
      setVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/products/${id}`);
      message.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const columns = [
    {
      title: '📷 Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (imageUrl, record) => (
        <img 
          src={getImageSrc(imageUrl, record.id)} 
          alt="product" 
          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
          onError={() => handleImageError(record.id)}
        />
      ),
    },
    {
      title: '🛍️ Product Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '🏷️ Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 120,
    },
    {
      title: '💰 Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => {
        const formatted = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0
        }).format(price);
        return <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{formatted}</span>;
      },
    },
    {
      title: ' Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      render: (stock) => (
        <Badge 
          count={stock} 
          style={{ 
            backgroundColor: stock > 0 ? '#52c41a' : '#ff4d4f',
            color: '#fff'
          }} 
        />
      ),
    },
    {
      title: '⭐ Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 80,
      render: (rating) => <span>{rating ? `⭐ ${rating.toFixed(1)}` : 'N/A'}</span>,
    },
    {
      title: '✅ Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge 
          status={status === 'ACTIVE' ? 'success' : 'error'} 
          text={status} 
        />
      ),
    },
    {
      title: '⚙️ Actions',
      key: 'action',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Product">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleShowModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Product?"
            description="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

  return (
    <AdminLayout>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
            <Statistic
              title="Total Products"
              value={products.length}
              prefix="📦"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
            <Statistic
              title="Total Stock"
              value={totalStock}
              prefix="📊"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
            <Statistic
              title="Inventory Value"
              value={totalValue}
              prefix="Đ"
              precision={0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>
            📦 Product Management
          </div>
        }
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => handleShowModal()}
              size="large"
            >
              Add New Product
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => fetchProducts()}
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
          dataSource={products}
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
            emptyText: <Empty description="No products found" />
          }}
          size="middle"
        />
      </Card>

      <Modal
        title={<h2>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h2>}
        open={visible}
        onOk={() => form.submit()}
        onCancel={() => {
          setVisible(false);
          setEditingProduct(null);
        }}
        okText={editingProduct ? 'Update' : 'Create'}
        cancelText="Cancel"
        width={700}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSave}
          autoComplete="off"
        >
          <Form.Item 
            name="name" 
            label="Product Name" 
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="e.g., iPhone 15 Pro" size="large" />
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={3} placeholder="Product description..." />
          </Form.Item>

          <Form.Item 
            name="categoryId" 
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category" size="large">
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="price" 
            label="Price" 
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber 
              min={0} 
              step={1000} 
              style={{ width: '100%' }} 
              size="large"
              prefix="Đ"
              formatter={(value) => {
                if (!value) return '';
                return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              }}
              parser={(value) => {
                return parseInt(value?.replace(/\./g, '') || 0);
              }}
              placeholder="e.g., 1.000.000"
            />
          </Form.Item>

          <Form.Item 
            name="stock" 
            label="Stock Quantity" 
            rules={[{ required: true, message: 'Please enter stock quantity' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} size="large" />
          </Form.Item>

          <Form.Item 
            name="imageUrl" 
            label="Image URL"
            rules={[{ required: true, message: 'Please enter image URL' }]}
          >
            <Input placeholder="https://example.com/image.jpg" size="large" />
          </Form.Item>

          <Form.Item 
            name="active" 
            label="Active"
            initialValue={true}
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;
