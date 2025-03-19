"use client";

import React, { useState, useEffect } from 'react';
import ProductFilterMenu from '@/components/filter/FillterSidebar';
import "@/styles/categoryPage.css"; // Đảm bảo đường dẫn CSS chính xác
import { getCategoriesByNameApi, getProductsByCategoryApi } from '@/apis/apis';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const Page = () => {
  // Khởi tạo state để lưu danh sách sản phẩm từ API
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const params = useParams();
  //console.log("params", params);
  // Dữ liệu mặc định (hardcode) chỉ dùng khi cần thiết
  // const defaultProducts = [
  //   {
  //     id: 1,
  //     name: "iPhone 15 Pro",
  //     image: "/asset/download.jpg",
  //     price: 999.99,
  //     description: "The iPhone 15 Pro is the latest and greatest iPhone model..."
  //   },
  //   {
  //     id: 2,
  //     name: "Samsung Galaxy S23",
  //     image: "/asset/download.jpg",
  //     price: 899.99,
  //     description: "The Samsung Galaxy S23 is the latest flagship smartphone..."
  //   },
  //   {
  //     id: 3,
  //     name: "MacBook Air M2",
  //     image: "/asset/download.jpg",
  //     price: 1199.99,
  //     description: "The MacBook Air M2 is the latest MacBook model..."
  //   },
  //   {
  //     id: 4,
  //     name: "Sony WH-1000XM5",
  //     image: "/asset/download.jpg",
  //     price: 399.99,
  //     description: "The Sony WH-1000XM5 is the latest wireless noise-canceling headphones..."
  //   },
  //   {
  //     id: 5,
  //     name: "Apple Watch Series 9",
  //     image: "/asset/download.jpg",
  //     price: 429.99,
  //     description: "The Apple Watch Series 9 is the latest smartwatch from Apple..."
  //   }
  // ];

  // Sử dụng useEffect để fetch dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const category = await getCategoriesByNameApi(params.gender);
        //console.log("data id", category.data._id);
        const response = await getProductsByCategoryApi(category.data._id);
        //console.log("data", response.data);
        //console.log("data [0]", response.data[0]);
        setProducts(response.data);
        setFilteredProducts(response.data)
        //LÔI PRODUCT ĐANG BỊ RỖNG
        // Nếu API trả về dữ liệu hợp lệ, cập nhật state
        // console.log("products", products);
        // if (response.data && Array.isArray(response.data)) {
        //   setProducts(response.data[0]);
        //   console.log("products", products);
        // } else {
        //   // Nếu không có dữ liệu từ API, sử dụng dữ liệu mặc định
        //   setProducts(defaultProducts);
        // }
      } catch (error) {
        console.error("Error fetching products:", error);
        // Nếu lỗi, sử dụng dữ liệu mặc định
        //setProducts(defaultProducts);
      }
    };

    fetchProducts();
  }, [params.gender]); // Mảng rỗng: chỉ chạy một lần khi component mount

  // Hàm xử lý bộ lọc từ ProductFilterMenu
  const handleFilter = (filterValues) => {
    let result = [...products];

    // Lọc theo khoảng giá
    if (filterValues.priceRange) {
      const [minPrice, maxPrice] = filterValues.priceRange;
      result = result.filter(product => product.price >= minPrice && product.price <= maxPrice);
    }

    console.log("filterValues", filterValues.colors);

    // Lọc theo màu sắc
    if (Array.isArray(filterValues.colors) && filterValues.colors.length > 0) {
      result = result.filter(product =>
        product.colors.some(color => filterValues.colors.includes(color))
      );
    }    

    // Lọc theo kích thước
    if (filterValues.sizes) {
      result = result.filter(product => product.size === filterValues.sizes);
    }
    // Lọc theo loại sản phẩm
    if (filterValues.productTypes && filterValues.productTypes.length > 0) {
      result = result.filter(product => filterValues.productTypes.includes(product.type));
    }

    // Sắp xếp
    if (filterValues.sort) {
      switch (filterValues.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'popular':
          // Thêm logic cho phổ biến (nếu có trường như views hoặc sales)
          break;
        case 'discount':
          // Thêm logic cho khuyến mãi (nếu có trường discount)
          break;
        default:
          break;
      }
    }

    setFilteredProducts(result); // Cập nhật danh sách đã lọc
    console.log("result", result);
  };
  return (
    <div className="container2">
      <header className="header">
        <h1>Category {decodeURIComponent(params.gender)}</h1>{/* giải mã encodingdecoded */}
        <p>Explore our wide range of products</p>
        <p>{products.length} sản phẩm</p>
      </header>

      <div className="content">
        {/* Filter Sidebar */}
        <aside className="sidebar">
          <ProductFilterMenu onFilter={handleFilter}/>
        </aside>

        {/* Product List */}
        <main className="product-list2">
          {filteredProducts.length > 0 ? (
            <div className="product-grid2">
              {filteredProducts.map(product => (
                <Link
                  style={{ textDecoration: "none", color: "#2563eb" }}
                  className="product-item"
                  key={product._id}
                  href={`/product/${product._id}`}
                >
                  <div className="product-card2">
                    <div className="product-image2">
                      <img src={product.imgUrl} alt={product.productName} />
                    </div>
                    <div className="product-content">
                      <h3>{product.productName}</h3>
                      <p className="product-description">
                        {product?.description || "Không có mô tả"}
                      </p>
                      <div className="product-footer">
                        <p className="product-price">${product.price}</p>
                        <button className="add-to-cart">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Không có sản phẩm nào</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;