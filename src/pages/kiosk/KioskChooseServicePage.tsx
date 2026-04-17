import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import bgImage from '../../assets/images/background-queuing.png'
import KioskHeader from '@/features/kiosk/components/KioskHeader';
import ServiceCard from '@/features/kiosk/components/ServiceCard';
import KioskProgressFooter from '@/features/kiosk/components/KioskProgressFooter';
import ConfirmServiceModal from '@/features/kiosk/components/ConfirmServiceModal';
import type { ServiceData } from '@/features/kiosk/components/ConfirmServiceModal';

const MOCK_SERVICES = [
  { id: 'deposit', icon: 'payments' },
  { id: 'card', icon: 'credit_card' },
  { id: 'bill', icon: 'receipt_long' },
  { id: 'ebanking', icon: 'devices' },
  { id: 'loan', icon: 'account_balance_wallet' },
  { id: 'advisory', icon: 'forum' }
];

export default function KioskChooseServicePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

  const handleSelectService = (serviceId: string) => {
    const s = MOCK_SERVICES.find(x => x.id === serviceId);
    if (!s) return;
    
    setSelectedService({
      id: s.id,
      icon: s.icon,
      title: t(`kiosk.chooseService.services.${s.id}.title`),
      desc: t(`kiosk.chooseService.services.${s.id}.desc`)
    });
  };

  const handleConfirm = () => {
    // Chuyển hướng hoặc xử lý lấy vé phụ thuộc vào yêu cầu tiếp theo
    console.log("Confirmed ticket for:", selectedService?.id);
    navigate('/kiosk/printing', { state: { service: selectedService }, replace: true });
  };

  return (
    <div className="bg-slate-50 text-on-surface font-sans h-screen flex flex-col relative overflow-hidden select-none touch-manipulation">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none z-0">
        <img 
          className="w-full h-full object-cover" 
          alt="Architectural background" 
          src={bgImage}
        />
      </div>

      <KioskHeader />

      <main className="flex-grow flex flex-col items-center justify-start px-4 md:px-6 lg:px-8 pt-4 relative z-10 w-full overflow-y-auto overscroll-contain pb-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mb-6 lg:mb-8 text-center"
        >
          <h2 className="font-headline font-black tracking-tight text-3xl md:text-4xl lg:text-5xl leading-none text-primary mb-2 md:mb-3">
            {t('kiosk.chooseService.title')}
          </h2>
          <p className="text-base md:text-xl text-slate-500 font-medium">
            {t('kiosk.chooseService.subtitle')}
          </p>
        </motion.div>

        {/* Service Bento Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 pb-8">
          {MOCK_SERVICES.map((service, index) => (
            <ServiceCard 
              key={service.id}
              icon={service.icon}
              title={t(`kiosk.chooseService.services.${service.id}.title`)}
              desc={t(`kiosk.chooseService.services.${service.id}.desc`)}
              onClick={() => handleSelectService(service.id)} 
              delay={0.1 * (index + 1)}
            />
          ))}
        </div>
      </main>

      {/* Progress Orbit Footer */}
      <KioskProgressFooter currentStep={3} />

      {/* Confirmation Modal */}
      <ConfirmServiceModal 
        isOpen={!!selectedService} 
        service={selectedService} 
        onClose={() => setSelectedService(null)} 
        onConfirm={handleConfirm} 
      />
    </div>
  );
}