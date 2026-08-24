import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDefaultAvatar } from '../../services/avatarLibrary';
import {
  LayoutDashboard,
  CheckSquare,
  ClipboardList,
  BookOpen,
  Keyboard,
  Upload,
  Menu,
  X,
  User,
  GraduationCap,
  Briefcase,
  Settings,
  Calendar,
  BarChart3,
  Bot,
  KeyRound,
  Users,
  ArrowLeft,
  Globe,
  Monitor
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onVisitWebsite?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, onVisitWebsite }) => {
  const { currentUser, isStudent, isTeacher } = useAuth();
  const { isKhmer, language, setLanguage } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Bottom primary tabs for quick one-thumb navigation
  const bottomTabs = isStudent
    ? [
        { id: 'dashboard', label: isKhmer ? 'ទំព័រដើម' : 'Home', icon: LayoutDashboard },
        { id: 'lessons', label: isKhmer ? 'មេរៀន' : 'Lessons', icon: BookOpen },
        { id: 'typing', label: isKhmer ? 'វាយអក្សរ' : 'Typing', icon: Keyboard },
        { id: 'assignments', label: isKhmer ? 'កិច្ចការ' : 'Tasks', icon: ClipboardList },
      ]
    : [
        { id: 'dashboard', label: isKhmer ? 'ទំព័រដើម' : 'Home', icon: LayoutDashboard },
        { id: 'attendance', label: isKhmer ? 'វត្តមាន' : 'Attendance', icon: CheckSquare },
        { id: 'students', label: isKhmer ? 'សិស្ស' : 'Students', icon: Users },
        { id: 'typing', label: isKhmer ? 'វាយអក្សរ' : 'Typing', icon: Keyboard },
      ];

  // Full Drawer Navigation Items
  const allNavItems = isStudent
    ? [
        { id: 'dashboard', label: isKhmer ? 'ផ្ទាំងដើម' : 'Home Dashboard', icon: LayoutDashboard },
        { id: 'teacher-profile', label: isKhmer ? 'ប្រវត្តិរូបគ្រូ' : 'Teacher Profiles', icon: GraduationCap },
        { id: 'lessons', label: isKhmer ? 'មេរៀន & មាតិកា' : 'Lessons & Content', icon: BookOpen },
        { id: 'assignments', label: isKhmer ? 'កិច្ចការ & ប្រឡង' : 'Assessments & Homework', icon: ClipboardList },
        { id: 'typing', label: isKhmer ? 'ហ្វឹកហាត់វាយអក្សរ' : 'Typing Speed Lab', icon: Keyboard },
        { id: 'submissions', label: isKhmer ? 'ផ្ញើកិច្ចការ & ឯកសារ' : 'Upload Submissions', icon: Upload },
        { id: 'calendar', label: isKhmer ? 'កាលវិភាគសិក្សា' : 'Class Calendar', icon: Calendar },
        { id: 'profile', label: isKhmer ? 'គណនីផ្ទាល់ខ្លួន' : 'My Profile', icon: User },
      ]
    : [
        { id: 'dashboard', label: isKhmer ? 'ផ្ទាំងការងារគ្រូ' : 'Teacher Dashboard', icon: LayoutDashboard },
        { id: 'teacher-profile', label: isKhmer ? 'ប្រវត្តិរូបគ្រូ' : 'Faculty Profile', icon: GraduationCap },
        { id: 'workspace', label: isKhmer ? 'កន្លែងការងាររហ័ស' : 'Teacher Workspace', icon: Briefcase },
        { id: 'attendance', label: isKhmer ? 'ស្រង់វត្តមានសិស្ស' : 'Take Attendance', icon: CheckSquare },
        { id: 'students', label: isKhmer ? 'បញ្ជីសិស្សទាំងអស់' : 'Student Directory', icon: Users },
        { id: 'student-credentials', label: isKhmer ? 'គណនី & ពាក្យសម្ងាត់សិស្ស' : 'Student Accounts', icon: KeyRound },
        { id: 'assignments', label: isKhmer ? 'កិច្ចការ & កែពិន្ទុ' : 'Assignments & Grading', icon: ClipboardList },
        { id: 'typing', label: isKhmer ? 'ហ្វឹកហាត់វាយអក្សរ' : 'Typing Speed Lab', icon: Keyboard },
        { id: 'submissions', label: isKhmer ? 'កិច្ចការសិស្សផ្ញើ' : 'Student Submissions', icon: Upload },
        { id: 'lab', label: isKhmer ? 'បន្ទប់កុំព្យូទ័រ' : 'Computer Lab Live', icon: Monitor },
        { id: 'reports', label: isKhmer ? 'របាយការណ៍សាលា' : 'Academic Reports', icon: BarChart3 },
        { id: 'ai-assistant', label: isKhmer ? 'ជំនួយការ AI' : 'AI Assistant', icon: Bot },
        { id: 'settings', label: isKhmer ? 'ការកំណត់ប្រព័ន្ធ' : 'System Settings', icon: Settings },
      ];

  return (
    <>
      {/* ============================================================== */}
      {/* 1. BOTTOM GLASSMORPHIC APP DOCK FOR MOBILE PHONES              */}
      {/* ============================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 z-40 px-2 py-1.5 flex items-center justify-around shadow-2xl select-none safe-area-bottom">
        {bottomTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer min-w-[56px] min-h-[46px] ${
                isActive
                  ? 'bg-pink-50 text-pink-900 font-black scale-105 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 active:scale-95'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px] text-pink-800' : 'stroke-2'}`} />
              <span className={`text-[10px] mt-0.5 tracking-tight truncate ${isActive ? 'font-black text-pink-950' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Menu Drawer Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer min-w-[56px] min-h-[46px] ${
            drawerOpen
              ? 'bg-pink-50 text-pink-900 font-black'
              : 'text-slate-500 hover:text-slate-900 active:scale-95'
          }`}
        >
          <Menu className="w-5 h-5 stroke-2" />
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">
            {isKhmer ? 'ច្រើនទៀត' : 'More'}
          </span>
        </button>
      </nav>

      {/* ============================================================== */}
      {/* 2. SLIDE-OVER MOBILE SYSTEM DRAWER WITH FLUID MOTION           */}
      {/* ============================================================== */}
      {/* Backdrop with smooth opacity fade */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer Panel with Spring-like Slide Motion */}
      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 w-[85%] max-w-xs bg-white h-full shadow-2xl z-50 flex flex-col justify-between p-5 safe-area-top transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="space-y-4 overflow-hidden flex flex-col flex-1">
          
          {/* Drawer Top Header with subtle stagger entrance */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md border border-pink-200 shrink-0 hover:scale-105 transition-transform">
                <img src="/ciis-logo.svg" alt="CIIS" className="w-full h-full object-contain" />
              </div>
              <div className="overflow-hidden min-w-0">
                <span className="font-black text-xs text-slate-950 truncate block uppercase leading-tight">
                  {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស' : 'CIIS SCHOOL'}
                </span>
                <span className="text-[9.5px] text-pink-800 font-extrabold uppercase truncate block font-mono">
                  {isTeacher ? (isKhmer ? 'ប្រព័ន្ធគ្រប់គ្រងគ្រូ' : 'Faculty Portal') : (isKhmer ? 'ប្រព័ន្ធសិស្ស' : 'Student Portal')}
                </span>
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 hover:rotate-90 transition-all cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Single Back to Public Website Button */}
          {onVisitWebsite && (
            <div className="shrink-0">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onVisitWebsite();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-100/90 hover:bg-pink-50 border border-slate-200/90 hover:border-pink-300 text-slate-800 text-xs font-black transition-all cursor-pointer shadow-2xs group"
                title="Back to Public Website"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-pink-800 group-hover:-translate-x-1 transition-transform" />
                  <span className="uppercase tracking-wider text-[11px] font-bold">
                    {isKhmer ? 'ត្រឡប់វិញ' : 'Back to Website'}
                  </span>
                </div>
                <span className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded-lg font-mono border border-slate-200 shadow-2xs">
                  {isKhmer ? 'គេហទំព័រ' : 'Web'}
                </span>
              </button>
            </div>
          )}

          {/* Navigation Links Scroll Area with smooth hover & tap animation */}
          <div className="py-2 space-y-1 overflow-y-auto flex-1 pr-1">
            {allNavItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setDrawerOpen(false);
                  }}
                  style={{
                    transitionDelay: drawerOpen ? `${idx * 20}ms` : '0ms'
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-100 via-pink-50 to-white text-pink-950 font-black border border-pink-200 shadow-xs translate-x-1'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform ${isActive ? 'bg-pink-800 text-white scale-105 shadow-xs' : 'text-slate-500'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* User Profile Footer Card */}
        <div className="pt-3 border-t border-slate-100 shrink-0 space-y-2">
          <div
            onClick={() => {
              setActiveTab('profile');
              setDrawerOpen(false);
            }}
            className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 border border-slate-100 hover:border-pink-200 transition-all cursor-pointer hover:bg-pink-50/50"
          >
            <img
              src={currentUser?.avatarUrl || getDefaultAvatar(currentUser?.role, currentUser?.studentId || currentUser?.fullName)}
              alt={currentUser?.fullName || 'User'}
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-pink-800/30 bg-white"
            />
            <div className="overflow-hidden min-w-0">
              <p className="font-extrabold text-xs text-slate-950 truncate">{currentUser?.fullName || 'Guest'}</p>
              <p className="text-[10px] text-pink-800 font-bold uppercase font-mono">
                {isTeacher ? (isKhmer ? 'គ្រូបង្រៀន (Teacher)' : 'Lead Teacher') : (currentUser?.studentId || 'STD-001')}
              </p>
            </div>
          </div>

          {/* Language Switcher Quick Pill */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100 text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-pink-700" />
              <span>{isKhmer ? 'ភាសា' : 'Language'}</span>
            </div>
            <span className="font-mono text-pink-900 font-black">{language === 'km' ? 'English' : 'ភាសាខ្មែរ'}</span>
          </button>
        </div>

      </div>
    </>
  );
};
