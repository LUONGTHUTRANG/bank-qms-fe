import { create } from 'zustand';
import { ticketService, type QueueItemDto, type TicketDto, type TicketStatusUpdateRequest, type SuspendedTicketDto } from '@/services/ticketService';
import { toast } from '@/stores/useToastStore';

interface QueueState {
  queueTickets: QueueItemDto[];
  isLoadingQueue: boolean;
  suspendedTickets: SuspendedTicketDto[];
  isLoadingSuspended: boolean;
  currentTicket: TicketDto | null;
  isCalling: boolean;
  
  fetchQueue: () => Promise<void>;
  addTicketToQueue: (newTicket: any) => void;
  updateTicketStatusInQueue: (ticketId: number, newStatus: string) => void;
  fetchSuspendedTickets: () => Promise<void>;
  addSuspendedTicket: (ticket: any) => void;
  removeSuspendedTicket: (ticketId: number) => void;
  callNextTicket: () => Promise<TicketDto | null>;
  fetchCurrentTicket: () => Promise<TicketDto | null>;
  updateCurrentTicketStatus: (status: string) => Promise<TicketDto | null>;
  updateCurrentTicketStatusWithReason: (request: TicketStatusUpdateRequest) => Promise<TicketDto | null>;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  suspendedTickets: [],
  isLoadingSuspended: false,
  queueTickets: [],
  isLoadingQueue: false,
  currentTicket: null,
  isCalling: false,
  
  fetchQueue: async () => {
    set({ isLoadingQueue: true });
    try {
      const data = await ticketService.getQueueTickets();
      // data might be wrapped in a page or data property depending on standard response envelope.
      // Assuming it's an array based on the user's prompt.
      if (Array.isArray(data)) {
        set({ queueTickets: data });
      } else if (data && (data as any).data && Array.isArray((data as any).data)) {
         set({ queueTickets: (data as any).data });
      }
    } catch (error) {
      console.error('Error fetching queue tickets', error);
      toast.error('Lỗi khi tải danh sách hàng đợi');
    } finally {
      set({ isLoadingQueue: false });
    }
  },
  
  addTicketToQueue: (newTicket) => {
    // Thêm vé mới vào danh sách và sắp xếp giảm dần theo điểm ưu tiên (score)
    set((state) => {
      const exists = state.queueTickets.find(t => t.ticketId === newTicket.ticketId);
      if (exists) return state; // Avoid duplicate
      
      // Không thêm vé với status SKIPPED_HOLD vào queue
      if (newTicket.status === 'SKIPPED_HOLD') {
        return state; // Ticket này sẽ được xử lý bởi addSuspendedTicket
      }

      // Create a compatible object from event data
      const queueItem: QueueItemDto = {
        ticketId: newTicket.ticketId,
        ticketNo: newTicket.ticketNo,
        score: newTicket.score || 0, 
        requestGroupId: newTicket.requestGroupId,
        requestGroupName: newTicket.requestGroupName,
        segmentId: newTicket.segmentId,
        segmentCode: newTicket.segmentCode,
        segmentName: newTicket.segmentName,
        status: newTicket.status || 'WAITING'
      };
      
      const newQueue = [...state.queueTickets, queueItem];
      // Sắp xếp các vé: điểm cao hơn (ưu tiên hơn) xếp trước
      newQueue.sort((a, b) => (b.score || 0) - (a.score || 0));
      
      return { queueTickets: newQueue };
    });
  },

  updateTicketStatusInQueue: (ticketId: number, newStatus: string) => {
    set((state) => {
      // Chỉ xoá vé có ticketId tương ứng khỏi queue, không xoá các vé khác
      // Nếu newStatus không phải WAITING, vé này sẽ được xoá
      const filteredQueue = state.queueTickets.filter(ticket => 
        ticket.ticketId !== ticketId
      );
      return { queueTickets: filteredQueue };
    });
  },

