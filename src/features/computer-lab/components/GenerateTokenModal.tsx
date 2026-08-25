// ====================================================================
// Component: GenerateTokenModal (Pair Laptop Modal)
// Clean & Fast Pairing Guide for School Laptops (Token: JJ)
// ====================================================================

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  KeyRound,
  Laptop,
  Copy,
  Check,
  Sparkles,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { ComputerWorkstation } from '../types/lab';
import { useLanguage } from '../../../context/LanguageContext';

interface GenerateTokenModalProps {
  computer: ComputerWorkstation | null;
  isOpen: boolean;
  onClose: () => void;
  onTokenGenerated?: (computerNumber: string, token: string) => void;
}

export const GenerateTokenModal: React.FC<GenerateTokenModalProps> = ({
  computer,
  isOpen,
  onClose
}) => {
  const { isKhmer } = useLanguage();
  const [copied, setCopied] = useState(false);

  const rawNum = computer?.computerNumber || computer?.computerCode || '01';
  const computerNumber = String(rawNum).replace(/\D/g, '').padStart(2, '0') || '01';
  const masterToken = 'JJ';
  const autoCommand = `irm 192.168.0.114:4001/${computerNumber}|iex`;

  if (!isOpen || !computer || typeof document === 'undefined') return null;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(autoCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(masterToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col my-auto select-none"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-black shadow-xs">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                <span>{isKhmer ? `ចុះឈ្មោះ Laptop ${computerNumber}` : `Pair Laptop ${computerNumber}`}</span>
              </h3>
              <p className="text-xs text-zinc-500 font-mono">School Computer Lab Agent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* 1-Click Command Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-800 flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-zinc-600" />
                <span>{isKhmer ? 'ពាក្យបញ្ជាដំឡើងលើ Laptop សិស្ស' : 'Command for Student Laptop'}</span>
              </span>
              <button
                type="button"
                onClick={handleCopyCommand}
                className="px-2.5 py-1 rounded-lg bg-zinc-950 text-white text-[11px] font-bold hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? (isKhmer ? 'ចម្លងរួច!' : 'Copied!') : (isKhmer ? 'ចម្លង' : 'Copy')}</span>
              </button>
            </div>

            <div
              onClick={handleCopyCommand}
              className="p-3 rounded-2xl bg-zinc-900 text-zinc-100 font-mono text-[12px] break-all border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors"
              title="Click to copy"
            >
              {autoCommand}
            </div>
          </div>

          {/* Simple Details Pill */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="text-[10px] text-zinc-400 font-mono uppercase font-bold">Laptop Number</div>
              <div className="text-base font-black text-zinc-900 font-mono">{computerNumber}</div>
            </div>
            <div
              onClick={handleCopyToken}
              className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer hover:bg-zinc-100 transition-colors"
            >
              <div className="text-[10px] text-zinc-400 font-mono uppercase font-bold flex items-center justify-between">
                <span>Pairing Token</span>
                <KeyRound className="w-3 h-3 text-zinc-400" />
              </div>
              <div className="text-base font-black text-zinc-900 font-mono">{masterToken}</div>
            </div>
          </div>

          {/* Steps */}
          <div className="p-3.5 rounded-2xl bg-zinc-50/80 border border-zinc-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900">
              <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
              <span>{isKhmer ? 'របៀបដំឡើង (២ វិនាទី):' : 'Easy Setup Steps (2 seconds):'}</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-600 leading-relaxed">
              <li>{isKhmer ? 'បើក PowerShell ជា Administrator លើ Laptop សិស្ស' : 'Open PowerShell as Administrator on Student Laptop'}</li>
              <li>{isKhmer ? 'Paste ពាក្យបញ្ជាខាងលើ រួចចុច Enter' : 'Paste the command above and press Enter'}</li>
              <li>{isKhmer ? 'Laptop នឹងភ្ជាប់មកកាន់ផ្ទាំងគ្រប់គ្រងដោយស្វ័យប្រវត្ត' : 'Laptop automatically registers and turns Online!'}</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            {isKhmer ? 'រួចរាល់' : 'Done'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
