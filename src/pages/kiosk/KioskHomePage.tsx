import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import KioskHeader from '@/features/kiosk/components/KioskHeader';
import KioskFooter from '@/features/kiosk/components/KioskFooter';
import { Button } from '@/components/ui/Button';

export default function KioskHomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleStart = () => {
    navigate('/kiosk/select-customer');
  };

  return (
    <div className="flex flex-col h-screen w-full relative">
      {/* Visual Polish: Status Bar Overlay */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-[#00AEEF] to-primary z-50"></div>

      <KioskHeader />

      {/* Main Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center relative px-8 bg-mesh pb-12 overflow-hidden">
        {/* Abstract Architectural Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.03, 0.05, 0.03],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-20 w-[60rem] h-[60rem] rounded-full bg-primary blur-[120px]"
          ></motion.div>
          <motion.div 
            animate={{ 
              scale: [1, 1.08, 1],
              opacity: [0.03, 0.06, 0.03],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 -right-20 w-[60rem] h-[60rem] rounded-full bg-[#00AEEF] blur-[120px]"
          ></motion.div>
          {/* Geometric Line Overlay */}
          <svg className="absolute top-0 right-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0 100 L100 0 M20 100 L100 20 M-20 100 L100 -20" fill="none" stroke="currentColor" strokeWidth="0.1"></path>
          </svg>
        </div>

        <div className="z-10 text-center max-w-6xl w-full flex flex-col items-center justify-center flex-grow -mt-8">
          {/* Greeting & Brand Identity */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 space-y-3 text-center"
          >
            <h2 className="font-headline font-black tracking-tight text-[#003063] text-5xl leading-tight">
              {t('kiosk.welcomeMain')}
            </h2>
            <h3 className="font-headline font-medium text-xl text-outline/60 leading-tight">
              {t('kiosk.welcomeSub')}
            </h3>
          </motion.div>

          {/* Central Content Area */}
          <div className="w-full flex items-center justify-center gap-12">
            {/* Large Visual Anchor Image */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="hidden lg:block w-3/5 max-w-xl aspect-[16/9] rounded-[2rem] overflow-hidden monolith-shadow border-4 border-white/80 ring-1 ring-black/5"
            >
              <img 
                alt="Premium architecture" 
                className="w-full h-full object-cover grayscale brightness-110 opacity-95 transition-transform duration-1000 hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsDgm2X-Ip6KLeXGrlzaNEnVR7EOE0dqM25HkSppa5notuqzwADiaGZl1WRPfjdAgw2er317eqvPHwdt4y3XWMF6kOzLCtHeG7eZtZ4Ztj0ySMiuiepRDdOC8CvgbyI4LMLvmjniAc856MVCL_MDvvM0xxAZKJzakjmNE5DSpJP8O2i42P5fmO0sVAuhGVeMm1lKYY3v76u09tH_QqkcfVZY0UKeR7j7L9RjxEr1-A9k1Csp8G71UWUsv-r9CkyW8nGP2VrjyIemoR"
              />
            </motion.div>

            {/* Main CTA Column */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col items-center shrink-0"
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 30px 60px -12px rgba(0,48,99,0.3)",
                    "0 30px 70px -4px rgba(0,48,99,0.5)",
                    "0 30px 60px -12px rgba(0,48,99,0.3)",
                  ]
                }}
                transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
                onClick={handleStart}
                className="group relative w-[420px] h-[110px] rounded-[2rem] bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center gap-6 cursor-pointer"
              >
                <motion.span 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="material-symbols-outlined text-5xl group-hover:scale-110 transition-transform"
                >
                  touch_app
                </motion.span>
                <div className="text-left">
                  <span className="block font-headline font-black text-3xl uppercase">
                    {t('kiosk.touchToStart')}
                  </span>
                  <span className="block font-label text-white/80 text-xs mt-1">
                    {t('kiosk.touchToStartSub')}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-[2rem] bg-white/10 opacity-0 group-active:opacity-100 transition-opacity"></div>
              </motion.button>
              
              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 text-primary">
                  <span className="material-symbols-outlined text-xl">fingerprint</span>
                  <span className="material-symbols-outlined text-xl">contactless</span>
                  <span className="material-symbols-outlined text-xl">credit_card</span>
                </div>
                <p className="font-label text-outline uppercase tracking-[0.3em] text-[10px] font-bold">
                  {t('kiosk.secureAccess')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <KioskFooter />
    </div>
  );
}
