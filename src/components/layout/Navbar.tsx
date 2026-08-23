import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDefaultAvatar } from '../../services/avatarLibrary';
import { AuthModal } from '../auth/AuthModal';
import {
  Search,
  Bell,
  Menu,
  School,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  X,
  Languages,
  Globe,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';

interface NavbarProps {
  activeTabTitle: string;
  onVisitWebsite?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTabTitle,
  onVisitWebsite
}) => {
  const { currentUser, isStudent, isTeacher, logout, showAuthModal, setShowAuthModal } = useAuth();
  const {
    classes,
    selectedClassId,
    setSelectedClassId,
    notifications,
    markNotificationRead
  } = useApp();
  const { language, setLanguage, isKhmer, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left: Current Page Title & Role Badge */}
      <div className="flex items-center gap-2.5 min-w-0">
        <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-tight truncate">
          {activeTabTitle}
        </h1>
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-pink-900 text-[10px] font-extrabold font-mono shrink-0">
          {isStudent ? (isKhmer ? 'សិស្ស' : 'Student') : (isKhmer ? 'គ្រូបង្រៀន' : 'Faculty')}
        </span>
      </div>

      {/* Right Controls: Class selector, Search, Language Switcher, Notifications, Auth/Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Class Selector for Teachers */}
        {!isStudent ? (
          <div className="relative hidden lg:flex items-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-pink-300 hover:shadow-xs transition-all">
              <School className="w-3.5 h-3.5 text-pink-700" />
              <span>{isKhmer ? 'ថ្នាក់៖' : 'Class:'}</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-transparent font-bold text-pink-700 border-none outline-none cursor-pointer pr-2 hover:text-pink-800 transition-colors"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.studentCount} {isKhmer ? 'សិស្ស' : 'students'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          /* Enrolled Class Pill for Students */
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-900 font-extrabold shadow-2xs hover:bg-pink-100/70 hover:scale-[1.02] transition-all cursor-default">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{currentUser.className || 'CIIS Computer {5:30-6:30}'}</span>
          </div>
        )}

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-36 lg:w-48">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('action.search', undefined, 'Search...')}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 transition-all placeholder:text-slate-400 hover:border-slate-300"
          />
        </div>

        {/* 1-Click EN | ខ្មែរ Bilingual Language Switcher Pill with hover & lift */}
        <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-xs">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all transform ${
              language === 'en'
                ? 'bg-pink-700 text-white shadow-xs scale-105'
                : 'text-slate-600 hover:text-pink-700 hover:bg-white/80'
            }`}
            title="English Language"
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('km')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all transform ${
              language === 'km'
                ? 'bg-pink-700 text-white shadow-xs scale-105'
                : 'text-slate-600 hover:text-pink-700 hover:bg-white/80'
            }`}
            title="ភាសាខ្មែរ (Khmer Language)"
          >
            ខ្មែរ
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-pink-700 hover:bg-pink-50 rounded-xl transition-all hover:scale-105"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-pink-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-modal border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm">
                  {isKhmer ? 'សេចក្តីជូនដំណឹង' : 'Notifications'}
                </h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 text-center">
                    {isKhmer ? 'មិនមានសេចក្តីជូនដំណឹងថ្មីទេ' : 'No notifications yet'}
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer ${
                        !n.isRead ? 'bg-pink-50/40' : ''
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-pink-100 text-pink-700 shrink-0">
                        {n.iconType === 'assignment' ? (
                          <BookOpen className="w-4 h-4" />
                        ) : n.iconType === 'grade' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Sign In Pill */}
        <div className="relative">
          {!currentUser ? (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-pink-700 to-pink-900 hover:from-pink-800 hover:to-pink-950 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isKhmer ? 'ចូលប្រើប្រាស់' : 'Sign In'}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-slate-50 hover:bg-pink-50 rounded-2xl border border-slate-200/80 transition-all text-left cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatarUrl || getDefaultAvatar(currentUser.role, currentUser.studentId || currentUser.fullName)}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-pink-600/20"
                  />
                  <div className={`absolute -bottom-1 -right-1 p-0.5 rounded-full ${isTeacher ? 'bg-pink-700 text-white' : 'bg-blue-600 text-white'} shadow-xs`}>
                    {isTeacher ? <GraduationCap className="w-2 h-2" /> : <User className="w-2 h-2" />}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-extrabold text-slate-900 leading-tight truncate max-w-[120px]">
                    {currentUser.fullName}
                  </p>
                  <p className="text-[10px] font-bold text-pink-700 uppercase tracking-wider">
                    {isTeacher ? (isKhmer ? 'គ្រូបង្រៀន (Teacher)' : 'Teacher') : (isKhmer ? 'សិស្ស (Student)' : 'Student')}
                  </p>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-modal border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                    {currentUser.studentId && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-pink-50 text-pink-900 font-mono text-[9px] font-bold">
                        {currentUser.studentId}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setShowAuthModal(true);
                      }}
                      className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-pink-50 hover:text-pink-700 flex items-center gap-2 text-left cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5 text-pink-700" />
                      <span>{isKhmer ? 'ចូលគណនី / ប្តូរគណនី' : 'Sign In / Switch User'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isKhmer ? 'ចាកចេញ (Sign Out)' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </header>
  );
};
