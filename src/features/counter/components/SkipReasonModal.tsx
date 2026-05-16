import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReasonDto } from '@/services/kioskService';
import { kioskService } from '@/services/kioskService';

interface SkipReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reasonId: number, reason: string) => void;
}

export default function SkipReasonModal({ isOpen, onClose, onConfirm }: SkipReasonModalProps) {
  const [reasons, setReasons] = useState<ReasonDto[]>([]);
  const [selectedReason, setSelectedReason] = useState<ReasonDto | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch skip reasons on mount
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        setIsLoading(true);
        const res = await kioskService.getReasons('SKIP');
        
        if (res.data && Array.isArray(res.data)) {
          setReasons(res.data);
        }
      } catch (error) {
        console.error('Error fetching skip reasons:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchReasons();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedReason(null);
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason.id, selectedReason.name);
      setSelectedReason(null);
    }
  };

  const handleClose = () => {
    setSelectedReason(null);
    setIsDropdownOpen(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 border-b border-amber-100">
              <h2 className="text-lg font-bold text-slate-900">Chọn lý do bỏ qua</h2>
              <p className="text-sm text-slate-600 mt-1">Vui lòng chọn lý do tại sao vé này được bỏ qua</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Reason Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Lý do</label>
                
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-between text-left
                      ${selectedReason 
                        ? 'border-green-300 bg-green-50 text-slate-900' 
                        : isLoading 
                          ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed' 
                          : 'border-slate-300 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50'
                      }`}
                  >
                    <span>
                      {isLoading 
                        ? 'Đang tải...' 
                        : selectedReason 
                          ? selectedReason.name 
                          : 'Chọn lý do'}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>

                  {/* Dropdown List */}
                  {isDropdownOpen && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
                    >
                      {reasons.length > 0 ? (
                        reasons.map((reason) => (
                          <button
                            key={reason.id}
                            onClick={() => {
                              setSelectedReason(reason);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 transition-colors border-b border-slate-100 last:border-b-0
                              ${selectedReason?.id === reason.id 
                                ? 'bg-green-100 text-green-900 font-semibold' 
                                : 'hover:bg-amber-50 text-slate-700'
                              }`}
                          >
                            <div className="font-medium">{reason.name}</div>
                            {reason.description && (
                              <div className="text-xs text-slate-600 mt-1">{reason.description}</div>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-slate-500">
                          Không có lý do nào
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Info message */}
              {selectedReason && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800"
                >
                  ✓ Bạn đã chọn: <span className="font-semibold">{selectedReason.name}</span>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex gap-3 justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedReason || isLoading}
                className={`px-6 py-2 rounded-lg font-medium transition-all
                  ${selectedReason && !isLoading
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
              >
                Xác nhận
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
