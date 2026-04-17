import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QueueListSection() {
  const [activeTab, setActiveTab] = useState<'queue' | 'postponed' | 'cancelled'>('queue');

  // Hardcoded counts for current mock data
  const counts = {
    queue: 4,
    postponed: 0,
    cancelled: 0
  };

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
            Cập nhật: 10:55:12
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden w-full">
        <div className="overflow-x-auto overflow-y-hidden w-full">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-4 px-6 py-4 border-b border-slate-100 text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
              <span>Số thứ tự</span>
              <span>Loại dịch vụ</span>
              <span>Thời gian chờ</span>
              <span className="text-right">Hành động</span>
            </div>
            
            {/* Tab content wrapper with AnimatePresence */}
            <AnimatePresence mode="wait">
              {activeTab === 'queue' && (
                <motion.div 
                  key="queue-list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="divide-y divide-slate-50"
                >
                  {/* Queue Item 1 */}
                  <div className="grid grid-cols-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base md:text-lg font-black text-[#003063]">A106</span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  </div>
                  <span className="text-[#191c20] font-semibold text-xs md:text-sm">Cá nhân</span>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-[15px] md:text-[17px]">avg_time</span>
                    <span className="font-medium text-[12px] md:text-[13px]">12 phút</span>
                  </div>
                  <div className="flex justify-end gap-1 md:gap-2">
                    <button className="cursor-pointer p-1.5 md:p-2 text-[#003063] hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center" title="Gọi số">
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">campaign</span>
                    </button>
                    <button className="cursor-pointer p-1.5 md:p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center" title="Tạm hoãn">
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">more_time</span>
                    </button>
                    <button className="cursor-pointer p-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center" title="Hủy bỏ">
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">close</span>
                    </button>
                  </div>
                </div>
                
                {/* Queue Item 2 (Business) */}
                <div className="grid grid-cols-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base md:text-lg font-black text-[#003063]">B022</span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  </div>
                  <span className="text-[#191c20] font-semibold text-xs md:text-sm">Doanh nghiệp</span>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-[15px] md:text-[17px]">avg_time</span>
                    <span className="font-medium text-[12px] md:text-[13px]">08 phút</span>
                  </div>
                  <div className="flex justify-end gap-1 md:gap-2">
                    <button className="cursor-pointer p-1.5 md:p-2 text-[#003063] hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center" title="Gọi số">
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">campaign</span>
                    </button>
                    <button className="cursor-pointer p-1.5 md:p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center" title="Tạm hoãn">
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">more_time</span>
                    </button>
                    <button className="cursor-pointer p-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center" title="Hủy bỏ">
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">close</span>
                    </button>
                  </div>
                </div>
                
                {/* Queue Item 3 (Priority) */}
                <div className="grid grid-cols-4 px-6 py-4 items-center transition-colors bg-amber-50/30 hover:bg-amber-50/60">
                  <div className="flex items-center gap-4">
                    <span className="text-base md:text-lg font-black text-[#003063]">S005</span>
                    <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-1.5 py-[2px] rounded text-[8px] md:text-[9px] font-black uppercase tracking-wider">Ưu tiên</span>
                  </div>
                  <span className="text-[#191c20] font-semibold text-xs md:text-sm">VIP Services</span>
                  <div className="flex items-center gap-2 text-red-600 font-bold">
                    <span className="material-symbols-outlined text-[15px] md:text-[17px]">priority_high</span>
                    <span className="text-[12px] md:text-[13px]">22 phút (Trễ)</span>
                  </div>
                  <div className="flex justify-end gap-1 md:gap-2">
                    <button className="cursor-pointer p-1.5 md:p-2 text-amber-600 hover:bg-amber-100 rounded-full transition-colors flex items-center justify-center" title="Gọi số">
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">campaign</span>
                    </button>
                    <button className="cursor-pointer p-1.5 md:p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center" title="Tạm hoãn">
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">more_time</span>
                    </button>
                    <button className="cursor-pointer p-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center" title="Hủy bỏ">
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">close</span>
                    </button>
                  </div>
                </div>
                
                {/* Queue Item 4 */}
                <div className="grid grid-cols-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base md:text-lg font-black text-[#003063]">A107</span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  </div>
                  <span className="text-[#191c20] font-semibold text-xs md:text-sm">Cá nhân</span>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-[15px] md:text-[17px]">avg_time</span>
                    <span className="font-medium text-[12px] md:text-[13px]">04 phút</span>
                  </div>
                  <div className="flex justify-end gap-1 md:gap-2">
                    <button className="cursor-pointer p-1.5 md:p-2 text-[#003063] hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center" title="Gọi số">
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">campaign</span>
                    </button>
                    <button className="cursor-pointer p-1.5 md:p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center" title="Tạm hoãn">
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">more_time</span>
                    </button>
                    <button className="cursor-pointer p-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center" title="Hủy bỏ">
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">close</span>
                    </button>
                  </div>
                </div>
                </motion.div>
              )}

              {activeTab === 'postponed' && (
                <motion.div 
                  key="postponed-list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="py-16 flex flex-col items-center justify-center text-amber-500/60"
                >
                  <span className="material-symbols-outlined text-4xl mb-3">hourglass_empty</span>
                  <p className="text-sm font-medium text-amber-600/70">Chưa có giao dịch tạm hoãn.</p>
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
      </div>
    </section>
  );
}
