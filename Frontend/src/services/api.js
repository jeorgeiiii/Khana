import axios from 'axios';

// Just update the URL, keep everything else exactly as is
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// User APIs
export const userApi = {
  getAllUsers: () => api.get('/user/all'),
  getUserById: (id) => api.get(`/user/${id}`),
  updateUser: (id, data) => api.put(`/user/update/${id}`, data),
  deleteUser: (id) => api.delete(`/user/delete/${id}`),
};

// Restaurant APIs
export const restaurantApi = {
  getAll: () => api.get('/resturant/getAll'),
  getById: (id) => api.get(`/resturant/get/${id}`),
  create: (data) => api.post('/resturant/create', data),
  update: (id, data) => api.put(`/resturant/update/${id}`, data),
  delete: (id) => api.delete(`/resturant/delete/${id}`),
  search: (query) => api.get(`/resturant/search?query=${query}`),
  getNearby: (coords) => api.post('/resturant/nearby', coords),
};

// Food APIs
export const foodApi = {
  getAll: () => api.get('/food/all'),
  getById: (id) => api.get(`/food/get/${id}`),
  getByRestaurant: (restaurantId) => api.get(`/food/restaurant/${restaurantId}`),
  create: (data) => api.post('/food/create', data),
  update: (id, data) => api.put(`/food/update/${id}`, data),
  delete: (id) => api.delete(`/food/delete/${id}`),
};

// Category APIs
export const categoryApi = {
  getAll: () => api.get('/category/all'),
  getById: (id) => api.get(`/category/get/${id}`),
  create: (data) => api.post('/category/create', data),
  update: (id, data) => api.put(`/category/update/${id}`, data),
  delete: (id) => api.delete(`/category/delete/${id}`),
};

// Order APIs
export const orderApi = {
  getAll: () => api.get('/order/all'),
  getById: (id) => api.get(`/order/get/${id}`),
  getByUser: (userId) => api.get(`/order/user/${userId}`),
  create: (data) => api.post('/order/create', data),
  updateStatus: (id, status) => api.put(`/order/status/${id}`, { status }),
  cancel: (id) => api.put(`/order/cancel/${id}`),
};

// Review APIs (if you create them)
export const reviewApi = {
  getByRestaurant: (restaurantId) => api.get(`/review/restaurant/${restaurantId}`),
  create: (data) => api.post('/review/create', data),
  update: (id, data) => api.put(`/review/update/${id}`, data),
  delete: (id) => api.delete(`/review/delete/${id}`),
  markHelpful: (id) => api.put(`/review/helpful/${id}`),
};

export default api;