import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TransferCounterModal from './TransferCounterModal';
import { useQueueStore } from '@/stores/useQueueStore';

export default function CurrentServingCard() {
  const [servingState, setServingState] = useState<'idle' | 'calling' | 'serving' | 'completed'>('idle');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const { currentTicket, callNextTicket, isCalling, fetchCurrentTicket, updateCurrentTicketStatus } = useQueueStore();

  // Load current active ticket on mount
  useEffect(() => {
    const loadCurrentTicket = async () => {
      const ticket = await fetchCurrentTicket();
      if (ticket) {
        if (ticket.status === 'CALLED') {
          setServingState('calling');
          // Calculate elapsed time from lastCalledAt if provided
          if (ticket.lastCalledAt) {
            const calledTime = new Date(ticket.lastCalledAt).getTime();
            const now = new Date().getTime();
            setElapsedTime(Math.floor((now - calledTime) / 1000));
          }
        } else if (ticket.status === 'SERVING') {
          setServingState('serving');
          // Calculate elapsed time from servingAt if provided
          if (ticket.servingAt) {
            const servingTime = new Date(ticket.servingAt).getTime();
            const now = new Date().getTime();
            setElapsedTime(Math.floor((now - servingTime) / 1000));
          }
        }
      }
    };
    loadCurrentTicket();
  }, [fetchCurrentTicket]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (servingState === 'calling' || servingState === 'serving') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [servingState]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCallNext = async () => {
    const ticket = await callNextTicket();
    if (ticket) {
      setElapsedTime(0);
      setServingState('calling');
    }
  };

  const handleConfirmService = () => {
    setShowConfirmModal(true);
  };

  const confirmStartService = async () => {
    setShowConfirmModal(false);
    
    // Call API updates status to SERVING
    if (currentTicket) {
      const updated = await updateCurrentTicketStatus('SERVING');
      if (updated) {
        setElapsedTime(0);
        setServingState('serving');
      }
    } else {
      setElapsedTime(0);
      setServingState('serving');
    }
  };

  const handleCompleteService = async () => {
    if (currentTicket) {
      const updated = await updateCurrentTicketStatus('DONE');
      if (updated) {
        setServingState('completed');
      }
    } else {
      setServingState('completed');
    }
  };

  const handleEndService = () => {
    setServingState('completed');
  };

  const handleTransferServiceGroup = (serviceGroupId: string, reason: string) => {
    // Implement transfer logic here
    console.log('Transferred to service group:', serviceGroupId, 'Reason:', reason);
    setShowTransferModal(false);
    // Move to completed state as the session is removed from current counter
    setServingState('completed');
  };

  return (
    <>
      <section className="h-full bg-white p-7 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between relative overflow-hidden transition-all duration-300">

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
              Đang phục vụ • Counter 03
              {servingState === 'calling' && (
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[9px] flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"></span>
                  Đang chờ khách
                </span>
              )}
              {servingState === 'serving' && (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[9px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block relative"><span className="absolute inset-0 rounded-full bg-green-500 animate-ping"></span></span>
                  Đang xử lý
                </span>
              )}
              {servingState === 'completed' && (
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[9px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">done_all</span>
                  Đã kết thúc
                </span>
              )}
            </h2>
            <div className="flex items-baseline gap-6 mt-2">
              <h1 className={`text-5xl font-black tracking-tight transition-colors duration-300 
                ${servingState === 'idle' ? 'text-slate-300' : 'text-[#003063]'}`}>
                {servingState === 'idle' ? '----' : currentTicket ? currentTicket.ticketNo : '----'}
              </h1>
            </div>
          </div>
          
          <div className={`text-right flex flex-col items-end transition-opacity duration-300 ${servingState === 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block mb-3 transition-colors
              ${servingState === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-800'}`}>
              {currentTicket ? currentTicket.requestGroupId : 'Giao dịch cá nhân'} 
              {/* Lưu ý: Sau này có thể cần fetch tên requestGroup hoặc truyền vào DTO */}
            </span>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border inline-flex transition-colors duration-300
              ${servingState === 'serving' ? 'bg-green-50 border-green-100' : 
                servingState === 'completed' ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
              <span className={`material-symbols-outlined text-lg 
                ${servingState === 'serving' ? 'text-green-600 animate-spin-slow' : 
                  servingState === 'completed' ? 'text-slate-400' : 'text-slate-400'}`}>
                {servingState === 'serving' ? 'autorenew' : 
                 servingState === 'completed' ? 'check_circle' : 'hourglass_empty'}
              </span>
              <div className="flex flex-col text-left">
                <span className={`text-[9px] uppercase font-bold tracking-wider 
                  ${servingState === 'serving' ? 'text-green-700/70' : 
                    servingState === 'completed' ? 'text-slate-500' : 'text-slate-500/70'}`}>
                  {servingState === 'calling' ? 'TG Chờ khách' : 'Thời gian phục vụ'}
                </span>
                <span className={`text-lg font-black tabular-nums leading-none mt-0.5 
                  ${servingState === 'serving' ? 'text-green-700' : 
                    servingState === 'completed' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 relative z-10 flex-1 flex flex-col justify-end">
          {/* Actions when Calling */}
          {servingState === 'calling' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-4">
              <button 
                onClick={handleConfirmService}
                className="cursor-pointer flex flex-col items-center justify-center py-4 px-2 gap-2 bg-[#10B981] text-white rounded-xl shadow-[0_4px_14px_rgba(16,185,129,0.3)] border border-[#059669] hover:bg-[#059669] hover:-translate-y-0.5 active:translate-y-0 transition-all group"
              >
                <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform">how_to_reg</span>
                <span className="text-[13px] font-extrabold uppercase tracking-tight">Xác nhận có mặt</span>
              </button>
              
              <button className="cursor-pointer flex flex-col items-center justify-center py-4 px-2 gap-2 bg-[#F0F5FF] text-[#1E40AF] rounded-xl border border-[#BFDBFE] hover:bg-[#E0E7FF] hover:border-[#93C5FD] transition-all group">
                <span className="material-symbols-outlined text-[28px] group-hover:-rotate-12 transition-transform">campaign</span>
                <span className="text-[13px] font-extrabold uppercase tracking-tight">Gọi lại số</span>
              </button>

              <button 
                onClick={handleEndService}
                className="cursor-pointer flex flex-col items-center justify-center py-4 px-2 gap-2 bg-[#FAFAFA] text-[#64748B] rounded-xl border border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#475569] hover:border-[#CBD5E1] transition-all group"
              >
                <span className="material-symbols-outlined text-[28px] group-hover:scale-95 transition-transform">person_off</span>
                <span className="text-[13px] font-extrabold uppercase tracking-tight">Không đến (Bỏ qua)</span>
              </button>
            </motion.div>
          )}

          {/* Actions when Serving or Completed */}
          {(servingState === 'serving' || servingState === 'completed') && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button 
                onClick={servingState === 'serving' ? handleCompleteService : undefined} 
                disabled={servingState === 'completed'}
                className={`flex flex-col items-center justify-center gap-1 p-3 border rounded-xl transition-all
                  ${servingState === 'serving' 
                    ? 'cursor-pointer bg-green-50 text-green-700 border-green-200 hover:bg-green-100 shadow-sm' 
                    : 'cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200 opacity-60 grayscale'}`}
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span className="text-[11px] font-bold uppercase tracking-tight">Hoàn thành</span>
              </button>
              <button 
                onClick={servingState === 'serving' ? () => setShowTransferModal(true) : undefined}
                disabled={servingState === 'completed'}
                className={`flex flex-col items-center justify-center gap-1 p-3 border rounded-xl transition-all
                  ${servingState === 'serving' 
                    ? 'cursor-pointer bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-sm' 
                    : 'cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200 opacity-60 grayscale'}`}
              >
                <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                <span className="text-[11px] font-bold uppercase tracking-tight">Chuyển quầy</span>
              </button>
              <button 
                disabled={servingState === 'completed'}
                className={`flex flex-col items-center justify-center gap-1 p-3 border rounded-xl transition-all
                  ${servingState === 'serving' 
                    ? 'cursor-pointer bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 shadow-sm' 
                    : 'cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200 opacity-60 grayscale'}`}
              >
                <span className="material-symbols-outlined text-[20px]">pause_circle</span>
                <span className="text-[11px] font-bold uppercase tracking-tight">Tạm dừng</span>
              </button>
              <button 
                onClick={servingState === 'serving' ? handleEndService : undefined} 
                disabled={servingState === 'completed'}
                className={`flex flex-col items-center justify-center gap-1 p-3 border rounded-xl transition-all
                  ${servingState === 'serving' 
                    ? 'cursor-pointer bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-sm' 
                    : 'cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200 opacity-60 grayscale'}`}
              >
                <span className="material-symbols-outlined text-[20px]">cancel</span>
                <span className="text-[11px] font-bold uppercase tracking-tight">Hủy GD</span>
              </button>
            </motion.div>
          )}

          {/* Idle / Call Next Action */}
          {(servingState === 'idle' || servingState === 'serving' || servingState === 'completed') && (
            <button 
              onClick={handleCallNext}
              disabled={servingState === 'serving' || isCalling}
              className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-300
                ${(servingState === 'idle' || servingState === 'completed') && !isCalling
                  ? 'cursor-pointer bg-[#003063] hover:bg-[#00468c] text-white shadow-md group hover:scale-[1.01] active:scale-[0.98]' 
                  : 'cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200 opacity-60'}`}
            >
              {isCalling ? (
                <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
              ) : (
                <span className={`material-symbols-outlined text-[20px] ${(servingState === 'idle' || servingState === 'completed') ? 'group-hover:translate-x-1 transition-transform' : ''}`}>
                  arrow_forward
                </span>
              )}
              <span className="text-[15px] font-bold">
                {isCalling ? 'Đang gọi...' : 'Gọi số tiếp theo'}
              </span>
            </button>
          )}
        </div>
      </section>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowConfirmModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm p-6 relative z-10"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 mx-auto">
                <span className="material-symbols-outlined text-2xl">how_to_reg</span>
              </div>
              <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Xác nhận bắt đầu</h3>
              <p className="text-center text-slate-500 mb-6 text-sm">
                Khách hàng <strong className="text-[#003063] mx-1">{currentTicket ? currentTicket.ticketNo : '---'}</strong> đã có mặt. Bạn có chắc chắn muốn bắt đầu ca phục vụ này?
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="cursor-pointer py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={confirmStartService}
                  className="cursor-pointer py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20 rounded-xl font-semibold transition-colors"
                >
                  Bắt đầu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Service Group Modal */}
      <TransferCounterModal 
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onConfirm={handleTransferServiceGroup}
      />
    </>
  );
}