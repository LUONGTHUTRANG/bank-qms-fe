import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCurrentTime } from '@/hooks/useCurrentTime';
import bgFlagVN from "../../../assets/images/flag-for-flag-vietnam-svgrepo-com.png"
import bgFlagEN from "../../../assets/images/flag-england-svgrepo-com.png"

export default function KioskHeader() {
  const { t, i18n } = useTranslation();
  const { timeString, dateString } = useCurrentTime();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex justify-between items-center w-full px-8 py-3 z-20"
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-3xl">
          account_balance
        </span>
        <h1 className="text-xl font-black tracking-tighter text-[#003063] uppercase whitespace-nowrap">
          Architectural Banking
        </h1>
      </div>

      {/* Ticker / Announcement */}
      <div className="flex-1 mx-8 overflow-hidden bg-primary/5 rounded-full px-5 py-1.5 border border-primary/10 flex items-center">
        <span className="material-symbols-outlined text-primary text-lg mr-2 shrink-0">
          campaign
        </span>
        <div className="overflow-hidden w-full relative h-[20px]">
          <motion.p 
            className="text-primary font-medium text-sm absolute whitespace-nowrap uppercase tracking-wide"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            style={{ left: "0", right: "0" }}
          >
            {t('kiosk.announcement')}
          </motion.p>
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        {/* Time Display */}
        <div className="text-right">
          <p className="text-2xl font-bold text-primary font-headline tabular-nums">{timeString}</p>
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest">{dateString}</p>
        </div>
        {/* Language Toggle (Glassmorphism Pill) */}
        <div className="flex items-center gap-1 p-1 bg-surface-container-lowest/80 backdrop-blur-xl rounded-full shadow-[0_20px_40px_rgba(0,70,140,0.06)] border border-outline-variant/15">
          <button 
            onClick={() => changeLanguage('vi')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${i18n.language === 'vi' ? 'bg-primary text-white' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
          >
            <img alt="Vietnamese Flag" className="w-4 h-3 object-cover rounded-sm" src={bgFlagVN} />
            <span className="text-xs font-bold">VN</span>
          </button>
          <button 
            onClick={() => changeLanguage('en')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${i18n.language === 'en' ? 'bg-primary text-white' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
          >
            <img alt="English Flag" className="w-4 h-3 object-cover rounded-sm" src={bgFlagEN} />
            <span className="text-xs font-bold">EN</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}