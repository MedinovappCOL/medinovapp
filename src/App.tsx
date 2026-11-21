import React, { useState, useEffect } from 'react';
import { Sidebar, ViewTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomNavBar } from './components/layout/BottomNavBar';
import { PatientHeaderBar } from './components/patient/PatientHeaderBar';
import { AllergyBanner } from './components/patient/AllergyBanner';
import { PatientTabsNav, PatientSectionTab } from './components/patient/PatientTabsNav';
import { EmergencyDashboardView } from './views/EmergencyDashboardView';
import { ClinicalSummaryView } from './views/ClinicalSummaryView';
import { ClinicalTimelineView } from './views/ClinicalTimelineView';
import { KardexExpressView } from './views/KardexExpressView';
import { MedicationsView } from './views/MedicationsView';
import { BoxesView } from './views/BoxesView';
import { InteractionsView } from './views/InteractionsView';
import { SignaturesView } from './views/SignaturesView';
import { RamReportModal } from './components/modals/RamReportModal';
import { ProtocolModal } from './components/modals/ProtocolModal';
import { NewAntecedentModal } from './components/modals/NewAntecedentModal';
import { JustifyDelayModal } from './components/modals/JustifyDelayModal';
import { PatientModal } from './components/modals/PatientModal';
import { MedicationModal } from './components/modals/MedicationModal';
import { ConfirmDeleteModal } from './components/modals/ConfirmDeleteModal';
import { DutyStaffModal } from './components/modals/DutyStaffModal';
import { NewSignatureModal } from './components/modals/NewSignatureModal';
import { ToastNotification, ToastData } from './components/modals/ToastNotification';
import { storageService } from './services/storage';
import {
  Patient,
  MedicationOrder,
  TimelineEpisode,
  DutyStaff,
  SignatureRecord,
  AdministrationEvent,
  extractIntervalHours,
  calculateNextDoseTime,
  generateScheduleTimes,
} from './types/clinical';

