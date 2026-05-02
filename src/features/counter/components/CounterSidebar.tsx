import { NavLink, useNavigate } from 'react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/authService';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toast } from '@/stores/useToastStore';

export default function CounterSidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      localStorage.removeItem('access_token');
      toast.success(t('counter.sidebar.logoutSuccess', 'Đăng xuất thành công'));
      navigate('/login');
    } catch (error) {
      toast.error(t('counter.sidebar.logoutError', 'Đăng xuất thất bại. Vui lòng thử lại.'));
    } finally {
      setIsLoggingOut(false);
      setIsLogoutDialogOpen(false);
    }
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-[20px_0_60px_-15px_rgba(0,0,0,0.03)] z-40 rounded-r-[2rem] hidden md:flex flex-col border-r border-slate-100">
        <div className="px-8 pt-10 pb-6">
          <h1 className="text-xl font-bold text-[#003063]">{t('counter.sidebar.title', 'Staff Portal')}</h1>
          <p className="text-xs text-slate-500 mt-1">{t('counter.sidebar.terminalId', 'Terminal ID')}: 4022</p>
        </div>
        <nav className="flex flex-col pt-2 pb-8 gap-1 overflow-y-auto">
          <NavLink 
            to="/counter" 
            className="cursor-pointer bg-gradient-to-br from-[#003063] to-[#00468c] text-white rounded-full mx-5 px-5 py-3 shadow-lg flex items-center gap-3 transition-all duration-300 ring-2 ring-blue-500 ring-offset-2"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            <span className="font-medium text-sm">{t('counter.sidebar.liveQueue', 'Live Queue')}</span>
          </NavLink>
          <button className="cursor-pointer text-[#737782] hover:text-[#00468C] px-10 py-3 flex items-center gap-3 hover:translate-x-2 transition-transform duration-200">
            <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
            <span className="font-medium text-sm">{t('counter.sidebar.counterView', 'Counter View')}</span>
          </button>
          <button className="cursor-pointer text-[#737782] hover:text-[#00468C] px-10 py-3 flex items-center gap-3 hover:translate-x-2 transition-transform duration-200">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            <span className="font-medium text-sm">{t('counter.sidebar.appointments', 'Appointments')}</span>
          </button>
          <button className="cursor-pointer text-[#737782] hover:text-[#00468C] px-10 py-3 flex items-center gap-3 hover:translate-x-2 transition-transform duration-200">
            <span className="material-symbols-outlined text-[20px]">badge</span>
            <span className="font-medium text-sm">{t('counter.sidebar.staffDirectory', 'Staff Directory')}</span>
          </button>
          <button className="cursor-pointer text-[#737782] hover:text-[#00468C] px-10 py-3 flex items-center gap-3 hover:translate-x-2 transition-transform duration-200">
            <span className="material-symbols-outlined text-[20px]">leaderboard</span>
            <span className="font-medium text-sm">{t('counter.sidebar.analytics', 'Analytics')}</span>
          </button>
        </nav>
        <div className="mt-auto p-6">
          <button 
            onClick={() => setIsLogoutDialogOpen(true)}
            className="cursor-pointer w-full py-3.5 bg-slate-100 text-[#003063] font-bold text-sm rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            {t('counter.sidebar.logout', 'Log Out')}
          </button>
        </div>
      </aside>

      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title={t('counter.dialog.logoutTitle', 'Xác nhận đăng xuất')}
        message={t('counter.dialog.logoutMessage', 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống? Các phiên giao dịch đang mở sẽ bị tạm ngưng.')}
        confirmText={t('common.confirm', 'Xác nhận')}
        cancelText={t('common.cancel', 'Hủy')}
        variant="warning"
        isLoading={isLoggingOut}
      />
    </>
  );
}