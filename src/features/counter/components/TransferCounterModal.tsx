import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransferCounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (counterId: string) => void;
}

const MOCK_COUNTERS = [
  { id: 'c1', name: 'Counter 01', type: 'Giao dịch cá nhân', status: 'idle' },
  { id: 'c2', name: 'Counter 02', type: 'Doanh nghiệp', status: 'serving' },
  { id: 'c4', name: 'Counter 04', type: 'Giao dịch cá nhân', status: 'idle' },
  { id: 'c5', name: 'Counter 05', type: 'Tổng hợp', status: 'serving' },
];

export default function TransferCounterModal({ isOpen, onClose, onConfirm }: TransferCounterModalProps) {
  const [selectedCounter, setSelectedCounter] = useState<string>('');

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCounter('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (selectedCounter) {
      onConfirm(selectedCounter);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative m-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-[#003063] flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                </div>
                Chuyển quầy phục vụ
              </h3>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded-full transition-colors leading-none"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {/* Current Customer Info */}
              <div className="mb-6 bg-blue-50/70 p-4 rounded-xl border border-blue-100/50 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Khách hàng hiện tại</div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-[#003063]">A105</span>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-slate-200/60 text-[11px] font-bold text-slate-600">
                  Giao dịch cá nhân
                </span>
              </div>

              {/* Counter Selection */}
              <div className="space-y-3 px-2">
                <label className="text-sm font-bold text-slate-700 flex justify-between items-end">
                  <span>Chọn quầy để chuyển đến</span>
                  {selectedCounter && <span className="text-xs font-medium text-blue-600">Đã chọn 1 quầy</span>}
                </label>
                <div className="max-h-[220px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                  {MOCK_COUNTERS.map(counter => (
                    <button
                      key={counter.id}
                      onClick={() => setSelectedCounter(counter.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200
                        ${selectedCounter === counter.id 
                          ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500 shadow-sm' 
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${selectedCounter === counter.id ? 'border-blue-600' : 'border-slate-300'}`}>
                          {selectedCounter === counter.id && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                        </div>
                        <div>
                          <div className={`font-bold ${selectedCounter === counter.id ? 'text-blue-800' : 'text-slate-700'}`}>
                            {counter.name}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{counter.type}</div>
                        </div>
                      </div>
                      <div className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5
                        ${counter.status === 'idle' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${counter.status === 'idle' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {counter.status === 'idle' ? 'Đang rảnh' : 'Đang bận'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirm}
                disabled={!selectedCounter}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2
                  ${selectedCounter 
                    ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md cursor-pointer' 
                    : 'bg-slate-300 cursor-not-allowed'}`}
              >
                Xác nhận chuyển
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}