import React from 'react';

export type PatientSectionTab =
  | 'resumen-clinico'
  | 'historia-clinica'
  | 'antecedentes-clinicos'
  | 'alergias'
  | 'medicamentos'
  | 'kardex-control';

interface PatientTabsNavProps {
  currentTab: PatientSectionTab;
  onSelectTab: (tab: PatientSectionTab) => void;
  allergiesCount?: number;
}

export const PatientTabsNav: React.FC<PatientTabsNavProps> = ({
  currentTab,
  onSelectTab,
  allergiesCount = 2,
}) => {
  const tabs = [
    { id: 'resumen-clinico' as PatientSectionTab, label: 'Resumen', icon: 'dashboard' },
    { id: 'antecedentes-clinicos' as PatientSectionTab, label: 'Antecedentes', icon: 'timeline' },
    { id: 'medicamentos' as PatientSectionTab, label: 'Medicamentos', icon: 'medication' },
    { id: 'kardex-control' as PatientSectionTab, label: 'Kárdex Activo', icon: 'view_timeline' },
    { id: 'alergias' as PatientSectionTab, label: 'Alergias', icon: 'warning', badge: allergiesCount },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-3 sm:px-space-md lg:px-space-xl pt-2 sm:pt-space-sm">
      <nav
        aria-label="Secciones Historia Clínica"
        className="bg-surface-container-high/40 backdrop-blur-md p-1 rounded-xl flex items-center gap-1 overflow-x-auto no-scrollbar border border-outline-variant/15 scroll-smooth"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 min-h-[38px] active:scale-95 touch-manipulation ${
                isActive
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-error text-on-error'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
