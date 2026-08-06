import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';
import { cn } from '../../lib/utils';

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-20 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="pointer-events-auto flex items-center gap-3 rounded-xl border border-borderc bg-surface px-4 py-3 shadow-xl"
          >
            {t.variant === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />}
            {t.variant === 'error' && <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />}
            {t.variant === 'info' && <Info className="h-5 w-5 shrink-0 text-text-secondary" />}
            <p className="flex-1 text-sm text-text-primary">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="text-xs font-medium text-text-secondary hover:text-text-primary"
              aria-label="Dismiss notification"
            >
              Dismiss
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
