import { motion } from 'framer-motion';
import type { Service } from '@/services/kioskService';

interface ServiceCardProps {
  icon: string;
  title: string;
  desc?: string;
  services?: Service[];
  onClick: () => void;
  delay?: number;
}

export default function ServiceCard({ icon, title, desc, services, onClick, delay = 0 }: ServiceCardProps) {
  return (
    <motion.button 
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
      onClick={onClick}
      className="group relative flex flex-col items-start p-4 md:p-6 bg-white rounded-[1.25rem] text-left transition-all duration-300 hover:-translate-y-1 active:-translate-y-0 active:scale-95 border-2 border-transparent hover:border-primary/20 active:border-primary/50 cursor-pointer w-full h-full min-h-[360px] overflow-hidden shadow-sm hover:shadow-[0_15px_30px_rgb(0,0,0,0.08)] active:shadow-inner touch-manipulation select-none"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className="relative w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-primary group-active:bg-primary transition-all duration-300 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-primary/10 group-hover:shadow-md">
        <span className="material-symbols-outlined text-2xl md:text-3xl text-primary group-hover:text-white group-active:text-white transition-colors duration-300" style={{ fontVariationSettings: "'FILL' 1"}}>
          {icon}
        </span>
      </div>
      
      <h3 className="relative text-lg md:text-2xl font-bold text-slate-800 leading-tight mb-3 md:mb-5 group-hover:text-primary group-active:text-primary transition-colors duration-300">
        {title}
      </h3>

      {/* Services List */}
      {services && services.length > 0 ? (
        <div className="relative w-full mb-4 flex-1">
          <ul className="space-y-1.5">
            {services.map((service) => (
              <li key={service.id} className="flex items-start gap-2 text-slate-600 text-md">
                <span className="material-symbols-outlined text-sm shrink-0 text-primary/60 group-hover:text-primary transition-colors duration-300 mt-0.5">check</span>
                <span className="leading-snug line-clamp-2">{service.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="relative text-slate-500 text-sm md:text-base font-medium leading-snug max-w-[85%] text-left mb-4">
          {desc}
        </p>
      )}

      {/* Decorative action indicator - always visible on kiosk */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary group-hover:translate-x-1 group-active:translate-x-1 group-active:bg-primary group-active:border-primary transition-all duration-300 text-slate-400 group-active:text-white">
        <span className="material-symbols-outlined text-xl">arrow_forward</span>
      </div>
    </motion.button>
  );
}
