import axiosClient from '../config/axiosClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const authService = {
  login: async (username: string, password: string) => {
    // API Route: /api/v1/auth/login
    // Do axiosClient cấu hình baseURL là 'http://localhost:8080/api'
    // Nên đường dẫn gọi ở đây chỉ cần '/v1/auth/login'
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password,
    });
    return response;
  },

  logout: async () => {
    return axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  getProfile: async () => {
    return axiosClient.get(API_ENDPOINTS.AUTH.PROFILE);
  }
};