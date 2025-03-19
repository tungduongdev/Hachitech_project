"use client";
import { Avatar, Dropdown, Space } from "antd";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getUserApi, logoutApi } from "@/apis/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function Header() {
  const [menu, setOpenMenu] = useState(false);
  const [user, setUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responsive = await getUserApi();
        const user = responsive.data;
        console.log("user", user);
        setUser(user);
      } catch (error) {
        setUser(null); // Nếu lỗi (chưa đăng nhập), đặt user về null
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const btn = document.getElementById("click_btn");
    const handleClick = () => setOpenMenu((prev) => !prev);
    if (btn) {
      btn.addEventListener("click", () => handleClick());
    }
    return () => {
      if (btn) btn.removeEventListener("click", handleClick);
    };
  }, []);

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

  const items = [
    { key: "1", label: <a target="_blank" rel="noopener noreferrer">My account</a> },
    { key: "2", label: user.role === "admin" ? (<Link href={"/dashboard"} target="_blank" rel="noopener noreferrer">DashBoard</Link>) : null },
    { key: "3", danger: true, label: user ? (<a onClick={handleLogout}>Logout</a>) : (<Link href="/login">Login</Link>) },
  ];

  return (
    <header>
      <div className="container">
        <div className="logo">
          <img src="/asset/download.jpg" width="50px" height="50px" alt="anh1" />
        </div>
        <div className="hidden-menu">
          <button id="click_btn" className="hidden-menu-btn">
            <span>...</span>
          </button>
        </div>
        <div className="menu">
          <ul className="menu-list">
            <Link href={"/"}>
              <li style={{ color: "#212726", backgroundColor: "unset" }}>Home</li>
            </Link>
            <li className="menu-item-with-submenu">
              <h3>Shop</h3>
              <div className="sub-menu">
                <ul>
                  {/* Menu Nam */}
                  <li className="menu-item-with-submenu">
                    <Link href={"/shop/Nam"}>
                      <h4>Nam</h4>
                    </Link>
                  </li>
                  {/* Menu Nữ */}
                  <li style={{ backgroundColor: "unset", padding: "unset" }}
                    className="menu-item-with-submenu">
                    <Link href={"/shop/Nữ"}>
                      <h4>Nữ</h4>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li>Pages</li>
            <li>Blog</li>
            <li>Features</li>
            <li>Document</li>
            <Link href={"/login"}>
              <li>PURCHASE</li>
            </Link>
          </ul>
        </div>
        <div className="user" style={{ width: "10%", display: "flex", alignItems: "center", justifyContent: "space-around", gap: "5px" }}>
          <Dropdown menu={{ items }} style={{ cursor: "pointer" }} placement="bottom">
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {user.imgUrl && (
                  <Avatar className="avt" size="large" src={user.imgUrl} alt="avatar" />
                )}
                <span style={{ color: "#212726"}}>{user.username ? `Hi, ${user.username}` : "Hi, Guest"}</span>
              </Space>
            </a>
          </Dropdown>
        </div>
        <div id="menu" className={`menu-items-rp ${menu ? "active" : "hidden"}`}>
          <ul className="menu-list-rp active">
            <li>Home</li>
            <li>Shop</li>
            <li>Pages</li>
            <li>Blog</li>
            <li>Features</li>
            <li>Document</li>
            <li>PURCHASE</li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;