import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import KioskHeader from '@/features/kiosk/components/KioskHeader';

export default function KioskPhoneInputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');

  // Lấy dữ liệu service được chọn từ màn hình trước
  // state có dạng { service: 'regular' | 'priority' | 'corporate', hasAccount: boolean }
  // const { service, hasAccount } = location.state || {}; // Có thể dùng khi dispatch action lên API

  const handleKeyPress = (num: string) => {
    if (phoneNumber.length < 11) {
      setPhoneNumber(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPhoneNumber('');
  };

  const handleContinue = () => {
    // Chuyển hướng đến bước tiếp theo (VD: chọn quầy/in vé)
    navigate('/kiosk/choose-service', { state: { phone: phoneNumber } });
  };

  // Format số điện thoại hiển thị (thêm khoảng trắng cho dễ nhìn VD: 090 123 4567)
  const formattedPhone = () => {
    if (!phoneNumber) return 'Nhập số điện thoại';
    let formatted = phoneNumber;
    if (formatted.length > 3) {
      formatted = formatted.slice(0, 3) + ' ' + formatted.slice(3);
    }
    if (formatted.length > 7) {
      formatted = formatted.slice(0, 7) + ' ' + formatted.slice(7);
    }
    return formatted;
  };

  return (
    <div className="bg-surface text-on-surface h-screen overflow-y-auto overflow-x-hidden flex flex-col font-sans">
      {/* Background Decoration */}
      <div className="fixed top-0 right-0 -z-10 w-1/2 h-full opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary rounded-full blur-[120px]"></div>
      </div>

      <KioskHeader />

      <main className="flex-grow flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full pb-20 md:pb-24 z-10 pt-6">
        
        {/* Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center mb-6 xl:mb-8"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-on-surface mb-2 xl:mb-3 tracking-tight">
            {t('kiosk.phoneInput.title')}
          </h1>
          <p className="text-outline text-base md:text-lg font-medium px-4">
            {t('kiosk.phoneInput.subtitle')}
          </p>
        </motion.div>

        {/* Phone Number Input Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full mb-6 xl:mb-8"
        >
          <div className="bg-surface-container-lowest shadow-[0_40px_60px_-15px_rgba(0,48,99,0.08)] rounded-xl px-6 md:px-12 py-6 xl:py-8 flex flex-col items-center justify-center min-h-[100px] transition-all duration-300 border border-outline-variant/10">
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-primary opacity-50 text-2xl md:text-3xl font-bold tracking-tight">+84</span>
              <div className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none ${phoneNumber ? 'text-primary' : 'text-outline-variant'}`}>
                {formattedPhone()}
              </div>
              <span className="w-1 h-8 md:h-10 bg-primary rounded-full animate-pulse ml-1 md:ml-2"></span>
            </div>
          </div>
        </motion.div>

        {/* Keypad Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-lg mx-auto mb-8 xl:mb-10"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button 
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="h-14 md:h-16 rounded-2xl bg-surface-container-low text-primary text-xl md:text-2xl font-bold hover:bg-primary-fixed transition-all flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 cursor-pointer border border-transparent hover:border-primary/20"
            >
              {num}
            </button>
          ))}
          
          <button 
            onClick={handleClear}
            className="h-14 md:h-16 rounded-2xl bg-secondary-container/50 text-on-surface-variant text-base md:text-lg font-semibold hover:bg-secondary-container transition-all flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
          >
            {t('kiosk.phoneInput.clear')}
          </button>
          
          <button 
            onClick={() => handleKeyPress('0')}
            className="h-14 md:h-16 rounded-2xl bg-surface-container-low text-primary text-xl md:text-2xl font-bold hover:bg-primary-fixed transition-all flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 cursor-pointer border border-transparent hover:border-primary/20"
          >
            0
          </button>
          
          <button 
            onClick={handleBackspace}
            className="h-14 md:h-16 rounded-2xl bg-secondary-container/50 text-on-surface-variant flex items-center justify-center shadow-sm hover:bg-secondary-container transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl">backspace</span>
          </button>
        </motion.div>

        {/* Action Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-lg mt-auto z-20 flex gap-4 md:gap-6"
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex-1 h-14 md:h-16 rounded-[1.25rem] bg-white border-2 border-primary/20 text-primary text-lg font-bold hover:bg-primary/5 hover:border-primary/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
            {t('kiosk.phoneInput.back')}
          </button>
          
          <button 
            onClick={handleContinue}
            disabled={phoneNumber.length < 9}
            className="flex-[2] h-14 md:h-16 rounded-[1.25rem] bg-gradient-to-br from-primary to-primary-container text-white text-lg font-bold shadow-[0_20px_40px_rgba(0,48,99,0.15)] hover:shadow-[0_20px_40px_rgba(0,48,99,0.25)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none enabled:hover:scale-[1.02] enabled:active:scale-[0.98] cursor-pointer"
          >
            {t('kiosk.phoneInput.continue')}
            <span className="material-symbols-outlined text-2xl md:text-3xl">arrow_forward</span>
          </button>
        </motion.div>
      </main>

      {/* Progress Orbit Navigation Footer (Adapted for Kiosk System) */}
      <footer className="fixed bottom-0 left-0 w-full p-6 md:p-10 flex border-t border-outline-variant/10 xl:border-none xl:bg-transparent bg-white/90 backdrop-blur-xl z-20 flex-col items-center justify-center pointer-events-none transition-all">
        <div className="relative flex items-center justify-center w-full max-w-7xl">
          <div className="flex items-center justify-center gap-3">
            <motion.div layoutId="kiosk-dot-1" className="w-4 h-4 bg-outline-variant/50 rounded-full"></motion.div>
            {/* Active Step 2 */}
            <motion.div layoutId="active-kiosk-step" className="w-12 h-4 rounded-full bg-primary shadow-sm shadow-primary/30 transition-shadow"></motion.div>
            {/* Pending Steps */}
            <motion.div layoutId="kiosk-dot-3" className="w-4 h-4 bg-outline-variant/50 rounded-full"></motion.div>
            <motion.div layoutId="kiosk-dot-4" className="w-4 h-4 bg-outline-variant/50 rounded-full"></motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}