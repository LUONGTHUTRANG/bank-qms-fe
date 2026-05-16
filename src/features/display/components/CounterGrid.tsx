import { useEffect, useState, useCallback } from 'react';
import CounterCard from './CounterCard';
import type { ICounterCard } from './CounterCard';
import { counterService, type ServiceCounterWithTicketDto } from '@/services/counterService';
import { socketService } from '@/services/socketService';
import { appConfig } from '@/config/appConfig';
import { ticketService } from '@/services/ticketService';

export default function CounterGrid() {
  const [counters, setCounters] = useState<ICounterCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const branchId = appConfig.branchId || 1;

  // Map API data to ICounterCard
  const mapCounterData = (data: ServiceCounterWithTicketDto[]): ICounterCard[] => {
    return data.map((counter) => {
      let status: 'serving' | 'calling' | 'ready' | 'offline' | 'completed' | 'cancelled' = 'offline';

      if (counter.status === 'INACTIVE') {
        status = 'offline';
      } else if (counter.status === 'AVAILABLE' || counter.status === 'ACTIVE') {
        if (counter.currentTicketId && counter.currentTicketStatus) {
          if (counter.currentTicketStatus === 'CALLED') {
            status = 'calling';
          } else if (counter.currentTicketStatus === 'DONE') {
            status = 'completed';
          } else if (counter.currentTicketStatus === 'CANCELLED') {
            status = 'cancelled';
          } else {
            status = 'serving';
          }
        } else if (counter.currentTicketNo) {
          status = 'serving';
        } else {
          status = 'ready';
        }
      }

      return {
        id: counter.id.toString(),
        number: counter.code.padStart(2, '0'),
        status,
        currentTicket: counter.currentTicketNo || '',
      };
    });
  };

  // Fetch counters data
  const fetchCounters = useCallback(async () => {
    try {
      setLoading(true);
      const data = await counterService.getServiceCountersWithTickets(branchId);
      const mappedCounters = mapCounterData(data as ServiceCounterWithTicketDto[]);
      setCounters(mappedCounters);
      setError(null);
      console.log(`📺 CounterGrid updated with ${mappedCounters.length} counters`);
    } catch (err) {
      console.error('Error fetching counters:', err);
      setError('Không thể tải danh sách quầy');

      // Fallback mock data
    //   const mockCounters: ICounterCard[] = [
    //     { id: '1', number: '01', status: 'serving', currentTicket: 'A-102' },
    //     { id: '2', number: '02', status: 'serving', currentTicket: 'B-045' },
    //     { id: '3', number: '03', status: 'serving', currentTicket: 'A-103' },
    //     { id: '4', number: '04', status: 'calling', currentTicket: 'A-105' },
    //     { id: '5', number: '05', status: 'serving', currentTicket: 'C-901' },
    //     { id: '6', number: '06', status: 'offline', currentTicket: '' },
    //   ];
    //   setCounters(mockCounters);
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  // Update single counter status directly - returns true if found, false if not
  const updateCounterStatus = (ticketNo: string, newTicketStatus: string): boolean => {
    let found = false;
    setCounters((prevCounters) => {
      return prevCounters.map((counter) => {
        if (counter.currentTicket === ticketNo) {
          found = true;
          let status: 'serving' | 'calling' | 'ready' | 'offline' | 'completed' | 'cancelled' = counter.status;
          
          if (newTicketStatus === 'CALLED') {
            status = 'calling';
          } else if (newTicketStatus === 'DONE') {
            status = 'completed';
          } else if (newTicketStatus === 'CANCELLED') {
            status = 'cancelled';
          } else if (newTicketStatus === 'SERVING') {
            status = 'serving';
          }
          
          console.log(`📺 Update counter ${counter.number}: ${counter.currentTicket} → ${newTicketStatus} (${status})`);
          return { ...counter, status };
        }
        return counter;
      });
    });
    return found;
  };

  // Socket subscription
  useEffect(() => {
    fetchCounters();

    let subscriptions: any[] = [];
    let isMounted = true;

    // Kết nối websocket để nhận cập nhật real-time
    socketService.connect(async () => {
      console.log('🔌 Socket connected for DisplayPage');

      try {
        // Lấy danh sách các topic hợp lệ từ API
        const topicsRes = await ticketService.getTopics();

        if (!isMounted) return;

        const topics = Array.isArray(topicsRes) ? topicsRes : (topicsRes as any)?.data || [];

        if (Array.isArray(topics) && topics.length > 0) {
          console.log(`📺 Display: Đăng ký ${topics.length} topic để cập nhật trạng thái quầy...`);

          topics.forEach((topic: string) => {
            console.log(`✅ Display subscribe: ${topic}`);

            const sub = socketService.subscribe(topic, (rawEventData: any) => {
              console.log(`[DISPLAY_SOCKET_EVENT_RAW] ${topic}:`, rawEventData);

              let eventData = rawEventData;
              if (typeof rawEventData === 'string') {
                try {
                  eventData = JSON.parse(rawEventData);
                } catch (e) {
                  console.warn(`[DISPLAY_PARSE_ERROR] Không thể parse JSON từ ${topic}:`, e);
                  eventData = rawEventData;
                }
              }

              console.log(`[DISPLAY_SOCKET_EVENT_PARSED] ${topic}:`, eventData);

              // Handle ticket status change events
              if (eventData?.action === 'TICKET_STATUS_CHANGED') {
                const { ticketNo, newStatus, oldStatus } = eventData;
                console.log(`📡 Ticket status changed: ${ticketNo} ${oldStatus} → ${newStatus}`);
                
                // Try to update existing counter
                const found = updateCounterStatus(ticketNo, newStatus);
                
                // If ticket not found, it's a new ticket → fetch all counters
                if (!found) {
                  console.log(`📡 Ticket ${ticketNo} not found in current list, fetching all counters...`);
                  fetchCounters();
                }
              } 
              // For new tickets, fetch all counters to get complete data
              else if (eventData?.action === 'NEW_TICKET') {
                console.log(`📡 New ticket event: ${eventData.ticketNo}`);
                fetchCounters();
              }
            });

            if (sub) {
              subscriptions.push(sub);
            }
          });
        }
      } catch (error) {
        console.error('Error subscribing to display topics:', error);
      }
    });

    return () => {
      isMounted = false;
      // Unsubscribe khi unmount
      subscriptions.forEach((sub) => {
        if (sub && typeof sub.unsubscribe === 'function') {
          sub.unsubscribe();
        }
      });
    };
  }, [fetchCounters]);

  return (
    <section className="w-[70%] flex flex-col h-full bg-surface-container-low rounded-3xl p-8 ambient-shadow relative overflow-hidden">
      <div className="flex justify-between items-end mb-8 shrink-0">
        <h2 className="text-4xl font-headline font-bold text-primary">Danh sách Quầy</h2>
        <div className="flex gap-4 items-center">
          {loading && <span className="text-sm text-on-surface-variant">Đang tải...</span>}
          {error && <span className="text-sm text-error">{error}</span>}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 h-fit overflow-y-auto pr-2 pb-4">
        {counters.map((counter) => (
          <CounterCard key={counter.id} {...counter} />
        ))}
      </div>
    </section>
  );
}
