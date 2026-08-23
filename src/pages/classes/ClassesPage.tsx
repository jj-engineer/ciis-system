import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SchoolClass } from '../../types';
import {
  School,
  Users,
  Clock,
  MapPin,
  GraduationCap,
  Plus,
  ArrowRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

interface ClassesPageProps {
  setActiveTab?: (tab: string) => void;
}

export const ClassesPage: React.FC<ClassesPageProps> = ({ setActiveTab }) => {
  const { isStaff, allProfiles } = useAuth();
  const { classes, selectedClassId, setSelectedClassId } = useApp();
  const { isKhmer, t } = useLanguage();

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newGrade, setNewGrade] = useState('10');
  const [newRoom, setNewRoom] = useState('Lab 1 - Room 204');
  const [newSchedule, setNewSchedule] = useState('Mon, Wed, Fri (08:00 - 09:30 AM)');

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    
    // When teacher switches class, wait for the splash loading modal to finish, then go directly to Teacher Dashboard
    setTimeout(() => {
      if (setActiveTab) {
        setActiveTab('dashboard');
      }
    }, 2050);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <School className="w-6 h-6 text-pink-700" />
            {t('title.classes', undefined, 'Class Management & Rosters')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'គ្រប់គ្រងថ្នាក់រៀនកុំព្យូទ័រ បន្ទប់អនុវត្ត និងកាលវិភាគបង្រៀន។ ចុចលើថ្នាក់ដើម្បីប្តូរ និងចូលទៅកាន់ផ្ទាំងគ្រប់គ្រងផ្ទាល់។'
              : 'Manage academic computer classes, lab room assignments, and schedules. Click a class to switch and go directly to Teacher Dashboard.'}
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setShowAddClassModal(true)}
            className="px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 btn-primary-hover"
          >
            <Plus className="w-4 h-4" />
            <span>{isKhmer ? 'បង្កើតថ្នាក់រៀនថ្មី' : 'Create New Class'}</span>
          </button>
        )}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((c) => {
          const isSelected = selectedClassId === c.id;
          return (
            <div
              key={c.id}
              onClick={() => handleSelectClass(c.id)}
              className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer shadow-sm card-hover-effect flex flex-col justify-between ${
                isSelected
                  ? 'border-pink-600 ring-2 ring-pink-200 bg-pink-50/25 shadow-md shadow-pink-700/10'
                  : 'border-slate-200 hover:border-pink-300 hover:shadow-card-hover'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{c.name}</h3>
                    <span className="text-xs text-slate-500 font-medium">{isKhmer ? `ថ្នាក់ទី ${c.grade} • ${c.academicYear}` : `Grade ${c.grade} • ${c.academicYear}`}</span>
                  </div>
                  <Badge variant={isSelected ? 'pink' : 'slate'} size="sm">
                    {c.studentCount} {isKhmer ? 'សិស្ស' : 'Students'}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-pink-700 shrink-0" />
                    <span>{isKhmer ? 'គ្រូទទួលបន្ទុក៖' : 'Lead:'} <strong>{c.teacherName}</strong></span>
                  </div>
                  {c.assistantName && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>{isKhmer ? 'គ្រូជំនួយការ៖' : 'Assistant:'} <strong>{c.assistantName}</strong></span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{c.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{c.scheduleDescription}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {isSelected ? (isKhmer ? 'ថ្នាក់កំពុងជ្រើសរើស (ចុចដើម្បីចូល)' : 'Selected Active Class') : (isKhmer ? 'ចុចដើម្បីប្តូរថ្នាក់ និងទៅកាន់ Dashboard' : 'Click to activate & go to Dashboard')}
                </span>
                <ArrowRight className="w-4 h-4 text-pink-700" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
