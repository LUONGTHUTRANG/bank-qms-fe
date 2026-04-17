import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, type ToastMessage } from '@/stores/useToastStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const bgColors = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-rose-50 border-rose-200 text-rose-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const titleColors = {
  success: 'text-emerald-900',
  error: 'text-rose-900',
  warning: 'text-amber-950',
  info: 'text-blue-900',
};

const ToastItem = ({ toast }: { toast: ToastMessage }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        'flex items-start p-4 mb-3 border rounded-xl shadow-lg w-80 sm:w-96 pointer-events-auto backdrop-blur-sm bg-opacity-95',
        bgColors[toast.type]
      )}
    >
      <div className="flex-shrink-0 mr-3 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 mr-2">
        {toast.title && (
          <h4 className={cn("text-sm font-semibold mb-1", titleColors[toast.type])}>
            {toast.title}
          </h4>
        )}
        <p className="text-sm opacity-90 leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const GlobalToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
};
