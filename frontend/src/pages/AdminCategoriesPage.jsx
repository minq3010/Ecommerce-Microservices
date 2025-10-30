import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm, Card, Row, Col, Statistic, Empty, Tooltip, Tabs, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { apiClient } from '../redux/apiClient';
import AdminLayout from '../layout/AdminLayout';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // When categories are loaded, fetch products to count them
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [categories.length]);

  useEffect(() => {
    // Update stats whenever categories change
    fetchStats();
  }, [categories]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/categories');
      
      if (response.data.success) {
        const data = response.data.data || [];
        // Add productCount to each category (will be updated after products are fetched)
        const categoriesWithCount = Array.isArray(data) ? data.map(cat => ({
          ...cat,
          productCount: 0
        })) : [];
        setCategories(categoriesWithCount);
      }
    } catch (error) {
      message.error('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products?page=0&size=1000');
      
      if (response.data.success) {
        const productsData = response.data.data?.content || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
        
        // Update categories with product count
        setCategories(prevCategories => {
          return prevCategories.map(cat => {
            const count = productsData.filter(prod => prod.category?.id === cat.id).length;
            return {
              ...cat,
              productCount: count
            };
          });
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Calculate stats from actual categories
      if (categories.length > 0) {
        const total = categories.length;
        // All categories from backend are considered "active" by default
        const active = categories.length;
        setStats({
          total: total,
          active: active
        });
      } else {
        setStats({
          total: 0,
          active: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleShowModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue(category);
    } else {
      setEditingCategory(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSave = async (values) => {
    try {
      if (editingCategory) {
        // Update category
        await apiClient.put(
          `/categories/${editingCategory.id}`,
          values
        );
        message.success('Category updated successfully!');
      } else {
        // Create category
        await apiClient.post(
          '/categories',
          values
        );
        message.success('Category created successfully!');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
      fetchCategories();
      fetchProducts();
      fetchStats();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await apiClient.delete(`/categories/${categoryId}`);
      message.success('Category deleted successfully!');
      fetchCategories();
      fetchProducts();
      fetchStats();
    } catch (error) {
      message.error('Failed to delete category');
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase()) ||
    category.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      render: (text) => <strong>{text}</strong>,
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '35%',
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: 'Products',
      dataIndex: 'productCount',
      key: 'productCount',
      width: '12%',
      align: 'center',
      render: (count) => (
        <span style={{ backgroundColor: '#e6f7ff', padding: '4px 8px', borderRadius: '4px' }}>
          {count ?? 0} items
        </span>
      ),
      sorter: (a, b) => (a.productCount ?? 0) - (b.productCount ?? 0)
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '18%',
      render: (date) => {
        if (!date) return 'N/A';
        try {
          return new Date(date).toLocaleDateString('vi-VN');
        } catch (error) {
          return 'Invalid date';
        }
      },
      sorter: (a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
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
            title="Delete Category"
            description="Are you sure to delete this category?"
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
        {/* Header Section */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
            <UnorderedListOutlined style={{ marginRight: '12px', color: '#667eea' }} />
            Category Management
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Manage product categories and organize your inventory
          </p>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Categories"
                value={stats.total}
                prefix={<UnorderedListOutlined />}
                valueStyle={{ color: '#667eea', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Categories"
                value={stats.active}
                suffix={`of ${stats.total}`}
                valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Category Utilization"
                value={(stats.active / (stats.total || 1) * 100).toFixed(0)}
                suffix="%"
                valueStyle={{ color: '#faad14', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Last Updated"
                value={new Date().toLocaleDateString('vi-VN')}
                valueStyle={{ color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Controls Section */}
        <Card style={{ marginBottom: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Input.Search
                placeholder="Search by category name or description..."
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
                    onClick={fetchCategories}
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
                  Add Category
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Table Section */}
        <Card
          style={{
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          <Spin spinning={loading}>
            {filteredCategories.length > 0 ? (
              <Table
                columns={columns}
                dataSource={filteredCategories}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} categories`,
                  pageSizeOptions: ['5', '10', '20', '50']
                }}
                bordered
                size="middle"
                style={{ fontSize: '14px' }}
              />
            ) : (
              <Empty
                description="No categories found"
                style={{ padding: '50px 0' }}
              />
            )}
          </Spin>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        onOk={() => form.submit()}
        width={600}
        okText={editingCategory ? 'Update' : 'Create'}
        cancelText="Cancel"
        style={{ borderRadius: '8px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter category name' },
              { min: 2, message: 'Category name must be at least 2 characters' },
              { max: 100, message: 'Category name must be less than 100 characters' }
            ]}
          >
            <Input
              placeholder="e.g., Electronics, Clothing, Books"
              size="large"
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: 'Please enter category description' },
              { min: 5, message: 'Description must be at least 5 characters' },
              { max: 500, message: 'Description must be less than 500 characters' }
            ]}
          >
            <Input.TextArea
              placeholder="Describe this category..."
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
