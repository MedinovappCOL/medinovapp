import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-md flex items-end sm:items-center justify-center p-2 sm:p-space-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-4 sm:p-space-lg max-w-sm w-full flex flex-col gap-space-sm border border-error/30 animate-in zoom-in-95 duration-200 text-xs">
        <div className="flex items-center gap-2.5 text-error">
          <div className="w-9 h-9 rounded-xl bg-error-container text-error flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-on-surface">{title}</h3>
            <span className="text-[11px] text-error font-medium">Acción de seguridad clínica</span>
          </div>
        </div>

        <p className="text-on-surface-variant text-xs py-1 leading-relaxed">{message}</p>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-outline-variant/15">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 sm:py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors cursor-pointer text-center touch-manipulation min-h-[40px]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2.5 sm:py-1.5 rounded-xl bg-error hover:bg-error/90 text-on-error font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation min-h-[40px]"
          >
            <span className="material-symbols-outlined text-[17px]">delete</span>
            <span>Confirmar Baja</span>
          </button>
        </div>
      </div>
    </div>
  );
};
