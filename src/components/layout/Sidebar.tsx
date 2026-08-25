import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDefaultAvatar } from '../../services/avatarLibrary';
import {
  LayoutDashboard,
  Users,
  School,
  CheckSquare,
  BookOpen,
  ClipboardList,
  Keyboard,
  FileSpreadsheet,
  Monitor,
  Calendar,
  BarChart3,
  Bot,
  Settings,
  TrendingUp,
  User,
  GraduationCap,
  Briefcase,
  Zap,
  Upload,
  KeyRound,
  LogOut,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed?: boolean;
  onVisitWebsite?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onVisitWebsite
}) => {
  const { currentUser, isStudent, isTeacher, logout } = useAuth();
  const { t, isKhmer } = useLanguage();

  // Define navigation items with uppercase labels matching the sample design
  let navItems: { id: string; labelEn: string; labelKh: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [];

  if (isStudent) {
    navItems = [
      { id: 'dashboard', labelEn: 'HOME', labelKh: 'ទំព័រដើម', icon: LayoutDashboard },
      { id: 'teacher-profile', labelEn: 'TEACHERS', labelKh: 'ប្រវត្តិរូបគ្រូ', icon: GraduationCap },
      { id: 'lessons', labelEn: 'LESSONS', labelKh: 'មេរៀន', icon: BookOpen },
      { id: 'calendar', labelEn: 'SCHEDULE', labelKh: 'កាលវិភាគ', icon: Calendar },
      { id: 'assignments', labelEn: 'ASSESSMENTS', labelKh: 'កិច្ចការ & ប្រឡង', icon: ClipboardList, badge: 'Active' },
      { id: 'typing', labelEn: 'TYPING LAB', labelKh: 'វាយអក្សរ', icon: Keyboard },
    ];
  } else {
    // Teacher
    navItems = [
      { id: 'dashboard', labelEn: 'HOME', labelKh: 'ទំព័រដើម', icon: LayoutDashboard },
      { id: 'lab', labelEn: 'COMPUTER LAB', labelKh: 'បន្ទប់កុំព្យូទ័រ', icon: Monitor, badge: 'Live' },
      { id: 'teacher-profile', labelEn: 'TEACHERS', labelKh: 'ប្រវត្តិរូបគ្រូ', icon: GraduationCap },
      { id: 'lessons', labelEn: 'LESSONS', labelKh: 'មេរៀន', icon: BookOpen },
      { id: 'calendar', labelEn: 'SCHEDULE', labelKh: 'កាលវិភាគ', icon: Calendar },
      { id: 'assignments', labelEn: 'ASSESSMENTS', labelKh: 'កិច្ចការ & ប្រឡង', icon: ClipboardList },
      { id: 'attendance', labelEn: 'ATTENDANCE', labelKh: 'ស្រង់វត្តមាន', icon: CheckSquare, badge: 'Fast' },
      { id: 'students', labelEn: 'STUDENTS', labelKh: 'បញ្ជីសិស្ស', icon: Users },
      { id: 'student-credentials', labelEn: 'ACCOUNTS', labelKh: 'គណនីសិស្ស', icon: KeyRound },
      { id: 'typing', labelEn: 'TYPING LAB', labelKh: 'វាយអក្សរ', icon: Keyboard },
      { id: 'reports', labelEn: 'REPORTS', labelKh: 'របាយការណ៍', icon: BarChart3 },
      { id: 'ai-assistant', labelEn: 'AI ASSIST', labelKh: 'ជំនួយការ AI', icon: Bot, badge: 'AI' },
      { id: 'settings', labelEn: 'SETTINGS', labelKh: 'ការកំណត់', icon: Settings },
    ];
  }

  return (
    <aside className="w-60 sm:w-64 bg-white border-r border-zinc-200/90 flex flex-col h-full shrink-0 select-none shadow-sm z-30 relative overflow-hidden font-sans">
      
      {/* 1. BRAND HEADER (Matching Sample Design: Logo + Website Name) */}
      <div className="p-5 flex items-center gap-3 border-b border-zinc-100 bg-white">
        <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md border border-pink-200 shrink-0">
          <img src="/ciis-logo.svg" alt="CIIS Logo" className="w-full h-full object-contain" />
        </div>
        <div className="overflow-hidden min-w-0">
          <h1 className="text-xs sm:text-[13px] font-black text-zinc-950 tracking-tight leading-tight uppercase truncate">
            {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស' : 'CIIS SCHOOL'}
          </h1>
          <p className="text-[9px] text-pink-800 font-extrabold uppercase tracking-wider truncate font-mono mt-0.5">
            CIIS TECH SYSTEM
          </p>
        </div>
      </div>

      {/* Single Back to Public Website Button */}
      {onVisitWebsite && (
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={onVisitWebsite}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/90 hover:bg-pink-50 border border-slate-200/90 hover:border-pink-300 text-slate-700 hover:text-pink-950 text-xs font-black transition-all cursor-pointer shadow-2xs group"
            title={isKhmer ? 'ត្រឡប់ទៅគេហទំព័រដើមវិញ' : 'Back to Public Website'}
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-800 group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-wider text-[11px] font-bold">
                {isKhmer ? 'ត្រឡប់វិញ' : 'Back'}
              </span>
            </div>
            <span className="text-[9.5px] px-2 py-0.5 rounded bg-white text-slate-600 group-hover:text-pink-800 font-mono font-bold border border-slate-200">
              {isKhmer ? 'គេហទំព័រ' : 'Web'}
            </span>
          </button>
        </div>
      )}

      {/* 2. NAVIGATION LINKS WITH CLEAN MOTION & SOFT PINK ACTIVE STYLE */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (isActive) {
            return (
              /* Active Item with Clean Pink Gradient & Icon Badge */
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center justify-between p-2 pl-2.5 rounded-2xl bg-gradient-to-r from-pink-100/90 via-pink-50 to-white text-pink-950 border border-pink-200/90 shadow-xs font-black cursor-pointer transition-all duration-200 relative group transform translate-x-1"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Clean Pink Icon Capsule */}
                  <div className="w-8 h-8 rounded-xl bg-pink-800 text-white flex items-center justify-center shrink-0 shadow-sm shadow-pink-800/30 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4 text-pink-100" />
                  </div>
                  <span className="text-xs font-black tracking-wider uppercase text-pink-950 truncate">
                    {isKhmer ? item.labelKh : item.labelEn}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mr-1">
                  {item.badge && (
                    <span className="text-[8.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 font-mono bg-pink-800 text-white shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-800 animate-pulse" />
                </div>
              </button>
            );
          }

          return (
            /* Inactive Item with Smooth Hover Motion & Micro-animations */
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center justify-between p-2 pl-2.5 rounded-2xl text-xs font-extrabold text-zinc-600 hover:text-pink-950 hover:bg-gradient-to-r hover:from-pink-50/70 hover:to-zinc-50/50 border border-transparent hover:border-pink-200/60 transition-all duration-200 group cursor-pointer transform hover:translate-x-1.5 hover:shadow-2xs active:scale-98"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-pink-800 group-hover:bg-pink-100/60 transition-all duration-200 shrink-0">
                  <Icon className="w-4 h-4 group-hover:scale-120 group-hover:rotate-6 transition-transform duration-200 ease-out" />
                </div>
                <span className="tracking-wide uppercase text-zinc-700 group-hover:text-pink-950 truncate text-[11.5px] group-hover:font-black transition-colors">
                  {isKhmer ? item.labelKh : item.labelEn}
                </span>
              </div>

              {item.badge && (
                <span className="text-[8.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 font-mono bg-zinc-100 text-zinc-600 border border-zinc-200 group-hover:border-pink-200 group-hover:bg-pink-50 group-hover:text-pink-900 transition-colors mr-1">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. USER PROFILE & LOGOUT FOOTER */}
      <div className="p-4 border-t border-zinc-100 bg-zinc-50/70 space-y-3">
        {/* User Profile Chip */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 cursor-pointer group hover:bg-white p-1.5 rounded-2xl transition-all border border-transparent hover:border-pink-200/70 hover:shadow-2xs"
        >
          <img
            src={currentUser?.avatarUrl || getDefaultAvatar(currentUser?.role, currentUser?.studentId || currentUser?.fullName)}
            alt={currentUser?.fullName || 'User'}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-800/30 group-hover:scale-105 transition-transform shrink-0 bg-white"
          />
          <div className="overflow-hidden min-w-0">
            <p className="text-xs font-black text-zinc-950 uppercase tracking-tight truncate leading-tight group-hover:text-pink-950 transition-colors">
              {currentUser?.fullName || 'Teacher'}
            </p>
            <p className="text-[9.5px] text-pink-800 font-bold uppercase tracking-wider truncate font-mono">
              {isTeacher ? (isKhmer ? 'គ្រូបង្រៀន' : 'Faculty') : (isKhmer ? 'សិស្ស' : 'Student')}
            </p>
          </div>
        </div>

        {/* Minimalist Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-500 hover:text-pink-950 hover:bg-pink-50 transition-all cursor-pointer text-xs font-black tracking-wider uppercase group hover:translate-x-1"
        >
          <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-pink-900 group-hover:scale-110 transition-transform" />
          <span>{isKhmer ? 'ចាកចេញ' : 'LOGOUT'}</span>
        </button>
      </div>

    </aside>
  );
};
