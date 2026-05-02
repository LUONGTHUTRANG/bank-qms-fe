import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import KioskHeader from '@/features/kiosk/components/KioskHeader';
import KioskFooter from '@/features/kiosk/components/KioskFooter';
import type { ServiceData } from '@/features/kiosk/components/ConfirmServiceModal';
import { useKioskStore } from '@/stores/useKioskStore';

export default function KioskPrintingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const resetStore = useKioskStore(state => state.reset);
  
  const [ticketNumber, setTicketNumber] = useState('A105');
  const [serviceName, setServiceName] = useState('Giao dịch Quầy ưu tiên');
  const [isPrinted, setIsPrinted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    // Nếu có truyền ticket data từ API create ticket
    if (location.state?.ticket) {
      const ticketData = location.state.ticket;
      setTicketNumber(ticketData.ticketNo || 'A105');
      // Chúng ta có thể lấy tên group/service từ màn hình trước truyền vào, hoặc fallback tạm
      // Từ KioskChooseServicePage, ta đã truyền group name/id nếu cần. 
      // Ở đây ta dùng tên dịch vụ trước nếu pass kèm
    }
    if (location.state?.serviceName) {
      setServiceName(location.state.serviceName);
    }
    
    // Giả lập trạng thái in thành công sau 5 giây (Tăng thời gian in)
    const printTimer = setTimeout(() => {
      setIsPrinted(true);
    }, 5000);
    
    // Tự động chuyển về Home sau 10s giả lập in xong (5s in + 5s chờ)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      // Chờ animation exit chạy khoảng 600ms rồi mới redirect thực sự
      setTimeout(() => {
        resetStore();
        navigate('/kiosk', { replace: true });
      }, 600);
    }, 10000);
    
    return () => {
      clearTimeout(printTimer);
      clearTimeout(exitTimer);
    };
  }, [location, navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="bg-slate-50 text-on-surface h-screen w-screen flex flex-col overflow-hidden relative bg-gradient-to-br from-[#f9f9ff] to-[#e7e8ee] touch-manipulation select-none"
    >
      {/* Decorative Architectural Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-24 -right-24 w-[35rem] h-[35rem] bg-[#00AEEF]/5 rounded-full blur-[100px]"></div>
      </div>

      <KioskHeader />

      <main className="flex-grow flex flex-col items-center justify-center px-6 min-h-0 relative z-10 w-full mb-16">
        <div className="w-full max-w-6xl flex flex-row items-center justify-between gap-12 lg:gap-24">
          
          {/* Left Side: Visuals & Status */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-10">
            
            {/* Printing Visual Anchor */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative group scale-75 lg:scale-100 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full scale-125 pointer-events-none"></div>
              
              {/* Graphic Container */}
              <div className="relative w-40 h-40 lg:w-56 lg:h-56 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,48,99,0.06)] flex flex-col items-center justify-center border border-white/50 transition-all duration-500 z-10 overflow-hidden">
                
                {/* Printer & Success Status */}
                <motion.div
                  animate={{ scale: isPrinted ? [1, 1.15, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                  className="z-20 relative flex flex-col items-center justify-center"
                >
                  {isPrinted ? (
                    <span 
                      className="material-symbols-outlined text-green-500" 
                      style={{ fontVariationSettings: "'FILL' 1", fontSize: "96px" }}
                    >
                      check_circle
                    </span>
                  ) : (
                    <div className="relative flex flex-col items-center mt-2">
                      <span 
                        className="material-symbols-outlined text-primary mb-2 relative z-10" 
                        style={{ fontVariationSettings: "'FILL' 1", fontSize: "80px" }}
                      >
                        print
                      </span>
                      
                      {/* Ticket printing animation (sliding down from inside printer) */}
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: ["0%", "50%", "0%"], opacity: [0, 1, 0], y: [0, 10, 20] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute top-[60px] z-0 w-[46px] bg-slate-50 border-x border-b border-dashed border-[#c2c6d2] rounded-b-sm shadow-sm flex flex-col items-center pt-2 space-y-1 overflow-hidden"
                      >
                        <div className="w-6 h-1 bg-slate-300 rounded-full"></div>
                        <div className="w-4 h-1 bg-slate-300 rounded-full"></div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>

              </div>
            </motion.div>

            {/* Status Messaging */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2 lg:space-y-4"
            >
              <h1 className={`font-bold tracking-tight text-[2.5rem] lg:text-[3.5rem] leading-[1.1] transition-colors duration-500 max-w-lg ${isPrinted ? 'text-green-700 leading-tight whitespace-normal' : 'text-primary whitespace-nowrap'}`}>
                {isPrinted 
                  ? t('kiosk.printing.successTitle', 'Đã in phiếu thành công')
                  : t('kiosk.printing.title', 'Đang in phiếu...')}
              </h1>
              <p className="text-xl lg:text-2xl text-slate-500 font-bold max-w-lg transition-all duration-300">
                {isPrinted 
                  ? t('kiosk.printing.successSubtitle', 'Quý khách vui lòng nhận phiếu và chờ đến lượt. Xin trân trọng cảm ơn.')
                  : t('kiosk.printing.subtitle', 'Vui lòng đợi trong giây lát')}
              </p>
              
              {/* Progress Orbit */}
              {!isPrinted && (
                <div className="flex items-center gap-4 pt-4 justify-center lg:justify-start transition-opacity duration-300">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <motion.div 
                    initial={{ width: "12px" }}
                    animate={{ width: ["12px", "60px", "12px"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="h-3 rounded-xl bg-primary shadow-[0_0_15px_rgba(0,48,99,0.4)]"
                  ></motion.div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Side: Ticket Details Card */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 mt-12 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="w-full max-w-md bg-white rounded-t-3xl rounded-b-lg p-10 lg:p-12 pb-8 lg:pb-10 shadow-[0_20px_40px_rgba(25,28,32,0.04)] border border-[#c2c6d2]/20 relative"
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="space-y-1 text-center">
                  <span className="text-[0.8rem] text-slate-400 font-bold tracking-widest uppercase">
                    {t('kiosk.printing.yourNumber')}
                  </span>
                  <div className="text-[5rem] lg:text-[7rem] font-black text-primary tracking-tighter leading-none mt-2">
                    {ticketNumber}
                  </div>
                </div>
                
                {/* Zigzag ticket cut separator */}
                <div className="w-[120%] -mx-10 h-1 border-t-[3px] border-dashed border-[#c2c6d2]/40 relative my-2"></div>
                
                <div className="text-center w-full mt-2">
                  <span className="text-[0.8rem] text-slate-400 font-bold tracking-widest uppercase">
                    {t('kiosk.printing.service')}
                  </span>
                  <div className="text-xl lg:text-2xl font-bold text-slate-700 mt-2 px-4 leading-tight">
                    {serviceName}
                  </div>
                </div>

                {/* Info Note Section */}
                <div className="mt-4 pt-6 border-t border-slate-100 w-full text-center px-2">
                  <p className="text-md font-bold text-amber-600 mb-1">{t('kiosk.printing.note')}</p>
                  <p className="text-md text-slate-500 font-medium leading-relaxed italic">
                    {t('kiosk.printing.noteContent')}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.p 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="text-primary font-bold text-2xl lg:text-3xl tracking-tight mt-4"
            >
              {t('kiosk.printing.thanks')}
            </motion.p>
          </div>

        </div>
      </main>

      <KioskFooter />
    </motion.div>
  );
}