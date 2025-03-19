'use client'; 

import React, { useState, useEffect } from 'react';
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
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
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
  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState(['product-list']);
  const [openKeys, setOpenKeys] = useState(['products']);
  
  // Xác định selectedKeys và openKeys dựa trên đường dẫn hiện tại
  useEffect(() => {
    if (pathname === '/dashboard') {
      setSelectedKeys(['product-list']);
      setOpenKeys(['products']);
    } else if (pathname === '/') {
      setSelectedKeys(['dashboard']);
      setOpenKeys([]);
    } else if (pathname.includes('/dashboard/products')) {
      if (pathname.includes('/inventory')) {
        setSelectedKeys(['product-inventory']);
      } else if (pathname.includes('/reviews')) {
        setSelectedKeys(['product-reviews']);
      } else {
        setSelectedKeys(['product-list']);
      }
      setOpenKeys(['products']);
    } else if (pathname.includes('/dashboard/categories')) {
      if (pathname.includes('/settings')) {
        setSelectedKeys(['category-settings']);
      } else {
        setSelectedKeys(['category-list']);
      }
      setOpenKeys(['categories']);
    } else if (pathname.includes('/dashboard/customers')) {
      setSelectedKeys(['customers']);
    } else if (pathname.includes('/dashboard/analytics')) {
      setSelectedKeys(['analytics']);
    } else if (pathname.includes('/dashboard/settings')) {
      setSelectedKeys(['settings']);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutApi();
      toast.success("Đăng xuất thành công!");
      router.push('/login');
      console.log("Cookie sau khi logout:", document.cookie); // Kiểm tra cookie trong frontend
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error("Đã có lỗi khi đăng xuất!");
    }
  };

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  
  // Xử lý khi người dùng mở/đóng các menu có submenu
  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };
  
  // Xử lý khi chọn menu item
  const handleMenuClick = ({ key }) => {
    setSelectedKeys([key]);
    
    // Xử lý routing đặc biệt nếu cần
    if (key === 'category-list') {
      router.push('/dashboard/categories');
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined style={styles.icon} />,
      label: <Link href="/" style={styles.menuItem}>Home</Link>,
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
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        mode="inline"
        items={menuItems}
        onClick={handleMenuClick}
        onOpenChange={handleOpenChange}
      />
    </Sider>
  );
};

export default DashboardSidebar;