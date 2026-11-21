import React, { useState } from 'react';
import { TimelineEpisode, Patient } from '../types/clinical';

interface ClinicalTimelineViewProps {
  patient: Patient;
  episodes: TimelineEpisode[];
  onOpenNewAntecedentModal: () => void;
  onEditEpisode: (episode: TimelineEpisode) => void;
  onDeleteEpisode: (episode: TimelineEpisode) => void;
  onViewProtocol: () => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
}

export const ClinicalTimelineView: React.FC<ClinicalTimelineViewProps> = ({
  patient,
  episodes,
  onOpenNewAntecedentModal,
  onEditEpisode,
  onDeleteEpisode,
  onViewProtocol,
  onShowToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('ep-1');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'urgencias', label: 'Urgencias' },
    { id: 'ram', label: 'Alergias / RAM' },
    { id: 'quirurgico', label: 'Quirúrgicos' },
    { id: 'cronico', label: 'Crónicos' },
  ];

  const filteredEpisodes = episodes.filter((ep) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'ram') return ep.type === 'ram' || ep.type === 'historical' || ep.category === 'ram';
    return ep.category === activeCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="max-w-6xl mx-auto w-full px-3 sm:px-space-md lg:px-space-xl py-3 sm:py-space-md">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-space-md items-start">
        {/* Left Column: Timeline Stream (8 cols) */}
        <section className="lg:col-span-8 flex flex-col gap-2.5 sm:gap-space-sm">
          {/* Header & Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-outline-variant/15">
            <div>
              <h2 className="font-title-sm text-base font-bold text-on-surface">
                Línea Temporal de Antecedentes
              </h2>
              <span className="text-xs text-on-surface-variant">
                {filteredEpisodes.length} eventos registrados para {patient.name}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={onOpenNewAntecedentModal}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-2 sm:py-1 rounded-xl shadow-xs hover:bg-surface-tint active:scale-95 transition-all cursor-pointer touch-manipulation min-h-[36px]"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>+ Registrar</span>
              </button>

              <div className="flex items-center gap-1 overflow-x-auto text-xs bg-surface-container-low p-1 rounded-xl border border-outline-variant/15 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-xs touch-manipulation whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Cards */}
          <div className="flex flex-col gap-2.5 pt-1">
            {filteredEpisodes.length === 0 ? (
              <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/20 text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-3xl mb-1 opacity-50">history_edu</span>
                <p>No hay eventos registrados en esta categoría.</p>
                <button
                  onClick={onOpenNewAntecedentModal}
                  className="mt-2 text-primary font-semibold hover:underline cursor-pointer"
                >
                  + Registrar primer antecedente
                </button>
              </div>
            ) : (
              filteredEpisodes.map((ep) => {
                const isRam = ep.type === 'ram' || ep.category === 'ram';
                const isActive = ep.type === 'active';
                const isExpanded = expandedId === ep.id;

                return (
                  <article
                    key={ep.id}
                    className={`p-3.5 sm:p-4 rounded-2xl bg-surface-container-lowest border transition-all ${
                      isRam ? 'border-error/30' : isActive ? 'border-primary/30' : 'border-outline-variant/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        onClick={() => toggleExpand(ep.id)}
                        className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0"
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                            isRam
                              ? 'bg-error text-on-error'
                              : isActive
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[17px]">
                            {isRam ? 'warning' : isActive ? 'emergency' : 'history'}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3
                            className={`font-title-sm text-sm font-bold truncate ${
                              isRam ? 'text-error' : 'text-on-surface'
                            }`}
                          >
                            {ep.title}
                          </h3>
                          <span className="text-xs text-on-surface-variant block mt-0.5 truncate">
                            {ep.dateStr.split('•')[0]} • {ep.timeAgo}
                          </span>
                        </div>
                      </div>

                      {/* CRUD Actions & Expand button */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onEditEpisode(ep)}
                          className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center cursor-pointer transition-colors touch-manipulation"
                          title="Editar antecedente"
                        >
                          <span className="material-symbols-outlined text-[17px]">edit</span>
                        </button>

                        <button
                          onClick={() => onDeleteEpisode(ep)}
                          className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 flex items-center justify-center cursor-pointer transition-colors touch-manipulation"
                          title="Eliminar antecedente"
                        >
                          <span className="material-symbols-outlined text-[17px]">delete</span>
                        </button>

                        <button
                          onClick={() => toggleExpand(ep.id)}
                          type="button"
                          className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-on-surface flex items-center justify-center cursor-pointer touch-manipulation"
                          aria-label="Expandir o colapsar detalle"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {isExpanded ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-outline-variant/15 flex flex-col gap-2.5 text-xs animate-in fade-in duration-150">
                        <p className="text-on-surface leading-relaxed">{ep.description}</p>

                        {ep.emergencyManagement && (
                          <div className="p-2.5 rounded-xl bg-error-container/20 text-error border border-error/20">
                            <strong>Manejo de Emergencia:</strong> {ep.emergencyManagement}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant flex-wrap gap-2">
                          <span>
                            Responsable: <strong className="text-on-surface">{ep.doctorName}</strong>
                          </span>
                          {isRam && (
                            <button
                              onClick={onViewProtocol}
                              className="text-error font-semibold hover:underline flex items-center gap-1 cursor-pointer py-1"
                            >
                              <span>Protocolo RAM</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* Right Column: Resumen Rápido (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-2.5 sm:gap-space-sm">
          {/* Action button */}
          <button
            onClick={onOpenNewAntecedentModal}
            className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-outline-variant/20 shadow-xs cursor-pointer touch-manipulation min-h-[40px]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">add_circle</span>
            <span>+ Registrar Nuevo Antecedente</span>
          </button>

          {/* Patológicos Personales Breves */}
          <div className="bg-surface-container-lowest p-3.5 sm:p-space-sm rounded-2xl border border-outline-variant/20 shadow-xs flex flex-col gap-2 text-xs">
            <span className="font-bold text-on-surface uppercase tracking-wider text-[11px] pb-1 border-b border-outline-variant/15">
              Patologías Personales
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-on-surface">Hipertensión Primaria</span>
                <span className="text-[10px] bg-secondary-container/50 text-on-secondary-container px-1.5 py-0.2 rounded font-medium">
                  Controlada
                </span>
              </div>
              <span className="text-on-surface-variant text-[11px]">Losartán 50mg/24h VO (Dr. Morales)</span>
            </div>
            <div className="flex flex-col gap-0.5 pt-1.5 border-t border-outline-variant/10">
              <span className="font-semibold text-on-surface">Hernia Discal L4-L5</span>
              <span className="text-on-surface-variant text-[11px]">Tratamiento kinesiológico motor</span>
            </div>
          </div>

          {/* Antecedentes Familiares & Hábitos */}
          <div className="bg-surface-container-lowest p-3.5 sm:p-space-sm rounded-2xl border border-outline-variant/20 shadow-xs flex flex-col gap-2 text-xs">
            <span className="font-bold text-on-surface uppercase tracking-wider text-[11px] pb-1 border-b border-outline-variant/15">
              Familiares &amp; Hábitos
            </span>
            <ul className="text-on-surface-variant text-[11px] space-y-1.5">
              <li>• <strong>Madre:</strong> Diabetes Mellitus tipo 2 y cardiopatía isquémica.</li>
              <li>• <strong>Padre:</strong> ACV isquémico (fallecido a los 68 años).</li>
              <li>• <strong>Tabaco:</strong> Ex-fumador (cesación hace 8 años, IPA 12).</li>
              <li>• <strong>Vacunación:</strong> Influenza y Neumococo al día.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
};
