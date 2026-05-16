import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueueStore } from '@/stores/useQueueStore';
import { ticketService } from '@/services/ticketService';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import type { QueueItemDto, SuspendedTicketDto } from '@/services/ticketService';

type TabType = 'queue' | 'postponed' | 'cancelled';
type TicketTabType = 'queue' | 'postponed';
type TicketItem = QueueItemDto | SuspendedTicketDto;

interface TabConfig {
  numberColor: string;
  dotColor: string;
  actionButtonColor: string;
  actionButtonBg: string;
  timeIcon: string;
  getTimeLabel: (ticket: TicketItem) => string;
  buttons: Array<{ icon: string; title: string; color: string; bg: string }>;
}

const tabConfigs: Record<TicketTabType, TabConfig> = {
  queue: {
    numberColor: 'text-[#003063]',
    dotColor: 'bg-blue-500',
    actionButtonColor: 'text-[#003063]',
    actionButtonBg: 'hover:bg-blue-50',
    timeIcon: 'avg_time',
    getTimeLabel: () => 'Vừa xong',
    buttons: [
      { icon: 'campaign', title: 'Gọi số', color: 'text-[#003063]', bg: 'hover:bg-blue-50' },
      { icon: 'more_time', title: 'Tạm hoãn', color: 'text-slate-500', bg: 'hover:bg-slate-100' },
      { icon: 'close', title: 'Hủy bỏ', color: 'text-red-500', bg: 'hover:bg-red-50' }
    ]
  },
  postponed: {
    numberColor: 'text-amber-600',
    dotColor: 'bg-amber-500',
    actionButtonColor: 'text-amber-600',
    actionButtonBg: 'hover:bg-amber-50',
    timeIcon: 'schedule',
    getTimeLabel: (ticket) => {
      const suspendedTicket = ticket as SuspendedTicketDto;
      return suspendedTicket.skipExpireAt ? new Date(suspendedTicket.skipExpireAt).toLocaleTimeString('vi-VN') : '--:--';
    },
    buttons: [
      { icon: 'undo', title: 'Tham gia lại', color: 'text-amber-600', bg: 'hover:bg-amber-50' }
    ]
  }
};

