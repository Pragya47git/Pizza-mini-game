import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const toast = useGameStore((s) => s.toast);
  const clearToast = useGameStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />,
    warning: <AlertTriangle size={16} className="text-amber-600 shrink-0" />,
    error: <AlertCircle size={16} className="text-rose-600 shrink-0" />,
    info: <Info size={16} className="text-blue-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    warning: 'border-amber-200 bg-amber-50 text-amber-950',
    error: 'border-rose-200 bg-rose-50 text-rose-950',
    info: 'border-blue-200 bg-blue-50 text-blue-950',
  };

  return (
    <div className="fixed top-16 right-4 z-50 max-w-sm animate-fade-in pointer-events-auto">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-lg text-xs font-semibold ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <span className="flex-1 leading-snug">{toast.text}</span>
        <button
          onClick={clearToast}
          type="button"
          className="text-stone-400 hover:text-stone-700 transition-colors p-0.5"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
