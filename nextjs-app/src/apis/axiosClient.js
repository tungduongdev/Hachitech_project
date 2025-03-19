import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';
// Biến để theo dõi trạng thái refresh
let isRefreshing = false;
let failedQueue = [];

// Tạo instance của Axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Gửi cookie trong request
});

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Interceptor cho response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Đưa request vào queue để chờ refresh hoàn tất
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token
        const { data } = await axios.post(
          `${API_URL}/users/refresh-token`,
          {},
          { withCredentials: true } // Gửi cookie refreshToken
        );

        // Cập nhật accessToken trong header mặc định
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

        // Xử lý các request trong queue
        processQueue(null, data.accessToken);

        // Thử lại request ban đầu
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Logout nếu refresh thất bại
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;