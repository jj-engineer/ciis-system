// ====================================================================
// Component: LabSessionModal
// Modal to configure and launch a live Computer Class Session
// ====================================================================

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  PlayCircle,
  Clock,
  FileSpreadsheet,
  FileText,
  Keyboard,
  Building,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { LabGroup, TargetApplication } from '../types/lab';
import { useLanguage } from '../../../context/LanguageContext';

interface LabSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLab: LabGroup;
  onStartSession: (
    title: string,
    targetApp: TargetApplication,
    durationMinutes: number,
    assignmentId?: string,
    assignmentTitle?: string
  ) => void;
}

export const LabSessionModal: React.FC<LabSessionModalProps> = ({
  isOpen,
  onClose,
  selectedLab,
  onStartSession
}) => {
  const { isKhmer } = useLanguage();

  const [title, setTitle] = useState<string>('Excel Practical Test #04 — Formulas & Data Tables');
  const [targetApp, setTargetApp] = useState<TargetApplication>('Microsoft Excel');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [linkedAssignmentId, setLinkedAssignmentId] = useState<string>('asg-excel-04');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onStartSession(
      title.trim(),
      targetApp,
      durationMinutes,
      linkedAssignmentId,
      'Excel Practical Test #04'
    );
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col my-auto"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-800 text-white flex items-center justify-center font-black shadow-xs">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-950">
                {isKhmer ? 'ចាប់ផ្តើមថ្នាក់កុំព្យូទ័រ' : 'Start Computer Class Session'}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">{selectedLab} • Live Workstation Dispatch</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-200/80 hover:bg-zinc-300 flex items-center justify-center text-zinc-600 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Class Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">
              {isKhmer ? 'ចំណងជើងថ្នាក់ / ប្រធានបទកិច្ចការ' : 'Class Topic / Assignment Title'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Excel Practical Test #04"
              className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white font-sans font-bold"
            />
          </div>

          {/* Target Application */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">
              {isKhmer ? 'កម្មវិធីគោលដៅសម្រាប់សិស្ស' : 'Target Application on Student PCs'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'Microsoft Excel', icon: FileSpreadsheet },
                  { id: 'Microsoft Word', icon: FileText },
                  { id: 'Touch Typing', icon: Keyboard },
                  { id: 'General', icon: Building }
                ] as const
              ).map((app) => {
                const Icon = app.icon;
                const isSelected = targetApp === app.id;
                return (
                  <button
                    type="button"
                    key={app.id}
                    onClick={() => setTargetApp(app.id)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-pink-50 border-pink-500 text-pink-950 font-black shadow-2xs'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-pink-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-pink-800' : 'text-zinc-500'}`} />
                    <span>{app.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">
              {isKhmer ? 'រយៈពេលកំណត់ (នាទី)' : 'Session Duration (Minutes)'}
            </label>
            <div className="flex items-center gap-2">
              {[30, 45, 60, 90].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDurationMinutes(mins)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    durationMinutes === mins
                      ? 'bg-zinc-900 text-white font-black'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {mins} {isKhmer ? 'នាទី' : 'min'}
                </button>
              ))}
            </div>
          </div>

          {/* Info Notice */}
          <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-200/80 text-xs text-pink-950 space-y-1">
            <div className="flex items-center gap-1.5 font-black text-pink-900">
              <Sparkles className="w-4 h-4 text-pink-800" />
              <span>{isKhmer ? 'ស្វ័យប្រវត្តិកម្មបន្ទប់កុំព្យូទ័រ' : 'Automated Lab Workflow'}</span>
            </div>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              {isKhmer
                ? 'នៅពេលចាប់ផ្តើម កុំព្យូទ័រទាំងអស់ក្នុងបន្ទប់នឹងទទួលបានការជូនដំណឹង បើកកម្មវិធីដែលបានកំណត់ និងចាប់ផ្តើមរាប់ពេលវេលា។'
                : 'Starting this session will notify all connected Windows Lab Agents, open the target application, and start the classroom timer.'}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
            >
              {isKhmer ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-pink-800 hover:bg-pink-700 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{isKhmer ? 'ចាប់ផ្តើមភ្លាមៗ' : 'Launch Session'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
