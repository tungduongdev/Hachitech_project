"use client"
import api from './axiosClient';

export const loginApi = async (data) => {
  try {
    const response = await api.post(`/users/login`, data);
    console.log("Cookie sau khi login:", document.cookie); // Kiểm tra cookie trong frontend
    return response;
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
  }
};

export const logoutApi = async () => {
  try {
    const response = await api.post(`/users/logout`, {
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
    const response = await api.get(`/products`);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
  }
}

export const deleteProductApi = async (id) => {
  try {
    const response = await api.delete(`/products/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
  }
}

export const addProductApi = async (data) => {
  try {
    const response = await api.post(`/products/create`, data);
    return response;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
  }
}

export const updateProductApi = async (id, data) => {
  try {
    const response = await api.put(`/products/update/${id}`, data);
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
  }
}

export const getProductByIdApi = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo ID:", error);
  }
}

// API cho danh mục
export const addCategoryApi = async (data) => {
  try {
    const response = await api.post(`/categories/create`, data);
    return response;
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
  }
}
export const getCategoriesApi = async () => {
  try {
    const response = await api.get(`/categories`);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
  }
}

export const deleteCategoryApi = async (id) => {
  try {
    const response = await api.delete(`/categories/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
  }
}

export const updateCategoryApi = async (id, data) => {
  try {
    const response = await api.put(`/categories/update/${id}`, data);
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
  }
}

export const getCategoryByIdApi = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục theo ID:", error);
  }
}

export const getCategoriesByNameApi = async (name) => {
  try {
    const response = await api.get(`/categories/find/${name}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm danh mục theo tên:", error);
  }
}

export const getProductsByCategoryApi = async (id) => {
  try {
    const response = await api.get(`/products/category-with-products/${id}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
  }
}

export const getUserApi = async () => {
  try {
    const response = await api.get(`/users/me`);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
  }
}