const renderTicketRow = (ticket: TicketItem, idx: number, tabType: TicketTabType, onRejoin?: (ticketId: number) => void) => {
  const config = tabConfigs[tabType];
  const isVIP = ticket.segmentCode === 'VIP';

  return (
    <div key={ticket.ticketId || idx} className={`grid grid-cols-4 px-6 py-4 items-center transition-colors ${isVIP ? 'bg-amber-50/30 hover:bg-amber-50/60' : 'hover:bg-slate-50'}`}>
      <div className="flex items-center gap-3">
        <span className={`text-base md:text-lg font-bold ${config.numberColor} uppercase`}>{ticket.ticketNo}</span>
        {isVIP ? (
          <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-1.5 py-[2px] rounded text-[8px] md:text-[9px] font-bold uppercase tracking-wider">VIP</span>
        ) : (
          <span className={`w-1.5 h-1.5 ${config.dotColor} rounded-full`}></span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[#191c20] font-semibold text-xs md:text-sm">
          {ticket.requestGroupName || `Loại DS ${ticket.requestGroupId}`}
        </span>
        {ticket.segmentName && (
          <span className="text-slate-500 text-[10px] md:text-[11px] font-medium">
            {ticket.segmentName}
          </span>
        )}
      </div>
      <div className={`flex items-center gap-2 ${tabType === 'queue' ? 'text-slate-500' : 'text-amber-600'}`}>
        <span className="material-symbols-outlined text-[15px] md:text-[17px]">{config.timeIcon}</span>
        <span className="font-medium text-[12px] md:text-[13px]">
          {config.getTimeLabel(ticket)}
        </span>
      </div>
      <div className="flex justify-end gap-1 md:gap-2">
        {config.buttons.map((btn: { icon: string; title: string; color: string; bg: string }, btnIdx: number) => (
          <button 
            key={btnIdx}
            className={`cursor-pointer p-1.5 md:p-2 ${btn.color} ${btn.bg} rounded-full transition-colors flex items-center justify-center`} 
            title={btn.title}
            onClick={() => tabType === 'postponed' && onRejoin && onRejoin(ticket.ticketId)}
          >
            <span className="material-symbols-outlined text-[18px] md:text-[20px]">{btn.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default function QueueListSection() {
  const [activeTab, setActiveTab] = useState<TabType>('queue');
  const [currentPage, setCurrentPage] = useState(1);
  const [rejoinLoading, setRejoinLoading] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [ticketToRejoin, setTicketToRejoin] = useState<number | null>(null);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const itemsPerPage = 8;
  
  const { queueTickets, isLoadingQueue, suspendedTickets, isLoadingSuspended, fetchSuspendedTickets } = useQueueStore();

  const handleRejoin = (ticketId: number) => {
    setTicketToRejoin(ticketId);
    setIsConfirmOpen(true);
  };

  const handleConfirmRejoin = async () => {
    if (ticketToRejoin === null) return;
    
    try {
      setRejoinLoading(ticketToRejoin);
      await ticketService.rejoinTicket(ticketToRejoin);
      // Refresh the suspended tickets list
      await fetchSuspendedTickets();
      setIsConfirmOpen(false);
      setTicketToRejoin(null);
    } catch (error: any) {
      console.error('Error rejoining ticket:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi tham gia lại';
      setErrorMessage(errorMsg);
      setIsErrorOpen(true);
      setIsConfirmOpen(false);
    } finally {
      setRejoinLoading(null);
    }
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setTicketToRejoin(null);
  };

  const handleCloseError = () => {
    setIsErrorOpen(false);
    setErrorMessage('');
    setTicketToRejoin(null);
  };

  // Lọc chỉ hiển thị tickets có status WAITING trong tab "Hàng đợi"
  const waitingTickets = queueTickets.filter(ticket => ticket.status === 'WAITING' || !ticket.status);

  // Temporary calculate count mapping
  const counts = {
    queue: waitingTickets.length,
    postponed: suspendedTickets.length,
    cancelled: 0
  };

  // Pagination logic
  const totalPages = Math.ceil(waitingTickets.length / itemsPerPage);
  const paginatedQueue = waitingTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Pagination logic for suspended tickets
  const totalSuspendedPages = Math.ceil(suspendedTickets.length / itemsPerPage);
  const paginatedSuspended = suspendedTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 md:gap-6 border-b border-slate-200 flex-wrap relative">
          <button 
            onClick={() => setActiveTab('queue')}
            className={`cursor-pointer relative text-sm md:text-base font-bold tracking-tight pb-2 flex items-center gap-2 transition-colors ${activeTab === 'queue' ? 'text-[#003063]' : 'text-slate-400 hover:text-[#003063]'}`}
          >
            Hàng đợi
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${activeTab === 'queue' ? 'bg-[#003063] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
              {counts.queue}
            </span>
            {activeTab === 'queue' && (
              <motion.div layoutId="c-tab-indicator" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#003063]" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('postponed')}
            className={`cursor-pointer relative text-sm md:text-base font-bold tracking-tight pb-2 flex items-center gap-2 transition-colors ${activeTab === 'postponed' ? 'text-amber-600' : 'text-slate-400 hover:text-amber-600'}`}
          >
            Tạm hoãn
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${activeTab === 'postponed' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
              {counts.postponed}
            </span>
            {activeTab === 'postponed' && (
              <motion.div layoutId="c-tab-indicator" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-amber-600" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('cancelled')}
            className={`cursor-pointer relative text-sm md:text-base font-bold tracking-tight pb-2 flex items-center gap-2 transition-colors ${activeTab === 'cancelled' ? 'text-red-600' : 'text-slate-400 hover:text-red-600'}`}
          >
            Đã hủy
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${activeTab === 'cancelled' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
              {counts.cancelled}
            </span>
            {activeTab === 'cancelled' && (
              <motion.div layoutId="c-tab-indicator" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-red-600" />
            )}
          </button>
        </div>
        <div className="flex gap-2 shrink-0">
          <span className="px-3 py-1 bg-white rounded-full text-[11px] font-bold text-slate-500 border border-slate-200/60 shadow-sm whitespace-nowrap">
            Cập nhật: --:--:--
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden w-full">
        <div className="overflow-x-auto overflow-y-hidden w-full">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-4 px-6 py-4 border-b border-slate-100 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              <span>Số thứ tự</span>
              <span>Loại dịch vụ</span>
              <span>Thời gian chờ</span>
              <span className="text-right">Hành động</span>
            </div>
            
            {/* Tab content wrapper with AnimatePresence */}
            <AnimatePresence mode="wait">
              {(activeTab === 'queue' || activeTab === 'postponed') && (
                <motion.div 
                  key={`${activeTab}-list`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="divide-y divide-slate-50"
                >
                  {activeTab === 'queue' ? (
                    isLoadingQueue ? (
                      <div className="py-8 text-center text-slate-400 font-medium">Đang tải dữ liệu hàng đợi...</div>
                    ) : waitingTickets.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 font-medium">Chưa có khách chờ trong hàng đợi.</div>
                    ) : (
                      paginatedQueue.map((ticket, idx) => renderTicketRow(ticket, idx, 'queue', handleRejoin))
                    )
                  ) : (
                    isLoadingSuspended ? (
                      <div className="py-8 text-center text-slate-400 font-medium">Đang tải dữ liệu vé tạm hoãn...</div>
                    ) : suspendedTickets.length === 0 ? (
                      <div className="py-16 flex flex-col items-center justify-center text-amber-500/60">
                        <span className="material-symbols-outlined text-4xl mb-3">hourglass_empty</span>
                        <p className="text-sm font-medium text-amber-600/70">Chưa có giao dịch tạm hoãn.</p>
                      </div>
                    ) : (
                      paginatedSuspended.map((ticket, idx) => renderTicketRow(ticket, idx, 'postponed', handleRejoin))
                    )
                  )}
                </motion.div>
              )}

              {activeTab === 'cancelled' && (
                <motion.div 
                  key="cancelled-list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="py-16 flex flex-col items-center justify-center text-red-400/60"
                >
                  <span className="material-symbols-outlined text-4xl mb-3">cancel</span>
                  <p className="text-sm font-medium text-red-500/70">Chưa có vé nào bị hủy.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination Controls */}
        {activeTab === 'queue' && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Hiển thị <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, waitingTickets.length)}</span> trong tổng số <span className="font-semibold text-slate-700">{waitingTickets.length}</span> vé
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang trước"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                      currentPage === i + 1
                        ? 'bg-[#003063] text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang sau"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}

        {/* Pagination Controls for Postponed */}
        {activeTab === 'postponed' && totalSuspendedPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Hiển thị <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, suspendedTickets.length)}</span> trong tổng số <span className="font-semibold text-slate-700">{suspendedTickets.length}</span> vé
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang trước"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalSuspendedPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                      currentPage === i + 1
                        ? 'bg-amber-600 text-white'
                        : 'border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalSuspendedPages, p + 1))}
                disabled={currentPage === totalSuspendedPages}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang sau"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Rejoin Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmRejoin}
        title="Xác nhận tham gia lại"
        message={`Bạn có chắc chắn muốn cho phép vé ${suspendedTickets.find(t => t.ticketId === ticketToRejoin)?.ticketNo || ''} tham gia lại hàng đợi?`}
        confirmText="Đồng ý"
        cancelText="Hủy"
        variant="info"
        isLoading={rejoinLoading === ticketToRejoin}
      />
      {/* Error Dialog */}
      <ConfirmDialog
        isOpen={isErrorOpen}
        onClose={handleCloseError}
        onConfirm={handleCloseError}
        title="Thất bại"
        message={errorMessage}
        confirmText="Đóng"
        variant="danger"
      />    </section>
  );
}
