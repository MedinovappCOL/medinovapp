import React from 'react';
import { ViewTab } from './Sidebar';

interface BottomNavBarProps {
  currentView: ViewTab;
  onSelectView: (view: ViewTab) => void;
  onOpenMenu: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentView,
  onSelectView,
  onOpenMenu,
}) => {
  const navTabs: { id: ViewTab | 'menu'; label: string; icon: string }[] = [
    {
      id: 'cuadro-de-mandos-urgencias',
      label: 'Panel',
      icon: 'emergency',
    },
    {
      id: 'administracion-mar',
      label: 'MAR',
      icon: 'medication',
    },
    {
      id: 'kardex-express',
      label: 'Kárdex',
      icon: 'inventory_2',
    },
    {
      id: 'pacientes-y-boxes',
      label: 'Boxes',
      icon: 'meeting_room',
    },
    {
      id: 'menu',
      label: 'Más',
      icon: 'grid_view',
    },
  ];

  return (
    <nav
      aria-label="Navegación Móvil"
      className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/15 md:hidden z-40 flex items-center justify-around px-2 pb-[max(env(safe-area-inset-bottom,0px),4px)] shadow-lg transition-colors"
    >
      {navTabs.map((tab) => {
        const isMenu = tab.id === 'menu';
        const isActive = !isMenu && currentView === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              if (isMenu) {
                onOpenMenu();
              } else {
                onSelectView(tab.id as ViewTab);
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all cursor-pointer active:scale-95 touch-manipulation ${
              isActive
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface font-medium'
            }`}
            type="button"
          >
            <div
              className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                isActive ? 'bg-primary/15 text-primary' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[21px]">{tab.icon}</span>
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
