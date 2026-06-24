import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, Sparkles, Bell } from "lucide-react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "promo";
}

interface NotificationToastProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export default function NotificationToast({ toasts, removeToast }: NotificationToastProps) {
  return (
    <div id="toast-container" className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            id={`toast-${toast.id}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
            className="pointer-events-auto bg-[#0A0A0B] border border-white/10 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 backdrop-blur-md"
          >
            <div className="mt-0.5">
              {toast.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-400" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === "info" && <Bell className="w-5 h-5 text-[#d4af37]" />}
              {toast.type === "promo" && <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />}
            </div>
            <div className="flex-1 text-sm font-sans pr-2 font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors text-xs font-mono select-none"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
