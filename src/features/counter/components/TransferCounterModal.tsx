import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RequestGroupDto, ReasonDto } from '@/services/kioskService';
import { kioskService } from '@/services/kioskService';

interface TransferCounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (serviceGroupId: string, reasonId: number) => void;
}

export default function TransferCounterModal({ isOpen, onClose, onConfirm }: TransferCounterModalProps) {
  const [requestGroups, setRequestGroups] = useState<RequestGroupDto[]>([]);
  const [reasons, setReasons] = useState<ReasonDto[]>([]);
  const [selectedServiceGroup, setSelectedServiceGroup] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch request groups and reasons on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [groupsRes, reasonsRes] = await Promise.all([
          kioskService.getRequestGroups(),
          kioskService.getReasons('TRANSFER')
        ]);
        
        if (groupsRes.data && Array.isArray(groupsRes.data)) {
          setRequestGroups(groupsRes.data);
        }
        
        if (reasonsRes.data && Array.isArray(reasonsRes.data)) {
          setReasons(reasonsRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchData();
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
      setSelectedServiceGroup('');
      setSelectedReason('');
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (selectedServiceGroup && selectedReason) {
      const selectedReasonObj = reasons.find(r => r.code === selectedReason);
      if (selectedReasonObj) {
        onConfirm(selectedServiceGroup, selectedReasonObj.id);
      }
      setSelectedServiceGroup('');
      setSelectedReason('');
      setIsDropdownOpen(false);
    }
  };

  const selectedGroup = requestGroups.find(g => g.id.toString() === selectedServiceGroup);

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
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative m-auto"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-[#003063] mb-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
                  </div>
                  Chuyển dịch vụ phục vụ
                </h3>
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">confirmation_number</span>
                  <span className="font-bold text-blue-700 text-sm tracking-wide">Số phiếu: A105</span>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors leading-none"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            
            {/* Content */}
            <div className="px-6 py-4 space-y-4">
              {/* Service Group Selection */}
              <div className="space-y-4">
                <label className="block font-headline text-lg font-bold text-on-surface tracking-tight">
                  Chọn dịch vụ chuyển đến
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full bg-white border-2 text-on-surface font-body text-md py-3 px-4 pr-10 rounded-lg transition-all cursor-pointer flex items-center justify-between ${
                      isDropdownOpen 
                        ? 'border-blue-500 ring-4 ring-blue-500/10' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={selectedServiceGroup ? 'text-on-surface font-medium' : 'text-slate-400'}>
                      {selectedServiceGroup 
                        ? selectedGroup?.name 
                        : isLoading ? 'Đang tải...' : 'Chọn dịch vụ đích...'}
                    </span>
                    <motion.span 
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      className="material-symbols-outlined text-slate-400 pointer-events-none"
                    >
                      expand_more
                    </motion.span>
                  </div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-lg shadow-lg overflow-y-auto max-h-60 py-2"
                      >
                        {isLoading ? (
                          <div className="px-4 py-3 text-slate-500 text-md text-center">Đang tải dữ liệu...</div>
                        ) : requestGroups.length === 0 ? (
                          <div className="px-4 py-3 text-slate-500 text-md text-center">Không có dịch vụ nào</div>
                        ) : (
                          requestGroups.map(group => (
                            <div
                              key={group.id}
                              onClick={() => {
                                setSelectedServiceGroup(group.id.toString());
                                setIsDropdownOpen(false);
                              }}
                              className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                                selectedServiceGroup === group.id.toString() 
                                  ? 'bg-blue-50 text-on-surface' 
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex-1">
                                <span className={`font-semibold text-md ${selectedServiceGroup === group.id.toString() ? 'font-bold text-blue-600' : ''}`}>
                                  {group.name}
                                </span>
                                <div className={`text-sm mt-1 ${selectedServiceGroup === group.id.toString() ? 'text-blue-600/70' : 'text-slate-500'}`}>
                                  {group.code} - {group.description}
                                </div>
                              </div>
                              {selectedServiceGroup === group.id.toString() && (
                                <span className="material-symbols-outlined text-blue-600 text-[20px] flex-shrink-0">
                                  check_circle
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Reason Selection */}
              <div className="space-y-4">
                <label className="block font-headline text-lg font-bold text-on-surface tracking-tight">
                  Lý do chuyển dịch vụ
                </label>
                <div className="flex flex-col gap-3">
                  {reasons.length === 0 ? (
                    <div className="px-4 py-6 text-slate-500 text-sm text-center">
                      {isLoading ? 'Đang tải lý do...' : 'Không có lý do nào'}
                    </div>
                  ) : (
                    reasons.map((reason) => (
                      <label key={reason.id} className="relative cursor-pointer group">
                        <div className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedReason === reason.code
                            ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100/50'
                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                        }`}>
                          <div className="flex-shrink-0 mt-1">
                            <input 
                              type="radio" 
                              name="transfer_reason" 
                              value={reason.code}
                              checked={selectedReason === reason.code}
                              onChange={(e) => setSelectedReason(e.target.value)}
                              className="w-5 h-5 accent-blue-500 cursor-pointer"
                            />
                          </div>
                          <div className="flex items-start gap-3 flex-1">
                            {/* <span className={`material-symbols-outlined transition-colors text-[22px] mt-0.5 flex-shrink-0 ${
                              selectedReason === reason.code
                                ? 'text-blue-600'
                                : 'text-slate-500 group-hover:text-blue-600'
                            }`}>
                              {reason.icon || 'info'}
                            </span> */}
                            <div className="flex-1">
                              <div className={`font-bold transition-colors text-md ${
                                selectedReason === reason.code
                                  ? 'text-blue-700'
                                  : 'text-on-surface group-hover:text-blue-600'
                              }`}>
                                {reason.name}
                              </div>
                              {/* <div className={`text-xs mt-1 leading-snug transition-colors ${
                                selectedReason === reason.code
                                  ? 'text-blue-600/70'
                                  : 'text-slate-500'
                              }`}>
                                {reason.description}
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
              <button 
                onClick={onClose}
                className="px-8 py-4 rounded-xl font-bold text-on-surface bg-surface-container hover:bg-surface-container-highest transition-colors flex items-center justify-center min-w-[120px]"
              >
                Hủy
              </button>
              <button 
                onClick={handleConfirm}
                disabled={!selectedServiceGroup || !selectedReason}
                className={`px-8 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 group min-w-[200px]
                  ${selectedServiceGroup && selectedReason
                    ? 'bg-gradient-to-br from-primary to-primary-container hover:shadow-lg hover:shadow-primary/20 cursor-pointer' 
                    : 'bg-slate-300 cursor-not-allowed'}`}
              >
                Xác nhận chuyển
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}