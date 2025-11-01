import React from 'react';
import { Table, Button, InputNumber, Space, Card, Row, Col, Empty, message, Divider, Tag } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store';
import { formatVND } from '../utils/formatters';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateItemQuantity, removeItemFromCart, clearCart } = useCartStore();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '60px' }}>
        <Empty 
          description="Your cart is empty"
          style={{ marginBottom: '30px' }}
        />
        <Button 
          type="primary" 
          size="large"
          onClick={() => navigate('/')}
          icon={<ShoppingOutlined />}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 'bold' }}>{text}</span>
          <span style={{ fontSize: '12px', color: '#999' }}>{record.productId}</span>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatVND(price),
      width: 140,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={999}
          value={quantity}
          onChange={(value) => {
            if (value) {
              updateItemQuantity(record.productId, value);
            }
          }}
          style={{ width: '80px' }}
        />
      ),
      width: 120,
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_, record) => formatVND(Number(record.price || 0) * record.quantity),
      width: 140,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            removeItemFromCart(record.productId);
            message.success('Item removed from cart');
          }}
        >
          Remove
        </Button>
      ),
      width: 100,
    },
  ];

  const subtotal = cart.items.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
  const tax = Number((subtotal * 0.1).toFixed(2));
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        🛒 Shopping Cart
      </h1>

      <Row gutter={[24, 24]}>
        {/* Cart Table */}
        <Col xs={24} lg={16}>
          <Card>
            <Table
              columns={columns}
              dataSource={cart.items.map((item, idx) => ({
                ...item,
                key: item.productId || idx,
              }))}
              pagination={false}
              scroll={{ x: true }}
              bordered
            />
          </Card>
        </Col>

        {/* Summary */}
        <Col xs={24} lg={8}>
          <Card
            title="Order Summary"
            style={{
              position: 'sticky',
              top: 80,
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Items Count */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Items ({cart.items.length}):</span>
                <span>{formatVND(subtotal)}</span>
              </div>

              {/* Tax */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Tax (10%):</span>
                <span>{formatVND(tax)}</span>
              </div>

              {/* Shipping */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <Space>
                  <span>Shipping:</span>
                  {shipping === 0 && <Tag color="green">FREE</Tag>}
                </Space>
                <span>{formatVND(shipping)}</span>
              </div>

              <Divider />

              {/* Total */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ff4d4f',
              }}>
                <span>Total:</span>
                <span>{formatVND(total)}</span>
              </div>

              {/* Checkout Button */}
              <Button
                type="primary"
                block
                size="large"
                onClick={() => navigate('/checkout')}
                style={{ marginTop: '16px', background: '#667eea', borderColor: '#667eea' }}
              >
                Proceed to Checkout
              </Button>

              {/* Continue Shopping */}
              <Button
                block
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>

              {/* Clear Cart */}
              <Button
                danger
                block
                onClick={() => {
                  clearCart();
                  message.success('Cart cleared');
                }}
              >
                Clear Cart
              </Button>

              {/* Info */}
              <div style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '16px' }}>
                {shipping === 0 ? (
                  <p>🎉 Free shipping for orders over $100!</p>
                ) : (
                  <p>Add ${(100 - subtotal).toFixed(2)} to get free shipping</p>
                )}
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
