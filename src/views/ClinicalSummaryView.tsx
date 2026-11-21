import React, { useState } from 'react';
import { Patient } from '../types/clinical';
import { NURSING_LOGS } from '../data/mockClinicalData';

interface ClinicalSummaryViewProps {
  patient: Patient;
  onOpenKardex: () => void;
  onReportRam: () => void;
  onSelectTab: (tab: any) => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
}

export const ClinicalSummaryView: React.FC<ClinicalSummaryViewProps> = ({
  patient,
  onOpenKardex,
  onReportRam,
  onSelectTab,
  onShowToast,
}) => {
  const [countdownMinutes, setCountdownMinutes] = useState(18);
  const [isDoseAdministered, setIsDoseAdministered] = useState(false);
  const [scheduledDisplayTime, setScheduledDisplayTime] = useState('04:00 AM');
  const [nextProjectedTime, setNextProjectedTime] = useState('04:00 AM (+24h)');

  const handlePostpone = () => {
    setCountdownMinutes((prev) => prev + 15);
    onShowToast('Dosis Pospuesta', 'Omeprazol 40mg IV pospuesto 15 minutos.', 'schedule');
  };

  const handleAdministerImmediate = () => {
    setIsDoseAdministered(true);
    setScheduledDisplayTime('04:00 AM (Cumplida hoy)');
    setNextProjectedTime('04:00 AM (Mañana)');
    onShowToast(
      '✅ Dosis Suministrada & Horario Recalculado',
      'Omeprazol 40mg IV registrado por Enf. M. Rivas. Próxima dosis calculada inmediatamente para las 04:00 AM de mañana (c/24h).',
      'update'
    );
  };

  return (
    <div className="p-3 sm:p-space-md md:p-space-lg flex flex-col gap-3 sm:gap-space-md max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-space-md items-start">
        {/* Columna Izquierda: Dosis Próxima & Medicación Activa (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-space-md">
          {/* Hero: Próxima Dosis */}
          <div className="rounded-2xl bg-surface-container-lowest p-3.5 sm:p-space-md shadow-xs border border-outline-variant/20 flex flex-col gap-3 sm:gap-space-md">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {isDoseAdministered ? 'Dosis Suministrada • Próxima Proyectada' : 'Próxima Dosis Programada'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono-metric text-on-surface-variant bg-surface-container px-2 py-0.5 rounded font-medium">
                  {scheduledDisplayTime}
                </span>
                {isDoseAdministered && (
                  <span className="font-mono-metric text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded font-bold">
                    Próx: {nextProjectedTime}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5 sm:gap-space-md">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">medication</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-title-sm text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 truncate">
                      Omeprazol Sódico 40 mg
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Semáforo Verde</span>
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">
                    Vía IV • Cada 24h • Bolo lento en 100ml Solución Salina
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                {isDoseAdministered ? (
                  <div className="flex flex-col items-end">
                    <span className="text-secondary font-bold text-xs sm:text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Suministrada
                    </span>
                    <span className="text-[10px] text-primary font-mono-metric font-semibold mt-0.5">
                      Próx: 04:00 (+24h)
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xl sm:text-2xl font-extrabold text-primary font-mono-metric">
                      {countdownMinutes}
                    </span>
                    <span className="text-xs text-on-surface-variant ml-1">min</span>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-outline-variant/15 text-xs">
              {!isDoseAdministered && (
                <button
                  onClick={handlePostpone}
                  className="px-3 py-2 sm:py-1.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer border border-outline-variant/20 font-medium touch-manipulation min-h-[40px] text-center"
                  type="button"
                >
                  Posponer 15m
                </button>
              )}
              <button
                onClick={handleAdministerImmediate}
                className="flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 rounded-xl bg-primary text-on-primary font-semibold shadow-xs hover:bg-surface-tint active:scale-95 transition-all cursor-pointer touch-manipulation min-h-[40px]"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                <span>{isDoseAdministered ? 'Dosis Cumplida • Próxima Proyectada' : 'Suministrar & Calcular Próxima Dosis'}</span>
              </button>
            </div>
          </div>

          {/* Fármacos Activos del Turno */}
          <div className="rounded-2xl bg-surface-container-lowest p-3.5 sm:p-space-md shadow-xs border border-outline-variant/20 flex flex-col gap-2.5 sm:gap-space-sm">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/15">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Medicamentos Activos en Kárdex
              </span>
              <button
                onClick={() => onSelectTab('medicamentos')}
                className="text-xs text-primary font-semibold hover:underline cursor-pointer py-1"
              >
                Ver todos (4) &gt;
              </button>
            </div>

            <div className="flex flex-col divide-y divide-outline-variant/10 text-xs">
              {/* Item 1 - Verde */}
              <div
                onClick={() => onSelectTab('kardex')}
                className="py-2.5 flex items-center justify-between hover:bg-surface-container-low px-2 rounded-xl transition-colors cursor-pointer border-l-2 border-emerald-500 pl-2.5 my-0.5"
              >
                <div className="flex items-center gap-2.5 min-w-0 mr-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-xs shadow-emerald-500/40" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block">Omeprazol 40 mg IV</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        Verde
                      </span>
                    </div>
                    <span className="text-on-surface-variant text-[11px]">Cada 24h • Protector Gástrico</span>
                  </div>
                </div>
                <span className="font-mono-metric text-primary font-semibold shrink-0">04:00 AM</span>
              </div>

              {/* Item 2 - Amarillo (Ceftriaxona) */}
              <div
                onClick={() => onSelectTab('kardex')}
                className="py-2.5 flex items-center justify-between hover:bg-surface-container-low px-2 rounded-xl transition-colors cursor-pointer border-l-2 border-amber-500 pl-2.5 my-0.5"
              >
                <div className="flex items-center gap-2.5 min-w-0 mr-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-xs shadow-amber-500/40" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-amber-600 dark:text-amber-400 truncate block">Ceftriaxona Sódica 2g IV</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                        Amarillo
                      </span>
                    </div>
                    <span className="text-on-surface-variant text-[11px]">Cada 24h • Antibiótico Cefalosporina 3ª</span>
                  </div>
                </div>
                <span className="text-secondary font-semibold shrink-0 text-[11px] sm:text-xs">Pautado 18:00</span>
              </div>

              {/* Item 3 - Rojo (Tramadol) */}
              <div
                onClick={() => onSelectTab('kardex')}
                className="py-2.5 flex items-center justify-between hover:bg-surface-container-low px-2 rounded-xl transition-colors cursor-pointer border-l-2 border-red-500 pl-2.5 my-0.5"
              >
                <div className="flex items-center gap-2.5 min-w-0 mr-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 shadow-xs shadow-red-500/40" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-red-600 dark:text-red-400 truncate block">Tramadol Clorhidrato 50 mg IV</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20">
                        Rojo (Alto Riesgo)
                      </span>
                    </div>
                    <span className="text-on-surface-variant text-[11px]">Condicional SOS • Opioide</span>
                  </div>
                </div>
                <span className="text-error font-semibold shrink-0 text-[11px] sm:text-xs">Atrasada (+35m)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Seguridad y Últimas Observaciones (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-space-md">
          {/* Card: Seguridad Farmacológica */}
          <div className="rounded-2xl bg-surface-container-lowest p-3.5 sm:p-space-md shadow-xs border border-outline-variant/20 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/15 text-xs">
              <span className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
                Seguridad MAR
              </span>
              <span className="text-secondary font-semibold">Doble Check OK</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low text-xs flex flex-col gap-1 border border-outline-variant/15">
              <div className="flex items-center justify-between font-semibold text-error">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">block</span>
                  Interacción Bloqueada
                </span>
                <span className="text-[11px] text-on-surface-variant font-mono-metric">02:15h</span>
              </div>
              <p className="text-on-surface-variant text-[11px] leading-relaxed">
                Ketorolaco interceptado automáticamente por antecedente de anafilaxia a AINEs.
              </p>
            </div>
          </div>

          {/* Card: Línea de Turno Breve */}
          <div className="rounded-2xl bg-surface-container-lowest p-3.5 sm:p-space-md shadow-xs border border-outline-variant/20 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/15 text-xs">
              <span className="font-bold text-on-surface uppercase tracking-wider">
                Turno Nocturno (03:42)
              </span>
              <span className="text-on-surface-variant text-[11px]">Enf. María Rivas</span>
            </div>

            <div className="flex flex-col gap-2 pt-1 text-xs">
              {NURSING_LOGS.slice(0, 2).map((log) => (
                <div key={log.id} className="flex items-start gap-2.5">
                  <span className="font-mono-metric text-[11px] font-bold text-on-surface-variant shrink-0 mt-0.5">
                    {log.time}
                  </span>
                  <div className="min-w-0">
                    <span className="font-semibold text-on-surface block truncate">{log.title}</span>
                    <span className="text-on-surface-variant text-[11px] leading-tight block">
                      {log.details.split('•')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectTab('antecedentes-clinicos')}
              className="text-xs text-primary font-semibold hover:underline mt-2 text-left py-1 cursor-pointer"
            >
              Ver historial clínico completo &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
