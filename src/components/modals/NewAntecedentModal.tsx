import React, { useState, useEffect } from 'react';
import { TimelineEpisode } from '../../types/clinical';

interface NewAntecedentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (antecedent: {
    id?: string;
    title: string;
    category: 'urgencias' | 'ram' | 'quirurgico' | 'cronico' | 'farmacologico';
    description: string;
    doctor: string;
    year: string;
    emergencyManagement?: string;
  }) => void;
  episodeToEdit?: TimelineEpisode | null;
}

export const NewAntecedentModal: React.FC<NewAntecedentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  episodeToEdit,
}) => {
  const isEditing = !!episodeToEdit;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'urgencias' | 'ram' | 'quirurgico' | 'cronico' | 'farmacologico'>('cronico');
  const [description, setDescription] = useState('');
  const [doctor, setDoctor] = useState('Dr. Alejandro Silva');
  const [year, setYear] = useState('2024');
  const [emergencyManagement, setEmergencyManagement] = useState('');

  useEffect(() => {
    if (episodeToEdit) {
      setTitle(episodeToEdit.title);
      setCategory(episodeToEdit.category);
      setDescription(episodeToEdit.description);
      setDoctor(episodeToEdit.doctorName);
      setYear(episodeToEdit.dateStr.split('•')[0].trim() || '2024');
      setEmergencyManagement(episodeToEdit.emergencyManagement || '');
    } else {
      setTitle('');
      setCategory('cronico');
      setDescription('');
      setDoctor('Dr. Alejandro Silva');
      setYear('2024');
      setEmergencyManagement('');
    }
  }, [episodeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: episodeToEdit?.id,
      title: title.trim(),
      category,
      description: description.trim(),
      doctor: doctor.trim(),
      year: year.trim(),
      emergencyManagement: category === 'ram' ? emergencyManagement.trim() : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-md flex items-end sm:items-center justify-center p-2 sm:p-space-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-3.5 sm:p-space-lg max-w-lg w-full flex flex-col gap-space-sm border border-outline-variant/30 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-xs">
        <div className="flex items-center justify-between border-b border-outline-variant/15 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[18px]">
                {isEditing ? 'edit_note' : 'history_edu'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">
                {isEditing ? 'Editar Antecedente Clínico' : 'Registrar Nuevo Antecedente'}
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Línea cronológica de eventos y diagnósticos
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
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-on-surface">
              Título del Evento / Diagnóstico *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Apendicectomía Laparoscópica, Hipertensión..."
              className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="bg-surface-container-low px-2 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              >
                <option value="cronico">Patología Crónica</option>
                <option value="quirurgico">Quirúrgico</option>
                <option value="ram">Reacción Adversa [RAM]</option>
                <option value="urgencias">Urgencias / Internación</option>
                <option value="farmacologico">Farmacológico</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Fecha o Período</label>
              <input
                type="text"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ej. 2023, Mayo 2022..."
                className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-on-surface">Médico Responsable o Centro</label>
            <input
              type="text"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              placeholder="Dr. Roberto Cárdenas"
              className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-on-surface">Descripción Clínica</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles clínicos, evolución, tratamiento o resolución..."
              className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 text-on-surface outline-none focus:bg-surface-container-lowest resize-none text-xs"
            />
          </div>

          {category === 'ram' && (
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-error">Manejo de Emergencia Realizado</label>
              <input
                type="text"
                value={emergencyManagement}
                onChange={(e) => setEmergencyManagement(e.target.value)}
                placeholder="Ej. Adrenalina 0.5mg IM + Hidrocortisona 200mg IV"
                className="bg-error-container/20 px-3 py-1.5 rounded-lg border border-error/30 text-on-surface outline-none focus:bg-surface-container-lowest"
              />
            </div>
          )}

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
              <span>{isEditing ? 'Guardar Cambios' : 'Registrar Antecedente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
