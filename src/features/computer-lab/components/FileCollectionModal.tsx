// ====================================================================
// Component: FileCollectionModal
// Live File Collection Progress & ZIP Export for Student Submissions
// ====================================================================

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  DownloadCloud,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Archive,
  Eye,
  Check,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { FileCollectionProgress } from '../types/lab';
import { useLanguage } from '../../../context/LanguageContext';

interface FileCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: FileCollectionProgress;
  onDownloadZip?: () => void;
}

export const FileCollectionModal: React.FC<FileCollectionModalProps> = ({
  isOpen,
  onClose,
  progress,
  onDownloadZip
}) => {
  const { isKhmer } = useLanguage();

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

  const handleDownload = () => {
    // Generate simulated ZIP download trigger
    const element = document.createElement('a');
    const file = new Blob(
      [
        `CIIS School Lab Submissions Archive\nCollected: ${progress.collectedFiles.length} files\nTimestamp: ${new Date().toISOString()}\n\n` +
          progress.collectedFiles.map((f) => `${f.computerCode} - ${f.studentName}: ${f.fileName} (${f.fileSize})`).join('\n')
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `CIIS_Lab_Submissions_${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[85vh] my-auto"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-800 text-white flex items-center justify-center font-black shadow-xs">
              <DownloadCloud className="w-5 h-5 text-pink-200" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-950">
                {isKhmer ? 'ប្រមូលកិច្ចការសិស្សទាំងអស់' : 'Collecting Student Submissions'}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                C:\SchoolLab\Assignments\ • Windows Lab Agent
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-200/80 hover:bg-zinc-300 flex items-center justify-center text-zinc-600 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress & Live Collection Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Progress Bar Container */}
          <div className="space-y-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-zinc-700 font-mono flex items-center gap-2">
                {progress.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-pink-700 animate-spin" />
                )}
                {progress.statusText}
              </span>
              <span className="text-pink-900 font-black font-mono text-sm">
                {progress.percent}%
              </span>
            </div>

            {/* Visual Animated Progress Bar */}
            <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progress.completed
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    : 'bg-gradient-to-r from-pink-800 to-rose-600'
                }`}
                style={{ width: `${progress.percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-1">
              <span>
                {progress.collectedCount} / {progress.totalStudents} {isKhmer ? 'សិស្សបានប្រគល់' : 'students collected'}
              </span>
              <span>{progress.completed ? (isKhmer ? 'រួចរាល់ 100%' : 'Done') : (isKhmer ? 'កំពុងដំណើរការ...' : 'In progress...')}</span>
            </div>
          </div>

          {/* Student Files Checklist */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
              {isKhmer ? 'បញ្ជីឯកសារដែលបានទទួល' : 'COLLECTED FILES LIST'}
            </span>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {progress.collectedFiles.length === 0 ? (
                <p className="text-xs text-zinc-400 italic text-center py-4">
                  {isKhmer ? 'កំពុងចាប់ផ្តើមប្រមូលឯកសារ...' : 'Initializing file collection...'}
                </p>
              ) : (
                progress.collectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs flex items-center justify-between gap-2 text-xs animate-fade-in"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <span className="font-bold text-zinc-900 truncate block">
                          {file.studentName} ({file.computerCode})
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono truncate block">
                          {file.fileName}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10.5px] font-mono text-zinc-500 font-bold shrink-0">
                      {file.fileSize}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-3">
          <span className="text-xs text-zinc-500 font-mono">
            {progress.completed ? `${progress.collectedFiles.length} files ready for grading` : 'Collecting...'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
            >
              {isKhmer ? 'បិទ' : 'Close'}
            </button>

            {progress.completed && (
              <button
                onClick={handleDownload}
                className="px-5 py-2 rounded-xl bg-pink-800 hover:bg-pink-700 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
              >
                <Archive className="w-4 h-4" />
                <span>{isKhmer ? 'ទាញយកឯកសារ ZIP' : 'Download ZIP Archive'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
