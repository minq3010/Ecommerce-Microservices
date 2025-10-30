import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Popconfirm, Card, Row, Col, Statistic, Badge, Empty, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '../layout/AdminLayout';
import { setProducts, addProduct, updateProduct, deleteProduct, setLoading, setError, setCurrentPage, setPageSize } from '../redux/slices/productSlice';
import { apiClient } from '../redux/apiClient';

const AdminProductsPageRedux = () => {
  const dispatch = useDispatch();
  const { products, loading, currentPage, pageSize, totalCount } = useSelector(state => state.product);
  const [visible, setVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize]);

  const fetchProducts = async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiClient.get(
        `/products?page=${currentPage - 1}&size=${pageSize}`
      );
      
      if (response.data.success) {
        const content = response.data.data?.content || response.data.data || [];
        dispatch(setProducts(Array.isArray(content) ? content : []));
      }
    } catch (error) {
      dispatch(setError('Failed to fetch products'));
      message.error('Failed to fetch products');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      form.setFieldsValue(product);
    } else {
      setEditingProduct(null);
      form.resetFields();
    }
    setVisible(true);
  };

  const handleSave = async (values) => {
    try {
      if (editingProduct) {
        await apiClient.put(`/products/${editingProduct.id}`, values);
        dispatch(updateProduct({ ...editingProduct, ...values }));
        message.success('Product updated successfully!');
      } else {
        const response = await apiClient.post('/products', values);
        dispatch(addProduct(response.data.data));
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
      dispatch(deleteProduct(id));
      message.success('Product deleted successfully!');
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const handleTableChange = (pagination) => {
    dispatch(setCurrentPage(pagination.current));
    dispatch(setPageSize(pagination.pageSize));
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: '10%' },
    { title: 'Name', dataIndex: 'name', key: 'name', width: '25%' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku', width: '12%' },
    { title: 'Price', dataIndex: 'price', key: 'price', width: '12%', render: (price) => `$${price?.toFixed(2)}` },
    { title: 'Stock', dataIndex: 'quantity', key: 'quantity', width: '10%' },
    { title: 'Category', dataIndex: 'category', key: 'category', width: '12%' },
    {
      title: 'Actions',
      key: 'actions',
      width: '19%',
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleShowModal(record)} />
          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const stats = [
    { title: 'Total Products', value: products.length, color: '#667eea' },
    { title: 'In Stock', value: products.filter(p => p.quantity > 0).length, color: '#764ba2' },
    { title: 'Total Inventory Value', value: `$${products.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 0), 0).toFixed(2)}`, color: '#f093fb' },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <Card>
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ color: stat.color }}
                />
              </Col>
            ))}
          </Row>

          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Products Management</h2>
            <Space>
              <Input.Search
                placeholder="Search products..."
                onSearch={(value) => setSearchText(value)}
                style={{ width: 200 }}
                prefix={<SearchOutlined />}
              />
              <Button type="primary" icon={<ReloadOutlined />} onClick={fetchProducts} />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleShowModal()}>
                Add Product
              </Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={products}
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalCount,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} products`,
            }}
            onChange={handleTableChange}
            rowKey="id"
            bordered
          />
        </Card>

        <Modal
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
          open={visible}
          onOk={() => form.submit()}
          onCancel={() => setVisible(false)}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
              <Input placeholder="Enter product name" />
            </Form.Item>
            <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
              <Input placeholder="Enter SKU" />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true, type: 'number' }]}>
              <InputNumber min={0} step={0.01} />
            </Form.Item>
            <Form.Item name="quantity" label="Stock Quantity" rules={[{ required: true, type: 'number' }]}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Input placeholder="Enter category" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPageRedux;
