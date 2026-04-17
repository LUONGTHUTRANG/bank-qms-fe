import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router';

export default function KioskFooter() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.nav 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
      className="flex justify-center items-center w-full px-8 py-3 bg-white/30 backdrop-blur-xl border-t border-white/50 absolute bottom-0 z-20"
    >
      <div className="flex gap-8">
        <Button 
          variant="primary" 
          icon="home"
          onClick={() => navigate('/kiosk')}
        >
          {t('kiosk.home')}
        </Button>
        <Button 
          variant="ghost" 
          icon="contact_support"
          onClick={() => {
            // TODO: Bật modal gọi nhân viên trợ giúp
          }}
        >
          {t('kiosk.helpSupport')}
        </Button>
      </div>
    </motion.nav>
  );
}