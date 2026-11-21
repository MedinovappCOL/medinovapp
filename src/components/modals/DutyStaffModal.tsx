import React, { useState, useEffect } from 'react';
import { DutyStaff } from '../../types/clinical';

interface DutyStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: DutyStaff) => void;
  staffToEdit?: DutyStaff | null;
}

export const DutyStaffModal: React.FC<DutyStaffModalProps> = ({
  isOpen,
  onClose,
  onSave,
  staffToEdit,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'doctor' | 'nurse'>('nurse');
  const [specialtyOrRank, setSpecialtyOrRank] = useState('');
  const [professionalLicense, setProfessionalLicense] = useState('');
  const [shiftType, setShiftType] = useState<'Nocturno' | 'Diurno' | 'Tarde' | 'Rotativo' | 'Refuerzo'>('Nocturno');
  const [shiftHours, setShiftHours] = useState('23:00 - 07:00');
  const [assignedArea, setAssignedArea] = useState('Boxes 01 - 12 (General)');
  const [digitalSignaturePin, setDigitalSignaturePin] = useState('');
  const [status, setStatus] = useState<'active' | 'break' | 'delivered'>('active');
  const [checkInTime, setCheckInTime] = useState('22:50');
  const [phoneContact, setPhoneContact] = useState('');
  const [isLead, setIsLead] = useState(false);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (staffToEdit) {
      setName(staffToEdit.name);
      setRole(staffToEdit.role);
      setSpecialtyOrRank(staffToEdit.specialtyOrRank);
      setProfessionalLicense(staffToEdit.professionalLicense);
      setShiftType(staffToEdit.shiftType);
      setShiftHours(staffToEdit.shiftHours);
      setAssignedArea(staffToEdit.assignedArea);
      setDigitalSignaturePin(staffToEdit.digitalSignaturePin);
      setStatus(staffToEdit.status);
      setCheckInTime(staffToEdit.checkInTime);
      setPhoneContact(staffToEdit.phoneContact || '');
      setIsLead(!!staffToEdit.isLead);
      setNotes(staffToEdit.notes || '');
    } else {
      // Default new entry
      setName('');
      setRole('doctor');
      setSpecialtyOrRank('Medicina de Urgencias');
      setProfessionalLicense('Reg. Méd. ');
      setShiftType('Nocturno');
      setShiftHours('23:00 - 07:00');
      setAssignedArea('Boxes 01 - 06');
      const randomPin = String(Math.floor(1000 + Math.random() * 9000));
      setDigitalSignaturePin(randomPin);
      setStatus('active');
      const now = new Date();
      setCheckInTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      setPhoneContact('');
      setIsLead(false);
      setNotes('');
    }
    setErrors({});
  }, [staffToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'El nombre completo es obligatorio';
    if (!specialtyOrRank.trim()) errs.specialtyOrRank = 'Indique la especialidad o cargo';
    if (!professionalLicense.trim()) errs.professionalLicense = 'El registro profesional / matrícula es obligatorio';
    if (!digitalSignaturePin.trim()) errs.digitalSignaturePin = 'Indique un PIN de 4 dígitos para firma';
    if (!shiftHours.trim()) errs.shiftHours = 'El horario de guardia es requerido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedStaff: DutyStaff = {
      id: staffToEdit ? staffToEdit.id : `staff-${Date.now()}`,
      name: name.trim(),
      role,
      specialtyOrRank: specialtyOrRank.trim(),
      professionalLicense: professionalLicense.trim(),
      shiftType,
      shiftHours: shiftHours.trim(),
      assignedArea: assignedArea.trim(),
      digitalSignaturePin: digitalSignaturePin.trim(),
      status,
      checkInTime: checkInTime.trim() || '23:00',
      phoneContact: phoneContact.trim() || undefined,
      isLead,
      notes: notes.trim() || undefined,
    };

    onSave(formattedStaff);
    onClose();
  };

  const handleRoleChange = (newRole: 'doctor' | 'nurse') => {
    setRole(newRole);
    if (!staffToEdit) {
      if (newRole === 'doctor') {
        if (!name.startsWith('Dr.')) setName(name ? `Dr. ${name.replace(/^Enf\.\s*(Jefa|Asist\.|Sup\.)?\s*/i, '')}` : 'Dr. ');
        if (!professionalLicense || professionalLicense.includes('Mat.')) setProfessionalLicense('Reg. Méd. ');
        setSpecialtyOrRank('Medicina Interna');
      } else {
        if (!name.startsWith('Enf.')) setName(name ? `Enf. ${name.replace(/^Dr[a]?\.\s*/i, '')}` : 'Enf. ');
        if (!professionalLicense || professionalLicense.includes('Reg.')) setProfessionalLicense('Mat. Enf. ');
        setSpecialtyOrRank('Enfermera Clínica de Urgencias');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/20 overflow-hidden animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-space-md border-b border-outline-variant/15 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${role === 'doctor' ? 'bg-primary/10 text-primary' : 'bg-secondary/15 text-secondary'}`}>
              <span className="material-symbols-outlined text-[20px]">
                {role === 'doctor' ? 'stethoscope' : 'medical_services'}
              </span>
            </div>
            <div>
              <h2 className="font-bold text-base text-on-surface">
                {staffToEdit ? 'Editar Profesional de Turno' : 'Registrar Profesional de Turno'}
              </h2>
              <p className="text-xs text-on-surface-variant">
                Control de guardia, asignación de área y clave de firma digital
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-space-md overflow-y-auto flex flex-col gap-3.5 text-xs">
          {/* Selector Rol: Doctor vs Enfermera */}
          <div>
            <label className="font-semibold text-on-surface block mb-1.5">
              Tipo de Profesional *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleRoleChange('doctor')}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-semibold transition-all ${
                  role === 'doctor'
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant border-outline-variant/20 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">stethoscope</span>
                <span>Médico / Doctor(a)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('nurse')}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-semibold transition-all ${
                  role === 'nurse'
                    ? 'bg-secondary text-on-secondary border-secondary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant border-outline-variant/20 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">medical_services</span>
                <span>Enfermera(o)</span>
              </button>
            </div>
          </div>

          {/* Nombre y Registro Profesional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Nombre y Apellidos *
              </label>
              <input
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                placeholder={role === 'doctor' ? 'Ej. Dr. Alejandro Silva' : 'Ej. Enf. María Rivas'}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className="text-error text-[11px] block mt-0.5">{errors.name}</span>}
            </div>

            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Registro / Matrícula Profesional *
              </label>
              <input
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs font-mono-metric"
                placeholder={role === 'doctor' ? 'Reg. Méd. 48291' : 'Mat. Enf. 90214'}
                value={professionalLicense}
                onChange={(e) => setProfessionalLicense(e.target.value)}
              />
              {errors.professionalLicense && (
                <span className="text-error text-[11px] block mt-0.5">{errors.professionalLicense}</span>
              )}
            </div>
          </div>

          {/* Especialidad / Cargo y Área Asignada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Especialidad o Cargo *
              </label>
              <input
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                placeholder={role === 'doctor' ? 'Medicina Interna, Urgenciología...' : 'Supervisora de Guardia, Cuidados Críticos...'}
                value={specialtyOrRank}
                onChange={(e) => setSpecialtyOrRank(e.target.value)}
              />
              {errors.specialtyOrRank && (
                <span className="text-error text-[11px] block mt-0.5">{errors.specialtyOrRank}</span>
              )}
            </div>

            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Área Asignada de Urgencias *
              </label>
              <select
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs cursor-pointer"
                value={assignedArea}
                onChange={(e) => setAssignedArea(e.target.value)}
              >
                <option value="Boxes 01 - 12 (General)">Boxes 01 - 12 (General)</option>
                <option value="Boxes 01 - 06">Boxes 01 - 06</option>
                <option value="Boxes 07 - 12">Boxes 07 - 12</option>
                <option value="Shock Room & Reanimación">Shock Room &amp; Reanimación</option>
                <option value="Triage de Urgencias">Triage de Urgencias</option>
                <option value="Observación Rápida">Observación Rápida</option>
              </select>
            </div>
          </div>

          {/* Turno, Horario y Hora de Ingreso */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Tipo de Turno *
              </label>
              <select
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs cursor-pointer"
                value={shiftType}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setShiftType(val);
                  if (val === 'Nocturno') setShiftHours('23:00 - 07:00');
                  else if (val === 'Diurno') setShiftHours('07:00 - 15:00');
                  else if (val === 'Tarde') setShiftHours('15:00 - 23:00');
                  else if (val === 'Refuerzo') setShiftHours('20:00 - 08:00');
                }}
              >
                <option value="Nocturno">Nocturno (23:00 - 07:00)</option>
                <option value="Diurno">Diurno (07:00 - 15:00)</option>
                <option value="Tarde">Tarde (15:00 - 23:00)</option>
                <option value="Rotativo">Rotativo 12h</option>
                <option value="Refuerzo">Refuerzo Guardia</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Horario de Guardia *
              </label>
              <input
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs font-mono-metric"
                placeholder="Ej. 23:00 - 07:00"
                value={shiftHours}
                onChange={(e) => setShiftHours(e.target.value)}
              />
              {errors.shiftHours && <span className="text-error text-[11px] block mt-0.5">{errors.shiftHours}</span>}
            </div>

            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Hora de Check-In
              </label>
              <input
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs font-mono-metric"
                placeholder="22:45"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
              />
            </div>
          </div>

          {/* Clave / PIN de Firma Digital y Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/15">
            <div>
              <label className="font-semibold text-on-surface block mb-1 flex items-center justify-between">
                <span>PIN de Firma Digital *</span>
                <span className="text-[10px] text-primary font-normal">Para autorizaciones y MAR</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  className="w-full h-10 pl-3 pr-8 bg-surface-container rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs font-mono-metric tracking-widest font-bold"
                  placeholder="Ej. 4829"
                  value={digitalSignaturePin}
                  onChange={(e) => setDigitalSignaturePin(e.target.value)}
                />
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">
                  lock
                </span>
              </div>
              {errors.digitalSignaturePin && (
                <span className="text-error text-[11px] block mt-0.5">{errors.digitalSignaturePin}</span>
              )}
            </div>

            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Estado Actual en Turno
              </label>
              <select
                className="w-full h-10 px-3 bg-surface-container rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs cursor-pointer font-medium"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="active">🟢 En Turno Activo</option>
                <option value="break">🟡 En Colación / Relevo Transitorio</option>
                <option value="delivered">⚪ Turno Entregado / Finalizado</option>
              </select>
            </div>
          </div>

          {/* Teléfono / Anexo y Checkbox Coordinador de Guardia */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="font-semibold text-on-surface block mb-1">
                Teléfono de Contacto / Anexo
              </label>
              <input
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                placeholder="Ej. Anexo 402 / Móvil 972334455"
                value={phoneContact}
                onChange={(e) => setPhoneContact(e.target.value)}
              />
            </div>

            <div className="sm:pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isLead}
                  onChange={(e) => setIsLead(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary/40 cursor-pointer"
                />
                <span className="font-semibold text-on-surface text-xs">
                  Jefe(a) de Turno / Coordinador(a)
                </span>
              </label>
            </div>
          </div>

          {/* Observaciones del Turno */}
          <div>
            <label className="font-semibold text-on-surface block mb-1">
              Observaciones Clínicas o Novedades de Guardia
            </label>
            <textarea
              rows={2}
              className="w-full p-2.5 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs resize-none"
              placeholder="Asignación específica, novedades de entrega de guardia, custodia de llaves de estupefacientes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold shadow-xs hover:bg-surface-tint active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">badge</span>
              <span>{staffToEdit ? 'Guardar Cambios' : 'Registrar en Turno'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
