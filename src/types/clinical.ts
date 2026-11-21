export interface Patient {
  id: string;
  name: string;
  nationalId: string;
  birthDate: string;
  age: number;
  gender: 'Masculino' | 'Femenino' | 'Otro';
  weightKg: number;
  box: string;
  bed: string;
  triageLevel: 'Triage I' | 'Triage II' | 'Triage III' | 'Triage IV';
  triageColor: 'error' | 'amber' | 'secondary' | 'primary';
  triageName: string;
  attendingDoctor: string;
  doctorSpecialty: string;
  doctorReg: string;
  avatarUrl: string;
  isQrVerified?: boolean;
  activeEpisodesCount: number;
  activePrescriptionsCount: number;
  allergies: Allergy[];
  vitals: VitalSigns;
  nextScheduledDrug?: {
    name: string;
    dose: string;
    route: string;
    inMinutes: number;
    timeStr: string;
    isOverdue?: boolean;
    urgencyText?: string;
  };
}

export interface Allergy {
  id: string;
  substance: string;
  riskLevel: number;
  riskName: string;
  reactionType: string;
  contraindicatedMeds: string[];
  notes: string;
}

export interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  oxygenSat: number;
  temperature: number;
  glucoseMgDl?: number;
  recordedAt: string;
}

export interface TimelineEpisode {
  id: string;
  type: 'active' | 'ram' | 'surgical' | 'chronic' | 'historical';
  category: 'urgencias' | 'ram' | 'quirurgico' | 'cronico' | 'farmacologico';
  title: string;
  badgeLabel: string;
  badgeType: 'primary' | 'error' | 'tertiary' | 'neutral' | 'secondary';
  dateStr: string;
  timeAgo: string;
  location: string;
  description: string;
  doctorName: string;
  doctorRole?: string;
  doctorReg?: string;
  doctorAvatarInitials?: string;
  vitals?: VitalSigns;
  emergencyManagement?: string;
  outcome?: string;
  actionButtonText?: string;
  biopsyOrNote?: string;
  actionUrl?: string;
}

export type MedicationRiskColor = 'red' | 'yellow' | 'green';

export interface MedicationRiskConfig {
  color: MedicationRiskColor;
  label: string;
  name: string;
  shortLabel: string;
  description: string;
  textClass: string;
  bgBadgeClass: string;
  borderClass: string;
  dotClass: string;
}

export const RISK_SEMAPHORE_CONFIGS: Record<MedicationRiskColor, MedicationRiskConfig> = {
  red: {
    color: 'red',
    label: 'ROJO',
    name: 'Medicamento de Alto Riesgo',
    shortLabel: 'Alto Riesgo',
    description: 'Medicamento de alto riesgo o alta complejidad.',
    textClass: 'text-red-600 dark:text-red-400 font-bold',
    bgBadgeClass: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30',
    borderClass: 'border-l-4 border-l-red-500',
    dotClass: 'bg-red-500 shadow-sm shadow-red-500/50',
  },
  yellow: {
    color: 'yellow',
    label: 'AMARILLO',
    name: 'Riesgo Moderado / Requiere Precaución',
    shortLabel: 'Riesgo Moderado',
    description: 'Medicamentos de riesgo moderado que requieren precaución.',
    textClass: 'text-amber-600 dark:text-amber-400 font-bold',
    bgBadgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    borderClass: 'border-l-4 border-l-amber-500',
    dotClass: 'bg-amber-500 shadow-sm shadow-amber-500/50',
  },
  green: {
    color: 'green',
    label: 'VERDE',
    name: 'Riesgo Habitual Bajo',
    shortLabel: 'Riesgo Habitual Bajo',
    description: 'Medicamentos de riesgo habitual bajo, que requieren manejo adecuado.',
    textClass: 'text-emerald-600 dark:text-emerald-400 font-bold',
    bgBadgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    borderClass: 'border-l-4 border-l-emerald-500',
    dotClass: 'bg-emerald-500 shadow-sm shadow-emerald-500/50',
  },
};

