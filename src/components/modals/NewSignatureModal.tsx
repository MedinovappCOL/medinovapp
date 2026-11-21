import React, { useState, useEffect } from 'react';
import { DutyStaff, SignatureRecord, Patient } from '../../types/clinical';

interface NewSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: SignatureRecord) => void;
  dutyStaff: DutyStaff[];
  patients: Patient[];
}

export const NewSignatureModal: React.FC<NewSignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dutyStaff,
  patients,
}) => {
  const [actType, setActType] = useState<SignatureRecord['actType']>('medication_double_check');
  const [drugOrTitle, setDrugOrTitle] = useState('');
  const [patientOrArea, setPatientOrArea] = useState('');
  const [time, setTime] = useState('');
  const [signer1Id, setSigner1Id] = useState('');
  const [signer2Id, setSigner2Id] = useState('');
  const [signer1CustomName, setSigner1CustomName] = useState('');
  const [signer2CustomName, setSigner2CustomName] = useState('');
  const [pin, setPin] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      setActType('medication_double_check');
      setDrugOrTitle('Omeprazol Sódico 40mg IV - Doble Chequeo');
      setPatientOrArea(patients[0] ? `${patients[0].name} (${patients[0].box})` : 'Carlos Eduardo Méndez (Box 04)');
      
      const leadStaff = dutyStaff.find((s) => s.isLead && s.role === 'nurse') || dutyStaff[0];
      const witnessStaff = dutyStaff.find((s) => s.id !== leadStaff?.id) || dutyStaff[1] || dutyStaff[0];
      
      setSigner1Id(leadStaff ? leadStaff.id : 'custom');
      setSigner2Id(witnessStaff ? witnessStaff.id : 'custom');
      setSigner1CustomName(leadStaff?.name || '');
      setSigner2CustomName(witnessStaff?.name || '');
      setPin(leadStaff?.digitalSignaturePin || '9021');
      setNotes('Doble chequeo conforme a protocolo de 5 correctos en cabecera.');
      setErrors({});
    }
  }, [isOpen, dutyStaff, patients]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!drugOrTitle.trim()) errs.drugOrTitle = 'El título o fármaco es obligatorio';
    if (!patientOrArea.trim()) errs.patientOrArea = 'Indique el paciente o servicio';
    if (!pin.trim()) errs.pin = 'Se requiere el PIN de firma del profesional';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const s1 = dutyStaff.find((s) => s.id === signer1Id);
    const s2 = dutyStaff.find((s) => s.id === signer2Id);

    const s1Name = s1 ? s1.name : signer1CustomName || 'Enf. Titular';
    const s1Role = s1 ? (s1.role === 'doctor' ? 'Médico Tratante' : s1.specialtyOrRank) : 'Profesional Titular';
    const s1License = s1 ? s1.professionalLicense : 'Reg. Hospitalario';

    const s2Name = s2 ? s2.name : signer2CustomName || 'Testigo de Guardia';
    const s2Role = s2 ? (s2.role === 'doctor' ? 'Médico Supervisor' : s2.specialtyOrRank) : 'Co-signatario Testigo';
    const s2License = s2 ? s2.professionalLicense : 'Mat. Testigo';

    const randomHash = `SHA256: ${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;

    let statusText = 'Conforme - Doble Chequeo OK';
    if (actType === 'shift_handover') statusText = 'Entrega de Turno Conforme';
    if (actType === 'narcotics_check') statusText = 'Libro de Fármacos Cuadrado';
    if (actType === 'critical_alert') statusText = 'Bloqueo Preventivo Validado';
    if (actType === 'admission_validation') statusText = 'Ingreso Urgencias Conforme';

    const newRecord: SignatureRecord = {
      id: `sig-${Date.now()}`,
      actType,
      drugOrTitle: drugOrTitle.trim(),
      patientOrArea: patientOrArea.trim(),
      time: time || '03:45',
      date: 'Hoy',
      signer1Name: s1Name,
      signer1Role: s1Role,
      signer1License: s1License,
      signer2Name: s2Name,
      signer2Role: s2Role,
      signer2License: s2License,
      pinVerified: true,
      hash: randomHash,
      status: statusText,
      notes: notes.trim() || undefined,
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/20 overflow-hidden animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-space-md border-b border-outline-variant/15 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">draw</span>
            </div>
            <div>
              <h2 className="font-bold text-base text-on-surface">
                Firmar Acta / Registro Clínico de Turno
              </h2>
              <p className="text-xs text-on-surface-variant">
                Doble verificación, entrega de guardia o control de estupefacientes
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
        <form onSubmit={handleSave} className="p-4 sm:p-space-md overflow-y-auto flex flex-col gap-3.5 text-xs">
          {/* Tipo de Acta */}
          <div>
            <label className="font-semibold text-on-surface block mb-1">
              Tipo de Registro Clínico *
            </label>
            <select
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs cursor-pointer font-medium"
              value={actType}
              onChange={(e) => {
                const val = e.target.value as any;
                setActType(val);
                if (val === 'medication_double_check') {
                  setDrugOrTitle('Omeprazol Sódico 40mg IV - Doble Chequeo');
                  setNotes('Doble chequeo conforme a protocolo de 5 correctos en cabecera.');
                } else if (val === 'shift_handover') {
                  setDrugOrTitle('Entrega y Recepción de Guardia Nocturna');
                  setNotes('Entrega conforme de 12 boxes, pendientes de interconsulta y reporte verbal.');
                } else if (val === 'narcotics_check') {
                  setDrugOrTitle('Cuadre de Fentanilo y Morfina en Carro de Paro');
                  setNotes('Recuento de estupefacientes sin discrepancias. Ampollas íntegras.');
                } else if (val === 'critical_alert') {
                  setDrugOrTitle('Intervención Preventiva Alergia / RAM');
                  setNotes('Bloqueo de prescripción no tolerada y validación de alternativa.');
                } else if (val === 'admission_validation') {
                  setDrugOrTitle('Validación Médica de Ingreso a Urgencias');
                  setNotes('Ingreso clínico ratificado y asignación de cuidados.');
                }
              }}
            >
              <option value="medication_double_check">💊 Doble Chequeo Farmacológico (Dosis Crítica / Vía EV)</option>
              <option value="shift_handover">🔄 Entrega y Recepción de Turno / Guardia</option>
              <option value="narcotics_check">🔐 Control y Cuadre de Estupefacientes</option>
              <option value="critical_alert">⚠️ Intervención / Bloqueo por Alerta Preventiva RAM</option>
              <option value="admission_validation">📋 Validación Médica de Ingreso a Urgencias</option>
            </select>
          </div>

          {/* Fármaco / Procedimiento y Paciente / Área */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Fármaco o Título del Acta *
              </label>
              <input
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                placeholder="Ej. Ceftriaxona 2g IV bolo"
                value={drugOrTitle}
                onChange={(e) => setDrugOrTitle(e.target.value)}
              />
              {errors.drugOrTitle && (
                <span className="text-error text-[11px] block mt-0.5">{errors.drugOrTitle}</span>
              )}
            </div>

            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Paciente o Área de Guardia *
              </label>
              <div className="relative">
                <input
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                  placeholder="Ej. Carlos Eduardo Méndez (Box 04)"
                  value={patientOrArea}
                  onChange={(e) => setPatientOrArea(e.target.value)}
                  list="patients-list"
                />
                <datalist id="patients-list">
                  {patients.map((p) => (
                    <option key={p.id} value={`${p.name} (${p.box})`} />
                  ))}
                  <option value="Guardia General Urgencias Boxes 01-12" />
                  <option value="Shock Room & Reanimación" />
                  <option value="Farmacia Satélite de Urgencias" />
                </datalist>
              </div>
              {errors.patientOrArea && (
                <span className="text-error text-[11px] block mt-0.5">{errors.patientOrArea}</span>
              )}
            </div>
          </div>

          {/* Firmante 1 (Titular) y Firmante 2 (Testigo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/15">
            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Profesional Titular (Firma 1) *
              </label>
              <select
                className="w-full h-10 px-3 bg-surface-container rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs cursor-pointer font-medium"
                value={signer1Id}
                onChange={(e) => {
                  setSigner1Id(e.target.value);
                  const found = dutyStaff.find((s) => s.id === e.target.value);
                  if (found) {
                    setSigner1CustomName(found.name);
                    setPin(found.digitalSignaturePin);
                  }
                }}
              >
                {dutyStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.role === 'doctor' ? '🩺' : '💉'} {staff.name} ({staff.professionalLicense})
                  </option>
                ))}
                <option value="custom">✍️ Otro profesional (Manual)</option>
              </select>
              {signer1Id === 'custom' && (
                <input
                  className="w-full h-9 px-3 mt-1.5 bg-surface-container rounded-xl text-on-surface border border-outline-variant/20 outline-none text-xs"
                  placeholder="Nombre y Registro del Titular"
                  value={signer1CustomName}
                  onChange={(e) => setSigner1CustomName(e.target.value)}
                />
              )}
            </div>

            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Profesional Testigo / Co-signatario *
              </label>
              <select
                className="w-full h-10 px-3 bg-surface-container rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs cursor-pointer font-medium"
                value={signer2Id}
                onChange={(e) => {
                  setSigner2Id(e.target.value);
                  const found = dutyStaff.find((s) => s.id === e.target.value);
                  if (found) {
                    setSigner2CustomName(found.name);
                  }
                }}
              >
                {dutyStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.role === 'doctor' ? '🩺' : '💉'} {staff.name} ({staff.professionalLicense})
                  </option>
                ))}
                <option value="custom">✍️ Otro profesional (Manual)</option>
              </select>
              {signer2Id === 'custom' && (
                <input
                  className="w-full h-9 px-3 mt-1.5 bg-surface-container rounded-xl text-on-surface border border-outline-variant/20 outline-none text-xs"
                  placeholder="Nombre y Registro del Testigo"
                  value={signer2CustomName}
                  onChange={(e) => setSigner2CustomName(e.target.value)}
                />
              )}
            </div>
          </div>

          {/* Hora y PIN de Verificación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Hora de Firma
              </label>
              <input
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs font-mono-metric"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold text-on-surface block mb-1 flex items-center justify-between">
                <span>PIN Digital del Firmante *</span>
                <span className="text-[10px] text-primary">Validación Criptográfica</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  className="w-full h-10 pl-3 pr-8 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs font-mono-metric tracking-widest font-bold"
                  placeholder="PIN 4 dígitos"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">
                  lock
                </span>
              </div>
              {errors.pin && <span className="text-error text-[11px] block mt-0.5">{errors.pin}</span>}
            </div>
          </div>

          {/* Observaciones Clínicas */}
          <div>
            <label className="font-semibold text-on-surface block mb-1">
              Constancia / Observaciones del Acto
            </label>
            <textarea
              rows={2}
              className="w-full p-2.5 bg-surface-container-low rounded-xl text-on-surface border border-outline-variant/20 outline-none focus:ring-1 focus:ring-primary/50 text-xs resize-none"
              placeholder="Detalles del doble chequeo, lote administrado, conteo físico o hallazgos..."
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
              <span className="material-symbols-outlined text-[17px]">verified</span>
              <span>Validar y Firmar Acta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
