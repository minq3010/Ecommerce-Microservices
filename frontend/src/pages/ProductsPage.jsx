import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Input, Button, Empty, Spin, message, Space, Tag, Segmented } from 'antd';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useCartStore } from '../store';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const { addItemToCart } = useCartStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, searchQuery, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/v1/products?page=0&size=100';
      
      if (searchQuery) {
        url = `/api/v1/products/search?query=${searchQuery}`;
      } else if (selectedCategory) {
        url = `/api/v1/products/category/${selectedCategory}`;
      }

      const response = await axios.get(url);
      let data = response.data.data.content || response.data.data;
      
      // Sort products
      if (sortBy === 'price-low') {
        data.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        data.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
      
      setProducts(data);
    } catch (error) {
      message.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/v1/categories');
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const handleAddToCart = (product, quantity = 1) => {
    if (product.stock <= 0) {
      message.error('Out of stock');
      return;
    }
    addItemToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl || 'https://via.placeholder.com/200',
    });
    message.success(`${product.name} added to cart!`);
  };

  const discountPercent = (product) => {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
          🛍️ Shop Our Products
        </h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
          Discover our amazing collection of products
        </p>
        
        {/* Filters */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search products..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="large"
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="All Categories"
                style={{ width: '100%' }}
                size="large"
                allowClear
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { label: 'All Categories', value: null },
                  ...categories.map(cat => ({
                    label: typeof cat === 'string' ? cat : cat.name || cat.id,
                    value: typeof cat === 'string' ? cat : cat.id,
                  }))
                ]}
              />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Segmented
                options={[
                  { label: 'Name', value: 'name' },
                  { label: 'Low Price', value: 'price-low' },
                  { label: 'High Price', value: 'price-high' },
                  { label: 'Rating', value: 'rating' },
                ]}
                value={sortBy}
                onChange={setSortBy}
                block
              />
            </Col>
          </Row>
        </Card>
      </div>

      {/* Products Grid */}
      <Spin spinning={loading} tip="Loading products...">
        {products.length === 0 ? (
          <Empty 
            description="No products found" 
            style={{ marginTop: '60px' }}
          />
        ) : (
          <>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Showing {products.length} products
            </p>
            <Row gutter={[20, 20]}>
              {products.map((product) => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    style={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                    cover={
                      <div
                        style={{
                          height: '200px',
                          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '8px 8px 0 0',
                        }}
                      >
                        <img
                          src={product.imageUrl || 'https://via.placeholder.com/200x200?text=Product'}
                          alt={product.name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        {discountPercent(product) > 0 && (
                          <Tag
                            color="red"
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                            }}
                          >
                            -{discountPercent(product)}%
                          </Tag>
                        )}
                        {product.stock <= 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'rgba(0, 0, 0, 0.6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '16px',
                              borderRadius: '8px 8px 0 0',
                            }}
                          >
                            Out of Stock
                          </div>
                        )}
                      </div>
                    }
                  >
                    {/* Product Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 4px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 8px 0', minHeight: '40px', lineHeight: '1.3' }}>
                        {product.name}
                      </h3>
                      
                      {product.category && (
                        <div style={{ marginBottom: '8px' }}>
                          <Tag color="blue" style={{ fontSize: '11px' }}>
                            {product.category}
                          </Tag>
                        </div>
                      )}

                      {product.description && (
                        <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0', flex: 1 }}>
                          {product.description.substring(0, 50)}...
                        </p>
                      )}

                      {/* Price */}
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f' }}>
                          ${Number(product.price || 0).toFixed(2)}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>
                            ${Number(product.originalPrice).toFixed(2)}
                          </div>
                        )}
                      </div>

                      {/* Stock & Rating */}
                      <div style={{ fontSize: '11px', marginBottom: '12px' }}>
                        <div style={{ marginBottom: '4px' }}>
                          <Tag color={product.stock > 0 ? 'green' : 'red'} style={{ fontSize: '10px' }}>
                            {product.stock || 0} in stock
                          </Tag>
                        </div>
                        {product.rating && (
                          <div>
                            ⭐ {Number(product.rating).toFixed(1)}/5 ({product.reviewCount || 0} reviews)
                          </div>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        block
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        style={{ marginTop: 'auto', background: '#667eea', borderColor: '#667eea' }}
                      >
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Spin>
    </div>
  );
};

export default ProductsPage;
