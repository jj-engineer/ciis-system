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

  const rawNum = computer?.computerNumber || computer?.computerCode || '01';
  const computerNumber = String(rawNum).replace(/\D/g, '').padStart(2, '0') || '01';

  // Generate a token and sync with backend server on open
  useEffect(() => {
    if (isOpen && computer) {
      const generated = `REG-${computerNumber}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setToken(generated);

      // Sync with backend API
      fetch('http://192.168.0.114:4001/api/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ laptopNumber: computerNumber })
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.token) {
            setToken(data.token);
            if (onTokenGenerated) {
              onTokenGenerated(computerNumber, data.token);
            }
          }
        })
        .catch(() => {
          // Fallback to local token
          if (onTokenGenerated) {
            onTokenGenerated(computerNumber, generated);
          }
        });
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
                Pairing Token (Laptop {computerNumber})
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

          {/* One-Line PowerShell Command Box */}
          <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10.5px] font-bold text-pink-900 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-pink-700" />
                <span>{isKhmer ? 'ពាក្យបញ្ជាស្វ័យប្រវត្ត ១ ចុច (PowerShell Admin)' : '1-Click Auto Install (Zero Typing)'}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const autoCmd = `irm 192.168.0.114:4001/${computerNumber}/${token}|iex`;
                  navigator.clipboard.writeText(autoCmd);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-2 py-0.5 rounded-md bg-pink-900 text-white text-[10px] font-bold hover:bg-pink-800 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Command</span>
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900 text-pink-300 font-mono text-[11.5px] select-all break-all border border-zinc-800 flex items-center justify-between gap-2">
              <span>irm 192.168.0.114:4001/{computerNumber}/{token}|iex</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-pink-200/60 text-[10.5px] text-zinc-500 font-mono">
              <span>{isKhmer ? 'ពាក្យបញ្ជាខ្លីទូទៅ:' : 'Short generic command:'}</span>
              <code
                onClick={() => {
                  navigator.clipboard.writeText('irm 192.168.0.114:4001|iex');
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded text-zinc-800 cursor-pointer hover:bg-zinc-100 font-bold"
                title="Click to copy generic command"
              >
                irm 192.168.0.114:4001|iex
              </code>
            </div>
          </div>

          {/* Quick Steps */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900">
              <Sparkles className="w-4 h-4 text-pink-800" />
              <span>{isKhmer ? 'ជំហានដំឡើងលើ Laptop របស់សិស្ស:' : 'Steps on Student School Laptop:'}</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-600">
              <li>{isKhmer ? 'បើក PowerShell ជា Administrator លើ Laptop សិស្ស' : 'Open PowerShell as Administrator on Student Laptop'}</li>
              <li>{isKhmer ? 'Paste ពាក្យបញ្ជាខាងលើ រួចចុច Enter (រួចរាល់ភ្លាមៗ ២ វិនាទី)' : 'Paste the command above and press Enter (Instantly pairs in 2 seconds)'}</li>
            </ol>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Expires in 15:00 minutes • Single-use pairing token</span>
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
