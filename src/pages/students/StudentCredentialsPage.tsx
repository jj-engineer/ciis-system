import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../../components/common/Modal';
import { UserProfile } from '../../types';
import {
  KeyRound,
  Search,
  Filter,
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit,
  Trash2,
  UserPlus,
  FileSpreadsheet,
  Users,
  School,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const StudentCredentialsPage: React.FC = () => {
  const { allProfiles, updateStudentCredentials, deleteStudentProfile, registerStudent, getNextAutoStudentId } = useAuth();
  const { classes } = useApp();
  const { isKhmer } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit Student Modal State
  const [editingStudent, setEditingStudent] = useState<UserProfile | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editClassId, setEditClassId] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // Add Student Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || 'ciis-evening-1');
  const [newPassword, setNewPassword] = useState('');

  const students = allProfiles.filter(p => p.role === 'student');

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      s.fullName.toLowerCase().includes(q) ||
      (s.studentId && s.studentId.toLowerCase().includes(q)) ||
      s.username.toLowerCase().includes(q) ||
      (s.className && s.className.toLowerCase().includes(q));
    const matchesClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    return matchesQuery && matchesClass;
  });

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyPassword = (id: string, pass: string) => {
    navigator.clipboard.writeText(pass || '123');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenEdit = (s: UserProfile) => {
    setEditingStudent(s);
    setEditFullName(s.fullName);
    setEditClassId(s.classId || classes[0]?.id || 'ciis-evening-1');
    setEditPassword(s.password || '123');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const targetClass = classes.find(c => c.id === editClassId) || classes[0];

    updateStudentCredentials(editingStudent.id, {
      fullName: editFullName.trim(),
      classId: targetClass?.id,
      className: targetClass?.name,
      password: editPassword.trim()
    });

    setEditingStudent(null);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPassword.trim()) return;
    const targetClass = classes.find(c => c.id === newClassId) || classes[0];

    registerStudent({
      fullName: newFullName,
      classId: targetClass?.id || 'ciis-evening-1',
      className: targetClass?.name || 'CIIS Computer {5:30-6:30}',
      password: newPassword
    });

    setShowAddModal(false);
    setNewFullName('');
    setNewPassword('');
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Class', 'Username', 'Email', 'Password', 'Created At'];
    const rows = filteredStudents.map(s => [
      s.studentId || 'N/A',
      s.fullName,
      s.className || 'N/A',
      s.username,
      s.email,
      s.password || '123',
      s.createdAt.split('T')[0]
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CIIS_Student_Credentials_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-900 text-xs font-bold border border-pink-200 mb-2">
            <KeyRound className="w-3.5 h-3.5 text-pink-700" />
            <span>{isKhmer ? 'ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យ & ពាក្យសម្ងាត់សិស្ស' : 'Teacher Master Student Records & Credentials'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            {isKhmer ? 'បញ្ជីព័ត៌មាន & ពាក្យសម្ងាត់សិស្សគ្រប់ថ្នាក់' : 'Student Accounts & Credentials Manager'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'ផ្ទុក និងគ្រប់គ្រងអត្តលេខ ឈ្មោះ ថ្នាក់រៀន និងពាក្យសម្ងាត់សិស្ស ដើម្បីជួយសិស្សដែលភ្លេចពាក្យសម្ងាត់។'
              : 'Store and manage student IDs, names, classes, and passwords to assist students with login.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-950 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-pink-800" />
            <span>{isKhmer ? 'ទាញយក Excel / CSV' : 'Export Records'}</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-pink-800 to-pink-950 hover:from-pink-700 hover:to-pink-900 text-white font-extrabold text-xs rounded-xl shadow-md shadow-pink-950/20 transition-all flex items-center gap-2 cursor-pointer border border-pink-700/30"
          >
            <UserPlus className="w-4 h-4 text-pink-300" />
            <span>{isKhmer ? 'បន្ថែមសិស្សថ្មី' : 'Add Student'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-pink-950/10 text-pink-900 flex items-center justify-center font-black">
            <Users className="w-5 h-5 text-pink-800" />
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-bold uppercase">{isKhmer ? 'សិស្សចុះឈ្មោះសរុប' : 'Total Students'}</p>
            <p className="text-xl font-black text-zinc-950">{students.length} {isKhmer ? 'នាក់' : 'Enrolled'}</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center font-black">
            <School className="w-5 h-5 text-pink-300" />
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-bold uppercase">{isKhmer ? 'ថ្នាក់រៀនសកម្ម' : 'Active Classes'}</p>
            <p className="text-xl font-black text-zinc-950">{classes.length} {isKhmer ? 'ថ្នាក់' : 'Classes'}</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-pink-950/10 text-pink-900 flex items-center justify-center font-black">
            <KeyRound className="w-5 h-5 text-pink-800" />
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-bold uppercase">{isKhmer ? 'ប្រព័ន្ធពាក្យសម្ងាត់' : 'Password Vault'}</p>
            <p className="text-xl font-black text-zinc-950">{isKhmer ? 'សុវត្ថិភាពខ្ពស់' : 'Secured'}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isKhmer ? 'ស្វែងរកតាមឈ្មោះ, អត្តលេខ (STD-001), ថ្នាក់...' : 'Search by name, ID (STD-001), or class...'}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-pink-500 outline-none cursor-pointer"
          >
            <option value="all">{isKhmer ? 'គ្រប់ថ្នាក់ទាំងអស់ (All Classes)' : 'All Classes'}</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Credentials Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">{isKhmer ? 'អត្តលេខ' : 'Student ID'}</th>
                <th className="py-3 px-4">{isKhmer ? 'ឈ្មោះសិស្ស' : 'Student Name'}</th>
                <th className="py-3 px-3">{isKhmer ? 'ភេទ' : 'Sex'}</th>
                <th className="py-3 px-4">{isKhmer ? 'ថ្នាក់រៀន' : 'Class / Shift'}</th>
                <th className="py-3 px-4">{isKhmer ? 'ពាក្យសម្ងាត់ (Password)' : 'Password'}</th>
                <th className="py-3 px-4">{isKhmer ? 'ឈ្មោះអ្នកប្រើ & អ៊ីមែល' : 'Username / Email'}</th>
                <th className="py-3 px-4">{isKhmer ? 'កាលបរិច្ឆេទ' : 'Enrolled Date'}</th>
                <th className="py-3 px-4 text-right">{isKhmer ? 'សកម្មភាព' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    {isKhmer ? 'រកមិនឃើញទិន្នន័យសិស្សទេ' : 'No student records found matching your search.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isPassVisible = !!visiblePasswords[student.id];
                  const pass = student.password || '123';
                  const isCopied = copiedId === student.id;
                  const isFemale = student.gender === 'female';

                  return (
                    <tr key={student.id} className="hover:bg-pink-50/30 transition-colors">
                      {/* Student ID */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-pink-100/70 text-pink-900 font-mono font-black text-[11px] border border-pink-200">
                          {student.studentId || 'STD-000'}
                        </span>
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 border border-zinc-800 shadow-xs">
                            <User className="w-4 h-4 text-zinc-100" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{student.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{student.username}</p>
                          </div>
                        </div>
                      </td>

                      {/* Sex / ភេទ */}
                      <td className="py-3.5 px-3">
                        {isFemale ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                            {isKhmer ? 'ស្រី (ស)' : 'Female (F)'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold">
                            {isKhmer ? 'ប្រុស (ប)' : 'Male (M)'}
                          </span>
                        )}
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[11px]">
                          {student.className || 'CIIS Computer Lab'}
                        </span>
                      </td>

                      {/* Password with Eye toggle & Copy Button */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200">
                          <Lock className="w-3 h-3 text-pink-700 shrink-0" />
                          <span className="font-mono font-black text-xs min-w-[70px] text-slate-900 tracking-wider">
                            {isPassVisible ? pass : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(student.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-colors"
                            title={isPassVisible ? 'Hide password' : 'Show password'}
                          >
                            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyPassword(student.id, pass)}
                            className="p-1 text-slate-400 hover:text-pink-700 rounded-md hover:bg-pink-100 transition-colors"
                            title="Copy password to clipboard"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Username & Email */}
                      <td className="py-3.5 px-4">
                        <p className="text-slate-700 font-mono">{student.username}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{student.email}</p>
                      </td>

                      {/* Enrolled Date */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {student.createdAt ? student.createdAt.split('T')[0] : '2026-02-01'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-pink-50 text-slate-600 hover:text-pink-700 transition-colors"
                            title="Edit Student Credentials"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(isKhmer ? `តើអ្នកប្រាកដជាចង់លុបទិន្នន័យសិស្ស ${student.fullName} ដែរឬទេ?` : `Are you sure you want to remove student ${student.fullName}?`)) {
                                deleteStudentProfile(student.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT STUDENT CREDENTIALS MODAL */}
      {editingStudent && (
        <Modal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          title={isKhmer ? 'កែប្រែព័ត៌មាន & ពាក្យសម្ងាត់សិស្ស' : 'Edit Student Credentials'}
          subtitle={`${editingStudent.studentId || ''} • ${editingStudent.fullName}`}
          maxWidth="sm"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ឈ្មោះពេញរបស់សិស្ស (Full Name)' : 'Student Full Name'}
              </label>
              <input
                type="text"
                required
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ថ្នាក់រៀន (Class)' : 'Class / Shift'}
              </label>
              <select
                value={editClassId}
                onChange={(e) => setEditClassId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ពាក្យសម្ងាត់សិស្ស (Password)' : 'Student Password'}
              </label>
              <input
                type="text"
                required
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold focus:border-pink-500 outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
              >
                {isKhmer ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                {isKhmer ? 'រក្សាទុកការកែប្រែ' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={isKhmer ? 'បន្ថែមគណនីសិស្សថ្មី' : 'Add New Student'}
          subtitle={isKhmer ? 'ប្រព័ន្ធនឹងកំណត់អត្តលេខស្វ័យប្រវត្ត' : 'System will auto-assign student ID'}
          maxWidth="md"
        >
          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div className="p-3 bg-pink-50 rounded-xl border border-pink-200 flex items-center justify-between">
              <span className="text-xs font-bold text-pink-900">{isKhmer ? 'អត្តលេខស្វ័យប្រវត្តិ៖' : 'Auto Student ID:'}</span>
              <span className="px-2.5 py-1 rounded bg-pink-200 text-pink-950 font-mono font-black text-xs">{getNextAutoStudentId()}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ឈ្មោះពេញរបស់សិស្ស *' : 'Student Full Name *'}
              </label>
              <input
                type="text"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="e.g. SOK Dara"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ថ្នាក់រៀន *' : 'Class / Shift *'}
              </label>
              <select
                value={newClassId}
                onChange={(e) => setNewClassId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ពាក្យសម្ងាត់ *' : 'Password *'}
              </label>
              <input
                type="text"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="e.g. 123456"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold focus:border-pink-500 outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
              >
                {isKhmer ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                {isKhmer ? 'បង្កើតគណនី' : 'Create Student'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
