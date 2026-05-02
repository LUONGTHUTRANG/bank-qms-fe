import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import bgImage from '../../assets/images/background-queuing.png'
import KioskHeader from '@/features/kiosk/components/KioskHeader';
import ServiceCard from '@/features/kiosk/components/ServiceCard';
import KioskProgressFooter from '@/features/kiosk/components/KioskProgressFooter';
import ConfirmServiceModal from '@/features/kiosk/components/ConfirmServiceModal';
import type { ServiceData } from '@/features/kiosk/components/ConfirmServiceModal';
import { useKioskStore } from '@/stores/useKioskStore';
import { kioskService } from '@/services/kioskService';
import type { RequestGroupDto } from '@/services/kioskService';
import { appConfig } from '@/config/appConfig';
import { toast } from '@/stores/useToastStore';

// Map icon tạm thời cho các dịch vụ
const getIconForPrefix = (prefix: string) => {
  const map: Record<string, string> = {
    A: 'payments',
    B: 'credit_card',
    C: 'receipt_long',
    D: 'devices',
    E: 'account_balance_wallet',
    F: 'forum'
  };
  return map[prefix] || 'home_repair_service';
};

export default function KioskChooseServicePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [requestGroups, setRequestGroups] = useState<RequestGroupDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const kioskState = useKioskStore();
  const itemsPerPage = 3;
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    // Nếu chưa chọn loại KH thì bắt quay lại
    if (!kioskState.customerSegmentId) {
      toast.warning('Vui lòng chọn loại khách hàng', 'Lưu ý');
      navigate('/kiosk/select-customer');
      return;
    }

    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const res: any = await kioskService.getRequestGroups();
        if (res && res.data) {
          setRequestGroups(res.data);
        } else if (Array.isArray(res)) {
          setRequestGroups(res);
        }
      } catch (err) {
        console.error('Lỗi khi lấy danh sách dịch vụ:', err);
        toast.error('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroups();
  }, [kioskState.customerSegmentId, navigate]);

  useEffect(() => {
    handleSwipe();
  }, [touchEnd]);

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    const totalPages = Math.ceil(requestGroups.length / itemsPerPage);

    if (isLeftSwipe && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
    if (isRightSwipe && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const deltaX = e.deltaX;
    if (Math.abs(deltaX) < 30) return; // Threshold để tránh kích hoạt nhầm

    const totalPages = Math.ceil(requestGroups.length / itemsPerPage);

    // Lướt sang phải (deltaX < 0) - trang trước
    if (deltaX < 0 && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
    // Lướt sang trái (deltaX > 0) - trang tiếp theo
    if (deltaX > 0 && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginatedServices = requestGroups.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const totalPages = Math.ceil(requestGroups.length / itemsPerPage);

  const handleSelectService = (serviceIdCode: string) => {
    const group = requestGroups.find(g => g.id.toString() === serviceIdCode);
    if (!group) return;
    
    setSelectedService({
      id: group.id.toString(),
      icon: getIconForPrefix(group.prefixCode),
      title: group.name,
      desc: group.description
    });
  };

  const handleConfirm = async () => {
    if (!selectedService) return;
    
    const group = requestGroups.find(g => g.id.toString() === selectedService.id);
    if (!group) return;

    setIsSubmitting(true);
    try {
      const payload = {
        branchId: appConfig.branchId,
        prefixCode: group.prefixCode,
        requestGroupId: group.id,
        customerSegmentId: kioskState.customerSegmentId as number,
        phoneNumber: kioskState.phoneNumber || ''
      };

      const res: any = await kioskService.createTicket(payload);
      const ticketData = res?.data || res;
      
      toast.success('Lấy phiếu thành công!');
      navigate('/kiosk/printing', { state: { ticket: ticketData, serviceName: group.name }, replace: true });
    } catch (err: any) {
      console.error('Lỗi tạo ticket:', err);
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo phiếu mới.');
    } finally {
      setIsSubmitting(false);
    }
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

      <main 
        className="flex-grow flex flex-col items-center justify-start px-4 md:px-6 lg:px-8 pt-4 relative z-10 w-full overflow-y-auto overscroll-contain pb-16"
        onTouchStart={(e) => setTouchStart(e.changedTouches[0].clientX)}
        onTouchEnd={(e) => setTouchEnd(e.changedTouches[0].clientX)}
        // onWheel={handleWheel}
      >
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
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 pb-8 auto-rows-fr">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-60">
              <span className="material-symbols-outlined text-primary text-6xl animate-spin mb-4">settings</span>
              <p className="text-xl font-medium text-slate-500">Đang tải danh sách dịch vụ...</p>
            </div>
          ) : paginatedServices.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-60">
              <span className="material-symbols-outlined text-primary text-6xl mb-4">error_outline</span>
              <p className="text-xl font-medium text-slate-500">Giờ này chi nhánh không có dịch vụ nào cung cấp</p>
            </div>
          ) : (
            paginatedServices.map((s, index) => (
              <ServiceCard 
                key={s.id}
                icon={getIconForPrefix(s.prefixCode)}
                title={s.name}
                desc={s.description}
                services={s.services}
                onClick={() => handleSelectService(s.id.toString())} 
                delay={0.1 * (index + 1)}
              />
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && requestGroups.length > 0 && (
          <div className="w-full max-w-5xl pb-8">
            {/* Main Navigation Row */}
            <div className="w-full flex items-center justify-between gap-4">
              {/* Previous Button - Right */}
              <motion.button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-primary text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                <span className="material-symbols-outlined text-lg md:text-xl">arrow_back</span>
                <span className="hidden md:inline">{t('kiosk.common.previous', 'Trước')}</span>
              </motion.button>

              {/* Pagination Dots - Center */}
              {/* <div className="flex items-center justify-center gap-2 flex-1">
                {Array.from({ length: totalPages }).map((_, page) => (
                  <motion.button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    animate={{
                      width: currentPage === page ? 32 : 8,
                      backgroundColor: currentPage === page ? '#003063' : '#cbd5e1'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="h-2.5 rounded-full transition-all cursor-pointer"
                    aria-label={`Go to page ${page + 1}`}
                  />
                ))}
              </div> */}
              {/* Page Info */}
              <p className="text-center text-sm md:text-base text-slate-500 font-medium">
                Trang {currentPage + 1} / {totalPages}
              </p>

              {/* Next Button - Left */}
              <motion.button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-primary text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                <span className="hidden md:inline">{t('kiosk.common.next', 'Tiếp')}</span>
                <span className="material-symbols-outlined text-lg md:text-xl">arrow_forward</span>
              </motion.button>
            </div>
          </div>
        )}
      </main>

      {/* Progress Orbit Footer */}
      <KioskProgressFooter currentStep={2} />

      {/* Confirmation Modal */}
      <ConfirmServiceModal 
        isOpen={!!selectedService} 
        service={selectedService} 
        isLoading={isSubmitting}
        onClose={() => setSelectedService(null)}
        onConfirm={handleConfirm} 
      />
    </div>
  );
}