import React, { useState } from 'react';
import { DutyStaff, SignatureRecord } from '../types/clinical';

interface SignaturesViewProps {
  dutyStaff: DutyStaff[];
  signatureRecords: SignatureRecord[];
  activeStaffId: string;
  onSelectActiveStaff: (staffId: string) => void;
  onOpenNewStaffModal: () => void;
  onEditStaff: (staff: DutyStaff) => void;
  onDeleteStaff: (staff: DutyStaff) => void;
  onToggleStaffStatus: (staffId: string) => void;
  onOpenNewSignatureModal: () => void;
  onDeleteSignature: (record: SignatureRecord) => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
}

export const SignaturesView: React.FC<SignaturesViewProps> = ({
  dutyStaff,
  signatureRecords,
  activeStaffId,
  onSelectActiveStaff,
  onOpenNewStaffModal,
  onEditStaff,
  onDeleteStaff,
  onToggleStaffStatus,
  onOpenNewSignatureModal,
  onDeleteSignature,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'turnos' | 'firmas'>('turnos');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'doctor' | 'nurse'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered'>('all');

  const activeStaff = dutyStaff.find((s) => s.id === activeStaffId) || dutyStaff[0];

  // Filtering for Duty Staff
  const filteredStaff = dutyStaff.filter((staff) => {
    if (roleFilter !== 'all' && staff.role !== roleFilter) return false;
    if (statusFilter !== 'all' && staff.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = staff.name.toLowerCase().includes(q);
      const matchSpec = staff.specialtyOrRank.toLowerCase().includes(q);
      const matchLic = staff.professionalLicense.toLowerCase().includes(q);
      const matchArea = staff.assignedArea.toLowerCase().includes(q);
      if (!matchName && !matchSpec && !matchLic && !matchArea) return false;
    }
    return true;
  });

  // Filtering for Signatures
  const filteredSignatures = signatureRecords.filter((rec) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = rec.drugOrTitle.toLowerCase().includes(q);
      const matchPatient = rec.patientOrArea.toLowerCase().includes(q);
      const matchSigner1 = rec.signer1Name.toLowerCase().includes(q);
      const matchSigner2 = rec.signer2Name.toLowerCase().includes(q);
      if (!matchTitle && !matchPatient && !matchSigner1 && !matchSigner2) return false;
    }
    return true;
  });

  // KPI Calculations
  const totalActiveStaff = dutyStaff.filter((s) => s.status === 'active').length;
  const totalDoctors = dutyStaff.filter((s) => s.role === 'doctor' && s.status === 'active').length;
  const totalNurses = dutyStaff.filter((s) => s.role === 'nurse' && s.status === 'active').length;
  const leadStaff = dutyStaff.find((s) => s.isLead && s.status === 'active');

  const handleExportAct = () => {
    onShowToast(
      'Acta Certificada Exportada',
      'El libro de firmas y entrega de turno fue descargado con sello criptográfico hospitalario.',
      'verified_user'
    );
  };

  return (
    <div className="p-3 sm:p-space-md md:p-space-lg flex flex-col gap-3.5 sm:gap-space-md max-w-6xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-space-sm pb-1 border-b border-outline-variant/15">
        <div>
          <h1 className="font-headline-lg text-xl sm:text-2xl text-on-surface font-bold tracking-tight">
            Gestión de Firmas &amp; Turnos de Guardia
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Registro de doctores y enfermeras en servicio, asignación de áreas y libro inmutable de firmas
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={activeSubTab === 'turnos' ? onOpenNewStaffModal : onOpenNewSignatureModal}
            className="flex-1 sm:flex-initial bg-primary text-on-primary px-3.5 py-2.5 sm:py-2 rounded-xl text-xs font-semibold hover:bg-surface-tint active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs touch-manipulation min-h-[38px]"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">
              {activeSubTab === 'turnos' ? 'person_add' : 'draw'}
            </span>
            <span>
              {activeSubTab === 'turnos' ? '+ Registrar Profesional' : '+ Nueva Firma / Acta'}
            </span>
          </button>

          <button
            onClick={handleExportAct}
            className="flex items-center justify-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface px-3 py-2.5 sm:py-2 rounded-xl border border-outline-variant/20 transition-all cursor-pointer text-xs font-semibold touch-manipulation min-h-[38px]"
            type="button"
            title="Exportar acta firmada"
          >
            <span className="material-symbols-outlined text-[17px] text-secondary">verified</span>
            <span className="hidden sm:inline">Descargar Acta</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-space-sm w-full">
        <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-on-surface-variant block font-medium">
              Personal en Turno
            </span>
            <span className="text-lg sm:text-xl font-bold text-on-surface">
              {totalActiveStaff} <span className="text-xs font-normal text-on-surface-variant">activos</span>
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">group</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-on-surface-variant block font-medium">
              Médicos de Guardia
            </span>
            <span className="text-lg sm:text-xl font-bold text-primary font-mono-metric">
              {totalDoctors < 10 ? `0${totalDoctors}` : totalDoctors}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">stethoscope</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-on-surface-variant block font-medium">
              Enfermería en Turno
            </span>
            <span className="text-lg sm:text-xl font-bold text-secondary font-mono-metric">
              {totalNurses < 10 ? `0${totalNurses}` : totalNurses}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">medical_services</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-between shadow-xs">
          <div className="min-w-0 pr-1">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-on-surface-variant block font-medium">
              Jefatura de Guardia
            </span>
            <span className="text-xs sm:text-sm font-bold text-on-surface truncate block">
              {leadStaff?.name || 'Enf. Jefa M. Rivas'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">shield_person</span>
          </div>
        </div>
      </section>

      {/* Segmented Control: Personal en Turno vs Libro de Firmas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/15 text-xs self-start">
          <button
            onClick={() => setActiveSubTab('turnos')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'turnos'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">badge</span>
            <span>Doctores &amp; Enfermeras en Turno ({dutyStaff.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('firmas')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'firmas'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">draw</span>
            <span>Libro de Firmas &amp; Trazabilidad ({signatureRecords.length})</span>
          </button>
        </div>

        {/* Global Search within Tab */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[17px] pointer-events-none">
            search
          </span>
          <input
            className="w-full h-9 pl-9 pr-7 bg-surface-container-low rounded-xl text-on-surface text-xs placeholder:text-on-surface-variant/70 outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/40 border border-outline-variant/20 transition-all shadow-xs"
            placeholder={activeSubTab === 'turnos' ? 'Buscar doctor, enfermera o box...' : 'Buscar acta, fármaco o firma...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: PERSONAL EN TURNO (DOCTORES Y ENFERMERAS)     */}
      {/* ======================================================== */}
      {activeSubTab === 'turnos' && (
        <div className="flex flex-col gap-3">
          {/* Filtros de Personal: Todos / Médicos / Enfermería */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-on-surface-variant text-[11px] font-medium mr-1">Filtrar por:</span>
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  roleFilter === 'all'
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Todos ({dutyStaff.length})
              </button>
              <button
                onClick={() => setRoleFilter('doctor')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  roleFilter === 'doctor'
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">stethoscope</span>
                <span>Doctores ({dutyStaff.filter(s => s.role === 'doctor').length})</span>
              </button>
              <button
                onClick={() => setRoleFilter('nurse')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  roleFilter === 'nurse'
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">medical_services</span>
                <span>Enfermería ({dutyStaff.filter(s => s.role === 'nurse').length})</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setStatusFilter(statusFilter === 'all' ? 'active' : 'all')}
                className={`px-2.5 py-1 rounded-lg font-medium border text-xs transition-colors cursor-pointer ${
                  statusFilter === 'active'
                    ? 'bg-secondary/15 text-secondary border-secondary font-semibold'
                    : 'bg-surface-container text-on-surface-variant border-outline-variant/20 hover:text-on-surface'
                }`}
              >
                {statusFilter === 'active' ? '✓ Solo Turno Activo' : 'Ver Solo Activos'}
              </button>
            </div>
          </div>

          {/* Cards Grid de Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-space-sm">
            {filteredStaff.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/15 text-on-surface-variant text-xs">
                No se encontraron profesionales con los criterios seleccionados.
              </div>
            ) : (
              filteredStaff.map((staff) => {
                const isCurrentActive = staff.id === activeStaffId;
                const isDoctor = staff.role === 'doctor';
                const isDelivered = staff.status === 'delivered';
                const isBreak = staff.status === 'break';

                return (
                  <div
                    key={staff.id}
                    className={`rounded-2xl p-3.5 sm:p-4 bg-surface-container-lowest border transition-all flex flex-col justify-between gap-3 shadow-xs ${
                      isCurrentActive
                        ? 'ring-2 ring-primary border-primary/50'
                        : isDelivered
                        ? 'opacity-70 border-outline-variant/15'
                        : 'border-outline-variant/20 hover:border-outline-variant/40'
                    }`}
                  >
                    {/* Header de la tarjeta */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isDoctor
                              ? 'bg-primary/10 text-primary'
                              : 'bg-secondary/15 text-secondary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {isDoctor ? 'stethoscope' : 'medical_services'}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-sm text-on-surface truncate">
                              {staff.name}
                            </h3>
                            {staff.isLead && (
                              <span
                                className="bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded"
                                title="Jefe(a) de Turno"
                              >
                                Jefatura
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-on-surface-variant block truncate">
                            {staff.specialtyOrRank}
                          </span>
                          <span className="text-[10px] font-mono-metric font-semibold text-primary block mt-0.5">
                            {staff.professionalLicense}
                          </span>
                        </div>
                      </div>

                      {/* Estado */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isDelivered
                            ? 'bg-surface-container text-on-surface-variant'
                            : isBreak
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                            : 'bg-secondary/15 text-secondary'
                        }`}
                      >
                        {isDelivered ? 'Entregado' : isBreak ? 'En Relevo' : 'En Turno'}
                      </span>
                    </div>

                    {/* Detalles del Turno y Área */}
                    <div className="p-2.5 rounded-xl bg-surface-container-low text-xs flex flex-col gap-1 border border-outline-variant/10">
                      <div className="flex items-center justify-between text-on-surface">
                        <span className="text-on-surface-variant text-[11px]">Horario Guardia:</span>
                        <span className="font-mono-metric font-semibold">{staff.shiftHours} ({staff.shiftType})</span>
                      </div>
                      <div className="flex items-center justify-between text-on-surface">
                        <span className="text-on-surface-variant text-[11px]">Área Asignada:</span>
                        <span className="font-semibold text-right truncate max-w-[170px]">{staff.assignedArea}</span>
                      </div>
                      <div className="flex items-center justify-between text-on-surface">
                        <span className="text-on-surface-variant text-[11px]">PIN Digital / Firma:</span>
                        <span className="font-mono-metric text-on-surface-variant font-bold tracking-widest">
                          •••• ({staff.digitalSignaturePin})
                        </span>
                      </div>
                      {staff.phoneContact && (
                        <div className="flex items-center justify-between text-on-surface pt-1 border-t border-outline-variant/10">
                          <span className="text-on-surface-variant text-[11px]">Contacto:</span>
                          <span className="text-[11px] truncate">{staff.phoneContact}</span>
                        </div>
                      )}
                    </div>

                    {staff.notes && (
                      <p className="text-[11px] text-on-surface-variant line-clamp-2 italic px-0.5">
                        "{staff.notes}"
                      </p>
                    )}

                    {/* Acciones de la Tarjeta */}
                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant/15 text-xs">
                      {/* Botón Seleccionar como Usuario Activo */}
                      <button
                        onClick={() => {
                          onSelectActiveStaff(staff.id);
                          onShowToast(
                            'Operador Activo Cambiado',
                            `Sesión de guardia activa asignada a ${staff.name}.`,
                            'account_circle'
                          );
                        }}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                          isCurrentActive
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isCurrentActive ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <span>{isCurrentActive ? 'En Sesión' : 'Fijar Activo'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {/* Alternar estado de turno (Activo / Entregado) */}
                        <button
                          onClick={() => onToggleStaffStatus(staff.id)}
                          className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container flex items-center justify-center cursor-pointer transition-colors"
                          title={isDelivered ? 'Reactivar en Turno' : 'Entregar Turno / Finalizar'}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[17px]">
                            {isDelivered ? 'restart_alt' : 'schedule'}
                          </span>
                        </button>

                        {/* Editar Ficha */}
                        <button
                          onClick={() => onEditStaff(staff)}
                          className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center cursor-pointer transition-colors"
                          title="Editar profesional"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[17px]">edit</span>
                        </button>

                        {/* Eliminar Ficha */}
                        <button
                          onClick={() => onDeleteStaff(staff)}
                          className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 flex items-center justify-center cursor-pointer transition-colors"
                          title="Retirar de guardia"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[17px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: LIBRO DE FIRMAS & TRAZABILIDAD                */}
      {/* ======================================================== */}
      {activeSubTab === 'firmas' && (
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-2xl shadow-xs border border-outline-variant/20 overflow-hidden flex flex-col">
          <div className="p-3 sm:p-space-md bg-surface-container-low border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">draw</span>
              <span className="font-title-sm text-xs sm:text-sm font-bold text-on-surface">
                Libro Electrónico de Firmas, Doble Chequeo &amp; Guardias
              </span>
            </div>
            <span className="font-mono-metric text-[11px] text-on-surface-variant">
              Trazabilidad Inmutable • Turno Nocturno 23:00 - 07:00
            </span>
          </div>

          <div className="divide-y divide-outline-variant/15 text-xs">
            {filteredSignatures.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                No hay firmas o actas registradas con ese criterio.
              </div>
            ) : (
              filteredSignatures.map((r) => {
                const isDoubleCheck = r.actType === 'medication_double_check';
                const isHandover = r.actType === 'shift_handover';
                const isAlert = r.actType === 'critical_alert';

                return (
                  <div
                    key={r.id}
                    className="p-3.5 sm:p-space-md flex flex-col gap-2 hover:bg-surface-container-low/40 transition-colors"
                  >
                    {/* Fila superior: Tipo, Título y Horario */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isDoubleCheck
                              ? 'bg-primary/10 text-primary'
                              : isHandover
                              ? 'bg-secondary/15 text-secondary'
                              : isAlert
                              ? 'bg-error-container text-error'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isDoubleCheck ? 'medication' : isHandover ? 'swap_horiz' : isAlert ? 'warning' : 'verified'}
                          </span>
                        </span>

                        <div className="min-w-0">
                          <h3 className="font-title-sm text-xs sm:text-sm font-bold text-on-surface truncate">
                            {r.drugOrTitle}
                          </h3>
                          <span className="text-[11px] text-on-surface-variant truncate block">
                            {r.patientOrArea}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="font-mono-metric text-on-surface font-semibold bg-surface-container px-2 py-0.5 rounded text-xs">
                          {r.time}
                        </span>
                        <span className="bg-secondary-container/50 text-on-secondary-container px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check</span>
                          {r.status}
                        </span>

                        {/* Botón Eliminar Acta */}
                        <button
                          onClick={() => onDeleteSignature(r)}
                          className="w-7 h-7 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 flex items-center justify-center cursor-pointer transition-colors"
                          title="Eliminar registro"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Detalle de Firmantes y Hash */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1 text-xs bg-surface-container-low/60 p-2.5 rounded-xl border border-outline-variant/15">
                      <div>
                        <span className="text-on-surface-variant text-[11px] block">Profesional Titular:</span>
                        <span className="text-on-surface font-semibold">{r.signer1Name}</span>
                        <span className="text-[10px] text-on-surface-variant block">{r.signer1Role} ({r.signer1License})</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant text-[11px] block">Profesional Testigo / Co-signatario:</span>
                        <span className="text-on-surface font-semibold">{r.signer2Name}</span>
                        <span className="text-[10px] text-on-surface-variant block">{r.signer2Role} ({r.signer2License || 'Mat. OK'})</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant text-[11px] block">Firma &amp; Sello Criptográfico:</span>
                        <span className="font-mono-metric text-primary text-[11px] font-bold block">{r.hash}</span>
                        <span className="text-[10px] text-secondary font-medium">Validación PIN Hospitalario ✓</span>
                      </div>
                    </div>

                    {/* Observaciones del Acta */}
                    {r.notes && (
                      <p className="text-[11px] text-on-surface-variant italic px-1">
                        "{r.notes}"
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
