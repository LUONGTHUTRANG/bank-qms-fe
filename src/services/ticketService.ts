import axiosClient from "@/config/axiosClient";

export enum TicketStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  SERVING = 'SERVING',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
  SKIPPED = 'SKIPPED',
  TRANSFERRED = 'TRANSFERRED'
}

export interface TicketDto {
  id: number;
  branchId: number;
  businessDate: string;
  ticketNo: string;
  requestGroupId: number;
  serviceTypeId: number;
  customerSegmentId: number;
  phoneNumber: string;
  status: TicketStatus;
  rejoinCount: number;
  skipExpireAt: string;
  waitCreditSeconds: number;
  callAttemptCount: number;
  currentCounterId: number;
  lastCalledAt: string;
  servingAt: string;
  doneAt: string;
  cancelledAt: string;
  createdAt: string;
}

export interface QueueItemDto {
  ticketId: number;
  ticketNo: string;
  score: number;
  requestGroupId: number;
  requestGroupName?: string;
  segmentId?: number;
  segmentCode?: string;
  segmentName?: string;
  status?: string; // WAITING, CALLED, SERVING, etc.
  // Các field khác từ response có thể có
}

export interface SuspendedTicketDto {
  ticketId: number;
  ticketNo: string;
  score: number;
  requestGroupId: number;
  requestGroupName: string;
  segmentId: number;
  segmentCode: string;
  segmentName: string;
  skipExpireAt: string;
  rejoinCount: number;
}

export interface SessionInfoDto {
  counterId: number;
  userId: number;
  waitingCount: number;
  completedCount: number;
  sessionDurationSeconds: number;
}

export interface TicketStatusUpdateRequest {
  status: TicketStatus | string;
  reasonId?: number;
  reason?: string;
}

export const ticketService = {
  getQueueTickets: async (): Promise<QueueItemDto[]> => {
    const res = await axiosClient.get('/v1/ticket/tickets/next-in-queue');
    return res?.data || res;
  },

  getTopics: async (): Promise<string[]> => {
    const res = await axiosClient.get('/v1/ticket/tickets/topics');
    return res?.data || res;
  },

  callNext: async (): Promise<TicketDto> => {
    const res = await axiosClient.post('/v1/ticket/tickets/call-next');
    return res?.data || res;  },

  getCurrentTicket: async (): Promise<TicketDto | null> => {
    const res = await axiosClient.get('/v1/ticket/tickets/current');
    return res?.data || res;  },

  updateTicketStatus: async (id: number, status: string): Promise<TicketDto> => {
    const res = await axiosClient.put(`/v1/ticket/tickets/${id}/status`, { status }, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res?.data || res;
  },

  updateTicketStatusWithReason: async (id: number, request: TicketStatusUpdateRequest): Promise<TicketDto> => {
    const res = await axiosClient.put(`/v1/ticket/tickets/${id}/status`, request, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res?.data || res;
  },

  getSessionInfo: async (): Promise<SessionInfoDto> => {
    const res = await axiosClient.get('/v1/ticket/tickets/session-info');
    return res?.data || res;
  },

  getSuspendedTickets: async (): Promise<SuspendedTicketDto[]> => {
    const res = await axiosClient.get('/v1/ticket/tickets/suspended-tickets');
    // Handle response wrapper if present
    if (res?.data && Array.isArray(res.data)) {
      return res.data;
    } else if (res?.data?.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return res?.data || res || [];
  },

  rejoinTicket: async (id: number): Promise<TicketDto> => {
    const res = await axiosClient.post(`/v1/ticket/tickets/${id}/rejoin`, {}, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res?.data || res;
  }
};