import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ticketService, type TicketDto } from '@/services/ticketService';
import { socketService } from '@/services/socketService';

interface ISkippedTicket {
  id: number;
  ticketNo: string;
  customerType: 'personal' | 'business' | 'priority';
  skipExpireAt: string;
  currentCounterCode?: string;
}

export default function SkippedTicketList() {
  const [skippedTickets, setSkippedTickets] = useState<ISkippedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map customerSegmentId to customer type
  const getCustomerType = (segmentId?: number): 'personal' | 'business' | 'priority' => {
    // Adjust based on your segment IDs
    if (segmentId === 2) return 'business';
    if (segmentId === 3) return 'priority';
    return 'personal';
  };

  // Format time from datetime (hh:mm format)
  const formatTimeOnly = (dateTime?: string): string => {
    if (!dateTime) return '-';
    try {
      const date = new Date(dateTime);
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '-';
    }
  };

  // Fetch skipped tickets
  const fetchSkippedTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketsByStatus('SKIPPED_HOLD');
      
      const mapped = (data as TicketDto[]).map((ticket) => ({
        id: ticket.id,
        ticketNo: ticket.ticketNo,
        customerType: getCustomerType(ticket.customerSegmentId),
        skipExpireAt: ticket.skipExpireAt,
        currentCounterCode: ticket.currentCounterCode,
    }));
      
      setSkippedTickets(mapped);
      setError(null);
      console.log(`📺 SkippedTicketList loaded ${mapped.length} tickets`);
    } catch (err) {
      console.error('Error fetching skipped tickets:', err);
      setError('Không thể tải phiếu lỡ lượt');
      
      // Fallback mock data
    //   setSkippedTickets([
    //     { id: 1, ticketNo: 'A-101', customerType: 'personal', skipExpireAt: new Date(Date.now() + 3600000).toISOString(), currentCounterId: 1 },
    //     { id: 2, ticketNo: 'B-046', customerType: 'business', skipExpireAt: new Date(Date.now() + 7200000).toISOString(), currentCounterId: 3 },
    //     { id: 3, ticketNo: 'C-900', customerType: 'priority', skipExpireAt: new Date(Date.now() + 5400000).toISOString(), currentCounterId: 2 },
    //   ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkippedTickets();

    let subscriptions: any[] = [];
    let isMounted = true;

    socketService.connect(async () => {
      try {
        const topicsRes = await ticketService.getTopics();
        if (!isMounted) return;

        const topics = Array.isArray(topicsRes) ? topicsRes : (topicsRes as any)?.data || [];

        if (Array.isArray(topics) && topics.length > 0) {
          topics.forEach((topic: string) => {
            const sub = socketService.subscribe(topic, (rawEventData: any) => {
              let eventData = rawEventData;
              if (typeof rawEventData === 'string') {
                try {
                  eventData = JSON.parse(rawEventData);
                } catch (e) {
                  eventData = rawEventData;
                }
              }

              if (eventData?.action === 'TICKET_STATUS_CHANGED') {
                const { newStatus, oldStatus } = eventData;
                // Nếu có ticket chuyển sang SKIPPED_HOLD hoặc mất trạng thái SKIPPED_HOLD thì lấy lại danh sách
                if (newStatus === 'SKIPPED_HOLD' || oldStatus === 'SKIPPED_HOLD') {
                  fetchSkippedTickets();
                }
              } else if (eventData?.action === 'NEW_TICKET') {
                if (eventData.status === 'SKIPPED_HOLD') {
                  fetchSkippedTickets();
                }
              }
            });

            if (sub) {
              subscriptions.push(sub);
            }
          });
        }
      } catch (error) {
        console.error('Error subscribing to display topics in NextQueueList:', error);
      }
    });

    // Refresh every 30 minutes just to clean up expired tickets if they aren't pushed via socket
    const interval = setInterval(fetchSkippedTickets, 30000);

    return () => {
        isMounted = false;
        clearInterval(interval);
        subscriptions.forEach((sub) => {
          if (sub && typeof sub.unsubscribe === 'function') {
            sub.unsubscribe();
          }
        });
    };
  }, []);

  const getCustomerTypeConfig = (type: string) => {
    const configs = {
      personal: {
        label: 'Cá nhân',
        icon: 'person',
      },
      business: {
        label: 'Doanh nghiệp',
        icon: 'business',
      },
      priority: {
        label: 'Ưu tiên',
        icon: 'star',
      },
    };
    return configs[type as keyof typeof configs] || configs.personal;
  };

  return (
    <aside className="w-[30%] flex flex-col h-full bg-surface-container-lowest rounded-3xl p-8 text-on-surface shadow-2xl relative overflow-hidden">
      <div className="flex items-center gap-4 mb-8 shrink-0 relative z-10 text-primary">
        {/* <span
          className="material-symbols-outlined !text-3xl"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          schedule
        </span> */}
        <h2 className="text-3xl font-headline font-bold">Phiếu lỡ lượt</h2>
        <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center text-white font-bold text-xl">
          {skippedTickets.length}
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1 overflow-hidden relative z-10">
        {/* Status/Error */}
        {loading && (
          <div className="px-2 mb-3 text-sm text-on-surface-variant">
            Đang tải...
          </div>
        )}
        {error && (
          <div className="px-2 mb-3 text-sm text-error">
            {error}
          </div>
        )}

        {/* Skipped Tickets Title */}
        {/* {!loading && skippedTickets.length > 0 && (
          <div className="px-2 mb-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">
              DANH SÁCH LỠ LƯỢT ({skippedTickets.length})
            </h3>
          </div>
        )} */}

        {/* Ticket List */}
        {skippedTickets.length > 0 ? (
          <div className="flex-1 relative overflow-hidden">
            <motion.div 
              className="space-y-3 absolute top-0 left-0 right-0 w-full"
              animate={skippedTickets.length > 4 ? {
                y: [0, -((skippedTickets.length * 90) + (skippedTickets.length * 12))] // approximate height per item (90px) + gap (12px)
              } : { y: 0 }}
              transition={skippedTickets.length > 4 ? {
                y: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: skippedTickets.length * 3, 
                  ease: "linear",
                }
              } : { type: "tween", duration: 0.5 }}
            >
              {[...skippedTickets, ...(skippedTickets.length > 4 ? skippedTickets : [])].map((ticket, index) => {
                const config = getCustomerTypeConfig(ticket.customerType);
                const expireTime = formatTimeOnly(ticket.skipExpireAt);
                return (
                  <div
                    key={`${ticket.id}-${index}`}
                    className="bg-surface-container rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <div className="text-2xl font-bold text-primary">{ticket.ticketNo}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-md font-bold uppercase text-outline">{config.label}</span>
                        <span>-</span>
                        {ticket.currentCounterCode && (
                          <span className="text-md uppercase font-bold text-secondary">
                            Quầy {ticket.currentCounterCode}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-md text-outline">Thời gian hết hạn</span>
                      <span className="text-2xl font-bold text-error">{expireTime}</span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        ) : (
          !loading && (
            <div className="flex items-center justify-center h-full text-on-surface-variant">
              <p className="text-sm text-center">Không có phiếu lỡ lượt</p>
            </div>
          )
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-outline-variant border-opacity-20 shrink-0 text-center relative z-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-lg">volume_up</span>
            <p className="text-sm font-medium">Vui lòng chú ý màn hình và âm thanh thông báo.</p>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Các phiếu lỡ lượt sẽ bị hủy sau 15 phút. Quý khách vui lòng đến quầy được chỉ định trước thời gian hết hạn để được tham gia lại hàng đợi.
          </p>
        </div>
      </div>
    </aside>
  );
}
