import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/v1` : 'https://192.168.1.50:3000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.get(`${API_BASE_URL}/user/refreshToken`, {
          withCredentials: true,
        });

        const newToken = refreshResponse.data.data.accessToken;
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear token
        localStorage.removeItem('accessToken');
        
        // Only redirect if not already on login/signup page
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/sign-up') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  getLoginStatus: () => api.get('/user/loginStatus'),
  login: (credentials) => api.post('/user/login', credentials),
  register: (formData) => api.post('/user/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  logout: () => api.post('/user/logout'),
  refreshToken: () => api.get('/user/refreshToken'),
  sendOTP: (email) => api.post('/user/getOTP', { email }),
  updateUser: (formData) => api.put('/user/update', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updatePassword: (data) => api.put('/user/updatePassword', data),
};

export const callAPI = {
  getCallHistory: () => api.get('/calls/history'),
};

export const contactAPI = {
  getContacts: () => api.get('/contact/getContacts'),
  getContactRequests: (type) => api.get('/contact/getContactRequests', { params: { type } }),
  sendRequest: (email) => api.post('/contact/sendRequest', { email }),
  acceptRequest: (requestId, accept) => api.post('/contact/decideRequest', { requestId, accept }),
  removeContact: (requestId) => api.delete(`/contact/removeContact/${requestId}`),
};

export default api;

