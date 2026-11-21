import React from 'react';

interface ProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProtocolModal: React.FC<ProtocolModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-md flex items-end sm:items-center justify-center p-2 sm:p-space-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-4 sm:p-space-xl max-w-2xl w-full flex flex-col gap-3 sm:gap-space-md border border-error/30 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-error text-on-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                Protocolo Clínico: Anafilaxia & Alergias Severas
              </h3>
              <span className="font-label-sm text-label-sm text-error font-semibold uppercase tracking-wider">
                Código de Emergencia HIG-URG-04 / Bloqueo Absoluto
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-space-md font-body-sm text-body-sm text-on-surface">
          <div className="p-space-md rounded-xl bg-error-container/30 border border-error/30 flex flex-col gap-1">
            <span className="font-title-sm text-title-sm font-bold text-error">
              1. Medidas Inmediatas de Primer Minuto
            </span>
            <ul className="list-disc pl-5 space-y-1 text-on-surface">
              <li>
                <strong>Detener infusión inmediatamente</strong> en caso de estar pasando cualquier fármaco. Mantener vía permeable con Solución Fisiológica 0.9%.
              </li>
              <li>
                <strong>Adrenalina (Epinefrina) 1:1000 (1 mg/mL):</strong> Administrar <strong>0.5 mg IM</strong> en cara anterolateral del muslo (vasto externo). Repetir cada 5-15 min según respuesta hemodinámica.
              </li>
              <li>
                <strong>Posición:</strong> Trendelenburg o decúbito supino con elevación de miembros inferiores si no hay dificultad respiratoria extrema.
              </li>
            </ul>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
            <span className="font-title-sm text-title-sm font-bold text-on-surface">
              2. Soporte de Vía Aérea y Oxigenoterapia
            </span>
            <p className="text-on-surface-variant">
              Administrar oxígeno a alto flujo mediante mascarilla con reservorio (10-15 L/min). Preparar equipo de intubación orotraqueal o cricotiroidotomía en caso de estridor laríngeo progresivo.
            </p>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
            <span className="font-title-sm text-title-sm font-bold text-on-surface">
              3. Fármacos de Segunda Línea (Tras Estabilización)
            </span>
            <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
              <li><strong>Corticoides:</strong> Hidrocortisona 200 mg IV o Metilprednisolona 1-2 mg/kg IV para prevenir reacciones bifásicas.</li>
              <li><strong>Antihistamínicos:</strong> Clorfenamina 10 mg IV o Difenhidramina 25-50 mg IV lento.</li>
              <li><strong>Broncodilatadores:</strong> Salbutamol 2.5-5 mg nebulizado con O2 si broncoespasmo refractario.</li>
            </ul>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Acta de Farmacovigilancia y Brazalete Rojo colocados
              </span>
            </div>
            <span className="font-mono-metric text-label-sm text-on-surface-variant">Revisión: 2024</span>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-outline-variant/20">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:bg-surface-tint active:scale-95 transition-all text-center touch-manipulation min-h-[40px]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