export function classifyDrugRisk(drugName: string, categoryOrClass?: string): MedicationRiskColor {
  const lower = `${drugName} ${categoryOrClass || ''}`.toLowerCase();

  // ROJO: Medicamentos de alto riesgo (según tabla clínica hospitalaria)
  // Insulina, Heparina, Cloruro de potasio concentrado, Sulfato de magnesio intravenoso, Drogas Vasoactivas, Morfina, Fentanilo
  if (
    lower.includes('insulina') ||
    lower.includes('heparina') ||
    lower.includes('enoxaparina') ||
    lower.includes('clexane') ||
    lower.includes('cloruro de potasio') ||
    lower.includes('potasio concentrado') ||
    lower.includes('kcl') ||
    lower.includes('sulfato de magnesio') ||
    lower.includes('magnesio intravenoso') ||
    lower.includes('mgso4') ||
    lower.includes('morfina') ||
    lower.includes('fentanilo') ||
    lower.includes('dopamina') ||
    lower.includes('noradrenalina') ||
    lower.includes('norepinefrina') ||
    lower.includes('adrenalina') ||
    lower.includes('propofol') ||
    lower.includes('midazolam') ||
    lower.includes('warfarina') ||
    lower.includes('alto riesgo')
  ) {
    return 'red';
  }

  // AMARILLO: Riesgo moderado / Requiere precaución (según tabla)
  // Ibuprofeno, Diclofenaco, Tramadol, Cefalosporinas, Antibióticos amplio espectro, Diuréticos, Corticoides
  if (
    lower.includes('tramadol') ||
    lower.includes('ibuprofeno') ||
    lower.includes('diclofenaco') ||
    lower.includes('ketorolaco') ||
    lower.includes('ceftriaxona') ||
    lower.includes('vancomicina') ||
    lower.includes('meropenem') ||
    lower.includes('levofloxacino') ||
    lower.includes('ciprofloxacino') ||
    lower.includes('amikacina') ||
    lower.includes('gentamicina') ||
    lower.includes('furosemida') ||
    lower.includes('hidrocortisona') ||
    lower.includes('metilprednisolona') ||
    lower.includes('dexametasona') ||
    lower.includes('amiodarona') ||
    lower.includes('digoxina') ||
    lower.includes('antibiótico') ||
    lower.includes('moderado') ||
    lower.includes('precaución') ||
    lower.includes('precaucion')
  ) {
    return 'yellow';
  }

  // VERDE: Riesgo habitual bajo (según tabla)
  // Paracetamol (acetaminofén), Loratadina, Omeprazol, Protectores gástricos, Cristaloides, Hidratación
  return 'green';
}

export function getMedicationRiskColor(med: MedicationOrder): MedicationRiskColor {
  if (med.riskColor) return med.riskColor;
  if (med.colorTag === 'error') return 'red';
  if (med.colorTag === 'amber') return 'yellow';
  return classifyDrugRisk(med.name, `${med.classification} ${med.categoryTag}`);
}

export interface AdministrationEvent {
  id: string;
  timestamp: string; // ej. "14:05"
  dateStr: string;   // ej. "07/11/2026"
  administeredBy: string; // ej. "Enf. María Rivas"
  scheduledFor: string;   // ej. "14:00"
  nextScheduled: string;  // ej. "22:00"
  notes?: string;
}

export interface MedicationOrder {
  id: string;
  name: string;
  commercialName: string;
  atcCode: string;
  classification: string;
  categoryTag: string;
  colorTag: 'purple' | 'primary' | 'secondary' | 'error' | 'amber';
  riskColor?: MedicationRiskColor; // Semáforo: 'red' | 'yellow' | 'green'
  dose: string;
  route: 'IV' | 'SC' | 'VO' | 'IM' | 'Topical';
  routeLabel: string;
  frequency: string;
  intervalHours?: number; // Formato de horario hospitalario: 4, 6, 8, 12, 24h (0 = Dosis única)
  dilution: string;
  infusionTime: string;
  lotNumber: string;
  expiryDate: string;
  isExpiringSoon?: boolean;
  expiryWarning?: string;
  status: 'active' | 'pending' | 'administered' | 'overdue' | 'recalled';
  scheduledTime: string; // Horario de la dosis actual (ej. "14:00")
  nextScheduledTime?: string; // Próxima hora o dosis proyectada (ej. "22:00")
  countdownMinutes?: number;
  lastAdministeredAt?: string; // Hora en que se cumplió la última dosis (ej. "14:05")
  lastAdministeredBy?: string; // Profesional que suministró la dosis
  dosesAdministeredCount?: number; // Cantidad de dosis cumplidas
  projectedSchedule?: string[]; // Esquema de horarios del ciclo (ej. ["06:00", "14:00", "22:00"])
  administrationHistory?: AdministrationEvent[]; // Historial de dosis administradas
  administeredAt?: string;
  administeredBy?: string;
  signatureId?: string;
  alertNote?: string;
  contraindications?: string[];
  reconstitutionStep?: string;
  dilutionStep?: string;
  commonSideEffects?: string[];
  severeSideEffects?: string[];
}

/**
 * Utilidades Clínicas para Formato de Horarios & Proyección de Próxima Dosis
 */

