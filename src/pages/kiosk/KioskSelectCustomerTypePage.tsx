import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import KioskHeader from '@/features/kiosk/components/KioskHeader';
import KioskProgressFooter from '@/features/kiosk/components/KioskProgressFooter';
import { useKioskStore } from '@/stores/useKioskStore';
import { kioskService } from '@/services/kioskService';

export default function KioskSelectCustomerTypePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setCustomerSegment = useKioskStore((state) => state.setCustomerSegment);
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const res = await kioskService.getCustomerSegments();
        setSegments(res.data);
      } catch (error) {
        console.error('Failed to fetch customer segments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSegments();
  }, []);
  
  const handleSelectCustomerType = (code: string, id: number) => {
    setCustomerSegment(code, id);
    navigate('/kiosk/choose-service');
  };

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
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8 max-w-6xl relative z-10">
          
          {loading ? (
            <div className="w-full text-center py-10">
              <div className="loading loading-spinner text-primary loading-lg"></div>
            </div>
          ) : (
            segments.map((segment) => {
              const code = segment.code;
              
              // Map visual styles based on code
              const isPersonal = code === 'PERSONAL';
              const isVIP = code === 'VIP';
              
              const baseGradient = isVIP 
                ? 'from-[#fffdf8] to-[#fcf4e4]'
                : isPersonal 
                  ? 'from-[#f8fbff] to-[#eef5fe]'
                  : 'from-[#f8f9fa] to-[#eef0f3]';
                  
              const shadowColor = isVIP 
                ? 'rgba(180,106,0,0.05)'
                : isPersonal 
                  ? 'rgba(0,48,99,0.05)'
                  : 'rgba(15,23,42,0.05)';
                  
              const hoverShadowColor = isVIP 
                ? 'rgba(180,106,0,0.12)'
                : isPersonal 
                  ? 'rgba(0,48,99,0.12)'
                  : 'rgba(15,23,42,0.12)';
                  
              const borderColor = isVIP ? 'border-[#f3e1bd]' : isPersonal ? 'border-[#d0e1f9]' : 'border-[#e2e8f0]';
              const hoverBorderColor = isVIP ? 'hover:border-[#B46A00]/30' : isPersonal ? 'hover:border-primary/30' : 'hover:border-slate-400/30';
              
              const accentBg = isVIP ? 'bg-orange-200/20' : isPersonal ? 'bg-blue-200/20' : 'bg-slate-200/40';
              
              const iconContainerBg = isVIP ? 'hover:bg-orange-50 border-orange-50' : isPersonal ? 'hover:bg-blue-50 border-blue-50' : 'hover:bg-slate-100 border-slate-100';
              const iconColor = isVIP ? 'text-[#B46A00]' : isPersonal ? 'text-primary' : 'text-slate-700';
              
              const titleColor = isVIP ? 'text-[#8A5100]' : isPersonal ? 'text-primary' : 'text-slate-800';
              const descColor = isVIP ? 'text-[#8A5100]/70' : isPersonal ? 'text-slate-600' : 'text-slate-600';
              
              const buttonBorderColor = isVIP ? 'border-orange-100' : isPersonal ? 'border-blue-100' : 'border-slate-200';
              const buttonGroupHover = isVIP ? 'group-hover:bg-[#B46A00] group-hover:border-[#B46A00]' : isPersonal ? 'group-hover:bg-primary group-hover:border-primary' : 'group-hover:bg-slate-700 group-hover:border-slate-700';
              const buttonTextColor = isVIP ? 'text-[#B46A00]' : isPersonal ? 'text-primary' : 'text-slate-700';

              let iconName = 'person';
              if (isVIP) iconName = 'star';
              else if (!isPersonal) iconName = 'business';

              return (
                <motion.button 
                  key={segment.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  onClick={() => handleSelectCustomerType(code, segment.id)}
                  className={`group relative flex flex-col items-center justify-between p-6 lg:p-8 bg-gradient-to-br ${baseGradient} rounded-2xl shadow-[0_20px_40px_${shadowColor}] hover:shadow-[0_40px_80px_${hoverShadowColor}] transition-all duration-500 hover:-translate-y-2 border ${borderColor} ${hoverBorderColor} text-left h-full min-h-[250px] lg:min-h-[320px] w-80 cursor-pointer overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 ${accentBg} rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-150 pointer-events-none`}></div>
                  
                  <div className={`w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-white flex items-center justify-center mb-4 lg:mb-6 transition-colors duration-300 relative z-10 shadow-sm border ${iconContainerBg}`}>
                    <span className={`material-symbols-outlined ${iconColor} text-2xl lg:text-4xl`} style={isVIP ? { fontVariationSettings: "'FILL' 1" } : {}}>{iconName}</span>
                  </div>
                  <div className="flex-grow text-center w-full relative z-10">
                    <h2 className={`text-xl lg:text-2xl font-bold ${titleColor} mb-2 lg:mb-3 tracking-tight`}>{segment.name}</h2>
                    <p className={`${descColor} text-sm lg:text-base font-medium leading-relaxed max-xl:line-clamp-3`}>{segment.description || segment.name}</p>
                  </div>
                  <div className={`mt-4 lg:mt-6 w-full py-3 lg:py-4 px-4 rounded-full bg-white border ${buttonBorderColor} ${buttonGroupHover} transition-all duration-300 flex items-center justify-center gap-2 relative z-10 w-[95%] mx-auto`}>
                    <span className={`${buttonTextColor} group-hover:text-white font-bold text-xs lg:text-sm uppercase tracking-wide transition-colors duration-300 text-center leading-tight whitespace-nowrap`}>
                      {t(`kiosk.selectService.${isVIP ? 'priority' : isPersonal ? 'regular' : 'corporate'}.action`, 'Tiếp tục')}
                    </span>
                    <span className={`material-symbols-outlined ${buttonTextColor} group-hover:text-white transition-colors duration-300 shrink-0`}>
                      {isVIP ? 'verified' : isPersonal ? 'chevron_right' : 'corporate_fare'}
                    </span>
                  </div>
                </motion.button>
              );
            })
          )}
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
    </div>
  );
}