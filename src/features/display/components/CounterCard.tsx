import { motion } from 'framer-motion';

export interface ICounterCard {
  id: string;
  number: string;
  status: 'serving' | 'calling' | 'ready' | 'offline' | 'completed' | 'cancelled';
  currentTicket: string;
}

export default function CounterCard({ id, number, status, currentTicket }: ICounterCard) {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { badge: string; bgColor: string; textColor: string; borderColor: string; ticketBg: string; opacity: string; pulse?: boolean }> = {
      serving: {
        badge: 'Đang phục vụ',
        bgColor: 'bg-primary-fixed',
        textColor: 'text-on-primary-fixed',
        borderColor: 'border-outline-variant border-opacity-15',
        ticketBg: 'bg-surface-container-low',
        opacity: '',
      },
      calling: {
        badge: 'Đang gọi',
        bgColor: 'bg-amber-400',
        textColor: 'text-amber-950',
        borderColor: 'border-2 border-amber-400',
        ticketBg: 'bg-amber-50',
        opacity: '',
        pulse: true,
      },
      ready: {
        badge: 'Sẵn sàng',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-outline-variant border-opacity-15',
        ticketBg: 'bg-surface-container-low',
        opacity: 'opacity-90',
      },
      completed: {
        badge: 'Đã hoàn thành',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-outline-variant border-opacity-15',
        ticketBg: 'bg-surface-container-low',
        opacity: '',
      },
      cancelled: {
        badge: 'Đã hủy',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-outline-variant border-opacity-15',
        ticketBg: 'bg-surface-container-low',
        opacity: '',
      },
      offline: {
        badge: 'Tạm nghỉ',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        borderColor: 'border-outline-variant border-opacity-15',
        ticketBg: 'bg-surface-container-low',
        opacity: 'opacity-60',
      },
    };
    return configs[status as keyof typeof configs] || configs.serving;
  };

  const config = getStatusConfig(status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-surface-container-lowest rounded-3xl max-h-[210px] bg-white p-6 ambient-shadow flex flex-col justify-between ${config.borderColor} ${config.opacity}`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-label-md text-outline font-semibold uppercase tracking-wider">
          Quầy {number}
        </span>
        <div
          className={`${config.bgColor} px-3 py-1 rounded-full text-xs font-semibold ${config.textColor} ${config.pulse ? 'animate-pulse' : ''}`}
        >
          {config.badge}
        </div>
      </div>
      {status === 'offline' || status === 'ready' ? (
        <div className={`text-center py-6 ${config.ticketBg} rounded-full flex items-center justify-center h-[120px]`}>
          {status === 'offline' ? (
            <span
              className="material-symbols-outlined !text-4xl text-outline-variant opacity-50"
              style={{ fontVariationSettings: '"FILL" 0' }}
            >
              do_not_disturb_on
            </span>
          ) : (
            <span
              className="material-symbols-outlined !text-4xl text-outline-variant opacity-50"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              person_add
            </span>
          )}
        </div>
      ) : (
        <div className={`text-center py-6 ${config.ticketBg} rounded-full`}>
          <div className="text-[4rem] font-black text-primary leading-none tracking-tighter">
            {currentTicket}
          </div>
        </div>
      )}
    </motion.div>
  );
}
