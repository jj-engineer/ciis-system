import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { AVATAR_COLLECTION, getDefaultAvatar } from '../../services/avatarLibrary';
import { TEACHERS_DATA } from '../../services/teacherData';
import { TeacherAuthTransitionModal } from './TeacherAuthTransitionModal';
import {
  GraduationCap,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  School,
  Check,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  X,
  Languages,
  Monitor,
  CheckSquare,
  Keyboard,
  ArrowRight,
  Sparkles,
  Command,
  ArrowLeft
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup';
  initialRole?: 'student' | 'teacher';
  skipSplash?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin',
  initialRole,
}) => {
  const { login, switchTeacher, registerStudent, getNextAutoStudentId, allProfiles, authModalRole } = useAuth();
  const { classes } = useApp();
  const { isKhmer } = useLanguage();

  const effectiveRole = initialRole || authModalRole || 'student';

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Transition Modal State (Loading & Done)
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [transitionTeacherId, setTransitionTeacherId] = useState('tekchas');

  // Student Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Student Sign Up State
  const [studentFullName, setStudentFullName] = useState('');
  const [studentClassId, setStudentClassId] = useState(classes[0]?.id || 'ciis-evening-1');
  const [selectedAvatarId, setSelectedAvatarId] = useState('avatar-std-1');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Teacher Command Access Flow State
  const [isTeacherMode, setIsTeacherMode] = useState(effectiveRole === 'teacher');
  const [teacherPassInput, setTeacherPassInput] = useState('');
  const [showTeacherPass, setShowTeacherPass] = useState(false);
  const [isTeacherVerified, setIsTeacherVerified] = useState(false);

  // Sync state when modal opens or role changes
  useEffect(() => {
    if (isOpen) {
      const isTeacher = (initialRole === 'teacher') || (authModalRole === 'teacher');
      setIsTeacherMode(isTeacher);
      setIsTeacherVerified(false);
      setTeacherPassInput('');
      setActiveTab(initialTab);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialRole, authModalRole, initialTab]);

  // Body scroll lock and Esc / Ctrl+Shift+T keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Secret Command Shortcut: CTRL + SHIFT + ENTER opens Teacher Mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'Enter' || e.code === 'Enter')) {
        e.preventDefault();
        setIsTeacherMode(true);
        setIsTeacherVerified(false);
        setErrorMessage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSignUp = activeTab === 'signup';
  const autoNextId = getNextAutoStudentId();

  // Quick fill helper for students
  const handleQuickFillStudent = (identifier: string, pass: string) => {
    setSignInIdentifier(identifier);
    setSignInPassword(pass);
  };

  // Student Sign In
  const handleStudentSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const term = (signInIdentifier || '').trim().toLowerCase();
    if (term.includes('teacher') || term.includes('tekchas') || term.includes('choeurn') || term.includes('nun') || term.includes('chandara')) {
      setTransitionTeacherId(term);
      setShowTransitionModal(true);
      return;
    }

    const res = login(signInIdentifier || 'STD-001', signInPassword, 'student');
    if (res.success) {
      setSuccessMessage(
        isKhmer
          ? 'ចូលប្រើប្រាស់ជោគជ័យក្នុងនាមជាសិស្ស!'
          : 'Signed in successfully as Student!'
      );
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 600);
    } else {
      setErrorMessage(res.error || (isKhmer ? 'គណនី ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ' : 'Invalid student credentials.'));
    }
  };

  // Student Sign Up
  const handleStudentSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!studentFullName.trim()) {
      setErrorMessage(isKhmer ? 'សូមបញ្ចូលឈ្មោះពេញរបស់សិស្ស' : 'Please enter student full name.');
      return;
    }
    if (!studentPassword.trim()) {
      setErrorMessage(isKhmer ? 'សូមបញ្ចូលពាក្យសម្ងាត់សម្រាប់សិស្ស' : 'Please create a password.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage(isKhmer ? 'សូមយល់ព្រមតាមលក្ខខណ្ឌប្រើប្រាស់' : 'Please accept the Terms & Conditions.');
      return;
    }

    const targetClass = classes.find(c => c.id === studentClassId) || classes[0];
    const selectedAvatar = AVATAR_COLLECTION.find(a => a.id === selectedAvatarId);

    const newStudent = registerStudent({
      fullName: studentFullName,
      classId: targetClass?.id || 'ciis-evening-1',
      className: targetClass?.name || 'CIIS Computer {5:30-6:30}',
      password: studentPassword,
      avatarUrl: selectedAvatar?.svgUri
    });

    setSuccessMessage(
      isKhmer
        ? `បានបង្កើតគណនីសិស្សជោគជ័យ! អត្តលេខ៖ ${newStudent.studentId}`
        : `Student registered successfully! Student ID: ${newStudent.studentId}`
    );

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 700);
  };

  // Teacher Master Password Confirmation (NO HINTS SHOWN)
  const handleVerifyTeacherPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const pass = teacherPassInput.trim();
    // Valid faculty authorization keys
    const validKeys = ['teacher123', 'ciis2026', 'ciis@teacher', 'asst123', 'admin123', 'ciis'];

    if (!validKeys.includes(pass)) {
      setErrorMessage(
        isKhmer
          ? 'ពាក្យសម្ងាត់អនុញ្ញាតគ្រូបង្រៀនមិនត្រឹមត្រូវទេ!'
          : 'Invalid Teacher Authorization Password.'
      );
      return;
    }

    setIsTeacherVerified(true);
    setErrorMessage(null);
  };

  // 1-Click Direct Teacher Log In with Loading & Done Transition Modal
  const handleDirectTeacherLogin = (teacherUsername: string, teacherFullName: string) => {
    setTransitionTeacherId(teacherUsername);
    setShowTransitionModal(true);
  };

  const handleTransitionComplete = () => {
    switchTeacher(transitionTeacherId);
    setShowTransitionModal(false);
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen overflow-y-auto flex items-center justify-center bg-zinc-950/75 backdrop-blur-md p-3 sm:p-6 transition-all duration-300"
      onClick={onClose}
      style={{ margin: 0, left: 0, top: 0, right: 0, bottom: 0 }}
    >
      {/* Split-Screen Modal Card */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white rounded-[28px] sm:rounded-[36px] shadow-2xl border border-zinc-200/90 overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-250 max-h-[92vh] select-none"
      >
        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-40 p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================================= */}
        {/* 1. LEFT PANEL: ARTISTIC HOT AIR BALLOON IN DARK GRADIENT PINK             */}
        {/* ========================================================================= */}
        <div className="w-full md:w-[45%] bg-gradient-to-br from-[#2c0417] via-[#1a020e] to-[#0c0007] text-white relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 shrink-0 min-h-[220px] md:min-h-[580px]">
          
          {/* Background Atmosphere */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-6 left-6 w-28 h-12 bg-white/10 rounded-full blur-[1px]" />
            <div className="absolute top-10 left-12 w-20 h-10 bg-white/15 rounded-full" />
            
            {/* Distant Smaller Balloon */}
            <div className="absolute top-12 left-10 opacity-70 animate-float-subtle">
              <svg width="45" height="60" viewBox="0 0 100 130">
                <ellipse cx="50" cy="45" rx="35" ry="42" fill="#be185d" />
                <path d="M 50 3 Q 32 45 42 85 L 58 85 Q 68 45 50 3 Z" fill="#ffffff" opacity="0.9" />
                <path d="M 42 85 L 45 98 L 55 98 L 58 85 Z" fill="#831843" />
                <rect x="44" y="100" width="12" height="10" rx="2" fill="#d97706" />
              </svg>
            </div>

            {/* Flying Birds */}
            <div className="absolute top-32 left-28 text-white/40">
              <svg width="30" height="16" viewBox="0 0 50 30" fill="currentColor">
                <path d="M0 15 Q 12 0 25 15 Q 38 0 50 15 Q 38 7 25 22 Q 12 7 0 15 Z" />
              </svg>
            </div>
          </div>

          {/* Top Brand Emblem */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 p-1 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md">
              <img src="/ciis-logo.svg" alt="CIIS Logo" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div>
              <h4 className="text-xs font-black tracking-wider text-white uppercase font-sans">
                {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស' : 'CIIS SCHOOL'}
              </h4>
              <p className="text-[9.5px] text-pink-300 font-mono font-bold">
                {isTeacherMode ? 'FACULTY PORTAL' : 'STUDENT PORTAL'}
              </p>
            </div>
          </div>

          {/* Centerpiece Hot Air Balloon */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto py-4">
            <div className="relative w-44 h-56 flex items-center justify-center animate-float-slow">
              <svg viewBox="0 0 200 260" className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
                <defs>
                  <linearGradient id="balloonMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#be185d" />
                    <stop offset="40%" stopColor="#9d174d" />
                    <stop offset="80%" stopColor="#831843" />
                    <stop offset="100%" stopColor="#500724" />
                  </linearGradient>
                </defs>
                <ellipse cx="100" cy="95" rx="75" ry="90" fill="url(#balloonMainGrad)" />
                <path d="M 100 5 Q 60 95 85 180 L 115 180 Q 140 95 100 5 Z" fill="#ffffff" opacity="0.95" />
                <ellipse cx="100" cy="95" rx="20" ry="88" fill="#be185d" opacity="0.9" />
                <path d="M 85 180 L 90 208 L 110 208 L 115 180 Z" fill="#500724" />
                <line x1="88" y1="208" x2="86" y2="222" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.8" />
                <line x1="112" y1="208" x2="114" y2="222" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.8" />
                <rect x="82" y="222" width="36" height="26" rx="5" fill="#d97706" />
                <line x1="82" y1="230" x2="118" y2="230" stroke="#b45309" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="text-center mt-2 space-y-1 relative z-10">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                {isTeacherMode
                  ? (isKhmer ? 'ច្រកគ្រូបង្រៀនផ្លូវការ' : 'Official Faculty Access')
                  : (isKhmer ? 'កុំព្យូទ័រ & ភាសាអង់គ្លេស' : 'Inspire Digital Minds')}
              </h3>
              <p className="text-[11px] text-pink-200/80 max-w-[240px] mx-auto leading-relaxed">
                {isTeacherMode
                  ? (isKhmer ? 'ប្រព័ន្ធគ្រប់គ្រងការបង្រៀន និងស្រង់វត្តមាន' : 'Classroom management & student evaluation')
                  : (isKhmer ? 'ហ្វឹកហាត់វាយអក្សររហ័ស និងជំនាញកុំព្យូទ័រ' : 'Practical touch typing & modern computer skills')}
              </p>
            </div>
          </div>

          {/* Bottom Security / Copyright Tag */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-pink-300/70 border-t border-white/10 pt-3">
            <span className="font-mono">CIIS LMS v2.5</span>
            <span className="flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
              {isTeacherMode ? 'Teacher Secure Mode' : 'SSL Encrypted'}
            </span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. RIGHT PANEL: FORM WORKSPACE                                            */}
        {/* ========================================================================= */}
        <div className="w-full md:w-[55%] bg-white p-6 sm:p-10 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[580px]">
          
          {/* Top Banner Alert Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ======================================================================= */}
          {/* FLOW A: TEACHER COMMAND MODE (PASSWORD CONFIRMATION -> 3 ACCOUNTS)      */}
          {/* ======================================================================= */}
          {isTeacherMode ? (
            <div className="space-y-5">
              
              {/* Back to Student Portal Button */}
              <button
                type="button"
                onClick={() => {
                  setIsTeacherMode(false);
                  setIsTeacherVerified(false);
                  setErrorMessage(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'ត្រឡប់ទៅផ្ទាំងសិស្ស (Student Portal)' : 'Back to Student Portal'}</span>
              </button>

              {/* STEP 1: Teacher Master Password Gate (when not verified) */}
              {!isTeacherVerified ? (
                <div className="space-y-5 pt-2">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-950/10 text-pink-900 border border-pink-200 text-[10.5px] font-black uppercase font-mono tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-pink-800" />
                      <span>{isKhmer ? 'ការផ្ទៀងផ្ទាត់សិទ្ធិគ្រូ' : 'TEACHER AUTHORIZATION'}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight mt-1">
                      {isKhmer ? 'បញ្ជាក់ពាក្យសម្ងាត់គ្រូបង្រៀន' : 'Enter Teacher Role Password'}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      {isKhmer
                        ? 'សូមបញ្ចូលពាក្យសម្ងាត់គ្រូបង្រៀនដើម្បីផ្ទៀងផ្ទាត់អត្តសញ្ញាណ មុនពេលជ្រើសរើសគណនី។'
                        : 'Please enter the teacher role authorization password to unlock faculty accounts.'}
                    </p>
                  </div>

                  {/* Password Input Form (NO HINTS SHOWN) */}
                  <form onSubmit={handleVerifyTeacherPassword} className="space-y-4 pt-1">
                    <div>
                      <label className="block text-xs font-black text-zinc-800 uppercase tracking-wider mb-1.5 font-mono">
                        {isKhmer ? 'ពាក្យសម្ងាត់គ្រូ (Teacher Password) *' : 'Teacher Password *'}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showTeacherPass ? 'text' : 'password'}
                          required
                          value={teacherPassInput}
                          onChange={(e) => setTeacherPassInput(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-2xl border border-zinc-200 bg-zinc-50/70 focus:bg-white focus:border-pink-800 focus:ring-2 focus:ring-pink-800/20 outline-none transition-all font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowTeacherPass(!showTeacherPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                        >
                          {showTeacherPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-800 via-pink-900 to-black hover:from-pink-700 hover:to-pink-950 text-white text-xs sm:text-sm font-black shadow-lg shadow-pink-950/20 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 border border-pink-700/30"
                    >
                      <span>{isKhmer ? 'ផ្ទៀងផ្ទាត់ & បើកបញ្ជីគណនី' : 'Confirm & Unlock Accounts'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ) : (
                /* STEP 2: 3 Teacher Accounts Grid (Direct 1-Click Log In) */
                <div className="space-y-4 pt-1">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-black uppercase font-mono tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isKhmer ? 'បានផ្ទៀងផ្ទាត់ជោគជ័យ' : 'VERIFIED FACULTY'}</span>
                    </div>
                    <h2 className="text-xl font-black text-zinc-950 tracking-tight mt-1">
                      {isKhmer ? 'ជ្រើសរើសគណនីគ្រូដើម្បីចូល' : 'Select Faculty Account'}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {isKhmer
                        ? 'ចុចលើគណនីរបស់អ្នកដើម្បីចូលប្រើប្រាស់ភ្លាមៗ'
                        : 'Click on your account card to immediately sign in.'}
                    </p>
                  </div>

                  {/* 3 Teacher Accounts Cards */}
                  <div className="space-y-2.5 pt-1">
                    {TEACHERS_DATA.map((teacher) => (
                      <div
                        key={teacher.id}
                        onClick={() => handleDirectTeacherLogin(teacher.id === 'teacher-nun-langdy' ? 'nun.langdy' : teacher.id === 'teacher-ten-chandara' ? 'ten.chandara' : 'tekchas', teacher.nameEn)}
                        className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-pink-50/50 border border-zinc-200 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={teacher.image}
                            alt={teacher.nameEn}
                            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-pink-900/20 group-hover:scale-105 transition-transform bg-white shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-black text-zinc-950 group-hover:text-pink-900 transition-colors truncate">
                              {isKhmer ? teacher.nameKh : teacher.nameEn}
                            </h4>
                            <p className="text-[10px] text-pink-800 font-extrabold uppercase font-mono truncate">
                              {isKhmer ? teacher.badgeKh : teacher.badgeEn}
                            </p>
                          </div>
                        </div>

                        <div className="px-3.5 py-1.5 rounded-xl bg-white border border-zinc-200 group-hover:bg-gradient-to-r group-hover:from-pink-800 group-hover:to-pink-950 group-hover:text-white group-hover:border-transparent text-zinc-700 text-xs font-black transition-all flex items-center gap-1 shrink-0">
                          <span>{isKhmer ? 'ចូលគណនី' : 'Log In'}</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* ======================================================================= */
            /* FLOW B: NORMAL STUDENT SIGN IN / SIGN UP                                */
            /* ======================================================================= */
            <div className="space-y-5">
              
              {/* Header Title */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                  {isSignUp
                    ? (isKhmer ? 'ចុះឈ្មោះសិស្សថ្មី' : 'Student Sign Up')
                    : (isKhmer ? 'ចូលគណនីសិស្ស' : 'Student Sign In')}
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  {isSignUp
                    ? (isKhmer ? 'បង្កើតគណនីសិស្ស និងជ្រើសរើសវេនសិក្សាក្នុង CIIS Lab' : 'Create student account & select your shift.')
                    : (isKhmer ? 'បញ្ចូលអត្តលេខសិស្ស ឬឈ្មោះដើម្បីចូលរៀន' : 'Enter your Student ID or username to log in.')}
                </p>
              </div>

              {/* Tab Switcher: Sign In vs Sign Up */}
              <div className="flex items-center p-1 bg-zinc-100 rounded-2xl border border-zinc-200/80">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signin');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    !isSignUp
                      ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/60 font-black'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isKhmer ? 'ចូលគណនី (Sign In)' : 'Sign In'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSignUp
                      ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/60 font-black'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isKhmer ? 'ចុះឈ្មោះ (Sign Up)' : 'Sign Up'}</span>
                </button>
              </div>

              {/* Student Sign In Form */}
              {!isSignUp ? (
                <form onSubmit={handleStudentSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-zinc-800 uppercase tracking-wider mb-1.5 font-mono">
                      {isKhmer ? 'អត្តលេខសិស្ស ឬឈ្មោះ (Student ID / Username) *' : 'Student ID / Username *'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signInIdentifier}
                        onChange={(e) => setSignInIdentifier(e.target.value)}
                        placeholder="e.g. STD-001 or Dara"
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-zinc-200 bg-zinc-50/70 focus:bg-white focus:border-pink-800 focus:ring-2 focus:ring-pink-800/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-800 uppercase tracking-wider mb-1.5 font-mono">
                      {isKhmer ? 'ពាក្យសម្ងាត់ (Password) *' : 'Password *'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl border border-zinc-200 bg-zinc-50/70 focus:bg-white focus:border-pink-800 focus:ring-2 focus:ring-pink-800/20 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-800 via-pink-900 to-black hover:from-pink-700 hover:to-pink-950 text-white text-xs sm:text-sm font-black shadow-lg shadow-pink-950/20 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 border border-pink-700/30"
                  >
                    <span>{isKhmer ? 'ចូលគណនីសិស្ស' : 'Sign In as Student'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Student Sign Up Form */
                <form onSubmit={handleStudentSignUp} className="space-y-3.5">
                  <div className="p-3 bg-pink-50/70 rounded-2xl border border-pink-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-pink-800 font-bold uppercase block">
                        {isKhmer ? 'អត្តលេខសិស្សស្វ័យប្រវត្តិ' : 'Auto Student ID'}
                      </span>
                      <span className="text-xs font-black text-pink-950 font-mono">{autoNextId}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-pink-800 text-white font-mono font-bold text-[9.5px]">
                      CIIS STD
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-800 uppercase tracking-wider mb-1 font-mono">
                      {isKhmer ? 'ឈ្មោះពេញរបស់សិស្ស (Full Name) *' : 'Student Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={studentFullName}
                      onChange={(e) => setStudentFullName(e.target.value)}
                      placeholder="e.g. SOK Dara"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50/70 focus:bg-white focus:border-pink-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-800 uppercase tracking-wider mb-1 font-mono">
                      {isKhmer ? 'វេនសិក្សាក្នុងបន្ទប់ Lab *' : 'Class Shift *'}
                    </label>
                    <select
                      value={studentClassId}
                      onChange={(e) => setStudentClassId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50/70 focus:bg-white focus:border-pink-800 outline-none font-bold"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.scheduleDescription})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-800 uppercase tracking-wider mb-1 font-mono">
                      {isKhmer ? 'ពាក្យសម្ងាត់សិស្ស (Password) *' : 'Password *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showStudentPassword ? 'text' : 'password'}
                        required
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full pl-3.5 pr-10 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50/70 focus:bg-white focus:border-pink-800 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStudentPassword(!showStudentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                      >
                        {showStudentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-800 via-pink-900 to-black hover:from-pink-700 hover:to-pink-950 text-white text-xs font-black shadow-lg shadow-pink-950/20 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 border border-pink-700/30"
                  >
                    <span>{isKhmer ? 'បង្កើតគណនីសិស្សថ្មី' : 'Create Student Account'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

            </div>
          )}

        </div>

      </div>

      {showTransitionModal && (
        <TeacherAuthTransitionModal
          isOpen={showTransitionModal}
          teacherIdentifier={transitionTeacherId}
          onComplete={handleTransitionComplete}
        />
      )}
    </div>,
    document.body
  );
};
