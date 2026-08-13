import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
      <div className={`p-4 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-xl ${
        isSuccess
          ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300'
          : isError
          ? 'bg-slate-900/90 border-rose-500/40 text-rose-300'
          : 'bg-slate-900/90 border-indigo-500/40 text-indigo-300'
      }`}>
        <div className="shrink-0 mt-0.5">
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isError ? (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          ) : (
            <Info className="w-5 h-5 text-indigo-400" />
          )}
        </div>

        <div className="flex-1 text-xs">
          <div className="font-bold text-white mb-0.5">
            {isSuccess ? 'Success' : isError ? 'Notification' : 'Notice'}
          </div>
          <div className="leading-relaxed">{toast.message}</div>
        </div>

        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
