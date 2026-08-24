import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { TEACHERS_DATA, TeacherProfile } from '../../services/teacherData';

interface TeacherInitialLoadingScreenProps {
  onComplete: () => void;
}

export const TeacherInitialLoadingScreen: React.FC<TeacherInitialLoadingScreenProps> = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const { isKhmer } = useLanguage();

  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Identify active teacher profile
  const activeTeacher: TeacherProfile = useMemo(() => {
    const uName = (currentUser?.username || '').toLowerCase();
    const fName = (currentUser?.fullName || '').toLowerCase();
    const uId = (currentUser?.id || '').toLowerCase();

    if (uName.includes('tekchas') || fName.includes('tekchas') || uId.includes('tekchas') || fName.includes('choeurn')) {
      return TEACHERS_DATA.find(t => t.id === 'teacher-choeurn-tekchas') || TEACHERS_DATA[2];
    }
    if (uName.includes('chandara') || fName.includes('chandara') || uId.includes('chandara') || fName.includes('ten')) {
      return TEACHERS_DATA.find(t => t.id === 'teacher-ten-chandara') || TEACHERS_DATA[1];
    }
    if (uName.includes('nun') || fName.includes('nun') || uId.includes('nun') || fName.includes('langdy')) {
      return TEACHERS_DATA.find(t => t.id === 'teacher-nun-langdy') || TEACHERS_DATA[0];
    }
    return TEACHERS_DATA[0];
  }, [currentUser]);

  // 4 Setup stages across 3.5 seconds
  const setupStages = [
    {
      labelKh: 'កំពុងផ្ទៀងផ្ទាត់គណនីគ្រូ...',
      labelEn: 'Verifying teacher credentials...',
    },
    {
      labelKh: 'កំពុងទាញទិន្នន័យបន្ទប់ Lab 1 (៤០+ គ្រឿង)...',
      labelEn: 'Syncing Computer Lab 1 (40+ stations)...',
    },
    {
      labelKh: 'កំពុងរៀបចំមេរៀន & កិច្ចការសិស្ស...',
      labelEn: 'Loading curriculum & assignment rosters...',
    },
    {
      labelKh: 'ប្រព័ន្ធរួចរាល់ • កំពុងបើកដំណើរការ...',
      labelEn: 'System ready • Opening workspace...',
    }
  ];

  useEffect(() => {
    const totalDuration = 3500;
    const updateInterval = 35;
    const stepIncrement = 100 / (totalDuration / updateInterval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + stepIncrement, 100);

        if (next < 25) setCurrentStepIndex(0);
        else if (next < 55) setCurrentStepIndex(1);
        else if (next < 85) setCurrentStepIndex(2);
        else setCurrentStepIndex(3);

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              onComplete();
            }, 300);
          }, 200);
        }
        return next;
      });
    }, updateInterval);

    return () => clearInterval(timer);
  }, [onComplete]);

  const currentStage = setupStages[currentStepIndex];

  return (
    <div
      className={`fixed inset-0 z-[999999] w-screen h-screen min-h-screen flex items-center justify-center bg-[#07060a] text-white select-none overflow-hidden transition-all duration-300 ease-out ${
        isFadingOut ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ margin: 0, left: 0, top: 0, right: 0, bottom: 0 }}
    >
      {/* Layered Organic Ambient Blur Shapes */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-pink-900/25 via-rose-600/15 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[360px] h-[360px] bg-pink-950/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[320px] h-[320px] bg-rose-950/30 rounded-full blur-[90px]" />
      </div>

      {/* Main Centered Minimalist Loading Composition */}
      <div className="relative z-10 flex items-center justify-center max-w-2xl px-6 w-full">
        
        {/* LEFT SIDE: Half-Masked Rotating Mechanical Gear (No Border, Soft Light Blur) */}
        <div className="relative w-16 sm:w-24 h-40 sm:h-52 overflow-hidden flex items-center justify-end shrink-0">
          <div
            className="absolute -right-12 sm:-right-16 w-24 sm:w-32 h-24 sm:h-32 text-white/95 drop-shadow-[0_0_18px_rgba(244,63,94,0.7)] animate-spin"
            style={{ animationDuration: '3.2s', animationTimingFunction: 'linear' }}
          >
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M44 4 L56 4 L57 18 C61 19.5 65 21.8 68.5 24.8 L80 16.5 L88.5 25 L80.2 36.5 C83.2 40 85.5 44 87 48 L101 49 L101 61 L87 62 C85.5 66 83.2 70 80.2 73.5 L88.5 85 L80 93.5 L68.5 85.2 C65 88.2 61 90.5 57 92 L56 106 L44 106 L43 92 C39 90.5 35 88.2 31.5 85.2 L20 93.5 L11.5 85 L19.8 73.5 C16.8 70 14.5 66 13 62 L-1 61 L-1 49 L13 48 C14.5 44 16.8 40 19.8 36.5 L11.5 25 L20 16.5 L31.5 24.8 C35 21.8 39 19.5 43 18 Z M50 35 A15 15 0 1 0 50 65 A15 15 0 1 0 50 35 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* CENTER VERTICAL SEAM DIVIDER (Pure gradient beam with soft luminous bloom) */}
        <div className="w-[2px] h-32 sm:h-44 bg-gradient-to-b from-transparent via-pink-400 to-transparent shrink-0 shadow-[0_0_14px_rgba(244,63,94,0.95)]" />

        {/* RIGHT SIDE: Full Logo, Full System Name, Teacher Identity & Clean Loading */}
        <div className="pl-5 sm:pl-8 text-left flex flex-col justify-center space-y-3 min-w-[260px] sm:min-w-[360px]">
          
          {/* Top Brand Identity: Official Logo & School Name (Borderless with Soft Glow) */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.4)] shrink-0">
                <img
                  src="/ciis-logo.svg"
                  alt="CIIS Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-pink-400 uppercase block leading-none drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                  CIIS ACADEMIC LMS
                </span>
                <p className="text-xs sm:text-sm font-black text-white font-khmer-title tracking-tight leading-tight">
                  {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស' : 'CIIS INTERNATIONAL SCHOOL'}
                </p>
              </div>
            </div>
          </div>

          {/* Teacher Profile Card (Borderless Glassmorphism with Smooth Backdrop Blur) */}
          <div className="flex items-center gap-3 py-2 px-3.5 rounded-2xl bg-white/[0.035] backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-[0_0_16px_rgba(244,63,94,0.4)] shrink-0 bg-zinc-900">
              <img
                src={activeTeacher.image}
                alt={activeTeacher.nameEn}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-black text-white truncate font-khmer-title leading-tight">
                {isKhmer ? activeTeacher.nameKh : activeTeacher.nameEn}
              </p>
              <p className="text-[10.5px] font-mono text-pink-300 truncate">
                {isKhmer ? activeTeacher.roleTitleKh : activeTeacher.roleTitleEn}
              </p>
            </div>
          </div>

          {/* Minimalist "Loading..." with Animated Dots & Seamless Progress Pill */}
          <div className="space-y-2 pt-0.5">
            
            {/* Header Status & Live Percentage */}
            <div className="flex items-baseline justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                  {isKhmer ? 'កំពុងដំណើរការ' : 'Loading'}
                </span>
                <span className="inline-flex gap-0.5 text-pink-400 font-black text-sm">
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse delay-100">.</span>
                  <span className="animate-pulse delay-200">.</span>
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-pink-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Seamless Frameless Progress Bar with Luminous Glow */}
            <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden relative backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-pink-600 via-rose-500 to-pink-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(244,63,94,0.9)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Subtitle Step Text */}
            <p className="text-[11px] text-zinc-400 font-medium font-kantumruy truncate">
              {isKhmer ? currentStage.labelKh : currentStage.labelEn}
            </p>

          </div>

        </div>

      </div>

      {/* Subtle Bottom Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10.5px] font-mono text-zinc-600 tracking-widest uppercase">
          CIIS SCHOOL • COMPUTER LAB 1 (40+ WORKSTATIONS)
        </p>
      </div>

    </div>
  );
};
