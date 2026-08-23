import React from 'react';
import { TeacherProfile } from '../../services/teacherData';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Clock } from 'lucide-react';

interface TeacherCardProps {
  teacher: TeacherProfile;
  onViewDetails: (teacher: TeacherProfile) => void;
  className?: string;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onViewDetails, className = '' }) => {
  const { isKhmer } = useLanguage();

  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-2xs hover:shadow-2xl hover:border-pink-900/40 transition-all duration-500 flex flex-col justify-between space-y-5 group -translate-y-0 hover:-translate-y-2 relative overflow-hidden ${className}`}>
      
      {/* Top Subtle Gradient Accent Line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-pink-800 group-hover:via-rose-600 group-hover:to-pink-950 transition-all duration-500" />

      {/* Top Section: Avatar + Name + Role Badge */}
      <div className="space-y-4">
        
        {/* Avatar and Role Pill */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden ring-2 ring-zinc-100 shadow-md border border-zinc-200 bg-zinc-50">
              <img
                src={teacher.image}
                alt={teacher.nameEn}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className={`absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-800 to-pink-950 text-white text-[10px] font-extrabold shadow-sm border border-pink-700/40 ${isKhmer ? 'font-kantumruy' : 'font-mono uppercase tracking-wider text-[9.5px]'}`}>
              {isKhmer ? teacher.badgeKh : teacher.badgeEn}
            </span>
          </div>

          <span className={`px-3 py-1 rounded-full bg-pink-950/5 text-pink-950 border border-pink-200/80 text-[11px] font-bold group-hover:bg-pink-950/10 transition-colors ${isKhmer ? 'font-kantumruy' : 'font-mono font-black text-[10.5px]'}`}>
            {isKhmer ? teacher.roleTitleKh.split('(')[0].trim() : teacher.badgeEn}
          </span>
        </div>

        {/* Name and Subject Specialization */}
        <div className="space-y-1 pt-1">
          <h3 className={`text-xl font-black text-zinc-950 group-hover:text-pink-950 transition-colors tracking-tight ${isKhmer ? 'font-khmer-title' : ''}`}>
            {isKhmer ? teacher.nameKh : teacher.nameEn}
          </h3>
          <p className="text-xs font-bold text-pink-800 font-mono">
            {teacher.nameEn}
          </p>
          <p className={`text-xs font-bold text-zinc-600 ${isKhmer ? 'font-kantumruy' : ''}`}>
            {isKhmer ? teacher.subjectKh : teacher.subjectEn}
          </p>
        </div>

        {/* Schedule & Shift Allocation Pill */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
          <div className={`flex items-center gap-2 text-pink-900 font-bold text-[11.5px] ${isKhmer ? 'font-kantumruy' : ''}`}>
            <Clock className="w-3.5 h-3.5 text-pink-800 shrink-0" />
            <span>{isKhmer ? teacher.scheduleKh : teacher.scheduleEn}</span>
          </div>
          <p className={`text-[10.5px] text-zinc-500 font-medium ${isKhmer ? 'font-kantumruy' : ''}`}>
            {isKhmer ? teacher.classesCountKh : teacher.classesCountEn}
          </p>
        </div>

        {/* Top 3 Technical Skills Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(isKhmer ? teacher.skillsKh : teacher.skillsEn).slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className={`px-2.5 py-0.5 rounded-lg bg-zinc-100 text-zinc-700 text-[10.5px] font-medium border border-zinc-200/70 group-hover:border-pink-200/80 group-hover:bg-pink-50/40 transition-colors ${
                isKhmer ? 'font-kantumruy' : 'font-mono'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Short Bio Extract */}
        <p className={`text-xs text-zinc-500 line-clamp-2 leading-relaxed ${isKhmer ? 'font-kantumruy' : ''}`}>
          {isKhmer ? teacher.bioKh : teacher.bioEn}
        </p>
      </div>

      {/* Action: View Details Button */}
      <button
        type="button"
        onClick={() => onViewDetails(teacher)}
        className={`w-full py-2.5 px-4 bg-zinc-50 group-hover:bg-gradient-to-r group-hover:from-pink-800 group-hover:to-pink-950 text-zinc-700 group-hover:text-white font-bold text-xs rounded-2xl border border-zinc-200 group-hover:border-pink-700/40 shadow-2xs group-hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${isKhmer ? 'font-kantumruy' : ''}`}
      >
        <span>{isKhmer ? 'មើលព័ត៌មានលម្អិត & ប្រវត្តិរូប' : 'View Faculty Profile'}</span>
        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-pink-200 group-hover:translate-x-1 transition-all" />
      </button>

    </div>
  );
};
