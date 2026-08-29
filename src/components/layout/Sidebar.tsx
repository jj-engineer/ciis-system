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
    <aside className="w-60 sm:w-64 bg-white border-r border-zinc-200/90 flex flex-col h-full shrink-0 select-none shadow-sm z-30 relative overflow-hidden font-sans animate-slide-in-left">
      
      {/* 1. BRAND HEADER */}
      <div className="p-5 flex items-center gap-3 border-b border-zinc-100 bg-white">
        <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs border border-zinc-200 shrink-0">
          <img src="/ciis-logo.svg" alt="CIIS Logo" className="w-full h-full object-contain" />
        </div>
        <div className="overflow-hidden min-w-0">
          <h1 className="text-xs sm:text-[13px] font-black text-zinc-950 tracking-tight leading-tight uppercase truncate">
            {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស' : 'CIIS SCHOOL'}
          </h1>
          <p className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider truncate font-mono mt-0.5">
            CIIS TECH SYSTEM
          </p>
        </div>
      </div>

      {/* Single Back to Public Website Button */}
      {onVisitWebsite && (
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={onVisitWebsite}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/70 border border-zinc-200/80 text-zinc-700 hover:text-zinc-950 text-xs font-black transition-all cursor-pointer shadow-2xs group spring-press"
            title={isKhmer ? 'ត្រឡប់ទៅគេហទំព័រដើមវិញ' : 'Back to Public Website'}
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-950 group-hover:-translate-x-0.5 transition-transform" />
              <span className="uppercase tracking-wider text-[11px] font-bold">
                {isKhmer ? 'ត្រឡប់វិញ' : 'Back'}
              </span>
            </div>
            <span className="text-[9.5px] px-2 py-0.5 rounded bg-white text-zinc-600 font-mono font-bold border border-zinc-200">
              {isKhmer ? 'គេហទំព័រ' : 'Web'}
            </span>
          </button>
        </div>
      )}

      {/* 2. NAVIGATION LINKS WITH MODERN MINIMALIST ACTIVE STYLE */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (isActive) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center justify-between p-2 pl-2.5 rounded-xl bg-zinc-900 text-white border border-zinc-900 shadow-sm font-bold cursor-pointer transition-all duration-150 relative group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 text-white flex items-center justify-center shrink-0 border border-zinc-700">
                    <Icon className="w-3.5 h-3.5 text-zinc-100" />
                  </div>
                  <span className="text-xs font-bold tracking-wider uppercase text-white truncate">
                    {isKhmer ? item.labelKh : item.labelEn}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mr-1">
                  {item.badge && (
                    <span className="text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 font-mono bg-zinc-800 text-zinc-200 border border-zinc-700">
                      {item.badge}
                    </span>
                  )}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center justify-between p-2 pl-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-transparent transition-all duration-150 group cursor-pointer nav-spring"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-zinc-800 group-hover:bg-zinc-200/60 transition-colors shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="tracking-wide uppercase text-zinc-700 group-hover:text-zinc-950 truncate text-[11.5px] transition-colors">
                  {isKhmer ? item.labelKh : item.labelEn}
                </span>
              </div>

              {item.badge && (
                <span className="text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 font-mono bg-zinc-100 text-zinc-500 border border-zinc-200 mr-1">
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
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-500 hover:text-pink-950 hover:bg-pink-50 transition-all cursor-pointer text-xs font-black tracking-wider uppercase group hover:translate-x-1 spring-press"
        >
          <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-pink-900 group-hover:scale-110 transition-transform" />
          <span>{isKhmer ? 'ចាកចេញ' : 'LOGOUT'}</span>
        </button>
      </div>

    </aside>
  );
};
