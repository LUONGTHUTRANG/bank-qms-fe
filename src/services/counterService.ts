import axiosClient from '../config/axiosClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export interface ServiceCounterDto {
  id: number;
  branchId: number;
  name: string;
  code: string;
  isActive: boolean;
}

export const counterService = {
  getServiceCountersByBranch: async (branchId: number) => {
    const res = await axiosClient.get(`${API_ENDPOINTS.MANAGEMENT.SERVICE_COUNTERS_BY_BRANCH}/${branchId}`);
    return res;
  },
};
