"use client"
import axios from 'axios';

const API_URL = 'http://66.42.52.15/api/v1';

export const loginApi = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, data, {
      withCredentials: true,
    });
    console.log("Cookie sau khi login:", document.cookie); // Kiểm tra cookie trong frontend
    return response;
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
  }
};

export const logoutApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/logout`, {
      withCredentials: true,
    });
    console.log("Cookie sau khi logout:", document.cookie); // Kiểm tra cookie trong frontend
    return response;
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
  }
}

//products api
export const getProductsApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
  }
}

export const deleteProductApi = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/products/delete/${id}`, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
  }
}

export const addProductApi = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/products/create`, data, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
  }
}

export const updateProductApi = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/products/update/${id}`, data, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
  }
}

export const getProductByIdApi = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo ID:", error);
  }
}

// API cho danh mục
export const addCategoryApi = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/categories/create`, data, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
  }
}
export const getCategoriesApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
  }
}

export const deleteCategoryApi = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/categories/delete/${id}`, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
  }
}

export const updateCategoryApi = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/categories/update/${id}`, data, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
  }
}