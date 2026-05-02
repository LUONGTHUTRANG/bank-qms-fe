import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CurrentServingCard from '@/features/counter/components/CurrentServingCard';
import QuickStatsGrid from '@/features/counter/components/QuickStatsGrid';
import QueueListSection from '@/features/counter/components/QueueListSection';
import { authService } from '@/services/authService';
import { useOutletContext } from 'react-router';
import { socketService } from '@/services/socketService';
import { appConfig } from '@/config/appConfig';
import { toast } from '@/stores/useToastStore';
import { useQueueStore } from '@/stores/useQueueStore';
import type { UserInfoDto } from '@/features/counter/components/CounterHeader';
import { ticketService } from '@/services/ticketService';

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
  const { fetchQueue, addTicketToQueue } = useQueueStore();

  useEffect(() => {
    // Load initial queue data
    fetchQueue();

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

               if (eventData?.action === 'NEW_TICKET' || eventData?.ticketNo) {
                  toast.info(`Có vé mới: ${eventData.ticketNo} - Kênh: ${topic}`);
                  addTicketToQueue(eventData);
               } else {
                  console.log(`[SOCKET_EVENT_REFRESH] Gọi lại fetchQueue vì không nhận ra action NEW_TICKET`);
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
          <QuickStatsGrid />
        </motion.div>
      </div>
      <motion.div variants={item}>
        <QueueListSection />
      </motion.div>
    </motion.div>
  );
}