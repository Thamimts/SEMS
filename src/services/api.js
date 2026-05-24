import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sems_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sems_token');
      localStorage.removeItem('sems_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  verifyOtp: (data) => api.post('/verify-otp', data),
  resendOtp: (data) => api.post('/resend-otp', data),
  logout: () => api.post('/logout'),
};

// Live location APIs
export const locationAPI = {
  update: (data) => api.post('/location/update', data),
  getCurrent: () => api.get('/location/current'),
};

// Vehicle APIs
export const vehicleAPI = {
  register: (data) => api.post('/vehicle/register', data),
  getVehicles: () => api.get('/vehicle/list'),
  updateVehicle: (id, data) => api.put(`/vehicle/${id}`, data),
  deleteVehicle: (id) => api.delete(`/vehicle/${id}`),
};

// Emergency APIs
export const emergencyAPI = {
  activate: (payload) => api.post('/emergency/activate', payload),
  deactivate: (data) => api.post('/emergency/deactivate', data),
  getStatus: (emergencyId) => api.get(`/emergency/${emergencyId}`),
  getActive: () => api.get('/emergency/active'),
  getHistory: (limit = 10) => api.get(`/emergency/history?limit=${limit}`),
};

// Hospital APIs
export const hospitalAPI = {
  getNearby: (params) => api.get('/nearby-hospitals', { params }),
  verify: (data) => api.post('/hospital/verify', data),
  confirmArrival: (data) => api.post('/hospital/confirm-arrival', data),
  getVerificationLogs: () => api.get('/hospital/verification-logs'),
};

// Traffic APIs
export const trafficAPI = {
  getStatus: (params) => api.get('/traffic-status', { params }),
  getSignalStatus: (params) => api.get('/traffic/signals', { params }),
  requestGreenCorridor: (data) => api.post('/traffic/green-corridor', data),
};

// V2X Communication APIs
export const v2xAPI = {
  broadcast: (payload) => api.post('/v2x/broadcast', payload),
  getStats: () => api.get('/v2x/stats'),
  getNearbyVehicles: (params) => api.get('/v2x/nearby-vehicles', { params }),
};

// Emergency Contacts APIs
export const contactsAPI = {
  add: (data) => api.post('/emergency-contacts/add', data),
  getContacts: () => api.get('/emergency-contacts/list'),
  deleteContact: (id) => api.delete(`/emergency-contacts/${id}`),
  updateContact: (id, data) => api.put(`/emergency-contacts/${id}`, data),
};

// Admin APIs
export const adminAPI = {
  getActiveEmergencies: () => api.get('/admin/emergencies/active'),
  getAllEmergencies: (filters) => api.get('/admin/emergencies', { params: filters }),
  getAnalytics: (period = '24h') => api.get(`/admin/analytics?period=${period}`),
  getFakeEmergencies: () => api.get('/admin/emergencies/fake'),
  flagFakeEmergency: (id) => api.post(`/admin/emergencies/${id}/flag-fake`),
  getTrafficAnalytics: () => api.get('/admin/analytics/traffic'),
  getV2XStats: () => api.get('/admin/analytics/v2x'),
  getVerificationLogs: () => api.get('/admin/logs/verification'),
};

export default api;
