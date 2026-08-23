import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface SplashLoadingModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  type?: 'language' | 'class' | 'general';
}

export const SplashLoadingModal: React.FC<SplashLoadingModalProps> = ({
  isOpen,
  title,
  subtitle,
  type = 'general'
}) => {
  let isKhmer = true;
  try {
    const lang = useLanguage();
    isKhmer = lang.isKhmer;
  } catch {
    isKhmer = typeof document !== 'undefined' ? (document.documentElement.lang === 'km' || document.documentElement.classList.contains('lang-km')) : true;
  }

  if (!isOpen) return null;

  const defaultTitle =
    type === 'language'
      ? (isKhmer ? 'កំពុងផ្លាស់ប្តូរភាសាប្រព័ន្ធ...' : 'Switching System Language...')
      : type === 'class'
      ? (isKhmer ? 'កំពុងប្តូរថ្នាក់រៀន...' : 'Switching Active Class...')
      : (isKhmer ? 'ប្រព័ន្ធកំពុងដំណើរការ...' : 'System is working...');

  const defaultSubtitle =
    type === 'language'
      ? (isKhmer ? 'សូមរង់ចាំបន្តិច ប្រព័ន្ធកំពុងរៀបចំភាសា និងចំណុចប្រទាក់' : 'Please wait while interface and resources are being updated')
      : type === 'class'
      ? (isKhmer ? 'កំពុងផ្ទុកកាលវិភាគ បញ្ជីសិស្ស និងកិច្ចការ' : 'Loading students, attendance roster, and study schedules')
      : (isKhmer ? 'សូមរង់ចាំមួយភ្លែត...' : 'Please wait a moment...');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl p-8 sm:p-10 max-w-sm w-full mx-4 text-center shadow-2xl border border-pink-100 overflow-hidden transform animate-in zoom-in-95 duration-200">
        
        {/* Soft Radial Ambient Lighting */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-100/70 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Center CIIS Official Logo with Clean Double Spinner Ring */}
        <div className="relative mx-auto w-24 h-24 mb-5 flex items-center justify-center">
          {/* Dual Precision Rotating Spinner Rings */}
          <div className="absolute inset-0 rounded-full border-[3.5px] border-slate-100 border-t-pink-700 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-pink-100 border-b-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2.5s' }} />
          
          {/* Centered Circular Logo */}
          <div className="w-16 h-16 rounded-full bg-white p-1 flex items-center justify-center shadow-sm border border-pink-100 z-10">
            <img 
              src="/ciis-logo.svg" 
              alt="CIIS - Community Internal Inspiration School" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        {/* Status Header Badge with Clean Pulsing Dot */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-800 text-[11px] font-extrabold border border-pink-200/70 mb-1">
            <span className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" />
            <span className="tracking-wide uppercase font-mono">CIIS ACADEMIC SYSTEM</span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
            {title || defaultTitle}
          </h3>

          <p className="text-xs text-slate-500 font-medium leading-relaxed px-1">
            {subtitle || defaultSubtitle}
          </p>
        </div>

        {/* Modern Indeterminate Progress Bar */}
        <div className="mt-6 relative z-10">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/80">
            <div className="bg-gradient-to-r from-pink-600 via-pink-700 to-pink-500 h-full rounded-full animate-indeterminate-bar" />
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
            <span>{isKhmer ? 'ដំណើរការ' : 'STATUS'}</span>
            <span className="text-pink-700 font-extrabold">{isKhmer ? 'កំពុងដំណើរការ...' : 'WORKING...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
