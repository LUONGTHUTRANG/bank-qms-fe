import axiosClient from '../config/axiosClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export interface Service {
  id: number;
  requestGroupId: number;
  code: string;
  name: string;
  averageServiceMinutes: number;
  priorityWeight: number;
  slaMinutes: number;
  isActive: boolean;
}

export interface RequestGroupDto {
  id: number;
  code: string;
  prefixCode: string;
  name: string;
  description: string;
  isActive: boolean;
  services?: Service[];
}

export interface ReasonDto {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'TRANSFER' | 'CANCEL' | 'HOLD' | 'SKIP';
  icon?: string;
  isActive: boolean;
}

export interface TicketCreateRequest {
  branchId: number;
  prefixCode: string;
  requestGroupId: number;
  customerSegmentId: number;
  phoneNumber: string;
}

export const kioskService = {
  getCustomerSegments: async () => {
    const res = await axiosClient.get('/v1/management/customer-segments');
    return res;
  },

  getRequestGroups: async () => {
    const res = await axiosClient.get(API_ENDPOINTS.MANAGEMENT.REQUEST_GROUPS);
    return res;
  },

  createTicket: async (data: TicketCreateRequest) => {
    const res = await axiosClient.post(API_ENDPOINTS.TICKET.CREATE, data);
    return res;
  },

  checkCustomerSegment: async (data: { phoneNumber: string; customerSegmentId: number }) => {
    const res = await axiosClient.post(API_ENDPOINTS.MANAGEMENT.CHECK_SEGMENT, data);
    return res;
  },

  getReasons: async (type: 'TRANSFER' | 'CANCEL' | 'HOLD' | 'SKIP') => {
    const res = await axiosClient.get('/v1/management/reasons', {
      params: { type }
    });
    return res;
  },
};
