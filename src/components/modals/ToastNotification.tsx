import React from 'react';

export interface ToastData {
  title: string;
  desc: string;
  icon?: string;
}

interface ToastNotificationProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toast,
  onDismiss,
}) => {
  if (!toast) return null;

  return (
    <div
      onClick={onDismiss}
      className="fixed bottom-6 right-8 z-50 transform translate-y-0 opacity-100 transition-all duration-300 flex items-center gap-space-md bg-inverse-surface text-inverse-on-surface px-space-lg py-space-md rounded-2xl shadow-2xl border border-outline-variant/30 backdrop-blur-xl cursor-pointer hover:scale-102 active:scale-98 animate-in slide-in-from-bottom-5"
    >
      <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm">
        <span className="material-symbols-outlined text-[22px]">
          {toast.icon || 'check_circle'}
        </span>
      </div>
      <div className="flex flex-col pr-2">
        <span className="font-title-sm text-title-sm font-bold text-inverse-on-surface">
          {toast.title}
        </span>
        <span className="font-body-sm text-body-sm opacity-90 leading-tight">
          {toast.desc}
        </span>
      </div>
    </div>
  );
};
