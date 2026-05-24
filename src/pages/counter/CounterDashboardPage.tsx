import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CurrentServingCard from '@/features/counter/components/CurrentServingCard';
import QuickStatsGrid from '@/features/counter/components/QuickStatsGrid';
import QueueListSection from '@/features/counter/components/QueueListSection';
import { socketService } from '@/services/socketService';
import { appConfig } from '@/config/appConfig';
import { toast } from '@/stores/useToastStore';
import { useQueueStore } from '@/stores/useQueueStore';
import { ticketService, type SessionInfoDto } from '@/services/ticketService';
import { getTicketStatusName } from '@/constants/ticketStatus';

// Container Variants for staggering animation
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function CounterDashboardPage() {
  const { fetchQueue, fetchSuspendedTickets, addTicketToQueue, updateTicketStatusInQueue, addSuspendedTicket, removeSuspendedTicket } = useQueueStore();
  const [sessionInfo, setSessionInfo] = useState<SessionInfoDto | null>(null);
  const [servingTicketsCount, setServingTicketsCount] = useState(0);

  // Fetch session info on mount
  useEffect(() => {
    const loadSessionInfo = async () => {
      try {
        const info = await ticketService.getSessionInfo();
        setSessionInfo(info);

        // Fetch current ticket to check if it's being served
        const currentTicket = await ticketService.getCurrentTicket();
        if (currentTicket && (currentTicket.status === 'CALLED' || currentTicket.status === 'SERVING')) {
          // Vé đang được gọi hoặc phục vụ, bắt đầu đếm giờ
          setServingTicketsCount(1);
        } else {
          setServingTicketsCount(0);
        }
      } catch (error) {
        console.error('Error fetching session info:', error);
      }
    };
    loadSessionInfo();
  }, []);

  // Service time counter - increment every second when serving tickets
  useEffect(() => {
    if (servingTicketsCount <= 0) return;

    const interval = setInterval(() => {
      setSessionInfo(prev =>
        prev ? {
          ...prev,
          sessionDurationSeconds: prev.sessionDurationSeconds + 1
        } : prev
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [servingTicketsCount]);

  useEffect(() => {
    // Load initial queue data and suspended tickets
    fetchQueue();
    fetchSuspendedTickets();

    let subscriptions: any[] = [];
    let isMounted = true;

    // Kết nối websocket khi vào màn hình dashboard
    socketService.connect(async () => {
       // Callback khi connect thành công
       const branchId = appConfig.branchId || 1; // get actual branch id context
       
       try {
         // Lấy danh sách các topic hợp lệ cho quầy từ API
         const topicsRes = await ticketService.getTopics();
         
         if (!isMounted) return; // Màn hình đã đóng, huỷ subscribe

         const topics = Array.isArray(topicsRes) ? topicsRes : (topicsRes as any)?.data || [];

         if (Array.isArray(topics) && topics.length > 0) {
           console.log(`Bắt đầu đăng ký ${topics.length} kênh dữ liệu cho quầy...`);
           
           topics.forEach((topic: string) => {
             console.log(`✅ Đang subscribe vào topic: ${topic}`);
             
             const sub = socketService.subscribe(topic, (rawEventData) => {
               console.log(`[SOCKET_EVENT_RECEIVED] Kênh ${topic} vừa nhận thông báo:`, rawEventData);
               let eventData = rawEventData;
               if (typeof rawEventData === 'string') {
                 try { eventData = JSON.parse(rawEventData); } catch(e) {
                   console.warn(`[SOCKET_EVENT_PARSE_ERROR] Không thể parse JSON từ kênh ${topic}:`, e);
                 }
               }
               
               console.log(`[SOCKET_EVENT_PARSED] Dữ liệu xử lý từ ${topic}:`, eventData);

               if (eventData?.action === 'NEW_TICKET') {
                  toast.info(`Có vé mới: ${eventData.ticketNo} - Kênh: ${topic}`);
                  
                  // Xử lý vé mới: nếu status = SKIPPED_HOLD, thêm vào suspended, không vào queue
                  if (eventData.status === 'SKIPPED_HOLD') {
                    console.log(`[TICKET_NEW_SUSPENDED] Vé ${eventData.ticketNo} được tạo với trạng thái tạm hoãn`);
                    addSuspendedTicket(eventData);
                  } else {
                    addTicketToQueue(eventData);
                    // Cập nhật session info: tăng waitingCount
                    setSessionInfo(prev => prev ? { ...prev, waitingCount: prev.waitingCount + 1 } : prev);
                  }
               } else if (eventData?.action === 'TICKET_STATUS_CHANGED') {
                  // Xử lý sự kiện thay đổi trạng thái vé
                  const { ticketId, newStatus, oldStatus } = eventData;
                  console.log(`[TICKET_STATUS_CHANGE] Vé ID: ${ticketId}, ${oldStatus} => ${newStatus}`);
                  updateTicketStatusInQueue(ticketId, newStatus);

                  // Xử lý vé được tạm hoãn (SKIPPED_HOLD)
                  if (newStatus === 'SKIPPED_HOLD') {
                    console.log(`[TICKET_SUSPENDED] Vé ${eventData.ticketNo} đã được tạm hoãn`);
                    addSuspendedTicket(eventData);
                  }

                  // Xử lý vé tham gia lại từ tạm hoãn (SKIPPED_HOLD -> WAITING)
                  if (oldStatus === 'SKIPPED_HOLD' && newStatus === 'WAITING') {
                    console.log(`[TICKET_REJOIN] Vé ${eventData.ticketNo} đã tham gia lại hàng đợi`);
                    removeSuspendedTicket(ticketId);
                    addTicketToQueue(eventData);
                  }

                  // Xử lý vé hết hạn tạm hoãn (SKIPPED_EXPIRED)
                  if (newStatus === 'SKIPPED_EXPIRED') {
                    console.log(`[TICKET_EXPIRED] Vé ${eventData.ticketNo} hết hạn tạm hoãn`);
                    removeSuspendedTicket(ticketId);
                  }

                  // Track serving tickets count for service time counter
                  const isOldServing = oldStatus === 'CALLED' || oldStatus === 'SERVING';
                  const isNewServing = newStatus === 'CALLED' || newStatus === 'SERVING';

                  if (!isOldServing && isNewServing) {
                    // Vé chuyển vào trạng thái phục vụ
                    setServingTicketsCount(prev => prev + 1);
                  } else if (isOldServing && !isNewServing) {
                    // Vé rời khỏi trạng thái phục vụ
                    setServingTicketsCount(prev => Math.max(0, prev - 1));
                  }

                  // Cập nhật session info dựa trên status thay đổi
                  setSessionInfo(prev => {
                    if (!prev) return prev;
                    const updated = { ...prev };
                    // Nếu từ WAITING sang trạng thái khác, giảm waitingCount
                    if (oldStatus === 'WAITING' && newStatus !== 'WAITING') {
                      updated.waitingCount = Math.max(0, updated.waitingCount - 1);
                    }
                    // Nếu từ SKIPPED_HOLD sang WAITING, tăng waitingCount
                    if (oldStatus === 'SKIPPED_HOLD' && newStatus === 'WAITING') {
                      updated.waitingCount = updated.waitingCount + 1;
                    }
                    // Nếu sang DONE, tăng completedCount
                    if (newStatus === 'DONE') {
                      updated.completedCount = updated.completedCount + 1;
                    }
                    return updated;
                  });
                  // Nếu vé đã không phải WAITING, tự động xép hàng
                  if (newStatus !== 'WAITING') {
                     const statusName = getTicketStatusName(newStatus);
                     toast.info(`Vé ${eventData.ticketNo || ticketId} chuyển sang trạng thái: ${statusName}`);
                  }
               } else {
                  console.log(`[SOCKET_EVENT_REFRESH] Gọi lại fetchQueue vì không nhận ra action`);
                  fetchQueue();
               }
             });
             
             if (sub) subscriptions.push(sub);
           });
           
           console.log(`Hoàn tất kết nối ${subscriptions.length} kênh.`);
         } else {
           console.log('Quầy chưa được phân công nhóm dịch vụ nào hoặc không có topic hợp lệ.');
         }
       } catch (error) {
         console.error('Lỗi lấy danh sách topic cho socket:', error);
       }
    });

    // Cleanup khi thoát dashboard
    return () => {
      isMounted = false;
      subscriptions.forEach(sub => {
        if (sub && typeof sub.unsubscribe === 'function') {
          sub.unsubscribe();
        }
      });
      socketService.disconnect();
    };
  }, []);

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={item} className="lg:col-span-7">
          <CurrentServingCard />
        </motion.div>
        <motion.div variants={item} className="lg:col-span-5 relative">
          <QuickStatsGrid sessionInfo={sessionInfo} />
        </motion.div>
      </div>
      <motion.div variants={item}>
        <QueueListSection />
      </motion.div>
    </motion.div>
  );
}