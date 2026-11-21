import React from 'react';
import { Patient } from '../../types/clinical';

interface PatientHeaderBarProps {
  patient: Patient;
  onOpenKardex: () => void;
  onReportRam: () => void;
  onEditPatient?: (patient: Patient) => void;
}

export const PatientHeaderBar: React.FC<PatientHeaderBarProps> = ({
  patient,
  onOpenKardex,
  onReportRam,
  onEditPatient,
}) => {
  return (
    <section className="bg-surface-container-lowest/90 backdrop-blur-xl shadow-xs px-3 sm:px-space-md lg:px-space-xl py-2.5 sm:py-space-sm border-b border-outline-variant/20 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-space-sm">
        {/* Patient Identity & Key Data */}
        <div className="flex items-center gap-2.5 sm:gap-space-md min-w-0">
          <div className="relative shrink-0">
            <img
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl object-cover bg-surface-container-high ring-1 ring-outline-variant/20 shadow-xs"
              alt={patient.name}
              src={patient.avatarUrl}
            />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-headline-md text-base sm:text-[18px] text-on-surface font-bold tracking-tight truncate">
                {patient.name}
              </h1>
              <span className="bg-primary/10 text-primary text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-semibold shrink-0">
                {patient.box}
              </span>
              <span className="bg-surface-container-high text-on-surface-variant text-[11px] sm:text-xs px-2 py-0.5 rounded-full shrink-0">
                {patient.bed}
              </span>
            </div>

            <div className="flex items-center gap-x-2 text-on-surface-variant text-[11px] sm:text-xs mt-0.5 flex-wrap">
              <span className="font-medium text-on-surface font-mono-metric">CC {patient.nationalId}</span>
              <span>•</span>
              <span>{patient.age} años</span>
              <span>•</span>
              <span>{patient.weightKg} kg</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline truncate">
                Tratante: <strong className="text-on-surface font-medium">{patient.attendingDoctor}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Essential Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-stretch sm:self-auto justify-end">
          {onEditPatient && (
            <button
              onClick={() => onEditPatient(patient)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 bg-surface-container px-2.5 py-2 sm:py-1.5 rounded-lg text-on-surface text-xs font-semibold hover:bg-surface-container-high active:scale-95 transition-all cursor-pointer border border-outline-variant/20 shadow-xs touch-manipulation min-h-[38px]"
              type="button"
              title="Editar ficha"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Editar</span>
            </button>
          )}
          <button
            onClick={onOpenKardex}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-surface-container px-3 py-2 sm:py-1.5 rounded-lg text-on-surface text-xs font-semibold hover:bg-surface-container-high active:scale-95 transition-all cursor-pointer border border-outline-variant/20 shadow-xs touch-manipulation min-h-[38px]"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">bolt</span>
            <span>Kárdex</span>
          </button>
          <button
            onClick={onReportRam}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-error/10 text-error hover:bg-error hover:text-on-error px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold active:scale-95 transition-all cursor-pointer border border-error/20 touch-manipulation min-h-[38px]"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">report_problem</span>
            <span>RAM</span>
          </button>
        </div>
      </div>
    </section>
  );
};
