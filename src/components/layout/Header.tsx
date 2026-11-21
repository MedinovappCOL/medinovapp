import React, { useState } from 'react';

interface HeaderProps {
  onOpenKardex: () => void;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenNotifications: () => void;
  onResetDemoData?: () => void;
  onOpenMobileMenu?: () => void;
  activeStaffName?: string;
  activeStaffRole?: string;
  onNavigateToShifts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenKardex,
  onSearchChange,
  searchQuery = '',
  isDarkMode,
  onToggleDarkMode,
  onOpenNotifications,
  onResetDemoData,
  onOpenMobileMenu,
  activeStaffName = 'Enf. Jefa María Rivas',
  activeStaffRole = 'Guardia Nocturna',
  onNavigateToShifts,
}) => {
  const [internalQuery, setInternalQuery] = useState(searchQuery);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.replace(/^(Dr[a]?\.|Enf\.)\s*/i, '').trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0] ? parts[0].substring(0, 2).toUpperCase() : 'UR';
  };

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-14 bg-surface-container-lowest/85 backdrop-blur-xl z-40 border-b border-outline-variant/15 flex items-center justify-between px-3 sm:px-space-md lg:px-space-lg transition-colors">
      {/* Left: Mobile Menu Trigger + Service Context + Active Staff */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={onOpenMobileMenu}
          aria-label="Abrir Menú Principal"
          className="md:hidden w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20 shrink-0"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>

        {/* Service Context */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
          <span className="text-xs font-bold text-on-surface uppercase tracking-wider truncate">
            Urgencias
          </span>
          <span className="hidden sm:inline text-xs text-on-surface-variant shrink-0">
            | Box 01-12
          </span>
        </div>

        {/* Active Staff on Duty Pill */}
        {activeStaffName && (
          <button
            onClick={onNavigateToShifts}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-xs border border-outline-variant/15 text-left cursor-pointer"
            title="Ver personal en turno y libro de firmas"
            type="button"
          >
            <span className="material-symbols-outlined text-primary text-[16px]">
              badge
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-on-surface truncate text-[11px] leading-tight">
                {activeStaffName}
              </span>
              <span className="text-[10px] text-on-surface-variant truncate leading-tight">
                {activeStaffRole}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Right: Global Search & Quick Actions */}
      <div className="flex items-center gap-1.5 sm:gap-space-sm shrink-0">
        {/* Responsive Search Input */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[17px] pointer-events-none">
            search
          </span>
          <input
            className="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/70 text-xs pl-8 pr-2.5 py-1.5 rounded-full w-28 sm:w-48 md:w-64 outline-none focus:w-44 sm:focus:w-56 md:focus:w-72 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/40 border border-outline-variant/20 transition-all shadow-xs"
            placeholder="Buscar..."
            type="text"
            value={internalQuery}
            onChange={handleInput}
          />
        </div>

        {/* Reset Demo Data Button */}
        {onResetDemoData && (
          <button
            aria-label="Restablecer Datos"
            onClick={onResetDemoData}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20 shrink-0"
            type="button"
            title="Restablecer datos demo"
          >
            <span className="material-symbols-outlined text-[17px]">restart_alt</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          aria-label="Cambiar Tema"
          onClick={onToggleDarkMode}
          className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20 shrink-0"
          type="button"
          title={isDarkMode ? 'Tema Claro' : 'Tema Oscuro'}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Critical Notifications */}
        <button
          aria-label="Notificaciones Críticas"
          onClick={onOpenNotifications}
          className="relative w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20 shrink-0"
          type="button"
          title="Ver Alertas"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error" />
        </button>

        {/* User Badge */}
        <button
          onClick={onNavigateToShifts}
          className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-primary hover:bg-surface-tint flex items-center justify-center text-on-primary text-xs font-bold shadow-xs cursor-pointer shrink-0 transition-colors"
          title={`Operador Activo: ${activeStaffName} • Ver turnos y firmas`}
          type="button"
        >
          {getInitials(activeStaffName)}
        </button>
      </div>
    </header>
  );
};
