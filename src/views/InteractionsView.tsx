import React, { useState } from 'react';

interface InteractionsViewProps {
  onShowToast: (title: string, desc: string, icon?: string) => void;
  onViewProtocol: () => void;
}

export const InteractionsView: React.FC<InteractionsViewProps> = ({
  onShowToast,
  onViewProtocol,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'moderate'>('all');

  const interactions = [
    {
      id: 'int-1',
      drugA: 'Ketorolaco IV (AINE)',
      drugB: 'Carlos E. Méndez (Antecedente)',
      severity: 'critical',
      severityLabel: 'Bloqueo Absoluto - Nivel 4',
      description: 'Antecedente de shock anafiláctico y broncoespasmo severo documentado en acta RAM-2023-882. La administración está estrictamente interceptada por el sistema MAR.',
      recommendation: 'Alternativa: Paracetamol IV 1g o Tramadol con titulación lenta y monitorización continua.',
    },
    {
      id: 'int-2',
      drugA: 'Ceftriaxona Sódica',
      drugB: 'Soluciones con Calcio (Ringer Lactato)',
      severity: 'critical',
      severityLabel: 'Incompatibilidad Física Letal',
      description: 'Precipitación insoluble de ceftriaxona-calcio en la vía intravenosa y lecho microvascular pulmonar y renal. Prohibido compartir lumen venoso o matraz.',
      recommendation: 'Pase por vía periférica independiente con lavado de 100ml de SF 0.9% previo y posterior.',
    },
    {
      id: 'int-3',
      drugA: 'Tramadol Clorhidrato',
      drugB: 'Inhibidores de la Recaptación de Serotonina',
      severity: 'moderate',
      severityLabel: 'Moderada - Precaución Nivel 2',
      description: 'Riesgo potencial de síndrome serotoninérgico y disminución del umbral convulsivo.',
      recommendation: 'Evaluar EVA dolor, iniciar con 50mg en 100ml a pasar en 45 minutos.',
    },
  ];

  const filtered = interactions.filter((i) => {
    if (filterSeverity === 'critical') return i.severity === 'critical';
    if (filterSeverity === 'moderate') return i.severity === 'moderate';
    return true;
  });

  return (
    <div className="p-3 sm:p-space-md md:p-space-lg flex flex-col gap-3 sm:gap-space-md max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-space-sm pb-1 border-b border-outline-variant/15">
        <div>
          <h1 className="font-headline-lg text-xl sm:text-2xl text-on-surface font-bold tracking-tight">
            Interacciones &amp; Alertas Farmacológicas
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Motor de Farmacovigilancia y Auditoría Cruzada MAR de Urgencias
          </p>
        </div>
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/20 text-xs overflow-x-auto">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer touch-manipulation ${
              filterSeverity === 'all'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Todas ({interactions.length})
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer touch-manipulation ${
              filterSeverity === 'critical'
                ? 'bg-error text-on-error font-bold shadow-xs'
                : 'text-error hover:bg-error-container/40'
            }`}
          >
            Críticas (2)
          </button>
          <button
            onClick={() => setFilterSeverity('moderate')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer touch-manipulation ${
              filterSeverity === 'moderate'
                ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Moderadas (1)
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-space-md">
        {filtered.map((item) => {
          const isCrit = item.severity === 'critical';
          return (
            <div
              key={item.id}
              className={`p-3.5 sm:p-space-lg rounded-2xl backdrop-blur-xl border flex flex-col gap-2.5 sm:gap-space-sm ${
                isCrit
                  ? 'bg-error-container/20 border-error/30'
                  : 'bg-surface-container-lowest/90 border-outline-variant/20'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[22px] shrink-0 ${
                      isCrit ? 'text-error' : 'text-amber-600'
                    }`}
                  >
                    {isCrit ? 'block' : 'warning'}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm text-on-surface">
                      {item.drugA}
                    </span>
                    <span className="text-on-surface-variant">↔</span>
                    <span className="font-bold text-sm text-on-surface">
                      {item.drugB}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isCrit ? 'bg-error text-on-error' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {item.severityLabel}
                </span>
              </div>

              <p className="text-xs text-on-surface leading-relaxed">
                {item.description}
              </p>

              <div className="p-3 rounded-xl bg-surface-container-low/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border border-outline-variant/15">
                <span className="text-secondary font-semibold">
                  Sugerencia Clínica: {item.recommendation}
                </span>
                {isCrit && (
                  <button
                    onClick={onViewProtocol}
                    className="text-error font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0 py-1"
                  >
                    <span>Ver Protocolo Anafilaxia</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