  fetchSuspendedTickets: async () => {
    set({ isLoadingSuspended: true });
    try {
      const data = await ticketService.getSuspendedTickets();
      if (Array.isArray(data)) {
        set({ suspendedTickets: data });
      } else {
        set({ suspendedTickets: [] });
      }
    } catch (error) {
      console.error('Error fetching suspended tickets', error);
      toast.error('Lỗi khi tải danh sách vé tạm hoãn');
      set({ suspendedTickets: [] });
    } finally {
      set({ isLoadingSuspended: false });
    }
  },

  callNextTicket: async () => {
    set({ isCalling: true });
    try {
      const ticket = await ticketService.callNext();
      if (ticket) {
        set({ currentTicket: ticket });
        // Xóa vé đó khỏi hàng đợi nếu nó có trong đó
        set((state) => ({
          queueTickets: state.queueTickets.filter(t => t.ticketNo !== ticket.ticketNo)
        }));
        return ticket;
      }
      return null;
    } catch (error: any) {
      console.error('Error calling next ticket:', error);
      if (error.response?.status === 404 || error.response?.status === 400) {
         toast.error(error.response?.data?.message || 'Không có khách hàng nào đang đợi');
      } else {
         toast.error('Lỗi khi gọi số tiếp theo. Vui lòng thử lại.');
      }
      return null;
    } finally {
      set({ isCalling: false });
    }
  },

  fetchCurrentTicket: async () => {
    try {
      const ticket = await ticketService.getCurrentTicket();
      if (ticket) {
        set({ currentTicket: ticket });
        return ticket;
      }
      return null;
    } catch (error: any) {
      console.error('Error fetching current ticket:', error);
      // Nếu 404 tưởng đương với chưa gọi ai, return null thay vì error
      return null;
    }
  },

  updateCurrentTicketStatus: async (status: string) => {
    const { currentTicket } = get();
    if (!currentTicket) return null;

    try {
      const updatedTicket = await ticketService.updateTicketStatus(currentTicket.id, status);
      set({ currentTicket: updatedTicket });
      toast.success(`Đã cập nhật trạng thái phiếu thành: ${status}`);
      return updatedTicket;
    } catch (error: any) {
      console.error('Error updating ticket status:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật trạng thái vé. Vui lòng thử lại.';
      toast.error(errorMsg);
      return null;
    }
  },

  updateCurrentTicketStatusWithReason: async (request: TicketStatusUpdateRequest) => {
    const { currentTicket } = get();
    if (!currentTicket) return null;

    try {
      const updatedTicket = await ticketService.updateTicketStatusWithReason(currentTicket.id, request);
      set({ currentTicket: updatedTicket });
      toast.success(`Đã cập nhật trạng thái phiếu thành: ${request.status}`);
      return updatedTicket;
    } catch (error: any) {
      console.error('Error updating ticket status with reason:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật trạng thái vé. Vui lòng thử lại.';
      toast.error(errorMsg);
      return null;
    }
  },

  addSuspendedTicket: (ticket) => {
    set((state) => {
      // Kiểm tra vé đã tồn tại chưa
      const exists = state.suspendedTickets.find(t => t.ticketId === ticket.ticketId);
      if (exists) return state; // Avoid duplicate

      // Tạo SuspendedTicketDto từ event data
      const suspendedTicket: SuspendedTicketDto = {
        ticketId: ticket.ticketId,
        ticketNo: ticket.ticketNo,
        score: ticket.score || 0,
        requestGroupId: ticket.requestGroupId,
        requestGroupName: ticket.requestGroupName,
        segmentId: ticket.segmentId,
        segmentCode: ticket.segmentCode,
        segmentName: ticket.segmentName,
        skipExpireAt: ticket.skipExpireAt || new Date().toISOString(),
        rejoinCount: ticket.rejoinCount || 0
      };

      const newSuspended = [...state.suspendedTickets, suspendedTicket];
      // Sắp xếp theo score (cao hơn xếp trước)
      newSuspended.sort((a, b) => (b.score || 0) - (a.score || 0));

      return { suspendedTickets: newSuspended };
    });
  },

  removeSuspendedTicket: (ticketId: number) => {
    set((state) => {
      const filteredSuspended = state.suspendedTickets.filter(ticket => ticket.ticketId !== ticketId);
      return { suspendedTickets: filteredSuspended };
    });
  } }
));