// Extrae el intervalo numérico en horas desde un texto de frecuencia
export function extractIntervalHours(frequency: string): number {
  if (!frequency) return 8;
  const lower = frequency.toLowerCase();

  if (lower.includes('stat') || lower.includes('única') || lower.includes('unica')) {
    return 0; // Dosis única
  }

  // Coincidencias tipo "Cada 8h", "c/6h", "c/ 12h"
  const match = lower.match(/(?:cada|c\/)\s*(\d+)\s*h/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }

  // Coincidencias tipo "8 horas", "12 horas"
  const numMatch = lower.match(/(\d+)\s*(?:horas|hora|h)/);
  if (numMatch && numMatch[1]) {
    return parseInt(numMatch[1], 10);
  }

  if (lower.includes('24h') || lower.includes('24 h') || lower.includes('diaria') || lower.includes('día')) return 24;
  if (lower.includes('12h') || lower.includes('12 h') || lower.includes('bid')) return 12;
  if (lower.includes('8h') || lower.includes('8 h') || lower.includes('tid')) return 8;
  if (lower.includes('6h') || lower.includes('6 h') || lower.includes('qid')) return 6;
  if (lower.includes('4h') || lower.includes('4 h')) return 4;

  return 8; // Intervalo estándar más común
}

// Convierte un string de hora a minutos acumulados del día (0-1439)
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 480; // 08:00 AM default
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const numOnly = clean.replace(/[^\d:]/g, '');
  const parts = numOnly.split(':');
  let hh = parseInt(parts[0] || '8', 10);
  const mm = parseInt(parts[1] || '0', 10);

  if (isPM && hh < 12) hh += 12;
  if (isAM && hh === 12) hh = 0;

  return ((hh % 24) * 60 + (mm % 60));
}

// Convierte minutos acumulados a formato horario hospitalario 24h "HH:mm"
export function formatMinutesToTime(minutes: number): string {
  const norm = ((minutes % 1440) + 1440) % 1440;
  const hh = Math.floor(norm / 60);
  const mm = norm % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

// Calcula la siguiente hora proyectada en base a la hora base y el intervalo
export function calculateNextDoseTime(baseTime: string, intervalHours: number): string {
  if (intervalHours <= 0) return 'Dosis Única';
  const currentMinutes = parseTimeToMinutes(baseTime);
  const nextMinutes = currentMinutes + intervalHours * 60;
  return formatMinutesToTime(nextMinutes);
}

// Genera el esquema de horarios proyectados para un ciclo completo de 24 horas
export function generateScheduleTimes(startTime: string, intervalHours: number): string[] {
  if (intervalHours <= 0 || intervalHours > 24) {
    return [formatMinutesToTime(parseTimeToMinutes(startTime))];
  }
  const times: string[] = [];
  const startMin = parseTimeToMinutes(startTime);
  const dosesPerDay = Math.floor(24 / intervalHours);
  for (let i = 0; i < dosesPerDay; i++) {
    times.push(formatMinutesToTime(startMin + i * intervalHours * 60));
  }
  return times;
}

export interface NursingLog {
  id: string;
  time: string;
  title: string;
  details: string;
  nurseName: string;
  type: 'vitals' | 'infusion' | 'shift_handover' | 'alert';
}

export interface DutyStaff {
  id: string;
  name: string;
  role: 'doctor' | 'nurse';
  specialtyOrRank: string; // ej. "Medicina Interna", "Enfermera Supervisora", "Médico Urgenciólogo"
  professionalLicense: string; // ej. "Reg. Méd. 48291", "Mat. Enf. 90214"
  shiftType: 'Nocturno' | 'Diurno' | 'Tarde' | 'Rotativo' | 'Refuerzo';
  shiftHours: string; // ej. "23:00 - 07:00", "07:00 - 15:00"
  assignedArea: string; // ej. "Boxes 01 - 06", "Boxes 07 - 12", "Shock Room", "Guardia General"
  digitalSignaturePin: string; // PIN de 4 dígitos para autorizaciones y doble chequeo
  status: 'active' | 'break' | 'delivered'; // Activo, En relevo/colación, Turno entregado
  checkInTime: string; // ej. "22:45"
  checkOutTime?: string;
  phoneContact?: string;
  isLead?: boolean; // Jefe de Guardia / Coordinador
  notes?: string;
}

export interface SignatureRecord {
  id: string;
  actType: 'medication_double_check' | 'shift_handover' | 'critical_alert' | 'narcotics_check' | 'admission_validation';
  drugOrTitle: string;
  patientOrArea: string;
  time: string;
  date: string;
  signer1Name: string;
  signer1Role: string;
  signer1License: string;
  signer2Name: string; // Testigo / Co-signatario
  signer2Role: string;
  signer2License?: string;
  pinVerified: boolean;
  hash: string;
  status: string;
  notes?: string;
}

