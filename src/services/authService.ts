import axiosClient from '../config/axiosClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export enum CounterSessionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED'
}

export interface CounterSessionDto {
  id: number;
  userId: number;
  counterId: number;
  branchId: number;
  status: CounterSessionStatus;
  fullName: string;
  startedAt: string;
  endedAt: string;
}

export const authService = {
  login: async (username: string, password: string) => {
    // API Route: /api/v1/auth/login
    // Do axiosClient cấu hình baseURL là 'http://localhost:8080/api'
    // Nên đường dẫn gửi ở đây chỉ cần '/v1/auth/login'
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
  },

  startCounterSession: async (counterId: string | number) => {
    return axiosClient.post<any, any>(API_ENDPOINTS.AUTH.COUNTER_SESSIONS.START, {
      counterId: Number(counterId)
    });
  },

  getActiveCounterSession: async () => {
    return axiosClient.get<any, any>(API_ENDPOINTS.AUTH.COUNTER_SESSIONS.ACTIVE);
  }
};
