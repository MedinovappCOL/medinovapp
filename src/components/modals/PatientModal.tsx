import React, { useState, useEffect } from 'react';
import { Patient, Allergy } from '../../types/clinical';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patientData: Patient) => void;
  patientToEdit?: Patient | null;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patientToEdit,
}) => {
  const isEditing = !!patientToEdit;

  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [age, setAge] = useState<number>(45);
  const [birthDate, setBirthDate] = useState('15/05/1979');
  const [gender, setGender] = useState<'Masculino' | 'Femenino' | 'Otro'>('Masculino');
  const [weightKg, setWeightKg] = useState<number>(70);
  const [box, setBox] = useState('Box 05 Urgencias');
  const [bed, setBed] = useState('Cama 05-A');
  const [triageLevel, setTriageLevel] = useState<'Triage I' | 'Triage II' | 'Triage III' | 'Triage IV'>('Triage II');
  const [attendingDoctor, setAttendingDoctor] = useState('Dr. Alejandro Silva');
  const [doctorSpecialty, setDoctorSpecialty] = useState('Med. Interna');
  const [hasPenicillinAllergy, setHasPenicillinAllergy] = useState(false);
  const [hasNsaidAllergy, setHasNsaidAllergy] = useState(false);
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [heartRate, setHeartRate] = useState<number>(75);
  const [oxygenSat, setOxygenSat] = useState<number>(98);
  const [temperature, setTemperature] = useState<number>(36.8);

  useEffect(() => {
    if (patientToEdit) {
      setName(patientToEdit.name);
      setNationalId(patientToEdit.nationalId);
      setAge(patientToEdit.age);
      setBirthDate(patientToEdit.birthDate);
      setGender(patientToEdit.gender);
      setWeightKg(patientToEdit.weightKg);
      setBox(patientToEdit.box);
      setBed(patientToEdit.bed);
      setTriageLevel(patientToEdit.triageLevel);
      setAttendingDoctor(patientToEdit.attendingDoctor);
      setDoctorSpecialty(patientToEdit.doctorSpecialty);
      setBloodPressure(patientToEdit.vitals.bloodPressure);
      setHeartRate(patientToEdit.vitals.heartRate);
      setOxygenSat(patientToEdit.vitals.oxygenSat);
      setTemperature(patientToEdit.vitals.temperature);

      const hasPen = patientToEdit.allergies.some((a: Allergy) =>
        a.substance.toLowerCase().includes('penicilina')
      );
      const hasNsaid = patientToEdit.allergies.some((a: Allergy) =>
        a.substance.toLowerCase().includes('aine')
      );
      setHasPenicillinAllergy(hasPen);
      setHasNsaidAllergy(hasNsaid);
    } else {
      // Defaults for new patient
      setName('');
      setNationalId('');
      setAge(35);
      setBirthDate('10/10/1989');
      setGender('Masculino');
      setWeightKg(72);
      setBox('Box 08 Urgencias');
      setBed('Cama 08-A');
      setTriageLevel('Triage II');
      setAttendingDoctor('Dr. Alejandro Silva');
      setDoctorSpecialty('Med. Interna');
      setHasPenicillinAllergy(false);
      setHasNsaidAllergy(false);
      setBloodPressure('120/80');
      setHeartRate(78);
      setOxygenSat(98);
      setTemperature(36.7);
    }
  }, [patientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const allergies: Allergy[] = [];
    if (hasPenicillinAllergy) {
      allergies.push({
        id: `alg-${Date.now()}-1`,
        substance: 'Penicilinas y Derivados',
        riskLevel: 4,
        riskName: 'Nivel 4 / Riesgo Severo',
        reactionType: 'Riesgo de Anafilaxia / Urticaria',
        contraindicatedMeds: ['Amoxicilina', 'Ampicilina'],
        notes: 'Alerta documentada en sistema MAR.',
      });
    }
    if (hasNsaidAllergy) {
      allergies.push({
        id: `alg-${Date.now()}-2`,
        substance: 'AINEs (Antiinflamatorios)',
        riskLevel: 4,
        riskName: 'Nivel 4 / Riesgo Severo',
        reactionType: 'Broncoespasmo',
        contraindicatedMeds: ['Ketorolaco', 'Ibuprofeno', 'Dipirona'],
        notes: 'Contraindicación de infusión IV directa.',
      });
    }

    const triageColor =
      triageLevel === 'Triage I'
        ? 'error'
        : triageLevel === 'Triage II'
        ? 'amber'
        : 'secondary';

    const triageName =
      triageLevel === 'Triage I'
        ? 'Rojo - Reanimación / Crítico'
        : triageLevel === 'Triage II'
        ? 'Naranjo - Cuidados Intermedios'
        : 'Verde - Estable';

    const finalPatient: Patient = {
      id: patientToEdit ? patientToEdit.id : String(Date.now()),
      name: name.trim(),
      nationalId: nationalId.trim() || `1.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}`,
      birthDate,
      age: Number(age) || 40,
      gender,
      weightKg: Number(weightKg) || 70,
      box,
      bed,
      triageLevel,
      triageColor,
      triageName,
      attendingDoctor,
      doctorSpecialty,
      doctorReg: patientToEdit?.doctorReg || 'Reg. Méd. 48291',
      avatarUrl:
        patientToEdit?.avatarUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isQrVerified: true,
      activeEpisodesCount: patientToEdit ? patientToEdit.activeEpisodesCount : 1,
      activePrescriptionsCount: patientToEdit ? patientToEdit.activePrescriptionsCount : 0,
      allergies,
      vitals: {
        bloodPressure,
        heartRate: Number(heartRate) || 75,
        oxygenSat: Number(oxygenSat) || 98,
        temperature: Number(temperature) || 36.6,
        recordedAt: 'En turno',
      },
      nextScheduledDrug: patientToEdit?.nextScheduledDrug,
    };

    onSave(finalPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-md flex items-end sm:items-center justify-center p-2 sm:p-space-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-3.5 sm:p-space-lg max-w-xl w-full flex flex-col gap-space-sm border border-outline-variant/30 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[18px]">
                {isEditing ? 'edit' : 'person_add'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">
                {isEditing ? 'Editar Ficha del Paciente' : 'Ingresar Nuevo Paciente a Urgencias'}
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Gestión demográfica y asignación de Box clínico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm pt-1">
          {/* Identidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Nombre y Apellido *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Manuel Morales Castro"
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Cédula / DNI / Pasaporte *</label>
              <input
                type="text"
                required
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="Ej. 1.020.485.912"
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>
          </div>

          {/* Demografía */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Edad</label>
              <input
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Género</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="bg-surface-container-low px-2 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>
          </div>

          {/* Box, Cama & Triage */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Box</label>
              <select
                value={box}
                onChange={(e) => setBox(e.target.value)}
                className="bg-surface-container-low px-2 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const num = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
                  return (
                    <option key={num} value={`Box ${num} Urgencias`}>
                      Box {num}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Cama</label>
              <input
                type="text"
                value={bed}
                onChange={(e) => setBed(e.target.value)}
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Triage</label>
              <select
                value={triageLevel}
                onChange={(e) => setTriageLevel(e.target.value as any)}
                className="bg-surface-container-low px-2 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              >
                <option value="Triage I">Triage I (Rojo)</option>
                <option value="Triage II">Triage II (Naranjo)</option>
                <option value="Triage III">Triage III (Verde)</option>
              </select>
            </div>
          </div>

          {/* Médico Tratante */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Médico Tratante</label>
              <input
                type="text"
                value={attendingDoctor}
                onChange={(e) => setAttendingDoctor(e.target.value)}
                placeholder="Dr. Alejandro Silva"
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Especialidad</label>
              <input
                type="text"
                value={doctorSpecialty}
                onChange={(e) => setDoctorSpecialty(e.target.value)}
                placeholder="Med. Interna / Urgenciología"
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>
          </div>

          {/* Constantes Vitales de Ingreso */}
          <div className="p-2.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/15 flex flex-col gap-1.5">
            <span className="font-semibold text-on-surface text-[11px] uppercase tracking-wide">
              Signos Vitales de Ingreso
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-on-surface-variant block">PA (mmHg)</label>
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  className="w-full bg-surface-container-lowest px-2 py-1 rounded text-center border border-outline-variant/20 text-on-surface font-mono-metric"
                />
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant block">FC (lpm)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest px-2 py-1 rounded text-center border border-outline-variant/20 text-on-surface font-mono-metric"
                />
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant block">SpO2 (%)</label>
                <input
                  type="number"
                  value={oxygenSat}
                  onChange={(e) => setOxygenSat(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest px-2 py-1 rounded text-center border border-outline-variant/20 text-on-surface font-mono-metric"
                />
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant block">Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest px-2 py-1 rounded text-center border border-outline-variant/20 text-on-surface font-mono-metric"
                />
              </div>
            </div>
          </div>

          {/* Alergias Críticas Checkboxes */}
          <div className="p-2.5 rounded-xl bg-error-container/20 border border-error/20 flex flex-col gap-1.5">
            <span className="font-bold text-error text-[11px] uppercase tracking-wide">
              Alertas de Alergia Crítica
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPenicillinAllergy}
                  onChange={(e) => setHasPenicillinAllergy(e.target.checked)}
                  className="rounded text-error"
                />
                <span className="text-on-surface font-medium">Alergia a Penicilinas</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasNsaidAllergy}
                  onChange={(e) => setHasNsaidAllergy(e.target.checked)}
                  className="rounded text-error"
                />
                <span className="text-on-surface font-medium">Alergia a AINEs</span>
              </label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-outline-variant/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 sm:py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors cursor-pointer text-center touch-manipulation min-h-[40px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 sm:py-1.5 rounded-xl bg-primary hover:bg-surface-tint text-on-primary font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation min-h-[40px]"
            >
              <span className="material-symbols-outlined text-[17px]">save</span>
              <span>{isEditing ? 'Guardar Cambios' : 'Ingresar Paciente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
