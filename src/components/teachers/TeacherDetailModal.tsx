import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { TeacherProfile } from '../../services/teacherData';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Mail,
  Phone,
  Clock,
  Award,
  BookOpen,
  Layers
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
          ? 'bg-zinc-950/0 backdrop-blur-none opacity-0'
          : 'bg-zinc-950/80 backdrop-blur-md opacity-100'
      }`}
      onClick={handleSmoothClose}
      style={{ margin: 0, left: 0, top: 0, right: 0, bottom: 0 }}
    >
      {/* Modal Container: Desktop Centered (750px max-w) & Mobile Bottom-Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full sm:max-w-2xl lg:max-w-3xl bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-zinc-200/90 overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col transition-all transform ${
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/80 sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-800 animate-pulse" />
            <span className={`text-xs font-bold text-zinc-500 ${isKhmer ? 'font-kantumruy' : 'font-mono uppercase tracking-wider'}`}>
              {isKhmer ? 'ព័ត៌មានលម្អិតគ្រូបង្រៀន CIIS' : 'CIIS FACULTY PROFILE'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSmoothClose}
            className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200/60 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Profile Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* 1. Header Area: Avatar + Name + Teaching Role (Stagger 0-80ms) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left pb-6 border-b border-zinc-100">
            {/* Teacher Profile Image */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-zinc-100 shadow-xl border border-zinc-200 bg-zinc-50 transition-transform duration-300 group-hover:scale-102">
                <img
                  src={teacher.image}
                  alt={teacher.nameEn}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-800 to-pink-950 text-white text-[10px] font-extrabold shadow-md border border-pink-700/40 ${isKhmer ? 'font-kantumruy' : 'font-mono uppercase tracking-wider'}`}>
                {isKhmer ? teacher.badgeKh : teacher.badgeEn}
              </span>
            </div>

            {/* Teacher Name & Title */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full bg-pink-950/10 text-pink-900 border border-pink-200 text-xs font-bold ${isKhmer ? 'font-kantumruy' : 'font-mono font-black'}`}>
                  {isKhmer ? teacher.roleTitleKh : teacher.roleTitleEn}
                </span>
              </div>

              <h2 className={`text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight ${isKhmer ? 'font-khmer-title' : ''}`}>
                {isKhmer ? teacher.nameKh : teacher.nameEn}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-pink-900 font-mono">
                {teacher.nameEn} • {teacher.subjectEn}
              </p>

              {/* Quote / Teaching Philosophy */}
              <p className={`text-xs text-zinc-500 italic pt-1 leading-relaxed max-w-xl ${isKhmer ? 'font-kantumruy' : ''}`}>
                "{isKhmer ? teacher.quoteKh : teacher.quoteEn}"
              </p>
            </div>
          </div>

          {/* 2. Quick Information Grid Cards (Stagger 140ms) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Schedule & Class Shifts */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-1.5">
              <div className={`flex items-center gap-2 text-pink-900 font-bold text-xs ${isKhmer ? 'font-kantumruy' : ''}`}>
                <Clock className="w-4 h-4 text-pink-800 shrink-0" />
                <span>{isKhmer ? 'កាលវិភាគបង្រៀន (Teaching Schedule)' : 'Teaching Schedule'}</span>
              </div>
              <p className={`text-xs font-black text-zinc-950 ${isKhmer ? 'font-kantumruy' : ''}`}>
                {isKhmer ? teacher.scheduleKh : teacher.scheduleEn}
              </p>
              <p className={`text-[11px] text-zinc-500 font-medium ${isKhmer ? 'font-kantumruy' : ''}`}>
                {isKhmer ? teacher.classesCountKh : teacher.classesCountEn}
              </p>
            </div>

            {/* Experience & Subject */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-1.5">
              <div className={`flex items-center gap-2 text-pink-900 font-bold text-xs ${isKhmer ? 'font-kantumruy' : ''}`}>
                <Award className="w-4 h-4 text-pink-800 shrink-0" />
                <span>{isKhmer ? 'បទពិសោធន៍ & ការអប់រំ (Experience)' : 'Experience & Background'}</span>
              </div>
              <p className={`text-xs font-black text-zinc-950 ${isKhmer ? 'font-kantumruy' : ''}`}>
                {isKhmer ? teacher.experienceKh : teacher.experienceEn}
              </p>
              <p className={`text-[11px] text-zinc-500 font-medium ${isKhmer ? 'font-kantumruy' : ''}`}>
                {isKhmer ? teacher.educationKh : teacher.educationEn}
              </p>
            </div>
          </div>

          {/* 3. Skills & Specializations Tags (Stagger 200ms) */}
          <div className="space-y-2.5">
            <h4 className={`text-xs font-black text-zinc-950 flex items-center gap-1.5 ${isKhmer ? 'font-khmer-title' : 'uppercase tracking-wider'}`}>
              <Layers className="w-4 h-4 text-pink-800" />
              <span>{isKhmer ? 'ជំនាញ និងមុខវិជ្ជាឯកទេស' : 'Technical Skills & Specializations'}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {(isKhmer ? teacher.skillsKh : teacher.skillsEn).map((skill, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-800 shadow-2xs hover:border-pink-300 hover:bg-pink-50/50 transition-colors ${isKhmer ? 'font-kantumruy' : ''}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 4. Biography & Profile Narrative (Stagger 260ms) */}
          <div className="space-y-2 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90">
            <h4 className={`text-xs font-black text-zinc-950 flex items-center gap-1.5 ${isKhmer ? 'font-khmer-title' : 'uppercase tracking-wider'}`}>
              <BookOpen className="w-4 h-4 text-pink-800" />
              <span>{isKhmer ? 'អំពីប្រវត្តិរូបសង្ខេប (Biography)' : 'Professional Biography'}</span>
            </h4>
            <p className={`text-xs text-zinc-600 leading-relaxed font-medium ${isKhmer ? 'font-kantumruy' : ''}`}>
              {isKhmer ? teacher.bioKh : teacher.bioEn}
            </p>
          </div>

          {/* 5. Contact Channels Footer */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-zinc-100">
            <div className="flex items-center gap-4 text-zinc-600 font-mono">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-pink-800" />
                <span>{teacher.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-pink-800" />
                <span>{teacher.phone}</span>
              </span>
            </div>

            {/* Action Button: Close Modal */}
            <div className="flex items-center justify-end w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSmoothClose}
                className={`w-full sm:w-auto px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm ${isKhmer ? 'font-kantumruy' : ''}`}
              >
                {isKhmer ? 'បិទផ្ទាំង (Close)' : 'Close'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

