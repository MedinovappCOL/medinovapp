import React, { useState } from 'react';

interface JustifyDelayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (justification: string, pin: string) => void;
  drugName: string;
  delayText: string;
}

export const JustifyDelayModal: React.FC<JustifyDelayModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  drugName,
  delayText,
}) => {
  const [justification, setJustification] = useState('Paciente en procedimiento diagnóstico / TAC Tórax');
  const [pin, setPin] = useState('4829');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(justification, pin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-md flex items-end sm:items-center justify-center p-2 sm:p-space-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-4 sm:p-space-xl max-w-lg w-full flex flex-col gap-3 sm:gap-space-md border border-error/30 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-error text-on-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">assignment_late</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                Justificación de Demora Clínica
              </h3>
              <p className="font-label-sm text-label-sm text-error font-semibold">
                {drugName} • Retraso {delayText}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          <div className="p-space-sm rounded-xl bg-error-container/20 text-on-surface text-body-sm">
            El sistema MAR requiere registrar el motivo del desfase horario de acuerdo a la norma de los 5 Correctos de la OMS.
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">
              Causa Clínica del Retraso
            </label>
            <select
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="bg-surface-container-low px-space-md py-2.5 rounded-xl border border-outline-variant/30 text-on-surface outline-none focus:bg-surface-container-lowest text-body-sm"
            >
              <option value="Paciente en procedimiento diagnóstico / TAC Tórax">
                Paciente en procedimiento diagnóstico / Radiología o TAC
              </option>
              <option value="Priorización de reanimación o episodio agudo de otro paciente">
                Priorización de reanimación o urgencia vital concurrente
              </option>
              <option value="Re-evaluación médica del dolor o constantes hemodinámicas">
                Re-evaluación médica del dolor o constantes hemodinámicas
              </option>
              <option value="Retraso en dispensación por Farmacia Central / Preparación de dilución">
                Retraso en dispensación por Farmacia Central / Preparación
              </option>
              <option value="Acceso venoso periférico extravasado / Recanalización requerida">
                Acceso venoso extravasado / Nueva vía venosa canalizada
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">
              Firma Digital / PIN Enfermera Responsable
            </label>
            <div className="flex items-center gap-space-sm">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="bg-surface-container-low px-space-md py-2 rounded-xl border border-outline-variant/30 text-center font-mono-metric text-on-surface text-lg tracking-widest outline-none focus:bg-surface-container-lowest w-32"
              />
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Enf. Jefa María Rivas (Turno Noche)
              </span>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 sm:py-2 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors text-center touch-manipulation min-h-[40px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 sm:py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs shadow-md hover:bg-surface-tint active:scale-95 transition-all flex items-center justify-center gap-1.5 touch-manipulation min-h-[40px]"
            >
              <span className="material-symbols-outlined text-[17px]">done_all</span>
              <span>Validar y Administrar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
