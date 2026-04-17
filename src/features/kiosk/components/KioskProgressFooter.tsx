import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

interface KioskProgressFooterProps {
  currentStep: number;
  hideBackButton?: boolean;
}

export default function KioskProgressFooter({ currentStep, hideBackButton = false }: KioskProgressFooterProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <footer className="fixed bottom-0 left-0 w-full p-6 md:p-10 flex border-t border-outline-variant/10 xl:border-none xl:bg-transparent bg-white/90 backdrop-blur-xl z-20 flex-col items-center justify-center pointer-events-none transition-all">
      <div className="relative flex items-center justify-center w-full max-w-7xl">
        {!hideBackButton && (
          <div className="absolute left-0 pointer-events-auto">
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center justify-center gap-2 md:gap-3 text-primary font-bold transition-all p-2 pr-4 rounded-full hover:bg-primary/5 cursor-pointer relative overflow-hidden"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-primary/40 flex items-center justify-center bg-primary/5 shadow-sm group-hover:border-primary group-hover:bg-primary/10 group-hover:shadow-md transition-all group-hover:-translate-x-1">
                <span className="material-symbols-outlined text-lg md:text-xl text-primary transition-all">arrow_back</span>
              </div>
              <span className="text-base md:text-lg transition-transform group-hover:-translate-x-1">{t('kiosk.chooseService.back', 'Quay lại')}</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 md:gap-3">
          {[1, 2, 3, 4].map((step) => (
             step === currentStep 
               ? <motion.div key={`step-${step}`} layoutId="active-kiosk-step" className="w-8 md:w-10 h-2.5 md:h-3 rounded-full bg-primary shadow-sm shadow-primary/30 transition-shadow"></motion.div>
               : <motion.div key={`step-${step}`} layoutId={`kiosk-dot-${step}`} className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-outline-variant/30"></motion.div>
          ))}
        </div>

        {/* Cancel Button Area positioned on the right edge */}
        <div className="absolute right-0 pointer-events-auto">
          <button 
            onClick={() => {
              // TODO: Reset toàn bộ Zustand state/luồng đăng ký tại đây khi tích hợp thực tế
              navigate('/kiosk');
            }}
            className="group flex flex-row-reverse items-center justify-center gap-2 md:gap-3 text-error font-bold transition-all p-2 pl-4 rounded-full hover:bg-error/5 cursor-pointer relative overflow-hidden"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-error/40 flex items-center justify-center bg-error/5 shadow-sm group-hover:border-error group-hover:bg-error/10 group-hover:shadow-md transition-all group-hover:translate-x-1">
              <span className="material-symbols-outlined text-lg md:text-xl text-error transition-all">close</span>
            </div>
            <span className="text-base md:text-lg transition-transform group-hover:translate-x-1">{t('kiosk.cancelTicket', 'Hủy lấy phiếu')}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}