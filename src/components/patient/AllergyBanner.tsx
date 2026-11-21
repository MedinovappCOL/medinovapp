import React from 'react';
import { Allergy } from '../../types/clinical';

interface AllergyBannerProps {
  allergies: Allergy[];
  onViewProtocol: () => void;
}

export const AllergyBanner: React.FC<AllergyBannerProps> = ({
  onViewProtocol,
}) => {
  return (
    <div className="max-w-7xl mx-auto w-full px-3 sm:px-space-md lg:px-space-xl pt-2 sm:pt-space-sm">
      <div className="bg-error-container/70 text-on-error-container rounded-xl px-3 sm:px-space-md py-2.5 flex items-center justify-between gap-2 sm:gap-space-md border border-error/20 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-space-sm min-w-0">
          <span className="material-symbols-outlined text-error text-[20px] shrink-0">
            warning
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0 text-xs sm:text-body-sm">
            <span className="font-bold text-error uppercase text-[11px] sm:text-xs tracking-wider">
              Alerta Alergias:
            </span>
            <span className="font-semibold text-on-surface">
              Penicilinas &amp; AINEs
            </span>
            <span className="hidden md:inline text-on-surface-variant text-xs">
              (Contraindicado: Amoxicilina, Ampicilina, Ketorolaco, Ibuprofeno)
            </span>
          </div>
        </div>

        <button
          onClick={onViewProtocol}
          className="bg-surface-container-lowest text-error hover:bg-error hover:text-on-error text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 border border-error/30 active:scale-95 touch-manipulation min-h-[34px]"
          type="button"
        >
          Protocolo
        </button>
      </div>
    </div>
  );
};
