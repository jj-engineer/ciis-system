import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { TEACHERS_DATA, TeacherProfile } from '../../services/teacherData';
import { TeacherAuthTransitionModal } from '../../components/auth/TeacherAuthTransitionModal';
import {
  GraduationCap,
  Mail,
  Phone,
  Clock,
  Award,
  BookOpen,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  User,
  Laptop,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const TeacherProfilePage: React.FC = () => {
  const { isKhmer } = useLanguage();
  const { currentUser, isTeacher, switchTeacher } = useAuth();

  // Match initial teacher with logged in user if applicable
  const getInitialTeacher = () => {
    const uName = (currentUser?.username || '').toLowerCase();
    const fName = (currentUser?.fullName || '').toLowerCase();
    if (uName.includes('tekchas') || fName.includes('tekchas') || fName.includes('choeurn')) {
      return TEACHERS_DATA[2];
    }
    if (uName.includes('chandara') || fName.includes('chandara') || fName.includes('ten')) {
      return TEACHERS_DATA[1];
    }
    return TEACHERS_DATA[0];
  };

  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile>(getInitialTeacher());
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [transitionTeacherId, setTransitionTeacherId] = useState('tekchas');

  useEffect(() => {
    if (currentUser) {
      setSelectedTeacher(getInitialTeacher());
    }
  }, [currentUser]);

  const isCurrentLoggedInTeacher = React.useMemo(() => {
    const uName = (currentUser?.username || '').toLowerCase();
    const fName = (currentUser?.fullName || '').toLowerCase();
    if (selectedTeacher.id === 'teacher-choeurn-tekchas') {
      return uName.includes('tekchas') || fName.includes('tekchas') || fName.includes('choeurn');
    }
    if (selectedTeacher.id === 'teacher-ten-chandara') {
      return uName.includes('chandara') || fName.includes('chandara') || fName.includes('ten');
    }
    if (selectedTeacher.id === 'teacher-nun-langdy') {
      return uName.includes('nun') || fName.includes('nun') || fName.includes('langdy');
    }
    return false;
  }, [currentUser, selectedTeacher]);

  return (
    <div className="space-y-6 antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-950/10 text-pink-900 border border-pink-200 text-xs font-black font-mono">
            <GraduationCap className="w-3.5 h-3.5 text-pink-800" />
            <span>{isKhmer ? 'ព័ត៌មានលម្អិតអំពីលោកគ្រូអ្នកគ្រូ' : 'FACULTY DIRECTORY'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
            {isKhmer ? 'ប្រវត្តិរូបលោកគ្រូអ្នកគ្រូ CIIS' : 'Teacher Profiles'}
          </h1>
        </div>

        {/* Teacher Quick Switcher Pills */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-zinc-200 shadow-xs flex-wrap gap-1">
          {TEACHERS_DATA.map((t) => {
            const isSelected = selectedTeacher.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTeacher(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-800 to-pink-950 text-white shadow-md shadow-pink-950/20 border border-pink-700/30'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <img src={t.image} alt={t.nameEn} className="w-4 h-4 rounded-full object-cover" />
                <span>{isKhmer ? t.nameKh : t.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Teacher Hero Card + Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Teacher Overview & Bio Card (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-6 text-center sm:text-left">
            {/* Avatar & Role */}
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-pink-900/20 shadow-xl border-2 border-pink-700/40 bg-zinc-950">
                  <img
                    src={selectedTeacher.image}
                    alt={selectedTeacher.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 p-1 rounded-xl bg-pink-800 text-white shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="px-3 py-1 rounded-full bg-pink-950/10 text-pink-900 border border-pink-200 text-[10.5px] font-black uppercase font-mono tracking-wider inline-block">
                  {isKhmer ? selectedTeacher.badgeKh : selectedTeacher.badgeEn}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                  {isKhmer ? selectedTeacher.nameKh : selectedTeacher.nameEn}
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                  {isKhmer ? selectedTeacher.roleTitleKh : selectedTeacher.roleTitleEn}
                </p>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2.5 text-xs text-left">
              <div className="flex items-center gap-2.5 text-zinc-700">
                <Mail className="w-4 h-4 text-pink-800 shrink-0" />
                <a href={`mailto:${selectedTeacher.email}`} className="font-mono hover:text-pink-900 truncate">
                  {selectedTeacher.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-700">
                <Phone className="w-4 h-4 text-pink-800 shrink-0" />
                <a href={`tel:${selectedTeacher.phone}`} className="font-mono font-bold hover:text-pink-900">
                  {selectedTeacher.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-700">
                <Clock className="w-4 h-4 text-pink-800 shrink-0" />
                <span className="font-mono text-[11.5px]">{isKhmer ? selectedTeacher.scheduleKh : selectedTeacher.scheduleEn}</span>
              </div>
            </div>

            {/* Switch to this Teacher Account Action Pill (Only accessible if already logged in as teacher) */}
            {isTeacher && (
              <div className="p-3.5 rounded-2xl border bg-gradient-to-r from-pink-50/70 to-zinc-50 flex items-center justify-between gap-3">
                <div className="text-left min-w-0">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                    {isKhmer ? 'ស្ថានភាពគណនី' : 'Account Status'}
                  </span>
                  <p className="text-xs font-black text-zinc-900 truncate">
                    {isCurrentLoggedInTeacher
                      ? (isKhmer ? '● កំពុងប្រើប្រាស់គណនីនេះ' : '● Currently Logged In')
                      : (isKhmer ? 'គណនីគ្រូដែលអាចប្តូរបាន' : 'Available Faculty Account')}
                  </p>
                </div>

                {!isCurrentLoggedInTeacher ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTransitionTeacherId(selectedTeacher.id);
                      setShowTransitionModal(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-800 to-pink-950 hover:from-pink-700 hover:to-pink-900 text-white text-xs font-black shadow-md shadow-pink-950/20 cursor-pointer flex items-center gap-1.5 transition-all shrink-0 hover:scale-105"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                    <span>{isKhmer ? 'ប្តូរប្រើគណនីនេះ' : 'Switch Account'}</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isKhmer ? 'សកម្ម' : 'Active'}</span>
                  </span>
                )}
              </div>
            )}

            {/* Quote */}
            <blockquote className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/5 via-pink-900/10 to-transparent border-l-4 border-pink-800 italic text-xs text-zinc-700 leading-relaxed text-left">
              "{isKhmer ? selectedTeacher.quoteKh : selectedTeacher.quoteEn}"
            </blockquote>

            {/* Bio */}
            <div className="space-y-2 text-left">
              <h4 className="text-xs font-black uppercase text-zinc-400 font-mono tracking-wider">
                {isKhmer ? 'ជីវប្រវត្តិ & ការប្តេជ្ញាចិត្ត' : 'Biography & Vision'}
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {isKhmer ? selectedTeacher.bioKh : selectedTeacher.bioEn}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Skills, Education, Shift Classes & Experience (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Class Shifts Assigned */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-sm font-black text-zinc-950 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-800" />
                <span>{isKhmer ? 'វេនបង្រៀនដែលទទួលបន្ទុក' : 'Assigned Class Shifts'}</span>
              </h3>
              <span className="text-xs font-bold text-pink-800 font-mono">
                {isKhmer ? selectedTeacher.classesCountKh : selectedTeacher.classesCountEn}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-800 to-pink-950 text-white shadow-md shadow-pink-950/20 border border-pink-700/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-pink-200 font-mono">
                <span className="font-bold">CIIS Computer Lab 1</span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9.5px] font-black uppercase">LIVE SCHEDULE</span>
              </div>
              <h4 className="text-base font-black text-white">
                {isKhmer ? selectedTeacher.subjectKh : selectedTeacher.subjectEn}
              </h4>
              <p className="text-xs text-pink-100/90 font-mono">
                {isKhmer ? selectedTeacher.scheduleKh : selectedTeacher.scheduleEn}
              </p>
            </div>
          </div>

          {/* Education & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-900 flex items-center justify-center border border-pink-200">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">
                {isKhmer ? 'កម្រិតវប្បធម៌ & សញ្ញាបត្រ' : 'Education'}
              </span>
              <p className="text-xs font-black text-zinc-950 leading-snug">
                {isKhmer ? selectedTeacher.educationKh : selectedTeacher.educationEn}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-900 to-pink-950 text-white flex items-center justify-center border border-pink-800">
                <Award className="w-5 h-5 text-pink-200" />
              </div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">
                {isKhmer ? 'បទពិសោធន៍ការងារ' : 'Experience'}
              </span>
              <p className="text-xs font-black text-zinc-950 leading-snug">
                {isKhmer ? selectedTeacher.experienceKh : selectedTeacher.experienceEn}
              </p>
            </div>
          </div>

          {/* Technical Skills & Expertise Badges */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-zinc-950 flex items-center gap-2 pb-2 border-b border-zinc-100">
              <Layers className="w-4 h-4 text-pink-800" />
              <span>{isKhmer ? 'ជំនាញឯកទេសបច្ចេកវិទ្យា & កុំព្យូទ័រ' : 'Skills & Professional Expertise'}</span>
            </h3>

            <div className="flex flex-wrap gap-2 pt-1">
              {(isKhmer ? selectedTeacher.skillsKh : selectedTeacher.skillsEn).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs font-extrabold text-zinc-800 hover:border-pink-300 hover:bg-pink-50/50 hover:text-pink-950 transition-all cursor-default flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-800" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

      {showTransitionModal && (
        <TeacherAuthTransitionModal
          isOpen={showTransitionModal}
          teacherIdentifier={transitionTeacherId}
          onComplete={() => {
            switchTeacher(transitionTeacherId);
            setShowTransitionModal(false);
          }}
        />
      )}
    </div>
  );
};
