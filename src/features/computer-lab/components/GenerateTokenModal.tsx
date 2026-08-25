// ====================================================================
// Component: GenerateTokenModal
// Admin & Teacher Token Generator for Registering School Laptops (01-30)
// ====================================================================

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  KeyRound,
  Laptop,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Terminal,
  Clock
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
  onClose,
  onTokenGenerated
}) => {
  const { isKhmer } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState<string>('');

  const computerNumber = computer?.computerNumber || computer?.computerCode || '01';

  // Generate a realistic token on open
  useEffect(() => {
    if (isOpen && computer) {
      const generated = `REG-${computerNumber}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setToken(generated);
      if (onTokenGenerated) {
        onTokenGenerated(computerNumber, generated);
      }
    }
  }, [isOpen, computer, computerNumber]);

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

  if (!isOpen || !computer || typeof document === 'undefined') return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const commandSnippet = `register-pc.bat  -->  Laptop: ${computerNumber}  |  Token: ${token}`;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col my-auto"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-900 text-white flex items-center justify-center font-black shadow-xs">
              <KeyRound className="w-5 h-5 text-pink-200" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                <span>{isKhmer ? `ចុះឈ្មោះកុំព្យូទ័រ ${computerNumber}` : `Register Laptop ${computerNumber}`}</span>
              </h3>
              <p className="text-xs text-zinc-500 font-mono">One-Time Registration Token</p>
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
          <div className="text-xs text-zinc-600 leading-relaxed">
            {isKhmer
              ? `សូមប្រើប្រាស់កូដនេះដើម្បីផ្ទៀងផ្ទាត់លើ Laptop ${computerNumber} របស់សាលា។ កូដនេះមានសុពលភាពរយៈពេល ១៥ នាទី។`
              : `Use this one-time token to pair and authorize School Laptop ${computerNumber}. This token will expire in 15 minutes.`}
          </div>

          {/* Token Box */}
          <div className="p-4 rounded-2xl bg-zinc-900 text-white flex items-center justify-between gap-3 shadow-inner">
            <div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
                Registration Token
              </div>
              <div className="text-xl font-black font-mono tracking-widest text-pink-300">
                {token}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white active:scale-95'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900">
              <Terminal className="w-4 h-4 text-pink-800" />
              <span>{isKhmer ? 'ជំហានដំឡើងលើ Laptop របស់សាលា (School Laptop):' : 'Steps on Student School Laptop:'}</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-600">
              <li>{isKhmer ? 'ចម្លង Folder pc-agent ដាក់លើ Laptop (តាម USB)' : 'Copy the `pc-agent` folder to the school laptop (via USB or LAN)'}</li>
              <li>{isKhmer ? 'បើក file ' : 'Run '} <code className="px-1 py-0.5 bg-zinc-200 rounded font-mono text-[10px]">pc-agent\installer\register-pc.bat</code></li>
              <li>{isKhmer ? 'បញ្ចូល IP កុំព្យូទ័រគ្រូ (Teacher IP), លេខ Laptop ' : 'Enter Teacher IP, Laptop Number '} <strong className="font-mono text-zinc-900">({computerNumber})</strong> {isKhmer ? 'និងកូដ Token' : 'and Token'}</li>
              <li>{isKhmer ? 'បើក ' : 'Run '} <code className="px-1 py-0.5 bg-zinc-200 rounded font-mono text-[10px]">install-startup.bat</code> {isKhmer ? 'ដើម្បីដំណើរការស្វ័យប្រវត្តពេលបើក Windows' : 'for silent Windows auto-start'}</li>
            </ol>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Expires in 15:00 minutes • One-time pairing token</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            {isKhmer ? 'រួចរាល់' : 'Done'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
