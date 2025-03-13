"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductByIdApi } from '../../../apis/apis.js';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [stock] = useState(10);
  const [rating] = useState(4.5);
  const [reviewCount] = useState(120);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductByIdApi(id);
        console.log("data",response.data)
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Đang tải sản phẩm...</div>;
  }

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    setIsInCart(true);
    setTimeout(() => {
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    }, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="product-detail-container">
      <div className="product-images">
        <div className="main-image">
          <img src={product.imgUrl} alt={product.productName} />
        </div>
      </div>

      <div className="product-info">
        <h1 className="product-title">{product.productName}</h1>

        <div className="product-rating">
          <span>{rating} ★ ({reviewCount} đánh giá)</span>
        </div>

        <div className="product-price">
          <span className="current-price">{formatCurrency(product.price)}</span>
        </div>

        <div className="product-description">
          <p>{product.description}</p>
        </div>

        <div className="product-colors">
          <h3>Màu sắc</h3>
          <div className="color-options">
            {product.colors?.map((color) => (
              <button
                key={color}
                className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div className="product-quantity">
          <h3>Số lượng</h3>
          <div className="quantity-selector">
            <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange(1)} disabled={quantity >= stock}>+</button>
            <span>Còn {stock} sản phẩm</span>
          </div>
        </div>

        <div className="product-actions">
          <button className={isInCart ? 'added' : ''} onClick={handleAddToCart}>
            {isInCart ? 'Đã thêm vào giỏ hàng' : 'Thêm vào giỏ hàng'}
          </button>
          <button onClick={() => setIsInWishlist(!isInWishlist)}>
            {isInWishlist ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
