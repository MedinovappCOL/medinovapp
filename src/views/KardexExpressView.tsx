import React, { useState } from 'react';
import {
  Patient,
  MedicationOrder,
  MedicationRiskColor,
  RISK_SEMAPHORE_CONFIGS,
  getMedicationRiskColor,
  calculateNextDoseTime,
  extractIntervalHours,
} from '../types/clinical';

interface KardexExpressViewProps {
  patient: Patient;
  medications: MedicationOrder[];
  onAdministerDrug: (medId: string) => void;
  onOpenNewMedModal: () => void;
  onEditMed: (med: MedicationOrder) => void;
  onDeleteMed: (med: MedicationOrder) => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
  onOpenJustifyModal: (drugName: string, delay: string) => void;
  onOpenDrugDetail: (drugId: string) => void;
}

export const KardexExpressView: React.FC<KardexExpressViewProps> = ({
  patient,
  medications,
  onAdministerDrug,
  onOpenNewMedModal,
  onEditMed,
  onDeleteMed,
  onShowToast,
  onOpenJustifyModal,
  onOpenDrugDetail,
}) => {
  const [kardexFilter, setKardexFilter] = useState<'all' | 'urgent' | 'completed'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | MedicationRiskColor>('all');
  const [isDualSigned, setIsDualSigned] = useState(false);

  const activeMeds = medications.filter((m) => m.status !== 'recalled');

  const countRed = activeMeds.filter((m) => getMedicationRiskColor(m) === 'red').length;
  const countYellow = activeMeds.filter((m) => getMedicationRiskColor(m) === 'yellow').length;
  const countGreen = activeMeds.filter((m) => getMedicationRiskColor(m) === 'green').length;

  const filteredMeds = activeMeds.filter((m) => {
    if (kardexFilter === 'urgent') {
      const isUrgent = m.status === 'overdue' || (m.countdownMinutes && m.countdownMinutes < 30);
      if (!isUrgent) return false;
    }
    if (kardexFilter === 'completed') {
      if (m.status !== 'administered') return false;
    }
    if (riskFilter !== 'all') {
      if (getMedicationRiskColor(m) !== riskFilter) return false;
    }
    return true;
  });

  return (
    <div className="p-3 sm:p-space-md md:p-space-lg flex flex-col gap-3 sm:gap-4 max-w-5xl mx-auto w-full">
      {/* Cabecera Limpia del Kárdex */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-outline-variant/15">
        <div>
          <h2 className="font-title-sm text-base sm:text-lg font-bold text-on-surface">
            Kárdex de Medicación
          </h2>
          <p className="text-xs text-on-surface-variant">
            {patient.name} • {patient.box} ({patient.bed})
          </p>
        </div>

        <button
          onClick={onOpenNewMedModal}
          className="flex items-center justify-center gap-1.5 bg-primary text-on-primary text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs hover:bg-surface-tint active:scale-95 transition-all cursor-pointer touch-manipulation min-h-[38px] self-start sm:self-auto"
          type="button"
        >
          <span className="material-symbols-outlined text-[17px]">add_circle</span>
          <span>+ Prescribir Fármaco</span>
        </button>
      </div>

      {/* Barra Unificada y Compacta de Filtros (Semáforo + Estado) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-surface-container-low p-2 rounded-xl border border-outline-variant/15 text-xs">
        {/* Filtro Semáforo Compacto */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-on-surface-variant mr-1 shrink-0">Semáforo:</span>
          
          <button
            onClick={() => setRiskFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer shrink-0 ${
              riskFilter === 'all'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Todos ({activeMeds.length})
          </button>

          <button
            onClick={() => setRiskFilter(riskFilter === 'red' ? 'all' : 'red')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              riskFilter === 'red'
                ? 'bg-red-500 text-white shadow-xs'
                : 'text-red-600 dark:text-red-400 hover:bg-red-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 ring-1 ring-white/50 shrink-0" />
            <span>Rojo ({countRed})</span>
          </button>

          <button
            onClick={() => setRiskFilter(riskFilter === 'yellow' ? 'all' : 'yellow')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              riskFilter === 'yellow'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white/50 shrink-0" />
            <span>Amarillo ({countYellow})</span>
          </button>

          <button
            onClick={() => setRiskFilter(riskFilter === 'green' ? 'all' : 'green')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              riskFilter === 'green'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white/50 shrink-0" />
            <span>Verde ({countGreen})</span>
          </button>
        </div>

        {/* Filtro Estado Rápido */}
        <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto border-t sm:border-t-0 border-outline-variant/10 pt-1 sm:pt-0">
          <button
            onClick={() => setKardexFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              kardexFilter === 'all'
                ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setKardexFilter('urgent')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              kardexFilter === 'urgent'
                ? 'bg-surface-container-lowest text-error font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Urgentes
          </button>
          <button
            onClick={() => setKardexFilter('completed')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              kardexFilter === 'completed'
                ? 'bg-surface-container-lowest text-secondary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Completados
          </button>
        </div>
      </div>

      {/* Lista Despejada de Medicamentos */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-xs divide-y divide-outline-variant/15 overflow-hidden">
        {filteredMeds.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-3xl mb-1 opacity-50">medication</span>
            <p>No hay medicamentos con los filtros seleccionados.</p>
            {(riskFilter !== 'all' || kardexFilter !== 'all') && (
              <button
                onClick={() => {
                  setRiskFilter('all');
                  setKardexFilter('all');
                }}
                className="mt-2 text-primary font-semibold hover:underline cursor-pointer"
              >
                Restablecer filtros
              </button>
            )}
          </div>
        ) : (
          filteredMeds.map((med) => {
            const isAdministered = med.status === 'administered';
            const isOverdue = med.status === 'overdue';
            const riskColor = getMedicationRiskColor(med);
            const riskConfig = RISK_SEMAPHORE_CONFIGS[riskColor];
            const interval = med.intervalHours ?? extractIntervalHours(med.frequency);
            const nextDose = med.nextScheduledTime || (interval > 0 ? calculateNextDoseTime(med.scheduledTime, interval) : 'Dosis Única');

            return (
              <div
                key={med.id}
                className={`p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-low/30 transition-colors border-l-4 ${
                  riskColor === 'red'
                    ? 'border-l-red-500'
                    : riskColor === 'yellow'
                    ? 'border-l-amber-500'
                    : 'border-l-emerald-500'
                } ${isOverdue ? 'bg-error-container/10' : ''}`}
              >
                {/* Info Principal del Medicamento */}
                <div
                  onClick={() => onOpenDrugDetail(med.id)}
                  className="flex flex-col min-w-0 flex-1 cursor-pointer group"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* LETRAS DEL MEDICAMENTO EN EL COLOR DEL SEMÁFORO */}
                    <span
                      className={`text-sm sm:text-base tracking-tight truncate ${riskConfig.textClass}`}
                    >
                      {med.name} {med.dose}
                    </span>

                    <span className="text-[11px] bg-surface-container px-2 py-0.2 rounded font-medium text-on-surface-variant">
                      {med.route}
                    </span>

                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider bg-surface-container text-on-surface-variant">
                      {riskConfig.shortLabel}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                    {med.frequency} • {med.dilution}
                  </p>

                  {/* Horario y Siguiente Dosis Limpio */}
                  <div className="flex items-center gap-2.5 text-xs mt-1 text-on-surface flex-wrap">
                    <span className="font-mono-metric font-semibold">
                      Dosis: <strong className="text-on-surface">{med.scheduledTime}</strong>
                    </span>

                    {interval > 0 && (
                      <span className="font-mono-metric text-primary font-medium flex items-center gap-0.5">
                        <span className="text-on-surface-variant">→</span>
                        <span>Próx: <strong>{nextDose}</strong></span>
                      </span>
                    )}

                    {med.lastAdministeredAt && (
                      <span className="text-secondary font-medium text-[11px]">
                        • Suministrada: {med.lastAdministeredAt}
                        {med.dosesAdministeredCount ? ` (#${med.dosesAdministeredCount})` : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Horario, Cuenta Regresiva & Acciones Rápidas */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/10 text-xs">
                  <div className="text-left sm:text-right">
                    <span
                      className={`font-mono-metric font-bold text-sm block ${
                        isOverdue ? 'text-error' : 'text-on-surface'
                      }`}
                    >
                      {med.scheduledTime}
                    </span>
                    <span
                      className={`text-[11px] font-medium block ${
                        isOverdue
                          ? 'text-error font-bold'
                          : med.lastAdministeredAt
                          ? 'text-secondary font-semibold'
                          : 'text-primary'
                      }`}
                    >
                      {isOverdue
                        ? 'Atrasada +35m'
                        : med.lastAdministeredAt
                        ? `Dosis cumplida`
                        : `En ${med.countdownMinutes || 15} min`}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1.5">
                    {med.status === 'recalled' ? (
                      <span className="text-xs bg-error/15 text-error px-2.5 py-1 rounded-lg font-bold">
                        Retirado
                      </span>
                    ) : (med.intervalHours === 0 && isAdministered) ? (
                      <span className="text-xs bg-secondary/10 text-secondary px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        Cumplida
                      </span>
                    ) : isOverdue ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onAdministerDrug(med.id)}
                          className="bg-primary text-on-primary hover:bg-surface-tint active:scale-95 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
                          type="button"
                          title="Suministrar y recalcular próxima dosis"
                        >
                          Suministrar
                        </button>
                        <button
                          onClick={() => onOpenJustifyModal(med.name, '+35 min')}
                          className="bg-error text-on-error hover:bg-error/90 active:scale-95 px-2 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
                          type="button"
                        >
                          Justificar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAdministerDrug(med.id)}
                        className="bg-primary text-on-primary hover:bg-surface-tint active:scale-95 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                        type="button"
                        title="Suministrar dosis y proyectar horario"
                      >
                        <span className="material-symbols-outlined text-[15px]">check</span>
                        <span>Suministrar</span>
                      </button>
                    )}

                    {/* Editar */}
                    <button
                      onClick={() => onEditMed(med)}
                      className="w-7 h-7 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center cursor-pointer transition-colors"
                      title="Editar orden"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>

                    {/* Suspender */}
                    <button
                      onClick={() => onDeleteMed(med)}
                      className="w-7 h-7 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 flex items-center justify-center cursor-pointer transition-colors"
                      title="Suspender orden"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pie de Auditoría Compacto y Discreto */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-container-low text-xs border border-outline-variant/15 text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
          <span>Doble Chequeo en Cabecera: Protocolo de 5 Correctos Activo</span>
        </div>

        <button
          onClick={() => {
            setIsDualSigned(!isDualSigned);
            onShowToast('Doble Chequeo', isDualSigned ? 'Firma removida.' : 'Co-firma registrada conforme a protocolo.', 'verified_user');
          }}
          className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all cursor-pointer self-start sm:self-auto ${
            isDualSigned
              ? 'bg-secondary/15 text-secondary'
              : 'bg-surface-container-lowest text-primary border border-outline-variant/20 hover:border-primary'
          }`}
          type="button"
        >
          {isDualSigned ? 'Co-Firmado ✓' : 'Co-Firmar Turno'}
        </button>
      </div>
    </div>
  );
};
