import React, { useState, useEffect } from 'react';

export type ViewTab =
  | 'cuadro-de-mandos-urgencias'
  | 'administracion-mar'
  | 'kardex-express'
  | 'pacientes-y-boxes'
  | 'alertas-e-interacciones'
  | 'trazabilidad-y-firmas';

interface SidebarProps {
  currentView: ViewTab;
  onSelectView: (view: ViewTab) => void;
  selectedBoxCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [timeStr, setTimeStr] = useState<string>('03:42:15');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      id: 'cuadro-de-mandos-urgencias' as ViewTab,
      label: 'Panel Urgencias',
      icon: 'emergency',
      description: 'Monitoreo de boxes y triage',
    },
    {
      id: 'administracion-mar' as ViewTab,
      label: 'Registro MAR',
      icon: 'medication',
      description: 'Administración y ficha de paciente',
    },
    {
      id: 'kardex-express' as ViewTab,
      label: 'Kárdex Express',
      icon: 'inventory_2',
      description: 'Control horario de dosis',
    },
    {
      id: 'pacientes-y-boxes' as ViewTab,
      label: 'Boxes 01-12',
      icon: 'meeting_room',
      description: 'Mapa de camas disponibles',
    },
    {
      id: 'alertas-e-interacciones' as ViewTab,
      label: 'Interacciones',
      icon: 'warning',
      description: 'Farmacovigilancia y alertas RAM',
    },
    {
      id: 'trazabilidad-y-firmas' as ViewTab,
      label: 'Firmas y Turnos',
      icon: 'draw',
      description: 'Doble chequeo y acreditación',
    },
  ];

  const handleItemClick = (tab: ViewTab) => {
    onSelectView(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navContent = (isMobile: boolean = false) => (
    <>
      <div className="flex flex-col gap-space-md">
        {/* Brand */}
        <div className="px-2 pt-1 flex items-center justify-between">
          <button
            onClick={() => handleItemClick('cuadro-de-mandos-urgencias')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
            title="Volver a Panel Urgencias"
          >
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold shadow-xs">
              <span className="material-symbols-outlined text-[18px]">local_hospital</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-on-surface group-hover:text-primary transition-colors">
                MEDINOVA
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                Estación Clínica HIG
              </span>
            </div>
          </button>
          
          {isMobile ? (
            <button
              onClick={onCloseMobile}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              title="Cerrar menú"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          ) : (
            <span className="w-2 h-2 rounded-full bg-secondary" title="En línea" />
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer active:scale-98 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{item.label}</span>
                  {isMobile && (
                    <span className={`text-[10px] truncate ${isActive ? 'text-on-primary/80' : 'text-on-surface-variant/70'}`}>
                      {item.description}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Shift timer */}
      <div className="flex flex-col gap-2 px-1 text-xs">
        <div className="p-2.5 rounded-xl bg-surface-container/60 flex items-center justify-between border border-outline-variant/15">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
            <span className="text-[11px] font-medium">Guardia Nocturna</span>
          </div>
          <span className="font-mono-metric font-bold text-on-surface text-xs">
            {timeStr}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on md and up) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-surface-container-low/90 backdrop-blur-xl z-50 flex-col justify-between py-space-md px-3 border-r border-outline-variant/15 transition-colors">
        {navContent(false)}
      </aside>

      {/* Mobile Off-Canvas Drawer (visible when isMobileOpen is true) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer content */}
          <aside className="relative w-72 max-w-[85vw] h-full bg-surface-container-lowest/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between py-space-md px-3.5 z-10 animate-in slide-in-from-left duration-250 border-r border-outline-variant/20">
            {navContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
