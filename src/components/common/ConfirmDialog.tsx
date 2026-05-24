import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  isLoading?: boolean;
}

const variantStyles = {
  danger: {
    icon: <AlertCircle className="w-6 h-6 text-red-600" />,
    iconBg: 'bg-red-100',
    button: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  },
  warning: {
    icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
    iconBg: 'bg-amber-100',
    button: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
  },
  info: {
    icon: <Info className="w-6 h-6 text-blue-900" />,
    iconBg: 'bg-blue-100',
    button: 'bg-blue-900 hover:bg-blue-800 text-white focus:ring-blue-500',
  },
  success: {
    icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
    iconBg: 'bg-emerald-100',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'warning',
  isLoading = false,
}) => {
  const styles = variantStyles[variant];

  // Prevent scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={!isLoading ? onClose : undefined}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl pointer-events-auto overflow-hidden flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={!isLoading ? onClose : undefined}
                disabled={isLoading}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-6">
                <div className="sm:flex sm:items-start gap-4">
                  {/* Icon */}
                  <div className={cn('mx-auto sm:mx-0 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full sm:w-10 sm:h-10 relative mt-0.5', styles.iconBg)}>
                    {styles.icon}
                  </div>

                  {/* Title & Message */}
                  <div className="mt-4 sm:mt-0 text-center sm:text-left flex-1">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-2">
                      {title}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {message}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex justify-center px-4 py-2.5 sm:py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={cn(
                    'w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 sm:py-2 text-sm font-semibold border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]',
                    styles.button,
                    isLoading && 'opacity-80'
                  )}
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
