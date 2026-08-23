import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface ModalSplashLoaderProps {
  onComplete: () => void;
  title?: string;
  durationMs?: number;
}

export const ModalSplashLoader: React.FC<ModalSplashLoaderProps> = ({
  onComplete,
  title,
  durationMs = 2200,
}) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);

  let isKhmer = true;
  try {
    const lang = useLanguage();
    isKhmer = lang.isKhmer;
  } catch {
    isKhmer = true;
  }

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      if (pct < 45) {
        setPhase(1);
      } else if (pct < 85) {
        setPhase(2);
      } else {
        setPhase(3);
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 150);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  const getPhaseText = () => {
    if (phase === 1) {
      return isKhmer ? 'កំពុងផ្ទៀងផ្ទាត់សិទ្ធិប្រើប្រាស់...' : 'Verifying workspace security...';
    }
    if (phase === 2) {
      return isKhmer ? 'កំពុងផ្ទុកទិន្នន័យ និងរៀបចំផ្ទាំង...' : 'Loading dataset & building interface...';
    }
    return isKhmer ? 'រួចរាល់! កំពុងបើកផ្ទាំងដំណើរការ...' : 'Ready! Opening workspace...';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10 max-w-sm w-full mx-4 text-center shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
        
        {/* Soft Ambient Glow in Dark Gradient Pink */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-900/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-pink-950/40 rounded-full blur-3xl pointer-events-none" />

        {/* Center CIIS Logo with Precision Rotating Dual Spinner Rings */}
        <div className="relative mx-auto w-24 h-24 mb-5 flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-[3.5px] border-zinc-800 border-t-pink-600 animate-spin" style={{ animationDuration: '1.2s' }} />
          {/* Inner Counter-Rotating Ring */}
          <div className="absolute inset-2 rounded-full border-2 border-zinc-800/80 border-b-pink-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
          
          {/* Logo Badge */}
          <div className="w-16 h-16 rounded-2xl bg-black p-1.5 flex items-center justify-center shadow-lg border border-pink-900/50 z-10">
            <img 
              src="/ciis-logo.svg" 
              alt="CIIS LMS" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        {/* Title & Status Information */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/50 text-pink-300 text-[10.5px] font-extrabold border border-pink-800/40 mb-1">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="tracking-wider uppercase font-mono">CIIS ACADEMIC LMS</span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
            {title || (isKhmer ? 'កំពុងរៀបចំផ្ទាំងទិន្នន័យ...' : 'Opening Workspace Modal...')}
          </h3>

          <p className="text-xs text-zinc-400 font-medium leading-relaxed min-h-[20px] transition-all">
            {getPhaseText()}
          </p>
        </div>

        {/* High-Precision Progress Bar & Counter */}
        <div className="mt-6 relative z-10 space-y-2">
          <div className="w-full bg-zinc-800/90 rounded-full h-2 overflow-hidden border border-zinc-700/60 p-0.5">
            <div 
              className="bg-gradient-to-r from-pink-800 via-pink-600 to-pink-400 h-full rounded-full transition-all duration-75 ease-out shadow-sm shadow-pink-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono font-bold">
            <span className="text-zinc-500">{isKhmer ? 'ដំណើរការប្រព័ន្ធ' : 'INITIALIZING'}</span>
            <span className="text-pink-400 font-extrabold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
