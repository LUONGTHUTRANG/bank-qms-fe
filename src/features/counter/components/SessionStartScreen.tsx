import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const COUNTERS = [
  { id: '01', name: 'Quầy 01 - Giao dịch cá nhân' },
  { id: '02', name: 'Quầy 02 - Doanh nghiệp' },
  { id: '03', name: 'Quầy 03 - VIP' },
  { id: '04', name: 'Quầy 04 - Tư vấn bảo hiểm' },
  { id: '05', name: 'Quầy 05 - Thẻ tín dụng' },
];

interface SessionStartScreenProps {
  selectedCounter: string;
  setSelectedCounter: (counter: string) => void;
  onStartSession: () => void;
}

export default function SessionStartScreen({ selectedCounter, setSelectedCounter, onStartSession }: SessionStartScreenProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCounterObj = COUNTERS.find(c => c.id === selectedCounter) || COUNTERS[0];

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
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-slate-50 border ${isDropdownOpen ? 'border-[#003063] ring-2 ring-[#003063]/20' : 'border-slate-200 hover:border-[#003063]/50'} text-slate-800 text-lg font-bold rounded-xl px-4 py-3 cursor-pointer flex items-center justify-between transition-all`}
              >
                <span>{selectedCounterObj.name}</span>
                <motion.span 
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  className="material-symbols-outlined text-slate-400"
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
                    className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-hidden py-2"
                  >
                    {COUNTERS.map((counter) => (
                      <div
                        key={counter.id}
                        onClick={() => {
                          setSelectedCounter(counter.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                          selectedCounter === counter.id 
                            ? 'bg-blue-50/50 text-[#003063]' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className={`font-semibold ${selectedCounter === counter.id ? 'font-bold text-[#003063]' : ''}`}>
                          {counter.name}
                        </span>
                        {selectedCounter === counter.id && (
                          <span className="material-symbols-outlined text-[#003063] text-[20px]">
                            check_circle
                          </span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <button 
          onClick={onStartSession}
          className="w-full bg-[#003063] hover:bg-[#002244] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#003063]/20 group cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">play_circle</span>
          Bắt đầu làm việc
        </button>
      </motion.div>
    </div>
  );
}