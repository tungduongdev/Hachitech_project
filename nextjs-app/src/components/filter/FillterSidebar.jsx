"use client";

import React, { useState, useEffect } from 'react';
import "@/styles/fillter.css";
import { 
  Layout, 
  Slider, 
  Checkbox, 
  Divider, 
  Radio, 
  Space, 
  Button, 
  Typography, 
  Input, 
  Select, 
  Form, 
  Card
} from 'antd';
import { 
  FilterOutlined, 
  SearchOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductFilterMenu = ({ onFilter }) => {
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(false);

  // Các danh mục kích thước
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Các danh mục màu sắc
  const colors = [
    { label: 'Đen', value: 'Đen' },
    { label: 'Trắng', value: 'Trắng' },
    { label: 'Đỏ', value: 'Đỏ' },
    { label: 'Xanh dương', value: 'Xanh dương' },
    { label: 'Xanh lá', value: 'Xanh lá' },
    { label: 'Vàng', value: 'Vàng' },
    { label: 'Hồng', value: 'Hồng' },
    { label: 'Tím', value: 'Tím' },
    { label: 'Xám', value: 'Xám' },
  ];

  // Giá trị mặc định cho khoảng giá
  const defaultPriceRange = [0, 2000000]; // VND

  // Sắp xếp
  const sortOptions = [
    { label: 'Giá: Thấp đến cao', value: 'price_asc' },
    { label: 'Giá: Cao đến thấp', value: 'price_desc' },
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Phổ biến nhất', value: 'popular' },
    { label: 'Khuyến mãi', value: 'discount' },
  ];

  // Loại sản phẩm
  const productTypes = [
    'Áo phông ngắn tay', 'Áo phông dài tay', 'Áo phông in hình', 'Áo phông trơn'
  ];

  // Xử lý khi submit form
  const handleSubmit = (values) => {
    if (onFilter && typeof onFilter === 'function') {
      onFilter(values);
    }
    console.log('Đã áp dụng bộ lọc:', values);
  };

  // Reset form
  const handleReset = () => {
    form.resetFields();
    if (onFilter && typeof onFilter === 'function') {
      onFilter(form.getFieldsValue()); // Gửi giá trị mặc định sau khi reset
    }
  };

  // Gửi giá trị mặc định khi component mount
  useEffect(() => {
    if (onFilter && typeof onFilter === 'function') {
      const initialValues = form.getFieldsValue();
      onFilter(initialValues); // Gửi giá trị mặc định lên cha chỉ một lần
    }
  }, []); // Mảng rỗng để chỉ chạy một lần khi mount

  return (
    <Sider
      width={300}
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className="custom-sider"
      style={{ 
        background: '#fff', 
        padding: collapsed ? '10px 0' : '20px',
        height: '100%', 
        borderRight: '1px solid #f0f0f0',
      }}
    >
      {!collapsed && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            priceRange: defaultPriceRange,
            sort: 'newest'
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <Title level={4} style={{ marginBottom: 16 }}>
              <FilterOutlined /> Bộ lọc sản phẩm
            </Title>
            <Search
              placeholder="Tìm kiếm sản phẩm"
              enterButton={<SearchOutlined />}
              style={{ marginBottom: 16 }}
              onSearch={(value) => {
                form.setFieldsValue({ search: value });
                form.submit(); // Submit form khi tìm kiếm
              }}
            />
          </div>

          <Divider orientation="left">Sắp xếp</Divider>
          <Form.Item name="sort">
            <Select placeholder="Sắp xếp theo">
              {sortOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider orientation="left">Khoảng giá</Divider>
          <Form.Item name="priceRange">
            <Slider
              range
              min={0}
              max={500}
              step={20}
              tooltip={{ formatter: value => `${value.toLocaleString()} USD` }}
            />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span>0 USD</span>
            <span>500 USD</span>
          </div>

          <Divider orientation="left">Màu sắc</Divider>
          <Form.Item name="colors">
            <Checkbox.Group style={{ width: '100%' }}>
              <Space direction="vertical">
                {colors.map(color => (
                  <Checkbox key={color.value} value={color.value}>
                    {color.label}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <Divider orientation="left">Kích thước</Divider>
          <Form.Item name="sizes">
            <Radio.Group>
              <Space wrap>
                {sizes.map(size => (
                  <Radio.Button key={size} value={size}>
                    {size}
                  </Radio.Button>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
          
          <Divider orientation="left">Loại sản phẩm</Divider>
          <Form.Item name="productTypes">
            <Checkbox.Group style={{ width: '100%' }}>
              <Space direction="vertical">
                {productTypes.map(type => (
                  <Checkbox key={type} value={type}>
                    {type}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ width: '100%' }}
                icon={<FilterOutlined />}
              >
                Áp dụng
              </Button>
              <Button 
                htmlType="button" 
                onClick={handleReset} 
                style={{ width: '100%' }}
                icon={<ReloadOutlined />}
              >
                Đặt lại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
      {collapsed && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <FilterOutlined style={{ fontSize: '24px' }} />
          <div>Lọc</div>
        </div>
      )}
    </Sider>
  );
};

export default ProductFilterMenu;