import React, { useState } from 'react';

interface RamReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: { drug: string; severity: string; symptoms: string }) => void;
  patientName: string;
}

export const RamReportModal: React.FC<RamReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patientName,
}) => {
  const [drug, setDrug] = useState('');
  const [severity, setSeverity] = useState('Nivel 3 - Severa');
  const [symptoms, setSymptoms] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ drug: drug || 'Ketorolaco', severity, symptoms: symptoms || 'Reacción alérgica aguda' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-md flex items-end sm:items-center justify-center p-2 sm:p-space-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-4 sm:p-space-xl max-w-lg w-full flex flex-col gap-3 sm:gap-space-md border border-error/30 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-error text-on-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">report_problem</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                Notificación de RAM Inmediata
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Farmacovigilancia Clínica Urgencias • {patientName}
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
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">
              Fármaco Sospechoso / Administrado
            </label>
            <input
              type="text"
              required
              value={drug}
              onChange={(e) => setDrug(e.target.value)}
              placeholder="Ej. Ketorolaco 30mg IV, Ampicilina, Dipirona..."
              className="bg-surface-container-low px-space-md py-2.5 rounded-xl border border-outline-variant/30 text-on-surface outline-none focus:bg-surface-container-lowest"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">
              Nivel de Severidad RAM (Algoritmo Naranjo / OMS)
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="bg-surface-container-low px-space-md py-2.5 rounded-xl border border-outline-variant/30 text-on-surface outline-none focus:bg-surface-container-lowest"
            >
              <option value="Nivel 4 - Crítica / Riesgo Vital (Anafilaxia / Paro)">
                Nivel 4 - Crítica / Riesgo Vital (Anafilaxia / Paro)
              </option>
              <option value="Nivel 3 - Severa (Broncoespasmo, Hipotensión, Edema)">
                Nivel 3 - Severa (Broncoespasmo, Hipotensión, Edema)
              </option>
              <option value="Nivel 2 - Moderada (Urticaria generalizada, Angioedema leve)">
                Nivel 2 - Moderada (Urticaria generalizada, Angioedema leve)
              </option>
              <option value="Nivel 1 - Leve (Prurito localizado, Rash transitorio)">
                Nivel 1 - Leve (Prurito localizado, Rash transitorio)
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">
              Descripción Clínica de la Reacción & Manifestaciones
            </label>
            <textarea
              rows={3}
              required
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describa tiempo de inicio, compromiso respiratorio, hemodinámico o cutáneo, y medidas tomadas..."
              className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/30 text-on-surface outline-none focus:bg-surface-container-lowest resize-none text-body-sm"
            />
          </div>

          <div className="p-space-sm rounded-xl bg-error-container/40 text-on-error-container text-label-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-[18px]">verified_user</span>
            <span>
              La alerta bloqueará automáticamente prescripciones cruzadas en MAR y notificará a Farmacia Central.
            </span>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 sm:py-2 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors text-center touch-manipulation min-h-[40px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 sm:py-2 rounded-xl bg-error text-on-error font-semibold text-xs shadow-md hover:bg-error/90 active:scale-95 transition-all flex items-center justify-center gap-1.5 touch-manipulation min-h-[40px]"
            >
              <span className="material-symbols-outlined text-[17px]">send</span>
              <span>Emitir Alerta y Bloqueo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
