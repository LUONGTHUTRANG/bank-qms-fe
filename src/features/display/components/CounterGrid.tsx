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
      let status: 'serving' | 'calling' | 'ready' | 'offline' | 'completed' | 'cancelled' | 'skipped' = 'offline';

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
          } else if (counter.currentTicketStatus === 'SKIPPED_HOLD' || counter.currentTicketStatus === 'SKIPPED') {
            status = 'skipped';
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
      return mappedCounters;
    } catch (err) {
      console.error('Error fetching counters:', err);
      setError('Không thể tải danh sách quầy');
      return [];
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  const playTicketCall = (ticketNo: string, counterCode: string) => {
    if (!('speechSynthesis' in window)) return;
    
    const numberText = ticketNo.split('').join(' ');
    const counterText = counterCode.replace(/^0+/, ''); 
    
    const text = `Xin mời khách hàng có số vé ${numberText}, đến quầy ${counterText}`;
    console.log(`🔊 Speaking: ${text}`);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(voice => voice.lang === 'vi-VN' || voice.lang === 'vi_VN' || voice.lang.toLowerCase().includes('vi'));
    if (viVoice) {
      utterance.voice = viVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Update single counter status directly
  const handleTicketStatusChange = (ticketNo: string, newTicketStatus: string) => {
    setCounters((prevCounters) => {
      let found = false;
      let counterToSpeak = '';
      
      const newCounters = prevCounters.map((counter) => {
        if (counter.currentTicket === ticketNo) {
          found = true;
          counterToSpeak = counter.number;
          let status: 'serving' | 'calling' | 'ready' | 'offline' | 'completed' | 'cancelled' | 'skipped' = counter.status;
          
          if (newTicketStatus === 'CALLED') {
            status = 'calling';
          } else if (newTicketStatus === 'DONE') {
            status = 'completed';
          } else if (newTicketStatus === 'CANCELLED') {
            status = 'cancelled';
          } else if (newTicketStatus === 'SKIPPED_HOLD' || newTicketStatus === 'SKIPPED') {
            status = 'skipped';
          } else if (newTicketStatus === 'SERVING') {
            status = 'serving';
          }
          
          return { ...counter, status };
        }
        return counter;
      });

      if (!found) {
        // If not found in current state, we fetch counters
        console.log(`📡 Ticket ${ticketNo} not found in current list, fetching all counters...`);
        fetchCounters().then(fetchedCounters => {
           if (newTicketStatus === 'CALLED') {
              const c = fetchedCounters.find(item => item.currentTicket === ticketNo);
              if (c) {
                 playTicketCall(ticketNo, c.number);
              }
           }
        });
      } else {
        if (newTicketStatus === 'CALLED' && counterToSpeak) {
           playTicketCall(ticketNo, counterToSpeak);
        }
      }

      return found ? newCounters : prevCounters;
    });
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
                
                handleTicketStatusChange(ticketNo, newStatus);
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
