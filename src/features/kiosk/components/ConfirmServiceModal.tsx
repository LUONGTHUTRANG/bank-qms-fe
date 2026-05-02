import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export interface ServiceData {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

interface ConfirmServiceModalProps {
  isOpen: boolean;
  service: ServiceData | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function ConfirmServiceModal({ isOpen, service, onClose, onConfirm, isLoading }: ConfirmServiceModalProps) {
  const { t } = useTranslation();
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClickable(false);
      const timer = setTimeout(() => setIsClickable(true), 400); // Ngăn chạm nhầm (ghost click) ngay lúc modal bật lên
      return () => clearTimeout(timer);
    } else {
      setIsClickable(false);
    }
  }, [isOpen]);

  if (!service && isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#001e2d]/60 backdrop-blur-md p-4 sm:p-8 select-none touch-manipulation"
          onClick={(e) => {
            if (!isClickable || isLoading) return;
            e.stopPropagation();
            onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.8 }}
            className="w-full max-w-3xl relative mt-16"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Inner Wrapper for Clipping */}
            <div className="bg-white/95 backdrop-blur-xl w-full rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden relative flex flex-col z-10">
              
              {/* Modal Body */}
              <div className="pt-16 pb-12 px-6 sm:px-10 md:px-12 flex flex-col items-center text-center">
                
                {/* Selected Service Focus Box */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 border-2 border-primary/20 shadow-inner">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '2.5rem' }}>
                    {service.icon}
                  </span>
                </div>

                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-headline font-extrabold text-2xl md:text-4xl text-primary leading-tight tracking-tight mb-2"
                >
                  {service.title}
                </motion.h2>

                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-slate-500 text-lg md:text-xl font-medium mb-12 max-w-2xl"
                >
                  {t('kiosk.confirmModal.subtitle')}
                </motion.p>

                {/* Selection Buttons */}
                <div className="w-full flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center">
                  
                  {/* Cancel/Reselect Button */}
                  <button 
                    type="button"
                    disabled={!isClickable || isLoading}
                    onClick={(e) => {
                      if (!isClickable || isLoading) return;
                      e.preventDefault();
                      e.stopPropagation();
                      onClose();
                    }}
                    className={`bg-slate-100 cursor-pointer text-slate-700 font-bold px-6 md:px-8 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all hover:bg-slate-200 active:scale-95 w-full sm:flex-1 text-lg ${!isClickable || isLoading ? 'opacity-80 cursor-wait' : ''}`}
                  >
                    <span className="material-symbols-outlined text-2xl">refresh</span>
                    <span>{t('kiosk.confirmModal.cancel')}</span>
                  </button>

                  {/* Confirm Button */}
                  <button 
                    type="button"
                    disabled={!isClickable || isLoading}
                    onClick={(e) => {
                      if (!isClickable || isLoading) return;
                      e.preventDefault();
                      e.stopPropagation();
                      onConfirm();
                    }}
                    className={`bg-gradient-to-br cursor-pointer from-[#003063] to-[#00468c] text-white font-bold px-6 md:px-8 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all hover:shadow-[0_20px_40px_rgba(0,48,99,0.2)] active:scale-95 w-full sm:flex-1 text-lg shadow-xl shadow-primary/20 ${!isClickable || isLoading ? 'opacity-80 cursor-wait grayscale-[20%]' : ''}`}
                  >
                    <span className="material-symbols-outlined text-2xl animate-spin" style={{ display: isLoading ? 'block' : 'none' }}>progress_activity</span>
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1", display: isLoading ? 'none' : 'block' }}>check_circle</span>
                    <span>{isLoading ? 'Đang tạo phiếu...' : t('kiosk.confirmModal.confirm')}</span>
                  </button>

                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}