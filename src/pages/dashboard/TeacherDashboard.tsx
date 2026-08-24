import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { TEACHERS_DATA, TeacherProfile } from '../../services/teacherData';
import {
  CheckSquare,
  BookOpen,
  Laptop,
  GraduationCap,
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Monitor,
  Users
} from 'lucide-react';

interface TeacherDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const { isKhmer } = useLanguage();
  const { selectedClass, selectedClassId, setSelectedClassId, classes } = useApp();

  const activeClass = selectedClass || classes.find(c => c.id === selectedClassId) || classes[0];

  // Identify active teacher profile
  const activeTeacherData: TeacherProfile = React.useMemo(() => {
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

  const getClassLabel = (cls?: { id: string; name: string; grade?: string }) => {
    if (!cls) return { shortKh: 'ល្ងាច វេន១', shortEn: 'Evening 1', fullKh: 'ថ្នាក់ល្ងាច វេនទី១ (5:30 - 6:30)', fullEn: 'Evening 1 (5:30 - 6:30 PM)' };
    if (cls.id === 'ciis-evening-1') {
      return {
        shortKh: 'ល្ងាច វេន១',
        shortEn: 'Evening 1',
        fullKh: 'ថ្នាក់ល្ងាច វេនទី១ (5:30 - 6:30)',
        fullEn: 'Evening 1 (5:30 - 6:30 PM)'
      };
    }
    if (cls.id === 'ciis-evening-2') {
      return {
        shortKh: 'ល្ងាច វេន២',
        shortEn: 'Evening 2',
        fullKh: 'ថ្នាក់ល្ងាច វេនទី២ (6:40 - 7:40)',
        fullEn: 'Evening 2 (6:40 - 7:40 PM)'
      };
    }
    return {
      shortKh: 'ចន្ទ ព្រឹក',
      shortEn: 'Mon Morning',
      fullKh: 'ថ្នាក់ចន្ទ ព្រឹក (7:30 - 11:00)',
      fullEn: 'Monday Morning (7:30 - 11:00 AM)'
    };
  };

  const activeClassLabel = getClassLabel(activeClass);

  return (
    <div className="space-y-6 antialiased max-w-5xl mx-auto pb-10">

      {/* ========================================================================= */}
      {/* 1. WELCOME HERO CARD (Clean, Warm & Focused with Power Reveal)            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm relative overflow-hidden text-left animate-system-hero power-light-sweep">

        {/* Subtle Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">

          {/* Left: Avatar & Personalized Greeting */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <img
                src={activeTeacherData.image}
                alt={activeTeacherData.nameEn}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-pink-800/15 shadow-sm bg-zinc-100 hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-pink-950/10 text-pink-900 border border-pink-200 text-[11px] font-bold font-mono">
                <span>{isKhmer ? activeTeacherData.badgeKh : activeTeacherData.badgeEn}</span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 tracking-tight leading-tight">
                {isKhmer ? (
                  <>ជម្រាបសួរលោកគ្រូ <span className="text-pink-800">{activeTeacherData.nameKh}</span></>
                ) : (
                  <>Welcome to CIIS LMS, <span className="text-pink-800">{activeTeacherData.nameEn}</span>!</>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-500 font-medium">
                {isKhmer
                  ? 'ប្រព័ន្ធគ្រប់គ្រងការបង្រៀនកុំព្យូទ័រ និងស្រង់វត្តមានសាលារៀន CIIS'
                  : 'CIIS Computer Laboratory & Classroom Management System'}
              </p>
            </div>
          </div>

          {/* Right: Current Class Badge & Shift Selector */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold font-mono shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>
                {isKhmer
                  ? `ថ្នាក់បច្ចុប្បន្ន៖ ${activeClassLabel.fullKh}`
                  : `Current Class: ${activeClassLabel.fullEn}`}
              </span>
            </div>

            {/* Quick Shift Selector Capsule */}
            <div className="flex items-center bg-zinc-50 p-1 rounded-2xl border border-zinc-200 shadow-2xs gap-1">
              {classes.slice(0, 3).map((cls) => {
                const isSelected = (activeClass?.id || classes[0]?.id) === cls.id;
                const itemLabel = getClassLabel(cls);
                return (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                        ? 'bg-pink-900 text-white shadow-xs font-black'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-white'
                      }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-400'}`} />
                    <span>{isKhmer ? itemLabel.shortKh : itemLabel.shortEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Quick Classroom Actions */}
        <div className="mt-6 pt-5 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-system-actions">

          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-pink-50/60 border border-zinc-200/80 transition-all cursor-pointer flex items-center justify-between group text-left transform hover:translate-y-[-2px] hover:shadow-sm active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckSquare className="w-4 h-4 text-pink-800" />
              </div>
              <div>
                <p className="text-xs font-black text-zinc-950 group-hover:text-pink-900 transition-colors">
                  {isKhmer ? 'ស្រង់វត្តមានសិស្ស' : 'Take Attendance'}
                </p>
                <p className="text-[10.5px] text-zinc-400 font-mono">&lt; 1 min</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-pink-800 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lessons')}
            className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-pink-50/60 border border-zinc-200/80 transition-all cursor-pointer flex items-center justify-between group text-left transform hover:translate-y-[-2px] hover:shadow-sm active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4 text-pink-800" />
              </div>
              <div>
                <p className="text-xs font-black text-zinc-950 group-hover:text-pink-900 transition-colors">
                  {isKhmer ? 'មេរៀន & ឯកសារ' : 'Lessons & Guides'}
                </p>
                <p className="text-[10.5px] text-zinc-400 font-mono">Word & Excel</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-pink-800 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lab')}
            className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-pink-50/60 border border-zinc-200/80 transition-all cursor-pointer flex items-center justify-between group text-left transform hover:translate-y-[-2px] hover:shadow-sm active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Laptop className="w-4 h-4 text-pink-800" />
              </div>
              <div>
                <p className="text-xs font-black text-zinc-950 group-hover:text-pink-900 transition-colors">
                  {isKhmer ? 'បន្ទប់កុំព្យូទ័រ' : 'Computer Lab'}
                </p>
                <p className="text-[10.5px] text-zinc-400 font-mono">40+ Stations</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-pink-800 group-hover:translate-x-0.5 transition-all" />
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. BRIEF SCHOOL & SYSTEM INFORMATION (Cascade Reveal)                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left animate-system-cards">

        {/* Card A: About CIIS School */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm space-y-3.5 hover:border-pink-200/80 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center border border-pink-200 shadow-2xs shrink-0">
              <img src="/ciis-logo.svg" alt="CIIS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-black text-zinc-950 leading-tight">
                {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស' : 'CIIS INTERNATIONAL SCHOOL'}
              </h2>
              <p className="text-[10px] text-pink-800 font-bold font-mono">
                CIIS SCHOOL • CAMBODIA
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed font-medium">
            {isKhmer
              ? 'សាលារៀន CIIS ផ្តល់នូវការអប់រំចំណេះដឹងទូទៅ និងការបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រជាក់ស្តែង (Microsoft Word, Excel, Touch Typing) នៅក្នុងបន្ទប់ពិសោធន៍ CIIS Lab 1 ប្រកបដោយគុណភាព។'
              : 'CIIS School offers comprehensive general education and practical computer skills training (Word, Excel, Touch Typing) in CIIS Lab 1 with a focus on real-world application.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-zinc-600">
            <span className="px-2.5 py-1 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-pink-800" />
              <span>{isKhmer ? 'មត្តេយ្យ ដល់ បឋមសិក្សា' : 'K-6 & Computer'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-pink-800" />
              <span>{isKhmer ? 'បន្ទប់ Lab (៤០+ គ្រឿង)' : '40+ Computer Stations'}</span>
            </span>
          </div>
        </div>

        {/* Card B: System Status & Highlights */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm space-y-3.5 hover:border-pink-200/80 transition-all">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-zinc-950 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-pink-800" />
              <span>{isKhmer ? 'ព័ត៌មានប្រព័ន្ធ CIIS LMS' : 'CIIS LMS System Highlights'}</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-800 border border-pink-200 text-[10px] font-mono font-bold">
              v2.5
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-[9.5px] text-zinc-400 font-mono uppercase block">{isKhmer ? 'វេនសិក្សា' : 'Class Shifts'}</span>
              <p className="text-xs font-black text-zinc-900 mt-0.5">{isKhmer ? '៣ វេន (ចន្ទ-សុក្រ)' : '3 Shifts Active'}</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-[9.5px] text-zinc-400 font-mono uppercase block">{isKhmer ? 'សុវត្ថិភាព' : 'Security'}</span>
              <p className="text-xs font-black text-zinc-900 mt-0.5">SSL Encrypted</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-[9.5px] text-zinc-400 font-mono uppercase block">{isKhmer ? 'ទិន្នន័យ' : 'Database'}</span>
              <p className="text-xs font-black text-zinc-900 mt-0.5">Synced Local</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-[9.5px] text-zinc-400 font-mono uppercase block">{isKhmer ? 'ភាសា' : 'Language'}</span>
              <p className="text-xs font-black text-zinc-900 mt-0.5">Khmer / English</p>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500">
            {isKhmer
              ? 'ប្រព័ន្ធដំណើរការស្រង់វត្តមាន គ្រប់គ្រងសិស្ស និងកត់ត្រាពិន្ទុដោយស្វ័យប្រវត្តិ។'
              : 'Automated attendance, touch typing benchmarking, and student grading system.'}
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. ACTIVE FACULTY ACCOUNT & 1-CLICK SWITCHER (Smooth Base Entrance)        */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/90 shadow-sm text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-system-footer">

        {/* Active Teacher Summary */}
        <div className="flex items-center gap-3">
          <img
            src={activeTeacherData.image}
            alt={activeTeacherData.nameEn}
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-pink-800/15 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-black text-zinc-950 truncate">
                {isKhmer ? activeTeacherData.nameKh : activeTeacherData.nameEn}
              </p>
              <span className="px-1.5 py-0.2 rounded bg-pink-100 text-pink-900 text-[9.5px] font-bold font-mono">
                {isKhmer ? 'គណនីបច្ចុប្បន្ន' : 'Active'}
              </span>
            </div>
            <p className="text-[10.5px] text-zinc-500 font-mono truncate">
              {activeTeacherData.email} • {activeTeacherData.phone}
            </p>
          </div>
        </div>

        {/* Security & Access Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-zinc-50 border border-zinc-200/80">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="text-left">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block leading-none">
              {isKhmer ? 'ស្ថានភាពចូលប្រើ' : 'ACCESS STATUS'}
            </span>
            <span className="text-xs font-black text-zinc-900 font-mono">
              {isKhmer ? 'បានផ្ទៀងផ្ទាត់សុវត្ថិភាព' : 'AUTHENTICATED'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
