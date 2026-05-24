import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '@/services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/stores/useToastStore';

export interface UserInfoDto {
  id: number;
  username: string;
  fullName: string;
  role: string;
  branchId: number;
}

export default function CounterHeader({ user, isSessionStarted }: { user?: UserInfoDto | null, isSessionStarted?: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    if (isSessionStarted) {
      toast.error('Đăng xuất thất bại. Vui lòng kết thúc phiên trước khi thực hiện đăng xuất');
      setIsDropdownOpen(false);
      return;
    }
    authService.logout();
    toast.success('Đã đăng xuất hợp lệ');
    navigate('/auth');
  };

  return (
    <header className="flex justify-between items-center w-full px-8 h-[72px] sticky top-0 z-30 bg-[#f9f9ff] shadow-[0_2px_20px_0_rgba(25,28,32,0.03)] border-b border-slate-200/50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">
            account_balance
          </span>
          <h1 className="text-xl font-black tracking-tighter text-[#003063] uppercase whitespace-nowrap">
            Architectural Banking
          </h1>
        </div>
        <span className="h-5 w-px bg-slate-300 opacity-50"></span>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          {user ? `${t('counter.header.branchPrefix', 'Chi nhánh')} ${user.branchId}` : t('common.loading', 'Đang tải...')}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-200/50 rounded-full transition-all duration-300 cursor-pointer"
          >
            <img 
              alt={t('counter.header.staffProfile', 'Hồ sơ nhân viên')} 
              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm bg-[#003063]" 
              src={`https://ui-avatars.com/api/?name=${user ? encodeURIComponent(user.fullName) : 'User'}&background=003063&color=fff`}
            />
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#003063] leading-none mb-0.5">{user?.fullName || t('common.loading', 'Đang tải...')}</span>
              <span className="text-[10px] text-slate-500 font-medium leading-none">{user?.role || t('common.staff', 'Nhân viên')}</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-slate-400">
              arrow_drop_down
            </span>
          </div>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 origin-top-right"
              >
                {/* <div className="px-4 py-2 mb-2 border-b border-slate-100 flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Đăng nhập với dạng</span>
                  <span className="text-sm font-bold text-[#003063] truncate">{user?.username || 'GUEST'}</span>
                </div> */}
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Đăng xuất
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* <div className="flex items-center gap-1">
          <button className="cursor-pointer p-2 text-slate-500 hover:bg-slate-200/50 rounded-full transition-all duration-300 relative aspect-square flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 border border-[#f9f9ff] rounded-full"></span>
          </button>
          <button className="cursor-pointer p-2 text-slate-500 hover:bg-slate-200/50 rounded-full transition-all duration-300 aspect-square flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div> */}
      </div>
    </header>
  );
}