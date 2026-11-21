import { Patient, MedicationOrder, TimelineEpisode, DutyStaff, SignatureRecord } from '../types/clinical';
import {
  PATIENTS,
  CARLOS_MEDICATIONS,
  ELENA_MEDICATIONS,
  SOFIA_MEDICATIONS,
  TIMELINE_EPISODES,
  DUTY_STAFF,
  INITIAL_SIGNATURE_RECORDS,
} from '../data/mockClinicalData';

const PATIENTS_STORAGE_KEY = 'medinova_patients_v1';
const MEDS_STORAGE_KEY_PREFIX = 'medinova_meds_v2_';
const EPISODES_STORAGE_KEY_PREFIX = 'medinova_episodes_v1_';
const STAFF_STORAGE_KEY = 'medinova_duty_staff_v1';
const SIGNATURES_STORAGE_KEY = 'medinova_signatures_v1';
const ACTIVE_STAFF_STORAGE_KEY = 'medinova_active_staff_id_v1';

export const storageService = {
  // --- PACIENTES ---
  getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(PATIENTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading patients from localStorage', e);
    }
    // Default fallback
    this.savePatients(PATIENTS);
    return PATIENTS;
  },

  savePatients(patients: Patient[]): void {
    try {
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
    } catch (e) {
      console.error('Error saving patients to localStorage', e);
    }
  },

  // --- MEDICAMENTOS POR PACIENTE ---
  getMedications(patientId: string): MedicationOrder[] {
    try {
      const key = `${MEDS_STORAGE_KEY_PREFIX}${patientId}`;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading medications from localStorage', e);
    }

    // Default fallback específico por paciente
    let defaults = CARLOS_MEDICATIONS;
    if (patientId === '52940182') {
      defaults = ELENA_MEDICATIONS;
    } else if (patientId === '1088231945') {
      defaults = SOFIA_MEDICATIONS;
    }

    this.saveMedications(patientId, defaults);
    return defaults;
  },

  saveMedications(patientId: string, meds: MedicationOrder[]): void {
    try {
      const key = `${MEDS_STORAGE_KEY_PREFIX}${patientId}`;
      localStorage.setItem(key, JSON.stringify(meds));
    } catch (e) {
      console.error('Error saving medications to localStorage', e);
    }
  },

  // --- ANTECEDENTES / TIMELINE POR PACIENTE ---
  getEpisodes(patientId: string): TimelineEpisode[] {
    try {
      const key = `${EPISODES_STORAGE_KEY_PREFIX}${patientId}`;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading episodes from localStorage', e);
    }

    // Default fallback for Carlos, or default empty list
    const defaults = patientId === '1020485912' ? TIMELINE_EPISODES : [];
    this.saveEpisodes(patientId, defaults);
    return defaults;
  },

  saveEpisodes(patientId: string, episodes: TimelineEpisode[]): void {
    try {
      const key = `${EPISODES_STORAGE_KEY_PREFIX}${patientId}`;
      localStorage.setItem(key, JSON.stringify(episodes));
    } catch (e) {
      console.error('Error saving episodes to localStorage', e);
    }
  },

  // --- PERSONAL EN TURNO (DOCTORES Y ENFERMERAS) ---
  getDutyStaff(): DutyStaff[] {
    try {
      const data = localStorage.getItem(STAFF_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading duty staff from localStorage', e);
    }
    this.saveDutyStaff(DUTY_STAFF);
    return DUTY_STAFF;
  },

  saveDutyStaff(staff: DutyStaff[]): void {
    try {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
    } catch (e) {
      console.error('Error saving duty staff to localStorage', e);
    }
  },

  getActiveStaffId(): string {
    try {
      const id = localStorage.getItem(ACTIVE_STAFF_STORAGE_KEY);
      if (id) return id;
    } catch (e) {
      console.warn('Error reading active staff id from localStorage', e);
    }
    return 'staff-1'; // Default: Enf. Jefa María Rivas
  },

  saveActiveStaffId(id: string): void {
    try {
      localStorage.setItem(ACTIVE_STAFF_STORAGE_KEY, id);
    } catch (e) {
      console.error('Error saving active staff id to localStorage', e);
    }
  },

  // --- LIBRO DE FIRMAS Y TRAZABILIDAD ---
  getSignatureRecords(): SignatureRecord[] {
    try {
      const data = localStorage.getItem(SIGNATURES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading signatures from localStorage', e);
    }
    this.saveSignatureRecords(INITIAL_SIGNATURE_RECORDS);
    return INITIAL_SIGNATURE_RECORDS;
  },

  saveSignatureRecords(records: SignatureRecord[]): void {
    try {
      localStorage.setItem(SIGNATURES_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Error saving signatures to localStorage', e);
    }
  },

  // Reset demo data
  resetAll(): void {
    try {
      localStorage.removeItem(PATIENTS_STORAGE_KEY);
      localStorage.removeItem(STAFF_STORAGE_KEY);
      localStorage.removeItem(SIGNATURES_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_STAFF_STORAGE_KEY);
      // Remove all prefix keys
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith(MEDS_STORAGE_KEY_PREFIX) ||
          key.startsWith(EPISODES_STORAGE_KEY_PREFIX)
        ) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  },
};

