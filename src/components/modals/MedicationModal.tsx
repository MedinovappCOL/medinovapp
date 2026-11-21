import React, { useState, useEffect } from 'react';
import {
  MedicationOrder,
  MedicationRiskColor,
  RISK_SEMAPHORE_CONFIGS,
  classifyDrugRisk,
  getMedicationRiskColor,
  extractIntervalHours,
  calculateNextDoseTime,
  generateScheduleTimes,
  formatMinutesToTime,
  parseTimeToMinutes,
} from '../../types/clinical';

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medData: MedicationOrder) => void;
  medToEdit?: MedicationOrder | null;
}

export const MedicationModal: React.FC<MedicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  medToEdit,
}) => {
  const isEditing = !!medToEdit;

  const [name, setName] = useState('');
  const [commercialName, setCommercialName] = useState('');
  const [dose, setDose] = useState('40 mg');
  const [route, setRoute] = useState<'IV' | 'SC' | 'VO' | 'IM' | 'Topical'>('IV');
  const [frequency, setFrequency] = useState('Cada 8h (c/8h)');
  const [intervalHours, setIntervalHours] = useState<number>(8);
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [dilution, setDilution] = useState('100 ml Solución Salina 0.9%');
  const [infusionTime, setInfusionTime] = useState('Bolo lento (15 min)');
  const [classification, setClassification] = useState('Protector gástrico / IBP');
  const [categoryTag, setCategoryTag] = useState('Gastro');
  const [colorTag, setColorTag] = useState<'purple' | 'primary' | 'secondary' | 'error' | 'amber'>('purple');
  const [riskColor, setRiskColor] = useState<MedicationRiskColor>('green');
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [lotNumber, setLotNumber] = useState('LT-8841-B');
  const [expiryDate, setExpiryDate] = useState('11/2026');
  const [alertNote, setAlertNote] = useState('');

  useEffect(() => {
    if (medToEdit) {
      setName(medToEdit.name);
      setCommercialName(medToEdit.commercialName);
      setDose(medToEdit.dose);
      setRoute(medToEdit.route);
      setFrequency(medToEdit.frequency);
      const interval = medToEdit.intervalHours ?? extractIntervalHours(medToEdit.frequency);
      setIntervalHours(interval);
      setScheduledTime(medToEdit.scheduledTime || '08:00');
      setDilution(medToEdit.dilution);
      setInfusionTime(medToEdit.infusionTime);
      setClassification(medToEdit.classification);
      setCategoryTag(medToEdit.categoryTag);
      setColorTag(medToEdit.colorTag);
      setRiskColor(getMedicationRiskColor(medToEdit));
      setIsManualOverride(true);
      setLotNumber(medToEdit.lotNumber);
      setExpiryDate(medToEdit.expiryDate);
      setAlertNote(medToEdit.alertNote || '');
    } else {
      setName('');
      setCommercialName('');
      setDose('1 g');
      setRoute('IV');
      setFrequency('Cada 8h (c/8h)');
      setIntervalHours(8);
      // Hora hospitalaria default proxima (redondeada a la siguiente hora)
      const now = new Date();
      const currentH = now.getHours();
      const nextH = (currentH + 1) % 24;
      setScheduledTime(`${String(nextH).padStart(2, '0')}:00`);
      setDilution('100 ml Solución Salina 0.9%');
      setInfusionTime('Perfusión en 30 min');
      setClassification('Antibiótico / Antimicrobiano');
      setCategoryTag('Antibiótico');
      setColorTag('secondary');
      setRiskColor('yellow');
      setIsManualOverride(false);
      setLotNumber(`LT-${Math.floor(1000 + Math.random() * 9000)}`);
      setExpiryDate('12/2026');
      setAlertNote('');
    }
  }, [medToEdit, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isManualOverride && val.trim().length >= 3) {
      const autoRisk = classifyDrugRisk(val, classification);
      setRiskColor(autoRisk);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let routeLabel = 'Vía Intravenosa (IV)';
    if (route === 'SC') routeLabel = 'Vía Subcutánea (SC)';
    if (route === 'VO') routeLabel = 'Vía Oral (VO)';
    if (route === 'IM') routeLabel = 'Vía Intramuscular (IM)';

    const calculatedNextDose = intervalHours > 0 ? calculateNextDoseTime(scheduledTime, intervalHours) : 'Dosis Única';
    const scheduleTimeline = generateScheduleTimes(scheduledTime, intervalHours);

    const finalMed: MedicationOrder = {
      id: medToEdit ? medToEdit.id : `med-${Date.now()}`,
      name: name.trim().toUpperCase(),
      commercialName: commercialName.trim() || name.trim(),
      atcCode: medToEdit?.atcCode || 'J01DD04',
      classification,
      categoryTag: categoryTag || 'Clínico',
      colorTag,
      riskColor,
      dose,
      route,
      routeLabel,
      frequency,
      intervalHours,
      scheduledTime,
      nextScheduledTime: calculatedNextDose,
      projectedSchedule: scheduleTimeline,
      dilution,
      infusionTime,
      lotNumber,
      expiryDate,
      status: medToEdit ? medToEdit.status : 'active',
      countdownMinutes: medToEdit?.countdownMinutes || 45,
      lastAdministeredAt: medToEdit?.lastAdministeredAt,
      lastAdministeredBy: medToEdit?.lastAdministeredBy,
      dosesAdministeredCount: medToEdit?.dosesAdministeredCount || 0,
      administrationHistory: medToEdit?.administrationHistory || [],
      alertNote: alertNote.trim() || undefined,
      reconstitutionStep:
        medToEdit?.reconstitutionStep ||
        'Reconstituir con solvente estéril adjunto de acuerdo al protocolo del fabricante.',
      dilutionStep:
        medToEdit?.dilutionStep ||
        `Diluir en ${dilution}. Administrar en ${infusionTime}.`,
      commonSideEffects: medToEdit?.commonSideEffects || ['Molestias gastrointestinales leves', 'Cefalea'],
      severeSideEffects: medToEdit?.severeSideEffects || ['Reacción de hipersensibilidad'],
    };

    onSave(finalMed);
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
                {isEditing ? 'edit' : 'add_circle'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">
                {isEditing ? 'Editar Orden Farmacológica' : 'Nueva Prescripción / Fármaco en Kárdex'}
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Doble verificación de posología y vía de administración
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
          {/* Nombre y Nombre comercial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Nombre Genérico (DCI) *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej. CEFTRIAXONA, PARACETAMOL, TRAMADOL"
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Nombre Comercial</label>
              <input
                type="text"
                value={commercialName}
                onChange={(e) => setCommercialName(e.target.value)}
                placeholder="Ej. Rocephin, Clexane, Losec"
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>
          </div>

          {/* SEMÁFORO INTELIGENTE DE RIESGO FARMACOLÓGICO */}
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <label className="font-bold text-on-surface flex items-center gap-1.5 text-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">traffic</span>
                <span>Semáforo Inteligente de Riesgo</span>
              </label>
              <span className="text-[10px] text-on-surface-variant font-medium">
                Clasificación clínica por colores
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* ROJO */}
              <button
                type="button"
                onClick={() => {
                  setRiskColor('red');
                  setIsManualOverride(true);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  riskColor === 'red'
                    ? 'bg-red-500/15 border-red-500 ring-1 ring-red-500 shadow-xs'
                    : 'bg-surface-container-lowest border-outline-variant/20 hover:border-red-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-red-600 dark:text-red-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
                  <span>ROJO</span>
                </div>
                <span className="text-[11px] leading-tight text-on-surface-variant font-medium">
                  Alto riesgo o alta complejidad
                </span>
              </button>

              {/* AMARILLO */}
              <button
                type="button"
                onClick={() => {
                  setRiskColor('yellow');
                  setIsManualOverride(true);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  riskColor === 'yellow'
                    ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500 shadow-xs'
                    : 'bg-surface-container-lowest border-outline-variant/20 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-600 dark:text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
                  <span>AMARILLO</span>
                </div>
                <span className="text-[11px] leading-tight text-on-surface-variant font-medium">
                  Riesgo moderado
                </span>
              </button>

              {/* VERDE */}
              <button
                type="button"
                onClick={() => {
                  setRiskColor('green');
                  setIsManualOverride(true);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  riskColor === 'green'
                    ? 'bg-emerald-500/15 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                    : 'bg-surface-container-lowest border-outline-variant/20 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                  <span>VERDE</span>
                </div>
                <span className="text-[11px] leading-tight text-on-surface-variant font-medium">
                  Menor riesgo (manejo adecuado)
                </span>
              </button>
            </div>

            {/* Vista previa de las letras con el color en el Kárdex */}
            <div className="mt-1 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant text-[11px]">Letras en Kárdex:</span>
              <div className="flex items-center gap-1.5">
                <span className={`font-mono-metric font-bold text-sm tracking-tight ${RISK_SEMAPHORE_CONFIGS[riskColor].textClass}`}>
                  {name.trim() || 'NOMBRE DEL FÁRMACO'} {dose}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${RISK_SEMAPHORE_CONFIGS[riskColor].bgBadgeClass}`}>
                  {RISK_SEMAPHORE_CONFIGS[riskColor].shortLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Dosis & Vía de Adm. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Dosis Farmacológica *</label>
              <input
                type="text"
                required
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="Ej. 1 g, 40 mg, 50 mg"
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Vía de Administración *</label>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value as any)}
                className="bg-surface-container-low px-2 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest font-medium"
              >
                <option value="IV">Intravenosa (IV) - Bolo / Infusión</option>
                <option value="SC">Subcutánea (SC) - Periumbilical</option>
                <option value="VO">Vía Oral (VO) - Comprimido / Jarabe</option>
                <option value="IM">Intramuscular (IM) - Glúteo / Deltoides</option>
                <option value="Topical">Tópica / Dérmica</option>
              </select>
            </div>
          </div>

          {/* PAUTA EN FORMATO DE HORARIO & FRECUENCIA HOSPITALARIA */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-on-surface flex items-center gap-1.5 text-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                <span>Frecuencia en Formato de Horario</span>
              </label>
              <span className="text-[10px] text-on-surface-variant font-medium">
                Pauta clínica estandarizada
              </span>
            </div>

            {/* Presets de Intervalo de Horario */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { label: 'Cada 4h', hours: 4, desc: '6 tomas / día' },
                { label: 'Cada 6h', hours: 6, desc: '4 tomas / día' },
                { label: 'Cada 8h', hours: 8, desc: '3 tomas / día' },
                { label: 'Cada 12h', hours: 12, desc: '2 tomas / día' },
                { label: 'Cada 24h', hours: 24, desc: '1 toma / día' },
                { label: 'Dosis Única', hours: 0, desc: 'STAT inmediata' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    setIntervalHours(opt.hours);
                    setFrequency(opt.hours === 0 ? 'Dosis única Stat' : `${opt.label} (${opt.desc})`);
                  }}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col ${
                    intervalHours === opt.hours
                      ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                      : 'bg-surface-container-lowest border-outline-variant/20 text-on-surface hover:border-primary/40'
                  }`}
                >
                  <span className="text-xs">{opt.label}</span>
                  <span className="text-[10px] text-on-surface-variant font-normal">{opt.desc}</span>
                </button>
              ))}
            </div>

            {/* Hora de Inicio & Ajuste de Texto de Frecuencia */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-outline-variant/15">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface text-[11px] flex items-center justify-between">
                  <span>Hora de Inicio / Dosis Actual (HH:mm)</span>
                  <span className="text-primary font-mono-metric font-bold">{scheduledTime}</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="time"
                    required
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="flex-1 bg-surface-container-lowest px-2.5 py-1.5 rounded-lg border border-outline-variant/25 text-on-surface font-mono-metric font-bold text-xs outline-none focus:border-primary"
                  />
                  <div className="flex items-center gap-1">
                    {['06:00', '08:00', '14:00', '22:00'].map((quickH) => (
                      <button
                        key={quickH}
                        type="button"
                        onClick={() => setScheduledTime(quickH)}
                        className={`px-1.5 py-1 text-[10px] rounded border font-mono-metric transition-colors cursor-pointer ${
                          scheduledTime === quickH
                            ? 'bg-primary text-on-primary border-primary font-bold'
                            : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/20 hover:text-on-surface'
                        }`}
                      >
                        {quickH}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface text-[11px]">
                  Glosa de Frecuencia / Indicación
                </label>
                <input
                  type="text"
                  value={frequency}
                  onChange={(e) => {
                    setFrequency(e.target.value);
                    const parsed = extractIntervalHours(e.target.value);
                    if (parsed !== intervalHours) {
                      setIntervalHours(parsed);
                    }
                  }}
                  placeholder="Ej. Cada 8h (06:00, 14:00, 22:00)"
                  className="bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/25 text-on-surface text-xs outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* TARJETA DE PROYECCIÓN DE LA SIGUIENTE HORA O DOSIS */}
            {(() => {
              const nextTime = intervalHours > 0 ? calculateNextDoseTime(scheduledTime, intervalHours) : 'Dosis Única';
              const dayTimes = generateScheduleTimes(scheduledTime, intervalHours);

              return (
                <div className="mt-1 p-2.5 rounded-xl bg-surface-container-lowest border border-primary/25 shadow-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">update</span>
                      <span>Proyección Automática de Dosis</span>
                    </span>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                      {intervalHours > 0 ? `Intervalo de ${intervalHours} horas` : 'Dosis Única'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/15">
                      <span className="text-[10px] text-on-surface-variant block">Hora Dosis Actual:</span>
                      <span className="font-mono-metric font-bold text-sm text-on-surface">
                        {scheduledTime}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <span className="text-[10px] text-primary block font-semibold">Siguiente Hora Proyectada:</span>
                      <span className="font-mono-metric font-extrabold text-sm text-primary">
                        {nextTime}
                      </span>
                    </div>
                  </div>

                  {intervalHours > 0 && dayTimes.length > 1 && (
                    <div className="pt-1 border-t border-outline-variant/15 flex flex-col gap-1">
                      <span className="text-[10px] text-on-surface-variant font-medium">
                        Horarios proyectados en el ciclo de 24 horas:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {dayTimes.map((t, idx) => (
                          <div
                            key={idx}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-mono-metric font-bold flex items-center gap-1 border ${
                              idx === 0
                                ? 'bg-primary text-on-primary border-primary'
                                : idx === 1
                                ? 'bg-secondary/15 text-secondary border-secondary/30'
                                : 'bg-surface-container-low text-on-surface border-outline-variant/20'
                            }`}
                          >
                            <span>{t}</span>
                            <span className="text-[9px] opacity-80 font-normal">
                              ({idx === 0 ? 'Actual' : idx === 1 ? 'Próxima' : `${idx + 1}ª`})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Horario de Infusión y Dilución */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Tiempo de Infusión</label>
              <input
                type="text"
                value={infusionTime}
                onChange={(e) => setInfusionTime(e.target.value)}
                placeholder="Ej. Bomba 200 ml/h (30 min), Bolo 5 min"
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Dilución y Vehículo</label>
              <input
                type="text"
                value={dilution}
                onChange={(e) => setDilution(e.target.value)}
                placeholder="Ej. 100 ml Solución Fisiológica 0.9%"
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>
          </div>

          {/* Lote y Vencimiento */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Lote Dispensario</label>
              <input
                type="text"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest font-mono-metric"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Caducidad</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/AAAA"
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest font-mono-metric"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Código de Color</label>
              <select
                value={colorTag}
                onChange={(e) => setColorTag(e.target.value as any)}
                className="bg-surface-container-low px-2 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              >
                <option value="purple">Púrpura (Gastro)</option>
                <option value="secondary">Verde (Antibiótico)</option>
                <option value="primary">Azul (Antitrombótico / HBPM)</option>
                <option value="error">Rojo (Opioide / Alto Riesgo)</option>
                <option value="amber">Ámbar (Diurético)</option>
              </select>
            </div>
          </div>

          {/* Alertas Farmacológicas / Notas */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-on-surface">Observaciones / Alertas MAR</label>
            <input
              type="text"
              value={alertNote}
              onChange={(e) => setAlertNote(e.target.value)}
              placeholder="Ej. Incompatible con soluciones de calcio. Verificar doble firma."
              className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
            />
          </div>

          {/* Botones */}
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
              <span>{isEditing ? 'Guardar Cambios' : 'Registrar en Kárdex'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
