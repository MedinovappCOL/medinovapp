import React from 'react';
import { Patient } from '../types/clinical';

interface BoxesViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
}

export const BoxesView: React.FC<BoxesViewProps> = ({
  patients,
  onSelectPatient,
}) => {
  // Generate 12 boxes status
  const boxes = Array.from({ length: 12 }, (_, i) => {
    const boxNum = i + 1;
    const boxStr = `Box ${boxNum < 10 ? '0' + boxNum : boxNum}`;
    const assignedPatient = patients.find((p) => p.box.includes(boxStr));
    const isOccupied = !!assignedPatient;

    return {
      boxNum,
      boxStr,
      isOccupied,
      patient: assignedPatient,
      status: !isOccupied
        ? 'Disponible'
        : assignedPatient.triageLevel === 'Triage I'
        ? 'Crítico'
        : 'Estable',
    };
  });

  return (
    <div className="p-3 sm:p-space-md md:p-space-lg flex flex-col gap-3 sm:gap-space-md max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-space-sm pb-1 border-b border-outline-variant/15">
        <div>
          <h1 className="font-headline-lg text-xl sm:text-2xl text-on-surface font-bold tracking-tight">
            Boxes de Urgencias 01 - 12
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Mapa de camas, ocupación en tiempo real y asignación de cuidados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-secondary-container text-on-secondary-container text-xs px-3 py-1 rounded-full font-semibold">
            {boxes.filter(b => b.isOccupied).length} Ocupados
          </span>
          <span className="bg-surface-container text-on-surface-variant text-xs px-3 py-1 rounded-full font-medium">
            {boxes.filter(b => !b.isOccupied).length} Disponibles
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-space-md">
        {boxes.map((box) => {
          const p = box.patient;
          const isCritical = box.status === 'Crítico';

          return (
            <div
              key={box.boxNum}
              onClick={() => p && onSelectPatient(p.id)}
              className={`p-3.5 sm:p-space-md rounded-2xl backdrop-blur-xl border transition-all flex flex-col justify-between min-h-[170px] ${
                !box.isOccupied
                  ? 'bg-surface-container-low/50 border-outline-variant/20 border-dashed'
                  : isCritical
                  ? 'bg-error-container/20 border-error/40 hover:shadow-md cursor-pointer'
                  : 'bg-surface-container-lowest/90 border-outline-variant/30 hover:shadow-md cursor-pointer hover:border-primary/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-on-surface">{box.boxStr}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      !box.isOccupied
                        ? 'bg-surface-container text-on-surface-variant'
                        : isCritical
                        ? 'bg-error text-on-error'
                        : 'bg-secondary text-on-secondary'
                    }`}
                  >
                    {box.status}
                  </span>
                </div>

                {p ? (
                  <div className="mt-3 flex items-center gap-2.5">
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-on-surface truncate block">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-on-surface-variant font-mono-metric">
                        CC {p.nationalId}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 text-center py-4 text-on-surface-variant/60 text-xs">
                    <span className="material-symbols-outlined text-2xl block mb-1">bed</span>
                    Cama Libre para Ingreso
                  </div>
                )}
              </div>

              {p && (
                <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-on-surface-variant">{p.bed}</span>
                  <span className="text-primary font-semibold flex items-center gap-0.5">
                    <span>Ver MAR</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
