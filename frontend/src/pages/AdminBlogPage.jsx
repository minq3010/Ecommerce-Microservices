import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Card, Row, Col, Statistic, Empty, Tooltip, Spin, Tag, DatePicker, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined, FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import AdminLayout from '../layout/AdminLayout';

const AdminBlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, views: 0 });

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const mockPosts = [
        {
          id: '1',
          title: 'Getting Started with Our E-Commerce Platform',
          slug: 'getting-started-ecommerce',
          excerpt: 'Learn how to get started with our powerful e-commerce platform and maximize your sales.',
          content: 'Full content here...',
          author: 'Admin',
          status: 'published',
          category: 'Tutorial',
          tags: ['ecommerce', 'guide', 'getting-started'],
          featured: true,
          viewCount: 1520,
          publishedAt: '2024-10-25T10:00:00Z',
          createdAt: '2024-10-20T10:00:00Z',
          updatedAt: '2024-10-25T10:00:00Z'
        },
        {
          id: '2',
          title: 'Top 10 Best Selling Products This Month',
          slug: 'top-10-best-selling-products',
          excerpt: 'Discover the most popular products our customers are buying right now.',
          content: 'Full content here...',
          author: 'John Doe',
          status: 'published',
          category: 'News',
          tags: ['bestsellers', 'products'],
          featured: false,
          viewCount: 850,
          publishedAt: '2024-10-22T10:00:00Z',
          createdAt: '2024-10-18T10:00:00Z',
          updatedAt: '2024-10-22T10:00:00Z'
        },
        {
          id: '3',
          title: 'How to Optimize Your Store for Mobile',
          slug: 'optimize-store-mobile',
          excerpt: 'Tips and tricks to make your online store mobile-friendly and increase conversions.',
          content: 'Full content here...',
          author: 'Admin',
          status: 'published',
          category: 'Tips',
          tags: ['mobile', 'optimization'],
          featured: true,
          viewCount: 2100,
          publishedAt: '2024-10-20T10:00:00Z',
          createdAt: '2024-10-15T10:00:00Z',
          updatedAt: '2024-10-20T10:00:00Z'
        },
        {
          id: '4',
          title: 'Black Friday 2024 Announcement',
          slug: 'black-friday-2024',
          excerpt: 'Join us for the biggest sale event of the year! Up to 50% off on selected items.',
          content: 'Full content here...',
          author: 'Marketing Team',
          status: 'draft',
          category: 'Announcement',
          tags: ['blackfriday', 'sale'],
          featured: false,
          viewCount: 0,
          publishedAt: null,
          createdAt: '2024-10-28T10:00:00Z',
          updatedAt: '2024-10-30T10:00:00Z'
        },
        {
          id: '5',
          title: 'Customer Success Story: How Sarah Grew Her Store 300%',
          slug: 'customer-story-sarah',
          excerpt: 'Read how one of our customers achieved massive growth using our platform.',
          content: 'Full content here...',
          author: 'Admin',
          status: 'published',
          category: 'Success Stories',
          tags: ['success', 'customer'],
          featured: true,
          viewCount: 3420,
          publishedAt: '2024-10-18T10:00:00Z',
          createdAt: '2024-10-10T10:00:00Z',
          updatedAt: '2024-10-18T10:00:00Z'
        }
      ];
      setPosts(mockPosts);
    } catch (error) {
      message.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStats({
        total: 5,
        published: 4,
        draft: 1,
        views: 7890
      });
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleShowModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      form.setFieldsValue({
        ...post,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : null
      });
    } else {
      setEditingPost(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSave = async (values) => {
    try {
      if (editingPost) {
        const newPosts = posts.map(p =>
          p.id === editingPost.id ? { ...p, ...values, updatedAt: new Date().toISOString() } : p
        );
        setPosts(newPosts);
        message.success('Blog post updated successfully!');
      } else {
        const newPost = {
          id: Date.now().toString(),
          ...values,
          slug: values.title.toLowerCase().replace(/\s+/g, '-'),
          viewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: values.status === 'published' ? new Date().toISOString() : null
        };
        setPosts([...posts, newPost]);
        message.success('Blog post created successfully!');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingPost(null);
      fetchStats();
    } catch (error) {
      message.error(error.message || 'Failed to save blog post');
    }
  };

  const handleDelete = async (postId) => {
    try {
      const newPosts = posts.filter(p => p.id !== postId);
      setPosts(newPosts);
      message.success('Blog post deleted successfully!');
      fetchStats();
    } catch (error) {
      message.error('Failed to delete blog post');
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchText.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchText.toLowerCase()) ||
    post.author.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === 'published' ? 'green' : 'orange';
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>by {record.author}</div>
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '12%',
      render: (category) => <Tag color="blue">{category}</Tag>,
      filters: [
        { text: 'Tutorial', value: 'Tutorial' },
        { text: 'News', value: 'News' },
        { text: 'Tips', value: 'Tips' },
        { text: 'Announcement', value: 'Announcement' },
        { text: 'Success Stories', value: 'Success Stories' }
      ],
      onFilter: (value, record) => record.category === value
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
      title: 'Views',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: '10%',
      align: 'center',
      render: (count) => (
        <Tooltip title="Page views">
          <span style={{ fontWeight: 'bold', color: '#667eea' }}>
            <EyeOutlined style={{ marginRight: '4px' }} />
            {count}
          </span>
        </Tooltip>
      ),
      sorter: (a, b) => a.viewCount - b.viewCount
    },
    {
      title: 'Published',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: '15%',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'Not published',
      sorter: (a, b) => {
        if (!a.publishedAt) return 1;
        if (!b.publishedAt) return -1;
        return new Date(a.publishedAt) - new Date(b.publishedAt);
      }
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '12%',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
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
            title="Delete Post"
            description="Are you sure to delete this blog post?"
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
            <FileTextOutlined style={{ marginRight: '12px', color: '#667eea' }} />
            Blog Management
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Create, edit, and manage your blog content and articles
          </p>
        </div>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Posts"
                value={stats.total}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#667eea', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Published"
                value={stats.published}
                suffix={`of ${stats.total}`}
                valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Drafts"
                value={stats.draft}
                valueStyle={{ color: '#faad14', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Views"
                value={stats.views}
                suffix="👁️"
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
                placeholder="Search by title, content, or author..."
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
                    onClick={fetchPosts}
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
                  New Post
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
            {filteredPosts.length > 0 ? (
              <Table
                columns={columns}
                dataSource={filteredPosts}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} posts`,
                  pageSizeOptions: ['5', '10', '20', '50']
                }}
                bordered
                size="middle"
              />
            ) : (
              <Empty description="No blog posts found" style={{ padding: '50px 0' }} />
            )}
          </Spin>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        title={editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingPost(null);
        }}
        onOk={() => form.submit()}
        width={800}
        okText={editingPost ? 'Update' : 'Create'}
        cancelText="Cancel"
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            label="Post Title"
            name="title"
            rules={[
              { required: true, message: 'Please enter post title' },
              { min: 5, message: 'Title must be at least 5 characters' }
            ]}
          >
            <Input placeholder="Enter blog post title" size="large" />
          </Form.Item>

          <Form.Item
            label="Excerpt"
            name="excerpt"
            rules={[{ required: true, message: 'Please enter excerpt' }]}
          >
            <Input.TextArea placeholder="Short summary of the post..." rows={2} />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'Please enter post content' }]}
          >
            <Input.TextArea placeholder="Full blog post content..." rows={6} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true }]}
              >
                <Select size="large" placeholder="Select category">
                  <Select.Option value="Tutorial">Tutorial</Select.Option>
                  <Select.Option value="News">News</Select.Option>
                  <Select.Option value="Tips">Tips</Select.Option>
                  <Select.Option value="Announcement">Announcement</Select.Option>
                  <Select.Option value="Success Stories">Success Stories</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true }]}
              >
                <Select size="large" placeholder="Select status">
                  <Select.Option value="draft">Draft</Select.Option>
                  <Select.Option value="published">Published</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Author"
            name="author"
            rules={[{ required: true }]}
          >
            <Input placeholder="Author name" size="large" />
          </Form.Item>

          <Form.Item
            label="Tags (comma-separated)"
            name="tags"
            initialValue=""
          >
            <Input placeholder="e.g., ecommerce, guide, tips" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminBlogPage;
