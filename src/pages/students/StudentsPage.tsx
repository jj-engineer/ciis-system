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
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Keyboard,
  ShieldCheck,
  Mail,
  UserCheck,
  User,
  Phone,
  Calendar,
  CreditCard
} from 'lucide-react';
import { StudentProfilePage } from './StudentProfilePage';

export const StudentsPage: React.FC = () => {
  const { allProfiles, registerStudent, isStaff } = useAuth();
  const { classes, selectedClassId, setSelectedClassId, studentAnalytics } = useApp();
  const { isKhmer, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<UserProfile | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // New Student Form
  const [newFullName, setNewFullName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [newGender, setNewGender] = useState<'female' | 'male'>('female');
  const [newPhone, setNewPhone] = useState('');
  const [newPaymentDeadline, setNewPaymentDeadline] = useState('28-Aug-26');
  const [newClassId, setNewClassId] = useState(selectedClassId);

  const students = allProfiles.filter(p => p.role === 'student');

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
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

  // If a student is selected to view their detailed profile, show the profile view
  if (selectedStudentForProfile) {
    return (
      <StudentProfilePage
        student={selectedStudentForProfile}
        onBack={() => setSelectedStudentForProfile(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-zinc-900" />
            {t('title.students', undefined, 'Student Directory & Profiles')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'គ្រប់គ្រងបញ្ជីវត្តមាន លេខទូរស័ព្ទ កាលបរិច្ឆេទបង់ថ្លៃសិក្សា ($15) និងលទ្ធផលរៀនសូត្រ។'
              : 'Manage student records, parent phone contacts, monthly tuition deadlines ($15), and grades.'}
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-zinc-300" />
            <span>{isKhmer ? 'ចុះឈ្មោះសិស្សថ្មី' : 'Add New Student'}</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isKhmer ? 'ស្វែងរកឈ្មោះ អត្តលេខ ឬលេខទូរស័ព្ទ...' : 'Search student name, ID or phone...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400/20 focus:border-zinc-800 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">{isKhmer ? 'តម្រៀបតាមថ្នាក់៖' : 'Filter Class:'}</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none cursor-pointer"
          >
            <option value="all">{isKhmer ? 'គ្រប់ថ្នាក់ទាំងអស់' : 'All Classes'}</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student, idx) => {
          const analytics = studentAnalytics.find(a => a.studentId === student.id) || {
            attendancePercentage: 95,
            overallProgressPercentage: 85,
            typingWpm: 42,
            needsAttention: false
          };

          return (
            <div
              key={student.id}
              onClick={() => setSelectedStudentForProfile(student)}
              className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shrink-0 border border-zinc-800 shadow-xs">
                      <User className="w-6 h-6 text-zinc-100" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-sm">{student.fullName}</h3>
                        {student.gender === 'female' ? (
                          <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                            {isKhmer ? 'ស្រី' : 'F'}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-200">
                            {isKhmer ? 'ប្រុស' : 'M'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">{student.studentId || `STD-${String(idx + 1).padStart(3, '0')}`}</p>
                    </div>
                  </div>
                  <Badge variant="slate" size="sm">{student.className || 'CIIS Computer'}</Badge>
                </div>

                {/* Contact & Payment Info Row */}
                <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-zinc-700" />
                      {isKhmer ? 'លេខទូរស័ព្ទ៖' : 'Phone:'}
                    </span>
                    <span className="font-mono font-bold text-zinc-900 text-[11px] truncate max-w-[170px]">
                      {student.phone || '012 345 678'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-200/60">
                    <span className="text-zinc-500 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-700" />
                      {isKhmer ? 'ថ្ងៃផុតកំណត់បង់ថ្លៃ៖' : 'Tuition Deadline:'}
                    </span>
                    <span className="font-mono font-bold text-zinc-900 text-[11px]">
                      {student.paymentDeadline || '28-Aug-26'} ($15)
                    </span>
                  </div>
                </div>

                {/* Quick Performance Indicators */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">{isKhmer ? 'វត្តមាន' : 'Attendance'}</span>
                    <span className={`text-xs font-bold ${analytics.attendancePercentage < 80 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {analytics.attendancePercentage}%
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">{isKhmer ? 'សរុប' : 'Overall'}</span>
                    <span className="text-xs font-bold text-zinc-900">
                      {analytics.overallProgressPercentage}%
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">{isKhmer ? 'វាយអក្សរ' : 'Typing'}</span>
                    <span className="text-xs font-bold text-slate-800">
                      {analytics.typingWpm} WPM
                    </span>
                  </div>
                </div>

                {analytics.needsAttention && (
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-[11px] text-rose-700 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{isKhmer ? 'វត្តមានក្រោម ៨០%' : 'Attendance below 80%'}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-zinc-900 font-bold">
                <span>{isKhmer ? 'មើលប្រវត្តិរូប & កំណត់ចំណាំ' : 'View Full Profile & Notes'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <Modal
          isOpen={showAddStudentModal}
          onClose={() => setShowAddStudentModal(false)}
          title={isKhmer ? 'ចុះឈ្មោះសិស្សថ្មី' : 'Enroll New Student'}
          subtitle={isKhmer ? 'បញ្ចូលឈ្មោះ ភេទ លេខទូរស័ព្ទ និងកាលបរិច្ឆេទបង់ថ្លៃសិក្សា' : 'Add student credentials, phone contact, and tuition deadline'}
          maxWidth="md"
        >
          <form onSubmit={handleAddStudentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ឈ្មោះពេញរបស់សិស្ស' : 'Full Name'} *
              </label>
              <input
                type="text"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="ឧ. សុខ បញ្ញា"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-zinc-900 focus:border-zinc-800"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'អត្តលេខសិស្ស' : 'Student ID'}
                </label>
                <input
                  type="text"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  placeholder="STD-020"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'លេខទូរស័ព្ទទំនាក់ទំនង' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="012 345 678"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'ថ្ងៃផុតកំណត់បង់ថ្លៃ' : 'Payment Deadline'}
                </label>
                <input
                  type="text"
                  value={newPaymentDeadline}
                  onChange={(e) => setNewPaymentDeadline(e.target.value)}
                  placeholder="28-Aug-26"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                {t('action.cancel', undefined, 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
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
