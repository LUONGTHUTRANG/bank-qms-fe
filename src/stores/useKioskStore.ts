import { create } from 'zustand';

interface KioskState {
  customerSegmentCode: string | null;
  customerSegmentId: number | null; // Cần xác định ID tương ứng code
  phoneNumber: string;
  requestGroupId: number | null;
  prefixCode: string | null;

  setCustomerSegment: (code: string, id: number) => void;
  setPhoneNumber: (phone: string) => void;
  setRequestGroup: (id: number, prefix: string) => void;
  reset: () => void;
}

export const useKioskStore = create<KioskState>((set) => ({
  customerSegmentCode: null,
  // Tạm map ID dựa trên chuẩn (có thể đổi lại nếu BE cấu hình khác): PERSONAL=1, VIP=2, BUSINESS=3
  customerSegmentId: null,
  phoneNumber: '',
  requestGroupId: null,
  prefixCode: null,

  setCustomerSegment: (code, id) => set({ customerSegmentCode: code, customerSegmentId: id }),
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),
  setRequestGroup: (id, prefix) => set({ requestGroupId: id, prefixCode: prefix }),
  reset: () => set({ 
    customerSegmentCode: null, 
    customerSegmentId: null, 
    phoneNumber: '', 
    requestGroupId: null, 
    prefixCode: null 
  }),
}));
