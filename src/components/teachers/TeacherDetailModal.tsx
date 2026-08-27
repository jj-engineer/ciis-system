import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { TeacherProfile } from '../../services/teacherData';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Mail,
  Phone
} from 'lucide-react';

interface TeacherDetailModalProps {
  teacher: TeacherProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherDetailModal: React.FC<TeacherDetailModalProps> = ({
  teacher,
  isOpen,
  onClose
}) => {
  const { isKhmer } = useLanguage();
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleSmoothClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSmoothClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsMounted(false);
      onClose();
    }, 220);
  };

  if (!isOpen && !isMounted) return null;
  if (!teacher) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] w-screen h-screen min-h-screen overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 transition-all duration-300 ${
        isClosing
          ? 'bg-black/0 backdrop-blur-none opacity-0'
          : 'bg-black/80 backdrop-blur-md opacity-100'
      }`}
      onClick={handleSmoothClose}
      style={{ margin: 0, left: 0, top: 0, right: 0, bottom: 0 }}
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full sm:max-w-2xl lg:max-w-3xl bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col transition-all transform ${
          isClosing
            ? 'translate-y-8 sm:translate-y-6 scale-95 opacity-0 duration-200'
            : 'translate-y-0 scale-100 opacity-100 duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]'
        }`}
        style={{
          transitionDuration: isClosing ? '220ms' : '380ms',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        {/* Sticky Top Header with Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/90 sticky top-0 z-20 backdrop-blur-sm font-mono">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-900">
              [ FACULTY // {isKhmer ? 'ព័ត៌មានលម្អិតគ្រូបង្រៀន' : 'INSTRUCTOR PROFILE'} ]
            </span>
          </div>

          <button
            type="button"
            onClick={handleSmoothClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200/60 rounded-xl transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Profile Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-left">
          
          {/* 1. Header Area: Avatar + Name + Teaching Role */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left pb-6 border-b border-zinc-100">
            {/* Teacher Profile Image */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-2 ring-zinc-100 shadow-md border border-zinc-200 bg-zinc-50">
                <img
                  src={teacher.image}
                  alt={teacher.nameEn}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-zinc-950 text-white text-[10px] font-mono font-bold shadow-sm">
                [ {isKhmer ? teacher.badgeKh : teacher.badgeEn} ]
              </span>
            </div>

            {/* Teacher Name & Title */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-950 border border-rose-200 text-xs font-mono font-bold">
                  [ {isKhmer ? teacher.roleTitleKh : teacher.roleTitleEn} ]
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight font-khmer-title">
                {isKhmer ? teacher.nameKh : teacher.nameEn}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-rose-900 font-mono">
                — {teacher.nameEn} • {teacher.subjectEn}
              </p>

              {/* Quote / Teaching Philosophy */}
              <p className="text-xs text-zinc-600 italic pt-1 leading-relaxed max-w-xl font-normal font-sans">
                "{isKhmer ? teacher.quoteKh : teacher.quoteEn}"
              </p>
            </div>
          </div>

          {/* 2. Quick Information Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Schedule & Class Shifts */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 font-mono">
              <div className="text-xs text-rose-900 font-bold">
                [ SCHEDULE // {isKhmer ? 'កាលវិភាគបង្រៀន' : 'Teaching Schedule'} ]
              </div>
              <p className="text-xs font-bold text-zinc-950 font-sans">
                {isKhmer ? teacher.scheduleKh : teacher.scheduleEn}
              </p>
              <p className="text-[11px] text-zinc-500 font-sans">
                — {isKhmer ? teacher.classesCountKh : teacher.classesCountEn}
              </p>
            </div>

            {/* Experience & Background */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 font-mono">
              <div className="text-xs text-rose-900 font-bold">
                [ BACKGROUND // {isKhmer ? 'បទពិសោធន៍' : 'Experience'} ]
              </div>
              <p className="text-xs font-bold text-zinc-950 font-sans">
                {isKhmer ? teacher.experienceKh : teacher.experienceEn}
              </p>
              <p className="text-[11px] text-zinc-500 font-sans">
                — {isKhmer ? teacher.educationKh : teacher.educationEn}
              </p>
            </div>
          </div>

          {/* 3. Skills & Specializations Tags */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold text-zinc-950">
              [ SPECIALIZATIONS // {isKhmer ? 'ជំនាញ និងមុខវិជ្ជាឯកទេស' : 'Technical Competencies'} ]
            </h4>
            <div className="flex flex-wrap gap-2">
              {(isKhmer ? teacher.skillsKh : teacher.skillsEn).map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-800"
                >
                  • {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 4. Biography & Profile Narrative */}
          <div className="space-y-2 p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <h4 className="text-xs font-mono font-bold text-zinc-950">
              [ BIOGRAPHY // {isKhmer ? 'ប្រវត្តិរូបសង្ខេប' : 'Narrative Profile'} ]
            </h4>
            <p className="text-xs text-zinc-700 leading-relaxed font-normal font-sans">
              {isKhmer ? teacher.bioKh : teacher.bioEn}
            </p>
          </div>

          {/* 5. Contact Channels Footer */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-zinc-100 font-mono">
            <div className="flex items-center gap-4 text-zinc-600">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-800" />
                <span>{teacher.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-800" />
                <span>{teacher.phone}</span>
              </span>
            </div>

            {/* Action Button: Close Modal */}
            <div className="flex items-center justify-end w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSmoothClose}
                className="w-full sm:w-auto px-6 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-mono font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                [ {isKhmer ? 'បិទផ្ទាំង' : 'Close'} ]
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};
export default TeacherDetailModal;
