import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import KioskHeader from '@/features/kiosk/components/KioskHeader';
import AccountCheckModal from '@/features/kiosk/components/AccountCheckModal';
import KioskProgressFooter from '@/features/kiosk/components/KioskProgressFooter';

export default function KioskSelectCustomerTypePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showAccountModal, setShowAccountModal] = useState(false);

  return (
    <div className="bg-surface text-on-surface h-screen flex flex-col relative overflow-y-auto overflow-x-hidden font-sans">
      {/* Decorative Background Patterns container - Fixed to avoid expanding scroll area */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0ibTEwIDEwbS0wLjUgMGEwLjUgMC41IDAgMSAwIDEgMGEwLjUgMC41IDAgMSAwIC0xIDBaIiBmaWxsPSIjMDA0NjhjIi8+PC9zdmc+')] opacity-[0.05]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-fixed opacity-20 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-tertiary-fixed opacity-20 blur-[100px] rounded-full"></div>
      </div>

      {/* Visual Polish: Status Bar Overlay (Matching Home Page) */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-[#00AEEF] to-primary z-50"></div>

      <KioskHeader />

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-8 py-6 lg:py-8 pb-28 lg:pb-36 relative w-full">
        {/* Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 lg:mb-12 max-w-3xl"
        >
          <h1 className="font-headline font-black text-primary tracking-tight leading-tight mb-2 lg:mb-3 text-3xl md:text-4xl lg:text-5xl">
            {t('kiosk.selectService.title')}
          </h1>
          <p className="text-lg md:text-xl text-outline font-medium tracking-wide">
            {t('kiosk.selectService.subtitle')}
          </p>
        </motion.div>

        {/* Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl relative z-10">
          
          {/* Individual Selection */}
          <motion.button 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onClick={() => setShowAccountModal(true)}
            className="group relative flex flex-col items-center justify-between p-6 lg:p-8 bg-gradient-to-br from-[#f8fbff] to-[#eef5fe] rounded-2xl shadow-[0_20px_40px_rgba(0,48,99,0.05)] hover:shadow-[0_40px_80px_rgba(0,48,99,0.12)] transition-all duration-500 hover:-translate-y-2 border border-[#d0e1f9] hover:border-primary/30 text-left h-full min-h-[250px] lg:min-h-[320px] cursor-pointer overflow-hidden"
          >
            {/* Soft decorative background accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-150 pointer-events-none"></div>
            
            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-white flex items-center justify-center mb-4 lg:mb-6 group-hover:bg-blue-50 transition-colors duration-300 relative z-10 shadow-sm border border-blue-50">
              <span className="material-symbols-outlined text-primary text-2xl lg:text-4xl">person</span>
            </div>
            <div className="flex-grow text-center w-full relative z-10">
              <h2 className="text-xl lg:text-2xl font-black text-primary mb-2 lg:mb-3 tracking-tight">{t('kiosk.selectService.regular.title')}</h2>
              <p className="text-slate-600 text-sm lg:text-base font-medium leading-relaxed max-xl:line-clamp-3">{t('kiosk.selectService.regular.desc')}</p>
            </div>
            <div className="mt-4 lg:mt-6 w-full py-3 lg:py-4 px-4 rounded-full bg-white border border-blue-100 group-hover:bg-primary group-hover:border-primary transition-all duration-300 flex items-center justify-center gap-2 relative z-10 w-[95%] mx-auto">
              <span className="text-primary group-hover:text-white font-bold text-xs lg:text-sm uppercase tracking-wide transition-colors duration-300 text-center leading-tight whitespace-nowrap">{t('kiosk.selectService.regular.action')}</span>
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors duration-300 shrink-0">chevron_right</span>
            </div>
          </motion.button>

          {/* Priority Selection */}
          <motion.button 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => navigate('/kiosk/phone-input', { state: { service: 'priority', hasAccount: true } })}
            className="group relative flex flex-col items-center justify-between p-6 lg:p-8 bg-gradient-to-br from-[#fffdf8] to-[#fcf4e4] rounded-2xl shadow-[0_20px_40px_rgba(180,106,0,0.05)] hover:shadow-[0_40px_80px_rgba(180,106,0,0.12)] transition-all duration-500 hover:-translate-y-2 border border-[#f3e1bd] hover:border-[#B46A00]/30 text-left h-full min-h-[250px] lg:min-h-[320px] cursor-pointer overflow-hidden"
          >
            {/* Soft decorative background accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/20 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-150 pointer-events-none"></div>
            
            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-white flex items-center justify-center mb-4 lg:mb-6 group-hover:bg-orange-50 transition-colors duration-300 relative z-10 shadow-[0_4px_20px_rgba(180,106,0,0.08)] border border-orange-50">
              <span className="material-symbols-outlined text-[#B46A00] text-2xl lg:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <div className="flex-grow text-center w-full relative z-10">
              <h2 className="text-xl lg:text-2xl font-black text-[#8A5100] mb-2 lg:mb-3 tracking-tight">{t('kiosk.selectService.priority.title')}</h2>
              <p className="text-[#8A5100]/70 text-sm lg:text-base font-medium leading-relaxed max-xl:line-clamp-3">{t('kiosk.selectService.priority.desc')}</p>
            </div>
            <div className="mt-4 lg:mt-6 w-full py-3 lg:py-4 px-4 rounded-full bg-white border border-orange-100 group-hover:bg-[#B46A00] group-hover:border-[#B46A00] transition-all duration-300 flex items-center justify-center gap-2 relative z-10 w-[95%] mx-auto">
              <span className="text-[#B46A00] group-hover:text-white font-bold text-xs lg:text-sm uppercase tracking-wide transition-colors duration-300 text-center leading-tight whitespace-nowrap">{t('kiosk.selectService.priority.action')}</span>
              <span className="material-symbols-outlined text-[#B46A00] group-hover:text-white transition-colors duration-300 shrink-0">verified</span>
            </div>
          </motion.button>

          {/* Corporate Selection */}
          <motion.button 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => navigate('/kiosk/phone-input', { state: { service: 'corporate', hasAccount: true } })}
            className="group relative flex flex-col items-center justify-between p-6 lg:p-8 bg-gradient-to-br from-[#f8f9fa] to-[#eef0f3] rounded-2xl shadow-[0_20px_40px_rgba(15,23,42,0.05)] hover:shadow-[0_40px_80px_rgba(15,23,42,0.12)] transition-all duration-500 hover:-translate-y-2 border border-[#e2e8f0] hover:border-slate-400/30 text-left h-full min-h-[250px] lg:min-h-[320px] cursor-pointer overflow-hidden"
          >
            {/* Soft decorative background accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-200/40 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-150 pointer-events-none"></div>

            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-white flex items-center justify-center mb-4 lg:mb-6 group-hover:bg-slate-100 transition-colors duration-300 relative z-10 shadow-sm border border-slate-100">
              <span className="material-symbols-outlined text-slate-700 text-2xl lg:text-4xl">business</span>
            </div>
            <div className="flex-grow text-center w-full relative z-10">
              <h2 className="text-xl lg:text-2xl font-black text-slate-800 mb-2 lg:mb-3 tracking-tight">{t('kiosk.selectService.corporate.title')}</h2>
              <p className="text-slate-600 text-sm lg:text-base font-medium leading-relaxed max-xl:line-clamp-3">{t('kiosk.selectService.corporate.desc')}</p>
            </div>
            <div className="mt-4 lg:mt-6 w-full py-3 lg:py-4 px-4 rounded-full bg-white border border-slate-200 group-hover:bg-slate-700 group-hover:border-slate-700 transition-all duration-300 flex items-center justify-center gap-2 relative z-10 w-[95%] mx-auto">
              <span className="text-slate-700 group-hover:text-white font-bold text-xs lg:text-sm uppercase tracking-wide transition-colors duration-300 text-center leading-tight whitespace-nowrap">{t('kiosk.selectService.corporate.action')}</span>
              <span className="material-symbols-outlined text-slate-700 group-hover:text-white transition-colors duration-300 shrink-0">corporate_fare</span>
            </div>
          </motion.button>
        </div>
      </main>

      {/* Decorative Image Block Component */}
      <div className="absolute bottom-[6rem] lg:bottom-[8rem] right-12 w-64 h-64 opacity-20 grayscale transition-all duration-700 pointer-events-none hidden lg:block blend-luminosity z-0">
        <img 
          alt="Banking Environment"
          className="w-full h-full object-cover rounded-3xl" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzOciZ71cMEn_OlkaLK80INpnAUCHBuCIrCdvvT_9aqCcmrnaAdU-Ca6lCgiSpXz60wxbYwTmkRTVMg0kX7xfSEAWWlmTWMRuOuTBTaX6Q3HLOS5Fa5Rlev_le3oheBaixvEgKmOiuQTKQ6KTFWMRHW3IA2bM0koEpFXBlYOhDc6w3gVNjelKhOAKYrhS98gSA7yASmzaGfCxVbLyIsVLTeBsaTGq2VnsfTn37T64zw0_ZGwh1G9Yrvb0VJD_FJ5eVt5Ipcs60ANRr" 
        />
      </div>

      <div className="hidden lg:block absolute bottom-0 left-0 w-[800px] h-[300px] bg-gradient-to-t from-surface-container-high/50 to-transparent pointer-events-none rounded-tr-full blur-3xl -z-10" />

      {/* Progress Orbit Footer */}
      <KioskProgressFooter currentStep={1} />

      {/* Extracted Account Check Modal */}
      <AccountCheckModal 
        isOpen={showAccountModal} 
        onClose={() => setShowAccountModal(false)} 
      />
    </div>
  );
}