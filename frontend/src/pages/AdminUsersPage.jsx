import React, { useState, useEffect } from "react";
import "./AdminUsersPage.css";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
  Empty,
  Tooltip,
  Spin,
  Tag,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { apiClient } from "../redux/apiClient";
import AdminLayout from "../layout/AdminLayout";
import {
  getRoleColor,
  getRoleLabel,
  getHighestRole,
} from "../utils/roleHelper";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    admin: 0,
    users: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [deletingBulk, setDeletingBulk] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/users");

      if (response.data.success) {
        const data = response.data.data || [];
        const usersList = Array.isArray(data) ? data : [];
        setUsers(usersList);
        updateStats(usersList);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        message.error(
          "You do not have permission to access this resource. Admin role required."
        );
      } else {
        message.error("Failed to fetch users");
      }
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (usersList) => {
    const adminCount = usersList.filter((u) =>
      u.roles?.some((r) => r.name === "ADMIN")
    ).length;
    setStats({
      total: usersList.length,
      active: usersList.filter((u) => u.enabled).length,
      admin: adminCount,
      users: usersList.filter((u) => !u.roles?.some((r) => r.name === "ADMIN"))
        .length,
    });
  };

  const handleShowModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue(user);
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSave = async (values) => {
    try {
      if (editingUser) {
        await apiClient.put(`/users/${editingUser.id}`, values);
        message.success("User updated successfully!");
      }
      setModalVisible(false);
      form.resetFields();
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to save user");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await apiClient.delete(`/users/${userId}`);
      message.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select users to delete");
      return;
    }

    setDeletingBulk(true);
    try {
      await apiClient.delete("/users", {
        data: { userIds: selectedRowKeys },
      });
      message.success(
        `${selectedRowKeys.length} user(s) deleted successfully!`
      );
      setSelectedRowKeys([]);
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete users");
    } finally {
      setDeletingBulk(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newUsers = users.map((u) =>
        u.id === userId
          ? { ...u, status: currentStatus === "active" ? "inactive" : "active" }
          : u
      );
      setUsers(newUsers);
      message.success("User status updated!");
    } catch (error) {
      message.error("Failed to update user status");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "👤 User",
      dataIndex: "username",
      key: "username",
      width: "20%",
      render: (text, record) => (
        <Space>
          <Avatar
            style={{ backgroundColor: "#667eea" }}
            icon={<UserOutlined />}
          />
          <div>
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>
              {record.firstName} {record.lastName}
            </div>
            <div style={{ color: "#999", fontSize: "12px" }}>{text}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "📧 Email",
      dataIndex: "email",
      key: "email",
      width: "22%",
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: "🔐 Role",
      dataIndex: "roles",
      key: "roles",
      width: "15%",
      render: (roles) => {
        const highestRole = getHighestRole(roles);
        return (
          <Tag color={getRoleColor(highestRole)}>
            {getRoleLabel(highestRole)}
          </Tag>
        );
      },
      sorter: (a, b) => {
        const roleA = getHighestRole(a.roles);
        const roleB = getHighestRole(b.roles);
        return roleA.localeCompare(roleB);
      },
    },
    {
      title: "✓ Status",
      dataIndex: "enabled",
      key: "enabled",
      width: "12%",
      render: (enabled) => (
        <Tag color={enabled ? "green" : "red"}>
          {enabled ? "Active" : "Inactive"}
        </Tag>
      ),
      sorter: (a, b) => (a.enabled ? 1 : -1) - (b.enabled ? 1 : -1),
    },
    {
      title: "⚙️ Actions",
      key: "action",
      width: "15%",
      align: "center",
      render: (_, record) => {
        const isAdmin = record.roles?.some((r) => r.name === "ADMIN");
        return (
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
              title="Delete User"
              description={
                isAdmin
                  ? "Admin users cannot be deleted"
                  : "Are you sure to delete this user?"
              }
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
              disabled={isAdmin}
            >
              <Tooltip title={isAdmin ? "Cannot delete admin users" : "Delete"}>
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  disabled={isAdmin}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div
        style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "8px",
            }}
          >
            <UserOutlined style={{ marginRight: "12px", color: "#667eea" }} />
            User Management
          </h1>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Manage customer accounts, roles, and permissions
          </p>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}>
              <Statistic
                title="Total Users"
                value={stats.total}
                prefix="👥"
                valueStyle={{
                  color: "#667eea",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}>
              <Statistic
                title="Active Users"
                value={stats.active}
                suffix={`of ${stats.total}`}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}>
              <Statistic
                title="Administrators"
                value={stats.admin}
                prefix="🔐"
                valueStyle={{
                  color: "#ff4d4f",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}>
              <Statistic
                title="Regular Users"
                value={stats.users}
                suffix={`(${
                  stats.total > 0
                    ? ((stats.users / stats.total) * 100).toFixed(0)
                    : 0
                }%)`}
                valueStyle={{
                  color: "#faad14",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Controls and Search */}
        <Card
          title={
            <div style={{ fontSize: 18, fontWeight: "bold" }}>
              👤 User Management
            </div>
          }
          extra={
            <Space>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title={`Delete ${selectedRowKeys.length} user(s)?`}
                  description="Are you sure you want to delete these users? This action cannot be undone."
                  onConfirm={handleDeleteMultiple}
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    loading={deletingBulk}
                  >
                    Delete ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
              <Tooltip title="Refresh">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchUsers}
                  loading={loading}
                />
              </Tooltip>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleShowModal()}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                }}
              >
                Add User
              </Button>
            </Space>
          }
          style={{
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={20} md={6}>
              <Input.Search
                placeholder="Search by name, email, or username..."
                prefix={<SearchOutlined />}
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                size="large"
                allowClear
                style={{ borderRadius: "6px" }}
              />
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Card
          style={{
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <Spin spinning={loading}>
            {filteredUsers.length > 0 ? (
              <Table
                className="users-table"
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                rowSelection={{
                  columnWidth: 36,
                  selectedRowKeys,
                  onChange: (keys) => {
                    // Only allow selecting non-admin users
                    const validKeys = keys.filter((key) => {
                      const user = filteredUsers.find((u) => u.id === key);
                      if (!user) return false;
                      const isAdmin = user.roles?.some(
                        (r) => r.name === "ADMIN"
                      );
                      return !isAdmin;
                    });
                    setSelectedRowKeys(validKeys);
                  },
                  getCheckboxProps: (record) => {
                    const isAdmin = record.roles?.some(
                      (r) => r.name === "ADMIN"
                    );
                    return {
                      disabled: isAdmin,
                    };
                  },
                }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} users`,
                  pageSizeOptions: ["5", "10", "20", "50"],
                }}
                bordered
                size="middle"
                scroll={{ x: 1000 }}
              />
            ) : (
              <Empty
                description="No users found"
                style={{ padding: "50px 0" }}
              />
            )}
          </Spin>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        title={editingUser ? "Edit User" : "Add New User"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingUser(null);
        }}
        onOk={() => form.submit()}
        width={600}
        okText={editingUser ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please enter username" },
              { min: 3, message: "Username must be at least 3 characters" },
            ]}
          >
            <Input
              placeholder="e.g., john@example.com"
              size="large"
              disabled={!!editingUser}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input type="email" placeholder="user@example.com" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input placeholder="John" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input placeholder="Doe" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select size="large" placeholder="Select role">
              <Select.Option value="ADMIN">ADMIN</Select.Option>
              <Select.Option value="STAFF">STAFF</Select.Option>
              <Select.Option value="USER">USER</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminUsersPage;