export default function App() {
  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Local storage state initialization
  const [patients, setPatients] = useState<Patient[]>(() => storageService.getPatients());
  const [selectedPatientId, setSelectedPatientId] = useState<string>('1020485912');
  const [currentView, setCurrentView] = useState<ViewTab>('cuadro-de-mandos-urgencias');
  const [currentPatientTab, setCurrentPatientTab] = useState<PatientSectionTab>('antecedentes-clinicos');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [searchGlobalQuery, setSearchGlobalQuery] = useState<string>('');

  // Patient-specific state from storage
  const [medications, setMedications] = useState<MedicationOrder[]>(() =>
    storageService.getMedications(selectedPatientId)
  );
  const [episodes, setEpisodes] = useState<TimelineEpisode[]>(() =>
    storageService.getEpisodes(selectedPatientId)
  );

  // Modals state for CRUD
  const [patientModal, setPatientModal] = useState<{
    isOpen: boolean;
    patientToEdit: Patient | null;
  }>({ isOpen: false, patientToEdit: null });

  const [medicationModal, setMedicationModal] = useState<{
    isOpen: boolean;
    medToEdit: MedicationOrder | null;
  }>({ isOpen: false, medToEdit: null });

  const [antecedentModal, setAntecedentModal] = useState<{
    isOpen: boolean;
    episodeToEdit: TimelineEpisode | null;
  }>({ isOpen: false, episodeToEdit: null });

  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // Duty Staff & Signatures state from storage
  const [dutyStaff, setDutyStaff] = useState<DutyStaff[]>(() => storageService.getDutyStaff());
  const [signatureRecords, setSignatureRecords] = useState<SignatureRecord[]>(() => storageService.getSignatureRecords());
  const [activeStaffId, setActiveStaffId] = useState<string>(() => storageService.getActiveStaffId());

  // Modals for Staff & Signatures
  const [staffModal, setStaffModal] = useState<{
    isOpen: boolean;
    staffToEdit: DutyStaff | null;
  }>({ isOpen: false, staffToEdit: null });

  const [signatureModal, setSignatureModal] = useState<boolean>(false);

  // Other utility modals
  const [isRamModalOpen, setIsRamModalOpen] = useState(false);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [justifyDelayData, setJustifyDelayData] = useState<{
    isOpen: boolean;
    drugName: string;
    delay: string;
  }>({
    isOpen: false,
    drugName: '',
    delay: '',
  });

  // Toast notification
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (title: string, desc: string, icon?: string) => {
    setToast({ title, desc, icon });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // When patient selection changes, load their medications and episodes from storage
  useEffect(() => {
    setMedications(storageService.getMedications(selectedPatientId));
    setEpisodes(storageService.getEpisodes(selectedPatientId));
  }, [selectedPatientId]);

  // Current selected patient
  const currentPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0] || {
      id: 'default',
      name: 'Sin Paciente',
      nationalId: '0.000.000',
      birthDate: '01/01/1980',
      age: 40,
      gender: 'Masculino',
      weightKg: 70,
      box: 'Box 01 Urgencias',
      bed: 'Cama 01-A',
      triageLevel: 'Triage II',
      triageColor: 'amber',
      triageName: 'Naranjo',
      attendingDoctor: 'Dr. Alejandro Silva',
      doctorSpecialty: 'Med. Interna',
      doctorReg: '48291',
      avatarUrl: '',
      isQrVerified: true,
      activeEpisodesCount: 0,
      activePrescriptionsCount: 0,
      allergies: [],
      vitals: {
        bloodPressure: '120/80',
        heartRate: 75,
        oxygenSat: 98,
        temperature: 36.6,
        recordedAt: '03:00',
      },
    };

  // ----------------------------------------------------
  // CRUD PACIENTES (LocalStorage)
  // ----------------------------------------------------
  const handleSavePatient = (patientData: Patient) => {
    const existingIndex = patients.findIndex((p) => p.id === patientData.id);
    let updatedPatients: Patient[];

    if (existingIndex >= 0) {
      updatedPatients = [...patients];
      updatedPatients[existingIndex] = patientData;
      showToast('Paciente Actualizado', `Ficha clínica de ${patientData.name} guardada en localStorage.`, 'edit');
    } else {
      updatedPatients = [patientData, ...patients];
      showToast('Paciente Ingresado', `${patientData.name} asignado a ${patientData.box} (guardado local).`, 'person_add');
      setSelectedPatientId(patientData.id);
    }

    setPatients(updatedPatients);
    storageService.savePatients(updatedPatients);
  };

  const handleDeletePatient = (patient: Patient) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Dar de Alta / Retirar Paciente',
      message: `¿Está seguro de retirar a ${patient.name} (${patient.box}) de la estación de urgencias? Sus registros locales se eliminarán.`,
      onConfirm: () => {
        const remaining = patients.filter((p) => p.id !== patient.id);
        setPatients(remaining);
        storageService.savePatients(remaining);
        if (selectedPatientId === patient.id && remaining.length > 0) {
          setSelectedPatientId(remaining[0].id);
        }
        showToast('Paciente Retirado', `${patient.name} ha sido dado de alta / retirado de la guardia.`, 'delete');
      },
    });
  };

  // ----------------------------------------------------
  // CRUD MEDICAMENTOS (LocalStorage)
  // ----------------------------------------------------
  const handleSaveMedication = (medData: MedicationOrder) => {
    const existingIndex = medications.findIndex((m) => m.id === medData.id);
    let updatedMeds: MedicationOrder[];

    if (existingIndex >= 0) {
      updatedMeds = [...medications];
      updatedMeds[existingIndex] = medData;
      showToast('Prescripción Editada', `${medData.name} (${medData.dose}) actualizada en Kárdex.`, 'edit');
    } else {
      updatedMeds = [medData, ...medications];
      showToast('Fármaco Prescrito', `${medData.name} (${medData.dose}) agregado al Kárdex de ${currentPatient.name}.`, 'add_circle');
    }

    setMedications(updatedMeds);
    storageService.saveMedications(selectedPatientId, updatedMeds);
  };

  const handleDeleteMedication = (med: MedicationOrder) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Suspender Prescripción',
      message: `¿Desea suspender y eliminar la orden de ${med.name} (${med.dose}) del Kárdex de ${currentPatient.name}?`,
      onConfirm: () => {
        const remaining = medications.filter((m) => m.id !== med.id);
        setMedications(remaining);
        storageService.saveMedications(selectedPatientId, remaining);
        showToast('Orden Suspendida', `${med.name} retirada del Kárdex activo.`, 'delete');
      },
    });
  };

  const handleAdministerMedication = (medId: string) => {
    const target = medications.find((m) => m.id === medId);
    if (!target) return;

    // Profesional activo en guardia
    const currentStaff = dutyStaff.find((s) => s.id === activeStaffId) || dutyStaff[0];
    const staffName = currentStaff ? currentStaff.name : 'Enf. M. Rivas';

    // Hora actual del registro
    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Determinar intervalo de frecuencia
    const interval = target.intervalHours ?? extractIntervalHours(target.frequency);

    let updatedScheduledTime = target.scheduledTime;
    let updatedNextScheduledTime = target.nextScheduledTime;
    let updatedStatus: 'active' | 'pending' | 'administered' = 'administered';
    let updatedCountdown = 0;
    let toastMsg = '';

    if (interval > 0) {
      // INMEDIATAMENTE CALCULA EL HORARIO DE LA PRÓXIMA DOSIS
      // La dosis actual cumplida da paso al siguiente horario programado
      updatedScheduledTime = calculateNextDoseTime(target.scheduledTime || currentTimeStr, interval);
      updatedNextScheduledTime = calculateNextDoseTime(updatedScheduledTime, interval);
      updatedStatus = 'active';
      updatedCountdown = interval * 60;
      toastMsg = `Próxima dosis recalculada inmediatamente para las ${updatedScheduledTime} (en ${interval}h).`;
    } else {
      // Dosis única / STAT
      updatedStatus = 'administered';
      updatedNextScheduledTime = 'Completada';
      toastMsg = `Dosis única completada y firmada por ${staffName}.`;
    }

    const adminEvent: AdministrationEvent = {
      id: `adm-${Date.now()}`,
      timestamp: currentTimeStr,
      dateStr,
      administeredBy: staffName,
      scheduledFor: target.scheduledTime,
      nextScheduled: updatedScheduledTime,
      notes: `Dosis #${(target.dosesAdministeredCount || 0) + 1} administrada según protocolo MAR`,
    };

    const newHistory = [adminEvent, ...(target.administrationHistory || [])];
    const newCount = (target.dosesAdministeredCount || 0) + 1;

    // Registrar firma digital de turno en auditoría
    const newSignature: SignatureRecord = {
      id: `sig-${Date.now()}`,
      actType: 'medication_double_check',
      drugOrTitle: `${target.name} ${target.dose}`,
      patientOrArea: `${currentPatient.name} • ${currentPatient.box}`,
      time: currentTimeStr,
      date: dateStr,
      signer1Name: staffName,
      signer1Role: currentStaff ? currentStaff.specialtyOrRank : 'Enfermera de Turno',
      signer1License: currentStaff?.professionalLicense || 'Mat. Enf. 90214',
      signer2Name: 'Enf. Javier Arce (Testigo)',
      signer2Role: 'Co-firmante de Turno',
      signer2License: 'Reg. Enf. 81023',
      pinVerified: true,
      hash: `#MAR-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Validado',
      notes: `Dosis #${newCount} administrada. Próxima dosis: ${updatedScheduledTime}`,
    };
    const updatedSignatures = [newSignature, ...signatureRecords];
    setSignatureRecords(updatedSignatures);
    storageService.saveSignatureRecords(updatedSignatures);

    const updatedMeds = medications.map((med) => {
      if (med.id === medId) {
        return {
          ...med,
          status: updatedStatus,
          scheduledTime: updatedScheduledTime,
          nextScheduledTime: updatedNextScheduledTime,
          lastAdministeredAt: currentTimeStr,
          lastAdministeredBy: staffName,
          dosesAdministeredCount: newCount,
          countdownMinutes: updatedCountdown,
          administeredAt: `${currentTimeStr} (suministrado)`,
          administeredBy: staffName,
          signatureId: `#${Math.floor(10000 + Math.random() * 90000)}`,
          administrationHistory: newHistory,
        };
      }
      return med;
    });

    setMedications(updatedMeds);
    storageService.saveMedications(selectedPatientId, updatedMeds);

    showToast(
      '✅ Dosis Suministrada & Horario Recalculado',
      `${target.name}: ${toastMsg}`,
      'update'
    );
  };

  // ----------------------------------------------------
  // CRUD ANTECEDENTES (LocalStorage)
  // ----------------------------------------------------
  const handleSaveAntecedent = (data: {
    id?: string;
    title: string;
    category: any;
    description: string;
    doctor: string;
    year: string;
    emergencyManagement?: string;
  }) => {
    let updatedEpisodes: TimelineEpisode[];

    if (data.id) {
      // Edit existing
      updatedEpisodes = episodes.map((ep) => {
        if (ep.id === data.id) {
          return {
            ...ep,
            title: data.title,
            category: data.category,
            description: data.description,
            doctorName: data.doctor,
            dateStr: `${data.year} • Registro clínico`,
            emergencyManagement: data.emergencyManagement,
          };
        }
        return ep;
      });
      showToast('Antecedente Editado', `"${data.title}" actualizado en el historial.`, 'edit');
    } else {
      // Create new
      const newEp: TimelineEpisode = {
        id: `ep-${Date.now()}`,
        type: data.category === 'ram' ? 'ram' : 'chronic',
        category: data.category,
        title: data.title,
        badgeLabel: data.category === 'ram' ? 'RAM Notificada' : 'Registro Clínico',
        badgeType: data.category === 'ram' ? 'error' : 'primary',
        dateStr: `${data.year} • Servicio de Urgencias`,
        timeAgo: 'Reciente',
        location: 'Urgencias',
        description: data.description,
        doctorName: data.doctor,
        doctorRole: 'Médico',
        emergencyManagement: data.emergencyManagement,
      };
      updatedEpisodes = [newEp, ...episodes];
      showToast('Antecedente Registrado', `"${data.title}" incorporado a la cronología de ${currentPatient.name}.`, 'history_edu');
    }

    setEpisodes(updatedEpisodes);
    storageService.saveEpisodes(selectedPatientId, updatedEpisodes);
  };

  const handleDeleteEpisode = (episode: TimelineEpisode) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Eliminar Antecedente',
      message: `¿Está seguro de eliminar el registro de "${episode.title}" del historial clínico?`,
      onConfirm: () => {
        const remaining = episodes.filter((ep) => ep.id !== episode.id);
        setEpisodes(remaining);
        storageService.saveEpisodes(selectedPatientId, remaining);
        showToast('Antecedente Eliminado', `"${episode.title}" ha sido retirado de la línea de tiempo.`, 'delete');
      },
    });
  };

  // Reset to default demo data
  const handleResetDemoData = () => {
    storageService.resetAll();
    const defaultPatients = storageService.getPatients();
    setPatients(defaultPatients);
    setSelectedPatientId('1020485912');
    setMedications(storageService.getMedications('1020485912'));
    setEpisodes(storageService.getEpisodes('1020485912'));
    const defaultStaff = storageService.getDutyStaff();
    setDutyStaff(defaultStaff);
    setActiveStaffId(storageService.getActiveStaffId());
    setSignatureRecords(storageService.getSignatureRecords());
    showToast('Datos Restablecidos', 'Base de datos local restaurada a valores iniciales de demostración.', 'refresh');
  };

  // ----------------------------------------------------
  // CRUD PERSONAL DE TURNO (DOCTORES Y ENFERMERAS)
  // ----------------------------------------------------
  const handleSaveStaff = (staffData: DutyStaff) => {
    const existingIndex = dutyStaff.findIndex((s) => s.id === staffData.id);
    let updatedStaff: DutyStaff[];

    if (existingIndex >= 0) {
      updatedStaff = [...dutyStaff];
      updatedStaff[existingIndex] = staffData;
      showToast('Profesional Actualizado', `${staffData.name} (${staffData.specialtyOrRank}) actualizado en turno.`, 'badge');
    } else {
      updatedStaff = [staffData, ...dutyStaff];
      showToast('Profesional Registrado', `${staffData.name} incorporado(a) a la guardia activa (${staffData.shiftHours}).`, 'person_add');
    }

    setDutyStaff(updatedStaff);
    storageService.saveDutyStaff(updatedStaff);
  };

  const handleDeleteStaff = (staff: DutyStaff) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Retirar Profesional de Guardia',
      message: `¿Desea retirar a ${staff.name} (${staff.professionalLicense}) del registro del turno actual?`,
      onConfirm: () => {
        const remaining = dutyStaff.filter((s) => s.id !== staff.id);
        setDutyStaff(remaining);
        storageService.saveDutyStaff(remaining);
        if (activeStaffId === staff.id && remaining.length > 0) {
          setActiveStaffId(remaining[0].id);
          storageService.saveActiveStaffId(remaining[0].id);
        }
        showToast('Profesional Retirado', `${staff.name} ha sido retirado de la guardia.`, 'delete');
      },
    });
  };

  const handleToggleStaffStatus = (staffId: string) => {
    const updated = dutyStaff.map((s) => {
      if (s.id === staffId) {
        const nextStatus = s.status === 'active' ? ('delivered' as const) : ('active' as const);
        return {
          ...s,
          status: nextStatus,
          checkOutTime: nextStatus === 'delivered' ? '07:00' : undefined,
        };
      }
      return s;
    });
    setDutyStaff(updated);
    storageService.saveDutyStaff(updated);
    const target = dutyStaff.find((s) => s.id === staffId);
    showToast(
      'Estado de Turno Actualizado',
      `${target?.name || 'Profesional'}: ${target?.status === 'active' ? 'Turno Entregado / Finalizado' : 'Reactivado en Guardia'}`,
      'schedule'
    );
  };

  const handleSelectActiveStaff = (staffId: string) => {
    setActiveStaffId(staffId);
    storageService.saveActiveStaffId(staffId);
  };

  // ----------------------------------------------------
  // CRUD LIBRO DE FIRMAS Y TRAZABILIDAD
  // ----------------------------------------------------
  const handleSaveSignature = (record: SignatureRecord) => {
    const updated = [record, ...signatureRecords];
    setSignatureRecords(updated);
    storageService.saveSignatureRecords(updated);
    showToast('Acta Firmada Digitalmente', `${record.drugOrTitle} guardado con sello criptográfico ${record.hash.substring(0, 16)}.`, 'verified');
  };

  const handleDeleteSignature = (record: SignatureRecord) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Eliminar Registro de Firma',
      message: `¿Desea anular y eliminar el registro "${record.drugOrTitle}" (${record.time}) del libro de firmas?`,
      onConfirm: () => {
        const remaining = signatureRecords.filter((r) => r.id !== record.id);
        setSignatureRecords(remaining);
        storageService.saveSignatureRecords(remaining);
        showToast('Registro Eliminado', 'Acta retirada del libro local de firmas.', 'delete');
      },
    });
  };

  const handleSelectPatient = (
    patientId: string,
    targetTab?: PatientSectionTab
  ) => {
    setSelectedPatientId(patientId);
    setCurrentView('administracion-mar');
    if (targetTab) {
      setCurrentPatientTab(targetTab);
    } else {
      setCurrentPatientTab('resumen-clinico');
    }
  };

  const handleOpenKardex = () => {
    setCurrentView('kardex-express');
    setCurrentPatientTab('kardex-control');
  };

  const handleRamSubmit = (report: { drug: string; severity: string; symptoms: string }) => {
    // Add as RAM episode
    const ramEp: TimelineEpisode = {
      id: `ep-ram-${Date.now()}`,
      type: 'ram',
      category: 'ram',
      title: `Alerta RAM: ${report.drug}`,
      badgeLabel: report.severity.split(' - ')[0] || 'Alerta RAM',
      badgeType: 'error',
      dateStr: 'Hoy • Farmacovigilancia Urgencias',
      timeAgo: 'Hace momentos',
      location: 'Urgencias',
      description: report.symptoms,
      doctorName: 'Enf. Jefa María Rivas',
      doctorRole: 'Notificador RAM',
    };
    const updated = [ramEp, ...episodes];
    setEpisodes(updated);
    storageService.saveEpisodes(selectedPatientId, updated);

    showToast(
      'Acta RAM Registrada',
      `Alerta preventiva activada para ${report.drug}. Guardado en localStorage.`,
      'crisis_alert'
    );
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface flex flex-col transition-colors">
      {/* Sidebar Navigation (Desktop fixed + Mobile slide-over drawer) */}
      <Sidebar
        currentView={currentView}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onSelectView={(view) => {
          setCurrentView(view);
          if (view === 'administracion-mar') {
            setCurrentPatientTab('resumen-clinico');
          } else if (view === 'kardex-express') {
            setCurrentPatientTab('kardex-control');
          }
        }}
      />

      {/* Main Content Area: Responsive pl-0 on mobile, pl-64 on desktop, pb-20 on mobile for BottomBar */}
      <div className="pl-0 md:pl-64 flex flex-col min-h-screen pb-20 md:pb-6 transition-all">
        {/* Top Header */}
        <Header
          onOpenKardex={handleOpenKardex}
          onSearchChange={(q) => setSearchGlobalQuery(q)}
          searchQuery={searchGlobalQuery}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onOpenNotifications={() => setIsProtocolModalOpen(true)}
          onResetDemoData={handleResetDemoData}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          activeStaffName={dutyStaff.find(s => s.id === activeStaffId)?.name}
          activeStaffRole={dutyStaff.find(s => s.id === activeStaffId)?.specialtyOrRank}
          onNavigateToShifts={() => setCurrentView('trazabilidad-y-firmas')}
        />

        {/* Dynamic Main Body */}
        <main className="w-full pt-14 bg-surface min-h-[calc(100vh-3.5rem)] flex-1">
          {/* VIEW 1: Panel Urgencias (Cuadro de mandos con CRUD de pacientes) */}
          {currentView === 'cuadro-de-mandos-urgencias' && (
            <EmergencyDashboardView
              patients={patients}
              onSelectPatient={handleSelectPatient}
              onOpenNewPatientModal={() => setPatientModal({ isOpen: true, patientToEdit: null })}
              onEditPatient={(patient) => setPatientModal({ isOpen: true, patientToEdit: patient })}
              onDeletePatient={handleDeletePatient}
              onShowToast={showToast}
            />
          )}

          {/* VIEW 2: Patient Workspace (MAR / Resumen / Antecedentes / Medicamentos / Kárdex) */}
          {currentView === 'administracion-mar' && (
            <div className="flex flex-col w-full pb-space-xl">
              {/* Patient Context Bar with Edit Option */}
              <PatientHeaderBar
                patient={currentPatient}
                onOpenKardex={handleOpenKardex}
                onReportRam={() => setIsRamModalOpen(true)}
                onEditPatient={(p) => setPatientModal({ isOpen: true, patientToEdit: p })}
              />

              {/* Allergy Warning Banner if patient has allergies */}
              {currentPatient.allergies.length > 0 && (
                <AllergyBanner
                  allergies={currentPatient.allergies}
                  onViewProtocol={() => setIsProtocolModalOpen(true)}
                />
              )}

              {/* Patient Navigation Segmented Control */}
              <PatientTabsNav
                currentTab={currentPatientTab}
                onSelectTab={(tab) => setCurrentPatientTab(tab)}
                allergiesCount={currentPatient.allergies.length}
              />

              {/* Sub-tab Views */}
              {currentPatientTab === 'resumen-clinico' && (
                <ClinicalSummaryView
                  patient={currentPatient}
                  onOpenKardex={handleOpenKardex}
                  onReportRam={() => setIsRamModalOpen(true)}
                  onSelectTab={(tab) => setCurrentPatientTab(tab)}
                  onShowToast={showToast}
                />
              )}

              {(currentPatientTab === 'antecedentes-clinicos' ||
                currentPatientTab === 'historia-clinica') && (
                <ClinicalTimelineView
                  patient={currentPatient}
                  episodes={episodes}
                  onOpenNewAntecedentModal={() =>
                    setAntecedentModal({ isOpen: true, episodeToEdit: null })
                  }
                  onEditEpisode={(ep) =>
                    setAntecedentModal({ isOpen: true, episodeToEdit: ep })
                  }
                  onDeleteEpisode={handleDeleteEpisode}
                  onViewProtocol={() => setIsProtocolModalOpen(true)}
                  onShowToast={showToast}
                />
              )}

              {currentPatientTab === 'kardex-control' && (
                <KardexExpressView
                  patient={currentPatient}
                  medications={medications}
                  onAdministerDrug={handleAdministerMedication}
                  onOpenNewMedModal={() => setMedicationModal({ isOpen: true, medToEdit: null })}
                  onEditMed={(med) => setMedicationModal({ isOpen: true, medToEdit: med })}
                  onDeleteMed={handleDeleteMedication}
                  onShowToast={showToast}
                  onOpenJustifyModal={(drugName, delay) =>
                    setJustifyDelayData({ isOpen: true, drugName, delay })
                  }
                  onOpenDrugDetail={() => {
                    setCurrentPatientTab('medicamentos');
                  }}
                />
              )}

              {currentPatientTab === 'medicamentos' && (
                <MedicationsView
                  patient={currentPatient}
                  medications={medications}
                  onOpenNewMedModal={() => setMedicationModal({ isOpen: true, medToEdit: null })}
                  onEditMed={(med) => setMedicationModal({ isOpen: true, medToEdit: med })}
                  onDeleteMed={handleDeleteMedication}
                  onAdministerDrug={handleAdministerMedication}
                  onShowToast={showToast}
                />
              )}

              {currentPatientTab === 'alergias' && (
                <div className="max-w-6xl mx-auto w-full px-space-md lg:px-space-xl py-space-md flex flex-col gap-space-md">
                  <div className="p-space-md rounded-xl bg-surface-container-lowest border border-error/30 shadow-xs flex flex-col gap-space-sm text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-outline-variant/15">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-error text-[22px]">
                          crisis_alert
                        </span>
                        <h2 className="font-bold text-sm text-on-surface">
                          Registro de Alergias &amp; Farmacovigilancia
                        </h2>
                      </div>
                      <button
                        onClick={() => setIsRamModalOpen(true)}
                        className="bg-error text-on-error px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-error/90 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        + Reportar Nueva RAM
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                      {currentPatient.allergies.length === 0 ? (
                        <p className="text-on-surface-variant p-4">El paciente no tiene alergias documentadas.</p>
                      ) : (
                        currentPatient.allergies.map((allergy) => (
                          <div
                            key={allergy.id}
                            className="p-3 rounded-xl bg-error-container/20 border border-error/25 flex flex-col gap-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-error">{allergy.substance}</span>
                              <span className="bg-error text-on-error text-[10px] font-bold px-2 py-0.2 rounded-full">
                                {allergy.riskName}
                              </span>
                            </div>
                            <span className="text-on-surface font-semibold text-[11px]">
                              Reacción: {allergy.reactionType}
                            </span>
                            <div className="p-2 bg-surface-container-lowest rounded text-[11px]">
                              <strong className="text-error">Contraindicaciones:</strong>{' '}
                              {allergy.contraindicatedMeds.join(', ')}
                            </div>
                            <p className="text-on-surface-variant text-[11px]">{allergy.notes}</p>
                            <button
                              onClick={() => setIsProtocolModalOpen(true)}
                              className="text-primary hover:underline font-semibold self-start mt-0.5"
                            >
                              Ver Protocolo &gt;
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: Kárdex Express Dedicated Screen */}
          {currentView === 'kardex-express' && (
            <div className="flex flex-col w-full pb-space-xl">
              <KardexExpressView
                patient={currentPatient}
                medications={medications}
                onAdministerDrug={handleAdministerMedication}
                onOpenNewMedModal={() => setMedicationModal({ isOpen: true, medToEdit: null })}
                onEditMed={(med) => setMedicationModal({ isOpen: true, medToEdit: med })}
                onDeleteMed={handleDeleteMedication}
                onShowToast={showToast}
                onOpenJustifyModal={(drugName, delay) =>
                  setJustifyDelayData({ isOpen: true, drugName, delay })
                }
                onOpenDrugDetail={() => {
                  setCurrentView('administracion-mar');
                  setCurrentPatientTab('medicamentos');
                }}
              />
            </div>
          )}

          {/* VIEW 4: Boxes 01-12 Ward Overview */}
          {currentView === 'pacientes-y-boxes' && (
            <BoxesView
              patients={patients}
              onSelectPatient={(id) => handleSelectPatient(id, 'resumen-clinico')}
            />
          )}

          {/* VIEW 5: Interacciones y Alertas Farmacológicas */}
          {currentView === 'alertas-e-interacciones' && (
            <InteractionsView
              onShowToast={showToast}
              onViewProtocol={() => setIsProtocolModalOpen(true)}
            />
          )}

          {/* VIEW 6: Firmas y Turnos */}
          {currentView === 'trazabilidad-y-firmas' && (
            <SignaturesView
              dutyStaff={dutyStaff}
              signatureRecords={signatureRecords}
              activeStaffId={activeStaffId}
              onSelectActiveStaff={handleSelectActiveStaff}
              onOpenNewStaffModal={() => setStaffModal({ isOpen: true, staffToEdit: null })}
              onEditStaff={(staff) => setStaffModal({ isOpen: true, staffToEdit: staff })}
              onDeleteStaff={handleDeleteStaff}
              onToggleStaffStatus={handleToggleStaffStatus}
              onOpenNewSignatureModal={() => setSignatureModal(true)}
              onDeleteSignature={handleDeleteSignature}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* MODALS CRUD */}

      {/* 1. Modal Paciente (Crear / Editar) */}
      <PatientModal
        isOpen={patientModal.isOpen}
        onClose={() => setPatientModal({ isOpen: false, patientToEdit: null })}
        onSave={handleSavePatient}
        patientToEdit={patientModal.patientToEdit}
      />

      {/* 2. Modal Medicamento (Crear / Editar) */}
      <MedicationModal
        isOpen={medicationModal.isOpen}
        onClose={() => setMedicationModal({ isOpen: false, medToEdit: null })}
        onSave={handleSaveMedication}
        medToEdit={medicationModal.medToEdit}
      />

      {/* 3. Modal Antecedente (Crear / Editar) */}
      <NewAntecedentModal
        isOpen={antecedentModal.isOpen}
        onClose={() => setAntecedentModal({ isOpen: false, episodeToEdit: null })}
        onSave={handleSaveAntecedent}
        episodeToEdit={antecedentModal.episodeToEdit}
      />

      {/* 4. Modal Confirmación de Eliminación */}
      <ConfirmDeleteModal
        isOpen={confirmDelete.isOpen}
        title={confirmDelete.title}
        message={confirmDelete.message}
        onConfirm={confirmDelete.onConfirm}
        onClose={() => setConfirmDelete((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* 5. Modal Personal de Turno (Doctores y Enfermeras) */}
      <DutyStaffModal
        isOpen={staffModal.isOpen}
        onClose={() => setStaffModal({ isOpen: false, staffToEdit: null })}
        onSave={handleSaveStaff}
        staffToEdit={staffModal.staffToEdit}
      />

      {/* 6. Modal Nueva Firma / Acta */}
      <NewSignatureModal
        isOpen={signatureModal}
        onClose={() => setSignatureModal(false)}
        onSave={handleSaveSignature}
        dutyStaff={dutyStaff}
        patients={patients}
      />

      {/* Other Clinical Modals */}
      <RamReportModal
        isOpen={isRamModalOpen}
        onClose={() => setIsRamModalOpen(false)}
        onSubmit={handleRamSubmit}
        patientName={currentPatient.name}
      />

      <ProtocolModal
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
      />

      <JustifyDelayModal
        isOpen={justifyDelayData.isOpen}
        drugName={justifyDelayData.drugName}
        delayText={justifyDelayData.delay}
        onClose={() =>
          setJustifyDelayData({ isOpen: false, drugName: '', delay: '' })
        }
        onConfirm={() => {
          showToast('Dosis Autorizada', 'Dosis atrasada justificada y firmada.', 'check_circle');
        }}
      />

      {/* Mobile Bottom Navigation Bar (Apple HIG ergonomics) */}
      <BottomNavBar
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          if (view === 'administracion-mar') {
            setCurrentPatientTab('resumen-clinico');
          } else if (view === 'kardex-express') {
            setCurrentPatientTab('kardex-control');
          }
        }}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Toast Notification */}
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
