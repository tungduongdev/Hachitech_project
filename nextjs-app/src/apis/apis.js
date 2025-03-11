"use client"
import axios from 'axios';


export const loginApi = async (data) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/v1/users/login`, data, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
  }
}

export const getProductsApi = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/v1/products`, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
  }
}

export const deleteProductApi = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/v1/products/delete/${id}`, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
  }
}

export const addProductApi = async (data) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/v1/products/create`, data, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
  }
}

export const updateProductApi = async (id, data) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/v1/products/update/${id}`, data, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
  }
}