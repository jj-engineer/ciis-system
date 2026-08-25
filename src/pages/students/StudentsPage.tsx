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
  User
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
  const [newClassId, setNewClassId] = useState(selectedClassId);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const students = allProfiles.filter(p => p.role === 'student');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.studentId && s.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesClass = selectedClassId === 'all' || s.classId === selectedClassId;
    return matchesSearch && matchesClass;
  });

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newStudentId.trim()) return;

    const targetClass = classes.find(c => c.id === newClassId);

    registerStudent({
      fullName: newFullName,
      studentId: newStudentId,
      classId: newClassId,
      className: targetClass?.name || 'CIIS Computer {5:30-6:30}',
      password: '123'
    });

    setShowAddStudentModal(false);
    setNewFullName('');
    setNewStudentId('');
    setNewUsername('');
    setNewEmail('');
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
            <Users className="w-6 h-6 text-pink-700" />
            {t('title.students', undefined, 'Student Directory & Profiles')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'គ្រប់គ្រងបញ្ជីឈ្មោះសិស្ស មើលលទ្ធផលសិក្សា និងកត់ត្រាការសង្កេតរបស់គ្រូ។'
              : 'Manage student records, view performance metrics, and log teacher behavioral notes.'}
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isKhmer ? 'ចុះឈ្មោះសិស្សថ្មី' : 'Add New Student'}</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isKhmer ? 'ស្វែងរកឈ្មោះ ឬអត្តលេខសិស្ស...' : 'Search student name or ID...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">{isKhmer ? 'តម្រៀបតាមថ្នាក់៖' : 'Filter Class:'}</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none"
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
        {filteredStudents.map((student) => {
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
              className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-pink-300 shadow-sm hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
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
                      <p className="text-[11px] text-slate-500 font-mono">{student.studentId || 'STD-001'}</p>
                    </div>
                  </div>
                  <Badge variant="pink" size="sm">{student.className || 'Grade 10A'}</Badge>
                </div>

                {/* Quick Performance Indicators */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">{isKhmer ? 'វត្តមាន' : 'Attendance'}</span>
                    <span className={`text-xs font-bold ${analytics.attendancePercentage < 80 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {analytics.attendancePercentage}%
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">{isKhmer ? 'សរុប' : 'Overall'}</span>
                    <span className="text-xs font-bold text-pink-700">
                      {analytics.overallProgressPercentage}%
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
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

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-pink-700 font-bold">
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
          subtitle={isKhmer ? 'បញ្ចូលឈ្មោះ និងថ្នាក់រៀនសម្រាប់សិស្ស' : 'Add student account credentials and assign to class'}
        >
          <form onSubmit={handleAddStudentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ឈ្មោះពេញរបស់សិស្ស' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="e.g. SOK Dara"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'អត្តលេខសិស្ស' : 'Student ID'}
                </label>
                <input
                  type="text"
                  required
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  placeholder="e.g. STD-2026-036"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'ថ្នាក់រៀន' : 'Class Assignment'}
                </label>
                <select
                  value={newClassId}
                  onChange={(e) => setNewClassId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                {t('action.cancel', undefined, 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
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
