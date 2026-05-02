import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { counterService, type ServiceCounterDto } from '@/services/counterService';
import { authService } from '@/services/authService';
import { appConfig } from '@/config/appConfig';
import { toast } from '@/stores/useToastStore';

interface SessionStartScreenProps {
  selectedCounter: string;
  setSelectedCounter: (counter: string) => void;
  onStartSession: () => void;
}

export default function SessionStartScreen({ selectedCounter, setSelectedCounter, onStartSession }: SessionStartScreenProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [counters, setCounters] = useState<ServiceCounterDto[]>([]);
  const [isLoadingCounters, setIsLoadingCounters] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCounters = async () => {
      setIsLoadingCounters(true);
      try {
        const res: any = await counterService.getServiceCountersByBranch(appConfig.branchId);
        
        // Data structure can be res.data or just res array
        const fetchedCounters = res?.data || res;
        
        if (Array.isArray(fetchedCounters)) {
          // Lọc chỉ những quầy isActive = true nếu cần, nhưng tạm thời hiện tất cả theo api trả về
          setCounters(fetchedCounters);
          
          // Nêú chưa có quầy nào được chọn, thiết lập quầy đầu tiên làm mặc định (chỉ chạy lần đầu)
          if (fetchedCounters.length > 0 && !selectedCounter) {
            setSelectedCounter(fetchedCounters[0].id.toString());
          }
        }
      } catch (error: any) {
        console.error('Lỗi khi tải danh sách quầy:', error);
        toast.error('Không thể tải danh sách quầy. Vui lòng thử lại sau.');
      } finally {
        setIsLoadingCounters(false);
      }
    };
    fetchCounters();
  }, []); // Xóa dependencies selectedCounter, setSelectedCounter để tránh re-render nhấp nháy

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCounterObj = counters.find(c => c.id.toString() === selectedCounter) || counters[0];

  const handleStartSession = async () => {
    if (!selectedCounter) return;
    setIsStarting(true);
    try {
      await authService.startCounterSession(selectedCounter);
      toast.success('Bắt đầu phiên làm việc thành công');
      onStartSession();
    } catch (err: any) {
      console.error('Lỗi khi bắt đầu phiên:', err);
      toast.error(err?.response?.data?.message || 'Không thể bắt đầu phiên làm việc');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full relative">
      {/* Background decorative elements */}
      <div className="absolute top-[0%] left-[0%] w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[0%] right-[0%] w-[30rem] h-[30rem] bg-indigo-400/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#003063]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#003063]/10">
            <span className="material-symbols-outlined text-[#003063] text-3xl">storefront</span>
          </div>
          <h1 className="text-2xl font-black text-[#003063] tracking-tight mb-2">Bắt đầu phiên làm việc</h1>
          <p className="text-slate-500 text-sm">Vui lòng chọn quầy của bạn để mở phiên giao dịch mới, hệ thống sẽ bắt đầu tính thời gian phục vụ.</p>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Số quầy
            </label>
            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => !isLoadingCounters && !isStarting && setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-slate-50 border ${isDropdownOpen ? 'border-[#003063] ring-2 ring-[#003063]/20' : 'border-slate-200 hover:border-[#003063]/50'} text-slate-800 text-lg font-bold rounded-xl px-4 py-3 flex items-center justify-between transition-all ${isLoadingCounters || isStarting ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
              >
                <span>{isLoadingCounters ? 'Đang tải danh sách...' : (selectedCounterObj ? `${selectedCounterObj.name} - ${selectedCounterObj.code}` : 'Chưa có quầy nào')}</span>
                <motion.span 
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  className="material-symbols-outlined text-slate-400"
                >
                  {isLoadingCounters || isStarting ? <span className="animate-spin text-sm">↻</span> : 'expand_more'}
                </motion.span>
              </div>

              <AnimatePresence>
                {isDropdownOpen && !isLoadingCounters && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-y-auto max-h-60 py-2"
                  >
                    {counters.length === 0 ? (
                       <div className="px-4 py-3 text-sm text-slate-500 text-center select-none">Không có quầy nào hoạt động tại chi nhánh này</div>
                    ) : (
                      counters.map((counter) => (
                        <div
                          key={counter.id}
                          onClick={() => {
                            setSelectedCounter(counter.id.toString());
                            setIsDropdownOpen(false);
                          }}
                          className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                            selectedCounter === counter.id.toString() 
                              ? 'bg-blue-50/50 text-[#003063]' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className={`font-semibold ${selectedCounter === counter.id.toString() ? 'font-bold text-[#003063]' : ''}`}>
                            {counter.name} - {counter.code}
                          </span>
                          {selectedCounter === counter.id.toString() && (
                            <span className="material-symbols-outlined text-[#003063] text-[20px]">
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
        </div>

        <button 
          onClick={handleStartSession}
          disabled={counters.length === 0 || isLoadingCounters || isStarting}
          className="w-full bg-[#003063] hover:bg-[#002244] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#003063]/20 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0 cursor-pointer"
        >
          {isStarting ? (
            <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
          ) : (
            <span className="material-symbols-outlined text-[20px] group-enabled:group-hover:scale-110 transition-transform">play_circle</span>
          )}
          {isStarting ? 'Đang khởi tạo...' : 'Bắt đầu làm việc'}
        </button>
      </motion.div>
    </div>
  );
}