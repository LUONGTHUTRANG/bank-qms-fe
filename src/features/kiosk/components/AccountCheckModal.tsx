import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

interface AccountCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountCheckModal({ isOpen, onClose }: AccountCheckModalProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#001e2d]/50 backdrop-blur-md p-4 sm:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.8 }}
            className="w-full max-w-4xl relative mt-16"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative Circular Logo Overhang */}
            <motion.div 
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.1, stiffness: 300, damping: 20 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center shadow-xl border border-outline-variant/10 z-20"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/5 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl md:text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_balance
                </span>
              </div>
            </motion.div>

            {/* Inner Wrapper for Clipping */}
            <div className="bg-white/95 backdrop-blur-xl w-full rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden relative flex flex-col z-10">
              {/* Modal Body */}
              <div className="pt-14 md:pt-16 pb-8 md:pb-12 px-6 sm:px-8 flex flex-col items-center text-center">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl text-primary leading-tight tracking-tight mb-4 max-w-3xl"
                >
                  {t('kiosk.accountModal.title')}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-outline text-base md:text-lg font-medium mb-8"
                >
                  {t('kiosk.accountModal.subtitle')}
                </motion.p>

                {/* Selection Buttons */}
                <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-4 md:gap-6 mb-8 items-center justify-center">
                  {/* Has Account Button */}
                  <button 
                    onClick={() => navigate('/kiosk/phone-input', { state: { service: 'regular', hasAccount: true } })}
                    className="bg-gradient-to-br from-[#003063] to-[#00468c] text-white px-6 md:px-8 py-5 rounded-3xl flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,48,99,0.2)] active:scale-95 w-full sm:flex-1 shadow-xl shadow-primary/20 cursor-pointer animate-fade-in"
                  >
                    <span className="material-symbols-outlined text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                    <span className="text-base md:text-lg font-bold tracking-tight">{t('kiosk.accountModal.hasAccount')}</span>
                  </button>

                  {/* Doesn't Have Account Button */}
                  <button 
                    onClick={() => navigate('/kiosk/choose-service', { state: { hasAccount: false } })}
                    className="bg-white border-2 border-primary/10 text-primary px-6 md:px-8 py-5 rounded-3xl flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5 hover:shadow-[0_20px_40px_rgba(0,48,99,0.08)] active:scale-95 w-full sm:flex-1 cursor-pointer animate-fade-in"
                  >
                    <span className="material-symbols-outlined text-2xl md:text-3xl">person_add</span>
                    <span className="text-base md:text-lg font-bold tracking-tight">{t('kiosk.accountModal.noAccount')}</span>
                  </button>
                </div>

                {/* Supportive Info Panel */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full bg-primary/[0.03] border border-primary/5 p-4 md:p-6 rounded-2xl flex items-center md:items-start gap-4 text-left hover:bg-primary/[0.05] transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded-full shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">info</span>
                  </div>
                  <p className="text-primary/80 text-sm md:text-base font-medium leading-relaxed">
                    {t('kiosk.accountModal.note')}
                  </p>
                </motion.div>
              </div>

              {/* Modal Footer / Navigation */}
              <div className="px-6 md:px-16 py-4 bg-primary/[0.02] border-t border-outline-variant/10 flex justify-between items-center sm:flex-row flex-col-reverse gap-4">
                <button 
                  onClick={onClose}
                  className="group flex items-center justify-center gap-3 text-slate-700 font-bold hover:text-primary transition-all p-2 pr-4 rounded-full hover:bg-black/5 cursor-pointer relative overflow-hidden"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-300 flex items-center justify-center bg-white shadow-sm group-hover:border-primary group-hover:bg-primary/5 transition-all group-hover:-translate-x-1">
                    <span className="material-symbols-outlined text-lg md:text-xl text-slate-600 group-hover:text-primary transition-all">arrow_back</span>
                  </div>
                  <span className="text-sm md:text-base transition-transform group-hover:-translate-x-1">{t('kiosk.accountModal.back')}</span>
                </button>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2 md:gap-3">
                  <motion.div layoutId="active-kiosk-step" className="h-2.5 w-8 md:w-12 rounded-full bg-primary shadow-sm shadow-primary/30"></motion.div>
                  <motion.div layoutId="kiosk-dot-2" className="h-2 w-2 rounded-full bg-outline-variant/40"></motion.div>
                  <motion.div layoutId="kiosk-dot-3" className="h-2 w-2 rounded-full bg-outline-variant/40"></motion.div>
                  <motion.div layoutId="kiosk-dot-4" className="h-2 w-2 rounded-full bg-outline-variant/40"></motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
