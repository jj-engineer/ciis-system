import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { UserProfile } from '../../types';
import {
  Users,
  Search,
  Plus,
  ArrowRight,
  User,
  Phone,
  Calendar,
  DollarSign,
  GraduationCap,
  School,
  Sparkles
} from 'lucide-react';
import { StudentProfilePage } from './StudentProfilePage';

export const StudentsPage: React.FC = () => {
  const { allProfiles, registerStudent, isStaff } = useAuth();
  const { classes, selectedClassId, setSelectedClassId, studentAnalytics } = useApp();
  const { isKhmer, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<UserProfile | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // New Student Form State
  const [newFullName, setNewFullName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [newGender, setNewGender] = useState<'female' | 'male'>('female');
  const [newPhone, setNewPhone] = useState('');
  const [newPaymentDeadline, setNewPaymentDeadline] = useState('28-Aug-26');
  const [newClassId, setNewClassId] = useState(selectedClassId);

  const students = allProfiles.filter(p => p.role === 'student');
  const femaleCount = students.filter(s => s.gender === 'female').length;
  const maleCount = students.filter(s => s.gender === 'male').length;

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = s.fullName.toLowerCase().includes(q) ||
                          (s.studentId && s.studentId.toLowerCase().includes(q)) ||
                          (s.phone && s.phone.toLowerCase().includes(q));
    const matchesClass = selectedClassId === 'all' || s.classId === selectedClassId;
    return matchesSearch && matchesClass;
  });

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim()) return;

    const targetClass = classes.find(c => c.id === newClassId);

    registerStudent({
      fullName: newFullName.trim(),
      studentId: newStudentId.trim() || undefined,
      gender: newGender,
      phone: newPhone.trim(),
      paymentDeadline: newPaymentDeadline.trim(),
      paymentAmount: 15,
      paymentStatus: 'pending',
      classId: newClassId,
      className: targetClass?.name || 'CIIS Computer {5:30-6:30}',
      password: '123'
    });

    setShowAddStudentModal(false);
    setNewFullName('');
    setNewStudentId('');
    setNewPhone('');
    setNewPaymentDeadline('28-Aug-26');
  };

  if (selectedStudentForProfile) {
    return (
      <StudentProfilePage
        student={selectedStudentForProfile}
        onBack={() => setSelectedStudentForProfile(null)}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-zinc-900" />
            {isKhmer ? 'ការគ្រប់គ្រងព័ត៌មាន & ប្រវត្តិរូបសិស្ស' : 'Student Directory & Profiles'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            {isKhmer
              ? 'គ្រប់គ្រងបញ្ជីវត្តមាន លេខទូរស័ព្ទ កាលបរិច្ឆេទបង់ថ្លៃសិក្សា ($15) និងលទ្ធផលសិក្សារបស់សិស្ស។'
              : 'Centralized directory for student records, parent phone contacts, tuition deadlines ($15), and grades.'}
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-zinc-300" />
            <span>{isKhmer ? 'ចុះឈ្មោះសិស្សថ្មី' : 'Add New Student'}</span>
          </button>
        )}
      </div>

      {/* Symmetrical KPI Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5 text-zinc-100" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-zinc-400 font-bold uppercase truncate">{isKhmer ? 'សិស្សសរុប' : 'Total Students'}</p>
            <p className="text-lg sm:text-xl font-black text-zinc-950 truncate">{students.length} {isKhmer ? 'នាក់' : 'Students'}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold shrink-0 border border-zinc-200">
            <GraduationCap className="w-5 h-5 text-zinc-800" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-zinc-400 font-bold uppercase truncate">{isKhmer ? 'សមាមាត្រភេទ' : 'Gender Ratio'}</p>
            <p className="text-sm sm:text-base font-black text-zinc-950 truncate">
              {femaleCount} {isKhmer ? 'ស្រី' : 'F'} • {maleCount} {isKhmer ? 'ប្រុស' : 'M'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold shrink-0 border border-zinc-200">
            <DollarSign className="w-5 h-5 text-zinc-800" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-zinc-400 font-bold uppercase truncate">{isKhmer ? 'ថ្លៃសិក្សាប្រចាំខែ' : 'Monthly Fee'}</p>
            <p className="text-lg sm:text-xl font-black text-zinc-950 truncate">$15 <span className="text-[11px] font-normal text-zinc-400">/ Student</span></p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold shrink-0">
            <School className="w-5 h-5 text-zinc-100" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-zinc-400 font-bold uppercase truncate">{isKhmer ? 'ថ្នាក់រៀនសកម្ម' : 'Active Classes'}</p>
            <p className="text-lg sm:text-xl font-black text-zinc-950 truncate">{classes.length} {isKhmer ? 'ថ្នាក់' : 'Classes'}</p>
          </div>
        </div>
      </div>

      {/* Symmetrical Search & Filter Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isKhmer ? 'ស្វែងរកឈ្មោះ, អត្តលេខ (STD-001) ឬលេខទូរស័ព្ទ...' : 'Search student name, ID or phone number...'}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all font-medium text-zinc-900"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-bold text-zinc-500 shrink-0">{isKhmer ? 'តម្រៀបតាមថ្នាក់៖' : 'Filter Class:'}</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-zinc-50 px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-800 outline-none cursor-pointer focus:border-zinc-800 transition-colors"
          >
            <option value="all">{isKhmer ? 'គ្រប់ថ្នាក់ទាំងអស់ (All Classes)' : 'All Classes'}</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Symmetrical Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student, idx) => {
          const analytics = studentAnalytics.find(a => a.studentId === student.id) || {
            attendancePercentage: 95,
            overallProgressPercentage: 85,
            typingWpm: 42,
            needsAttention: false
          };

          const isFemale = student.gender === 'female';

          return (
            <div
              key={student.id}
              onClick={() => setSelectedStudentForProfile(student)}
              className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs hover:border-zinc-400 transition-all cursor-pointer flex flex-col justify-between h-full min-h-[300px] group"
            >
              {/* Top Row: Avatar + Name + Badges */}
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 border border-zinc-800 shadow-xs group-hover:scale-105 transition-transform">
                      <User className="w-5 h-5 text-zinc-100" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-zinc-950 text-sm truncate">{student.fullName}</h3>
                        {isFemale ? (
                          <span className="px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 shrink-0">
                            {isKhmer ? 'ស្រី' : 'F'}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-200 shrink-0">
                            {isKhmer ? 'ប្រុស' : 'M'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono font-bold">{student.studentId || `STD-${String(idx + 1).padStart(3, '0')}`}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-700 text-[10px] font-bold border border-zinc-200 shrink-0">
                    {student.className ? student.className.replace('CIIS Computer', 'Class') : 'Class 5:30'}
                  </span>
                </div>

                {/* Symmetrical Contact & Tuition Row */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5 text-zinc-500" />
                      {isKhmer ? 'លេខទូរស័ព្ទ' : 'Phone'}
                    </span>
                    <p className="font-mono font-bold text-zinc-900 text-[11px] truncate">
                      {student.phone || '012 345 678'}
                    </p>
                  </div>

                  <div className="space-y-0.5 min-w-0 border-l border-zinc-200 pl-2.5">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 text-zinc-500" />
                      {isKhmer ? 'ថ្ងៃផុតកំណត់បង់ ($15)' : 'Payment Deadline'}
                    </span>
                    <p className="font-mono font-bold text-zinc-900 text-[11px] truncate">
                      {student.paymentDeadline || '28-Aug-26'}
                    </p>
                  </div>
                </div>

                {/* Symmetrical 3-Column Performance Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">{isKhmer ? 'វត្តមាន' : 'Attendance'}</span>
                    <span className={`text-xs font-black ${analytics.attendancePercentage < 80 ? 'text-rose-600' : 'text-zinc-900'}`}>
                      {analytics.attendancePercentage}%
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">{isKhmer ? 'លទ្ធផល' : 'Progress'}</span>
                    <span className="text-xs font-black text-zinc-950">
                      {analytics.overallProgressPercentage}%
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">{isKhmer ? 'វាយអក្សរ' : 'Typing'}</span>
                    <span className="text-xs font-black text-zinc-900">
                      {analytics.typingWpm} WPM
                    </span>
                  </div>
                </div>
              </div>

              {/* Symmetrical Card Footer Action */}
              <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-900 font-bold group-hover:text-zinc-950">
                <span>{isKhmer ? 'មើលប្រវត្តិរូប & លទ្ធផលសិស្ស' : 'View Full Profile & Performance'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-zinc-600" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Symmetrical Add Student Modal */}
      {showAddStudentModal && (
        <Modal
          isOpen={showAddStudentModal}
          onClose={() => setShowAddStudentModal(false)}
          title={isKhmer ? 'ចុះឈ្មោះសិស្សថ្មី' : 'Enroll New Student'}
          subtitle={isKhmer ? 'បញ្ចូលឈ្មោះ ភេទ លេខទូរស័ព្ទ និងកាលបរិច្ឆេទបង់ថ្លៃសិក្សា ($15)' : 'Add student credentials, parent contact, and payment deadline ($15)'}
          maxWidth="md"
        >
          <form onSubmit={handleAddStudentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'ឈ្មោះពេញរបស់សិស្ស' : 'Full Name'} *
              </label>
              <input
                type="text"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder={isKhmer ? 'ឧ. សុខ បញ្ញា' : 'e.g. SOK Panha'}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-bold text-zinc-900 focus:border-zinc-800 transition-colors"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  {isKhmer ? 'ភេទ' : 'Gender'}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewGender('female')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      newGender === 'female'
                        ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-600'
                    }`}
                  >
                    {isKhmer ? 'ស្រី (ស)' : 'Female'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewGender('male')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      newGender === 'male'
                        ? 'bg-sky-50 border-sky-300 text-sky-800 shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-600'
                    }`}
                  >
                    {isKhmer ? 'ប្រុស (ប)' : 'Male'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  {isKhmer ? 'អត្តលេខសិស្ស' : 'Student ID'}
                </label>
                <input
                  type="text"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  placeholder="STD-020"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  {isKhmer ? 'លេខទូរស័ព្ទទំនាក់ទំនង' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="012 345 678"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  {isKhmer ? 'ថ្ងៃផុតកំណត់បង់ថ្លៃ' : 'Payment Deadline'}
                </label>
                <input
                  type="text"
                  value={newPaymentDeadline}
                  onChange={(e) => setNewPaymentDeadline(e.target.value)}
                  placeholder="28-Aug-26"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800 transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                {t('action.cancel', undefined, 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isKhmer ? 'រក្សាទុកសិស្ស' : 'Register Student'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
