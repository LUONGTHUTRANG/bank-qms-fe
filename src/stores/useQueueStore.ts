import { create } from 'zustand';
import { ticketService, type QueueItemDto, type TicketDto } from '@/services/ticketService';
import { toast } from '@/stores/useToastStore';

interface QueueState {
  queueTickets: QueueItemDto[];
  isLoadingQueue: boolean;
  currentTicket: TicketDto | null;
  isCalling: boolean;
  
  fetchQueue: () => Promise<void>;
  addTicketToQueue: (newTicket: any) => void;
  callNextTicket: () => Promise<TicketDto | null>;
  fetchCurrentTicket: () => Promise<TicketDto | null>;
  updateCurrentTicketStatus: (status: string) => Promise<TicketDto | null>;
}

export const useQueueStore = create<QueueState>((set, get) => ({
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

      // Create a compatible object from event data
      const queueItem: QueueItemDto = {
        ticketId: newTicket.ticketId,
        ticketNo: newTicket.ticketNo,
        score: newTicket.score || 0, 
        requestGroupId: newTicket.requestGroupId,
        requestGroupName: newTicket.requestGroupName,
        segmentId: newTicket.segmentId,
        segmentCode: newTicket.segmentCode,
        segmentName: newTicket.segmentName
      };
      
      const newQueue = [...state.queueTickets, queueItem];
      // Sắp xếp các vé: điểm cao hơn (ưu tiên hơn) xếp trước
      newQueue.sort((a, b) => (b.score || 0) - (a.score || 0));
      
      return { queueTickets: newQueue };
    });
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
      toast.error('Lỗi khi cập nhật trạng thái vé. Vui lòng thử lại.');
      return null;
    }
  }
}));