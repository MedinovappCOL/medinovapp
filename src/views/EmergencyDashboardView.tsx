import React, { useState } from 'react';
import { Patient, classifyDrugRisk, RISK_SEMAPHORE_CONFIGS } from '../types/clinical';

interface EmergencyDashboardViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string, targetTab?: 'resumen-clinico' | 'kardex-control' | 'alergias' | 'antecedentes-clinicos') => void;
  onOpenNewPatientModal: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patient: Patient) => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
}

export const EmergencyDashboardView: React.FC<EmergencyDashboardViewProps> = ({
  patients,
  onSelectPatient,
  onOpenNewPatientModal,
  onEditPatient,
  onDeletePatient,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [triageFilter, setTriageFilter] = useState<string>('all');

  const filteredPatients = patients.filter((patient) => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = patient.name.toLowerCase().includes(term);
      const matchId = patient.nationalId.replace(/\./g, '').includes(term.replace(/\./g, ''));
      const matchBox = patient.box.toLowerCase().includes(term);
      if (!matchName && !matchId && !matchBox) return false;
    }
    if (triageFilter !== 'all') {
      if (patient.triageLevel !== triageFilter) return false;
    }
    return true;
  });

  return (
    <div className="relative w-full max-w-6xl mx-auto px-3 sm:px-space-md lg:px-space-xl py-3 sm:py-space-md flex flex-col gap-3.5 sm:gap-space-lg">
      {/* Header Conciso y Limpio */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-space-sm pt-1 border-b border-outline-variant/15 pb-2.5 sm:pb-space-sm">
        <div>
          <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
            Panel de Urgencias
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Boxes 01 - 12 • Monitoreo MAR y Administración Segura
          </p>
        </div>

        {/* Quick action: New Patient */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewPatientModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-primary text-on-primary text-xs font-semibold px-3.5 py-2.5 sm:py-2 rounded-xl shadow-xs hover:bg-surface-tint active:scale-95 transition-all cursor-pointer touch-manipulation min-h-[40px]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Ingresar Paciente</span>
          </button>
        </div>
      </header>

      {/* Buscador Simple y Directo */}
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
          search
        </span>
        <input
          className="w-full h-11 pl-11 pr-10 bg-surface-container-low rounded-xl text-on-surface text-base sm:text-sm placeholder:text-on-surface-variant/70 outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/40 border border-outline-variant/20 transition-all shadow-xs"
          placeholder="Buscar por nombre, cédula o Box..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-1"
            title="Limpiar búsqueda"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* 4 KPIs Clave en Grid Móvil 2x2 */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-space-sm w-full">
        <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-on-surface-variant block font-medium">
              Ocupación
            </span>
            <span className="text-lg sm:text-xl font-bold text-on-surface">
              {patients.length} / 14
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">airline_seat_flat</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-on-surface-variant block font-medium">
              Próximas Dosis
            </span>
            <span className="text-lg sm:text-xl font-bold text-secondary">04</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">timer</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-on-surface-variant block font-medium">
              Alertas Alergia
            </span>
            <span className="text-lg sm:text-xl font-bold text-error">
              {patients.filter((p) => p.allergies.length > 0).length}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-error-container text-error flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-on-surface-variant block font-medium">
              Lotes Críticos
            </span>
            <span className="text-lg sm:text-xl font-bold text-tertiary">01</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">hourglass_bottom</span>
          </div>
        </div>
      </section>

      {/* Pacientes en Observación */}
      <section className="flex flex-col gap-2.5 sm:gap-space-sm">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Pacientes en Guardia ({filteredPatients.length})
          </span>

          {/* Filtro Simple */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setTriageFilter(triageFilter === 'all' ? 'Triage I' : 'all')}
              className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer text-xs ${
                triageFilter === 'Triage I'
                  ? 'bg-error text-on-error border-error font-semibold'
                  : 'bg-surface-container text-on-surface-variant border-outline-variant/20 hover:text-on-surface'
              }`}
            >
              {triageFilter === 'Triage I' ? 'Solo Críticos (Rojo)' : 'Filtrar Críticos'}
            </button>
          </div>
        </div>

        {/* Grid de Pacientes Responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-space-md">
          {filteredPatients.map((patient) => {
            const isElena = patient.id === '52940182';

            return (
              <article
                key={patient.id}
                className={`p-3.5 sm:p-space-md rounded-2xl bg-surface-container-lowest border transition-all hover:shadow-md flex flex-col justify-between gap-3 ${
                  isElena
                    ? 'border-error/30 hover:border-error'
                    : 'border-outline-variant/20 hover:border-primary/40'
                }`}
              >
                {/* Cabecera del Paciente con botones de Edición/Eliminación */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    onClick={() => onSelectPatient(patient.id, isElena ? 'alergias' : 'resumen-clinico')}
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
                  >
                    <img
                      className="w-11 h-11 rounded-xl object-cover bg-surface-container shrink-0 group-hover:ring-1 group-hover:ring-primary"
                      alt={patient.name}
                      src={patient.avatarUrl}
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-title-sm text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                        {patient.name}
                      </span>
                      <span className="text-xs text-on-surface-variant font-mono-metric">
                        CC {patient.nationalId}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-md font-semibold shrink-0 ${
                        isElena
                          ? 'bg-error-container text-error'
                          : 'bg-primary-fixed text-primary'
                      }`}
                    >
                      {patient.box.replace(' Urgencias', '')}
                    </span>

                    {/* Botón Editar Paciente */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPatient(patient);
                      }}
                      className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center cursor-pointer transition-colors touch-manipulation"
                      title="Editar datos del paciente"
                    >
                      <span className="material-symbols-outlined text-[17px]">edit</span>
                    </button>

                    {/* Botón Dar de Alta / Eliminar Paciente */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePatient(patient);
                      }}
                      className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 flex items-center justify-center cursor-pointer transition-colors touch-manipulation"
                      title="Dar de alta / Eliminar paciente"
                    >
                      <span className="material-symbols-outlined text-[17px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Info Clave: Fármaco programado / Alerta */}
                {(() => {
                  const drugName = patient.nextScheduledDrug?.name || '';
                  const riskColor = drugName ? classifyDrugRisk(drugName) : 'green';
                  const riskConfig = RISK_SEMAPHORE_CONFIGS[riskColor];

                  return (
                    <div
                      onClick={() => onSelectPatient(patient.id, isElena ? 'alergias' : 'resumen-clinico')}
                      className={`px-3 py-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer border-l-2 ${
                        isElena
                          ? 'bg-error-container/30 text-error border-error'
                          : `bg-surface-container-low text-on-surface ${riskConfig.borderClass}`
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 mr-2">
                        {!isElena && (
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${riskConfig.dotClass}`}
                            title={`Semáforo ${riskConfig.label}`}
                          />
                        )}
                        <span className={`truncate ${isElena ? 'font-bold' : riskConfig.textClass}`}>
                          {patient.nextScheduledDrug?.name || 'Medicación pautada'} {patient.nextScheduledDrug?.dose || ''}
                        </span>
                      </div>
                      <span className="font-bold shrink-0 ml-1 font-mono-metric text-[11px]">
                        {patient.nextScheduledDrug?.urgencyText || 'Activo'}
                      </span>
                    </div>
                  );
                })()}

                {/* Botón Simple para abrir MAR */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-on-surface-variant font-medium truncate mr-2">
                    {patient.triageLevel} • {patient.bed}
                  </span>
                  <button
                    onClick={() => onSelectPatient(patient.id, isElena ? 'alergias' : 'resumen-clinico')}
                    className="text-primary font-semibold flex items-center gap-1 hover:underline cursor-pointer py-1 touch-manipulation shrink-0"
                  >
                    <span>{isElena ? 'Ver Alerta' : 'Abrir MAR'}</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
