import React from 'react';
import { useBrightloop } from '../context/BrightloopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBrightloop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-800 transition-all transform translate-y-0"
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />}
            {isWarning && <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />}
            {isError && <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />}
            {!isSuccess && !isWarning && !isError && <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />}

            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white tracking-tight">{toast.title}</div>
              <div className="text-xs text-slate-300 mt-0.5 leading-snug">{toast.message}</div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
