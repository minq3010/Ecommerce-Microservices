import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { cartService } from '../services/cartService';
import AdminLayout from '../layout/AdminLayout';

const CartsPage = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);

  // Placeholder - in real scenario you'd fetch all carts from a cart management API
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleViewDetails = (cart) => {
    setSelectedCart(cart);
    setDetailsVisible(true);
  };

  const columns = [
    { title: 'Cart ID', dataIndex: 'id', key: 'id' },
    { title: 'User ID', dataIndex: 'userId', key: 'userId' },
    {
      title: 'Total Items',
      dataIndex: 'totalItems',
      key: 'totalItems',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `$${price}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => handleViewDetails(record)}>
          View Items
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <ShoppingOutlined style={{ fontSize: '48px', color: '#667eea' }} />
        <h2 style={{ marginTop: '16px', color: '#333' }}>🛒 Cart Management</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Carts are managed per user. Use the user management section to view user-specific carts.
        </p>
      </div>

      <Modal
        title="Cart Details"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCart && (
          <div>
            <p><strong>Cart ID:</strong> {selectedCart.id}</p>
            <p><strong>User ID:</strong> {selectedCart.userId}</p>
            <p><strong>Total Items:</strong> {selectedCart.totalItems}</p>
            <p><strong>Total Price:</strong> ${selectedCart.totalPrice}</p>
            <h4>Items in Cart:</h4>
            <Table
              columns={[
                { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
                { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
                { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                {
                  title: 'Price',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => `$${price}`,
                },
              ]}
              dataSource={selectedCart.items || []}
              pagination={false}
              rowKey="id"
            />
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default CartsPage;
