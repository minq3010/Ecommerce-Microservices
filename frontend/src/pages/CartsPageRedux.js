import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, message, Space, Card, Row, Col, Statistic, Empty, Tooltip, Form } from 'antd';
import { DeleteOutlined, ShoppingOutlined, CheckOutlined, ClearOutlined } from '@ant-design/icons';
import AdminLayout from '../layout/AdminLayout';
import { setItems, removeItemFromCart, updateCartItem, clearCart, setLoading, setError } from '../redux/slices/cartSlice';
import { apiClient } from '../redux/apiClient';

const CartsPageRedux = () => {
  const dispatch = useDispatch();
  const { items, totalPrice, totalQuantity, loading } = useSelector(state => state.cart);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiClient.get('/carts');
      if (response.data.success) {
        const cartItems = response.data.data?.items || [];
        dispatch(setItems(Array.isArray(cartItems) ? cartItems : []));
      }
    } catch (error) {
      dispatch(setError('Failed to fetch cart items'));
      message.error('Failed to fetch cart items');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRemoveItem = (itemId) => {
    Modal.confirm({
      title: 'Remove Item',
      content: 'Are you sure you want to remove this item from the cart?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        dispatch(removeItemFromCart(itemId));
        message.success('Item removed from cart');
      },
    });
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    dispatch(updateCartItem({ id: itemId, quantity: newQuantity }));
    message.success('Cart updated');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      message.warning('Your cart is empty');
      return;
    }

    Modal.confirm({
      title: 'Checkout',
      content: `Are you sure you want to checkout? Total: $${totalPrice.toFixed(2)}`,
      okText: 'Yes, Checkout',
      cancelText: 'Cancel',
      async onOk() {
        try {
          const response = await apiClient.post('/orders', {
            cartItems: items,
            totalPrice: totalPrice,
            totalQuantity: totalQuantity,
          });
          message.success('Order created successfully!');
          dispatch(clearCart());
        } catch (error) {
          message.error('Failed to create order');
        }
      },
    });
  };

  const handleClearCart = () => {
    Modal.confirm({
      title: 'Clear Cart',
      content: 'Are you sure you want to clear your entire cart?',
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: { danger: true },
      onOk() {
        dispatch(clearCart());
        message.success('Cart cleared');
      },
    });
  };

  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '12%',
      render: (price) => `$${price?.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '12%',
      render: (quantity, record) => (
        <Space>
          <Button size="small" onClick={() => handleUpdateQuantity(record.id, quantity - 1)}>-</Button>
          <span>{quantity}</span>
          <Button size="small" onClick={() => handleUpdateQuantity(record.id, quantity + 1)}>+</Button>
        </Space>
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      width: '12%',
      render: (_, record) => `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '19%',
      render: (_, record) => (
        <Space>
          <Tooltip title="Remove from cart">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveItem(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <Card>
          {/* Statistics */}
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={8}>
              <Statistic
                title="Items in Cart"
                value={totalQuantity}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#667eea' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Statistic
                title="Cart Total"
                value={totalPrice}
                prefix="$"
                precision={2}
                valueStyle={{ color: '#764ba2' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Statistic
                title="Items"
                value={items.length}
                valueStyle={{ color: '#f093fb' }}
              />
            </Col>
          </Row>

          {/* Actions */}
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Shopping Cart</h2>
            <Space>
              <Tooltip title="Refresh cart data">
                <Button icon={<ShoppingOutlined />} onClick={fetchCarts} />
              </Tooltip>
              <Button
                danger
                icon={<ClearOutlined />}
                onClick={handleClearCart}
                disabled={items.length === 0}
              >
                Clear Cart
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Checkout
              </Button>
            </Space>
          </div>

          {/* Cart Items Table */}
          {items.length === 0 ? (
            <Empty
              description="Your cart is empty"
              style={{ marginTop: '48px', marginBottom: '48px' }}
            />
          ) : (
            <Table
              columns={columns}
              dataSource={items}
              loading={loading}
              rowKey="id"
              pagination={false}
              bordered
              style={{ marginBottom: '24px' }}
            />
          )}

          {/* Cart Summary */}
          {items.length > 0 && (
            <Card style={{ backgroundColor: '#f0f2f5', marginTop: '24px' }}>
              <Row justify="end" gutter={16}>
                <Col xs={24} sm={12} md={8}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Subtotal:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Shipping:</span>
                    <span>$0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Tax:</span>
                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #d9d9d9',
                    paddingTop: '8px',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}>
                    <span>Total:</span>
                    <span>${(totalPrice * 1.1).toFixed(2)}</span>
                  </div>
                </Col>
              </Row>
            </Card>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CartsPageRedux;
