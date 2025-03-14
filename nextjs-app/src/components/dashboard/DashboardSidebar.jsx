'use client'; 

import React, { useState } from 'react';
import { Menu, Layout } from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Sử dụng next/navigation nếu dùng App Router, ngược lại dùng next/router
import { toast } from 'react-toastify'; // Import react-toastify
import { logoutApi } from'@/apis/apis.js'

const { Sider } = Layout;

// CSS thuần
const styles = {
  logo: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#001529',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    borderBottom: '1px solid #002140',
  },
  sider: {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: '16px',
    marginRight: '10px',
  },
};

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutApi();
      toast.success("Đăng xuất thành công!");
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error("Đã có lỗi khi đăng xuất!");
    }
  };

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined style={styles.icon} />,
      label: <Link href="/dashboard" style={styles.menuItem}>Dashboard</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined style={styles.icon} />,
      label: <span style={styles.menuItem}>Sản phẩm</span>,
      children: [
        {
          key: 'product-list',
          label: <Link href="/dashboard">Danh sách sản phẩm</Link>,
        },
        {
          key: 'add-product',
          label: <Link href="/dashboard/products/add">Thêm sản phẩm mới</Link>,
        },
        {
          key: 'product-inventory',
          label: <Link href="/dashboard/products/inventory">Quản lý tồn kho</Link>,
        },
        {
          key: 'product-reviews',
          label: <Link href="/dashboard/products/reviews">Đánh giá sản phẩm</Link>,
        },
      ],
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined style={styles.icon} />,
      label: <span style={styles.menuItem}>Danh mục</span>,
      children: [
        {
          key: 'category-list',
          label: <Link href="/dashboard/categories">Danh sách danh mục</Link>,
        },
        {
          key: 'add-category',
          label: <Link href="/dashboard/categories/add">Thêm danh mục mới</Link>,
        },
        {
          key: 'category-settings',
          label: <Link href="/dashboard/categories/settings">Cài đặt danh mục</Link>,
        },
      ],
    },
    {
      key: 'customers',
      icon: <UserOutlined style={styles.icon} />,
      label: <Link href="/dashboard/customers" style={styles.menuItem}>Khách hàng</Link>,
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined style={styles.icon} />,
      label: <Link href="/dashboard/analytics" style={styles.menuItem}>Thống kê</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined style={styles.icon} />,
      label: <Link href="/dashboard/settings" style={styles.menuItem}>Cài đặt</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined style={styles.icon} />,
      label: <span onClick={handleLogout} style={styles.menuItem}>Đăng xuất</span>,
    },
  ];

  return (
    <Sider
      style={styles.sider}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      theme="dark"
    >
      <div style={styles.logo}>
        {collapsed ? 'AD' : 'Admin Dashboard'}
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={['dashboard']}
        defaultOpenKeys={['products', 'categories']}
        mode="inline"
        items={menuItems}
      />
    </Sider>
  );
};

export default DashboardSidebar;