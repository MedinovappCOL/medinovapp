import React, { useState } from 'react';
import {
  Patient,
  MedicationOrder,
  getMedicationRiskColor,
  RISK_SEMAPHORE_CONFIGS,
  calculateNextDoseTime,
  extractIntervalHours,
} from '../types/clinical';

interface MedicationsViewProps {
  patient: Patient;
  medications: MedicationOrder[];
  onOpenNewMedModal: () => void;
  onEditMed: (med: MedicationOrder) => void;
  onDeleteMed: (med: MedicationOrder) => void;
  onAdministerDrug?: (medId: string) => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
  selectedDrugId?: string;
}

export const MedicationsView: React.FC<MedicationsViewProps> = ({
  patient,
  medications,
  onOpenNewMedModal,
  onEditMed,
  onDeleteMed,
  onAdministerDrug,
  onShowToast,
  selectedDrugId,
}) => {
  const [activeRouteFilter, setActiveRouteFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentSelectedId, setCurrentSelectedId] = useState<string>(
    selectedDrugId || (medications[0]?.id ?? '')
  );
  // Mobile sub-tab: 'list' | 'detail'
  const [mobileTab, setMobileTab] = useState<'list' | 'detail'>('list');

  const selectedMed =
    medications.find((m) => m.id === currentSelectedId) || medications[0];

  const filteredMeds = medications.filter((m) => {
    if (activeRouteFilter !== 'all' && m.route.toLowerCase() !== activeRouteFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchCommercial = m.commercialName.toLowerCase().includes(q);
      if (!matchName && !matchCommercial) return false;
    }
    return true;
  });

  const handleRegisterKardex = () => {
    if (!selectedMed) return;
    onShowToast('Ficha Validada', `${selectedMed.name} programada con éxito en Kárdex.`, 'verified');
  };

  const handleSelectMedMobile = (id: string) => {
    setCurrentSelectedId(id);
    // On small screens, allow viewing detail easily
  };

  return (
    <div className="p-3 sm:p-space-md md:p-space-lg flex flex-col gap-3 sm:gap-space-md max-w-6xl mx-auto w-full">
      {/* Barra de Filtros Simple con Botón de Nueva Prescripción */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-space-sm pb-1 border-b border-outline-variant/15">
        <div>
          <h2 className="font-title-sm text-base sm:text-lg font-bold text-on-surface">
            Órdenes Médicas Vigentes
          </h2>
          <p className="text-xs text-on-surface-variant">
            {filteredMeds.length} prescripciones para {patient.name}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Botón Nueva Prescripción */}
          <button
            onClick={onOpenNewMedModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-primary text-on-primary text-xs font-semibold px-3.5 py-2 sm:py-1.5 rounded-xl shadow-xs hover:bg-surface-tint active:scale-95 transition-all cursor-pointer touch-manipulation min-h-[38px]"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>+ Prescribir Fármaco</span>
          </button>

          {/* Filtros de Vía */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs bg-surface-container-low p-1 rounded-xl border border-outline-variant/15">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'iv', label: 'IV' },
              { id: 'sc', label: 'SC' },
              { id: 'vo', label: 'VO' },
            ].map((route) => (
              <button
                key={route.id}
                onClick={() => setActiveRouteFilter(route.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer touch-manipulation ${
                  activeRouteFilter === route.id
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                {route.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selector Móvil de Vista (Lista / Detalle Ficha) */}
      <div className="flex lg:hidden bg-surface-container-high/40 p-1 rounded-xl border border-outline-variant/15 text-xs">
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation ${
            mobileTab === 'list'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
          <span>Prescripciones ({filteredMeds.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('detail')}
          className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation ${
            mobileTab === 'detail'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>Ficha Técnica</span>
        </button>
      </div>

      {/* Grid: Lista de Fármacos + Ficha Técnica Rápida */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-space-md items-start">
        {/* Lista (Visible siempre en desktop; en mobile según mobileTab) */}
        <div className={`lg:col-span-7 flex flex-col gap-2 sm:gap-2.5 ${mobileTab === 'detail' ? 'hidden lg:flex' : 'flex'}`}>
          {filteredMeds.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/20 text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-3xl mb-1 opacity-50">medication</span>
              <p>No hay medicamentos registrados en esta categoría.</p>
              <button
                onClick={onOpenNewMedModal}
                className="mt-2 text-primary font-semibold hover:underline cursor-pointer"
              >
                + Prescribir primer fármaco
              </button>
            </div>
          ) : (
            filteredMeds.map((med) => {
              const isSelected = med.id === currentSelectedId;
              const isRecalled = med.status === 'recalled';

              const riskColor = getMedicationRiskColor(med);
              const riskConfig = RISK_SEMAPHORE_CONFIGS[riskColor];

              return (
                <div
                  key={med.id}
                  onClick={() => {
                    handleSelectMedMobile(med.id);
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl bg-surface-container-lowest border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary ring-1 ring-primary shadow-xs'
                      : isRecalled
                      ? 'border-error/30 opacity-75'
                      : 'border-outline-variant/20 hover:border-outline'
                  } ${riskConfig.borderClass}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        {/* Letras en color del semáforo */}
                        <span className={`text-sm tracking-tight truncate ${riskConfig.textClass}`}>
                          {med.name} {med.dose}
                        </span>

                        {/* Badge de Semáforo */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${riskConfig.bgBadgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${riskConfig.dotClass}`} />
                          <span>{riskConfig.label}: {riskConfig.shortLabel}</span>
                        </span>

                        <span className="text-[11px] bg-surface-container px-2 py-0.2 rounded text-on-surface-variant font-medium shrink-0">
                          {med.route}
                        </span>
                        {isRecalled && (
                          <span className="text-[10px] bg-error text-on-error px-1.5 py-0.2 rounded font-bold uppercase shrink-0">
                            No Administrar
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-0.5 truncate">
                        {med.classification} • {med.frequency}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs font-mono-metric text-on-surface-variant font-medium mr-1">
                        {med.scheduledTime}
                      </span>

                      {/* Editar Medicamento */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMed(med);
                        }}
                        className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center cursor-pointer transition-colors touch-manipulation"
                        title="Editar prescripción"
                      >
                        <span className="material-symbols-outlined text-[17px]">edit</span>
                      </button>

                      {/* Eliminar / Suspender Medicamento */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMed(med);
                        }}
                        className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 flex items-center justify-center cursor-pointer transition-colors touch-manipulation"
                        title="Suspender / Eliminar orden"
                      >
                        <span className="material-symbols-outlined text-[17px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Acceso rápido a ficha en móvil */}
                  <div className="lg:hidden mt-2 pt-2 border-t border-outline-variant/10 flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="font-mono-metric text-[11px]">Lote: {med.lotNumber}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSelectedId(med.id);
                        setMobileTab('detail');
                      }}
                      className="text-primary font-semibold flex items-center gap-0.5 hover:underline py-0.5"
                    >
                      <span>Ver Ficha Técnica</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Ficha Rápida del Fármaco Seleccionado */}
        {selectedMed ? (
          <aside className={`lg:col-span-5 bg-surface-container-lowest rounded-2xl p-3.5 sm:p-space-md border border-outline-variant/20 shadow-xs flex flex-col gap-space-sm text-xs ${mobileTab === 'list' ? 'hidden lg:flex' : 'flex'} ${RISK_SEMAPHORE_CONFIGS[getMedicationRiskColor(selectedMed)].borderClass}`}>
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
              <div>
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">
                  Ficha Técnica MAR
                </span>
                <h3 className={`text-base tracking-tight ${RISK_SEMAPHORE_CONFIGS[getMedicationRiskColor(selectedMed)].textClass}`}>
                  {selectedMed.name}
                </h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${RISK_SEMAPHORE_CONFIGS[getMedicationRiskColor(selectedMed)].bgBadgeClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${RISK_SEMAPHORE_CONFIGS[getMedicationRiskColor(selectedMed)].dotClass}`} />
                <span>{RISK_SEMAPHORE_CONFIGS[getMedicationRiskColor(selectedMed)].label}</span>
              </span>
            </div>

            {/* Tarjeta del Semáforo de Riesgo */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${RISK_SEMAPHORE_CONFIGS[getMedicationRiskColor(selectedMed)].bgBadgeClass}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 shadow-xs ${RISK_SEMAPHORE_CONFIGS[getMedicationRiskColor(selectedMed)].dotClass}`}>
                <span className="material-symbols-outlined text-[15px] text-white">traffic</span>
              </div>
              <div className="min-w-0">
                <span className="font-bold block text-xs">
                  Semáforo {RISK_SEMAPHORE_CONFIGS[getMedicationRiskColor(selectedMed)].label}: {RISK_SEMAPHORE_CONFIGS[getMedicationRiskColor(selectedMed)].name}
                </span>
                <span className="text-[11px] block opacity-90 leading-tight">
                  {RISK_SEMAPHORE_CONFIGS[getMedicationRiskColor(selectedMed)].description}
                </span>
              </div>
            </div>

            {(() => {
              const interval = selectedMed.intervalHours ?? extractIntervalHours(selectedMed.frequency);
              const nextDose = selectedMed.nextScheduledTime || (interval > 0 ? calculateNextDoseTime(selectedMed.scheduledTime, interval) : 'Dosis Única');

              return (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                    <span className="text-on-surface-variant">Pauta &amp; Frecuencia</span>
                    <span className="font-semibold text-primary">{selectedMed.frequency}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                    <span className="text-on-surface-variant">Dosis Actual Programada</span>
                    <span className="font-mono-metric font-bold text-on-surface">{selectedMed.scheduledTime}</span>
                  </div>
                  {interval > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-primary/10 border border-primary/20">
                      <span className="text-primary font-semibold">Siguiente Dosis Proyectada</span>
                      <span className="font-mono-metric font-extrabold text-primary">{nextDose}</span>
                    </div>
                  )}
                  {selectedMed.lastAdministeredAt && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/10 border border-secondary/20">
                      <span className="text-secondary font-semibold">Última Dosis Suministrada</span>
                      <span className="font-mono-metric font-bold text-secondary">{selectedMed.lastAdministeredAt} ({selectedMed.lastAdministeredBy || 'Enf. M. Rivas'})</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                    <span className="text-on-surface-variant">Presentación Comercial</span>
                    <span className="font-semibold text-on-surface">{selectedMed.commercialName}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                    <span className="text-on-surface-variant">Dosis &amp; Vía</span>
                    <span className="font-semibold text-on-surface">{selectedMed.dose} ({selectedMed.route})</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                    <span className="text-on-surface-variant">Dilución &amp; Infusión</span>
                    <span className="font-semibold text-on-surface text-right">{selectedMed.dilution} • {selectedMed.infusionTime}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                    <span className="text-on-surface-variant">Lote &amp; Caducidad</span>
                    <span className="font-mono-metric text-on-surface">{selectedMed.lotNumber} (Vence: {selectedMed.expiryDate})</span>
                  </div>
                </div>
              );
            })()}

            {(selectedMed.colorTag === 'error' || selectedMed.colorTag === 'amber' || selectedMed.alertNote) && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                <span className="text-[11px] font-semibold">{selectedMed.alertNote || 'Medicamento de Alto Riesgo (ISMP): Doble chequeo obligatorio en bomba.'}</span>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-1">
              {onAdministerDrug && (
                <button
                  onClick={() => onAdministerDrug(selectedMed.id)}
                  className="w-full bg-primary text-on-primary py-2.5 rounded-xl font-semibold shadow-xs hover:bg-surface-tint active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation min-h-[42px]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[17px]">check_circle</span>
                  <span>Suministrar Dosis &amp; Recalcular Horario</span>
                </button>
              )}
              <button
                onClick={handleRegisterKardex}
                className="w-full bg-surface-container-low hover:bg-surface-container text-on-surface py-2 rounded-xl font-medium border border-outline-variant/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation text-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>Re-validar en Kárdex</span>
              </button>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
};
