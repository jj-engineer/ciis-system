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
  Users,
  School,
  Lock,
  User,
  Phone
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
  const [editPhone, setEditPhone] = useState('');
  const [editPaymentDeadline, setEditPaymentDeadline] = useState('');

  // Add Student Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || 'ciis-evening-1');
  const [newPassword, setNewPassword] = useState('123');
  const [newPhone, setNewPhone] = useState('');
  const [newPaymentDeadline, setNewPaymentDeadline] = useState('28-Aug-26');

  const students = allProfiles.filter(p => p.role === 'student');

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      s.fullName.toLowerCase().includes(q) ||
      (s.studentId && s.studentId.toLowerCase().includes(q)) ||
      (s.phone && s.phone.toLowerCase().includes(q)) ||
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
    setEditPhone(s.phone || '');
    setEditPaymentDeadline(s.paymentDeadline || '28-Aug-26');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const targetClass = classes.find(c => c.id === editClassId) || classes[0];

    updateStudentCredentials(editingStudent.id, {
      fullName: editFullName.trim(),
      classId: targetClass?.id,
      className: targetClass?.name,
      password: editPassword.trim(),
      phone: editPhone.trim(),
      paymentDeadline: editPaymentDeadline.trim()
    });

    setEditingStudent(null);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim()) return;
    const targetClass = classes.find(c => c.id === newClassId) || classes[0];

    registerStudent({
      fullName: newFullName.trim(),
      classId: targetClass?.id || 'ciis-evening-1',
      className: targetClass?.name || 'CIIS Computer {5:30-6:30}',
      password: newPassword.trim() || '123',
      phone: newPhone.trim(),
      paymentDeadline: newPaymentDeadline.trim(),
      paymentAmount: 15,
      paymentStatus: 'pending'
    });

    setShowAddModal(false);
    setNewFullName('');
    setNewPassword('123');
    setNewPhone('');
    setNewPaymentDeadline('28-Aug-26');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-zinc-900" />
            {isKhmer ? 'ការគ្រប់គ្រងគណនី & លេខទូរស័ព្ទសិស្ស' : 'Student Accounts & Tuition Deadlines'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            {isKhmer
              ? 'មើលលេខសម្ងាត់ លេខទូរស័ព្ទ កាលបរិច្ឆេទបង់ថ្លៃ ($15) និងព័ត៌មានគណនីសិស្សទាំងអស់។'
              : 'Secure credentials vault, contact phone directory, and monthly payment deadlines ($15).'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-zinc-300" />
          <span>{isKhmer ? 'បន្ថែមគណនីថ្មី' : 'Add Student Account'}</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold">
            <Users className="w-5 h-5 text-zinc-100" />
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-bold uppercase">{isKhmer ? 'សិស្សសរុប' : 'Total Students'}</p>
            <p className="text-xl font-black text-zinc-950">{students.length} {isKhmer ? 'នាក់' : 'Students'}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold">
            <School className="w-5 h-5 text-zinc-100" />
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-bold uppercase">{isKhmer ? 'ថ្នាក់រៀនសកម្ម' : 'Active Classes'}</p>
            <p className="text-xl font-black text-zinc-950">{classes.length} {isKhmer ? 'ថ្នាក់' : 'Classes'}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold border border-zinc-200">
            <KeyRound className="w-5 h-5 text-zinc-800" />
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-bold uppercase">{isKhmer ? 'ថ្លៃសិក្សាប្រចាំខែ' : 'Monthly Tuition'}</p>
            <p className="text-xl font-black text-zinc-950">$15 <span className="text-xs font-normal text-zinc-400">/ Student</span></p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isKhmer ? 'ស្វែងរកតាមឈ្មោះ, អត្តលេខ (STD-001), លេខទូរស័ព្ទ...' : 'Search by name, ID (STD-001), or phone...'}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-zinc-800 outline-none cursor-pointer"
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
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">{isKhmer ? 'អត្តលេខ' : 'Student ID'}</th>
                <th className="py-3 px-4">{isKhmer ? 'ឈ្មោះសិស្ស' : 'Student Name'}</th>
                <th className="py-3 px-3">{isKhmer ? 'ភេទ' : 'Sex'}</th>
                <th className="py-3 px-3">{isKhmer ? 'លេខទូរស័ព្ទ' : 'Phone Number'}</th>
                <th className="py-3 px-3">{isKhmer ? 'ថ្ងៃផុតកំណត់បង់' : 'Payment Deadline'}</th>
                <th className="py-3 px-4">{isKhmer ? 'ពាក្យសម្ងាត់' : 'Password'}</th>
                <th className="py-3 px-4 text-right">{isKhmer ? 'សកម្មភាព' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    {isKhmer ? 'រកមិនឃើញទិន្នន័យសិស្សទេ' : 'No student records found matching your search.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const isPassVisible = !!visiblePasswords[student.id];
                  const pass = student.password || '123';
                  const isCopied = copiedId === student.id;
                  const isFemale = student.gender === 'female';

                  return (
                    <tr key={student.id} className="hover:bg-zinc-50/70 transition-colors">
                      {/* Student ID */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-900 font-mono font-bold text-[11px] border border-zinc-200">
                          {student.studentId || `STD-${String(idx + 1).padStart(3, '0')}`}
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
                            {isKhmer ? 'ស្រី (ស)' : 'Female'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold">
                            {isKhmer ? 'ប្រុស (ប)' : 'Male'}
                          </span>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-3 font-mono font-bold text-zinc-800 text-[11px]">
                        {student.phone || '012 345 678'}
                      </td>

                      {/* Payment Deadline */}
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-900 font-mono font-bold text-[11px] border border-zinc-200">
                          {student.paymentDeadline || '28-Aug-26'} ($15)
                        </span>
                      </td>

                      {/* Password with Eye toggle & Copy Button */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-100 border border-zinc-200">
                          <Lock className="w-3 h-3 text-zinc-700 shrink-0" />
                          <span className="font-mono font-black text-xs min-w-[60px] text-zinc-900 tracking-wider">
                            {isPassVisible ? pass : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(student.id)}
                            className="p-1 text-zinc-400 hover:text-zinc-900 rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
                            title={isPassVisible ? 'Hide password' : 'Show password'}
                          >
                            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyPassword(student.id, pass)}
                            className="p-1 text-zinc-400 hover:text-zinc-900 rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
                            title="Copy password to clipboard"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
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
                            className="p-1.5 rounded-lg bg-zinc-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
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

      {/* EDIT STUDENT MODAL */}
      {editingStudent && (
        <Modal
          isOpen={Boolean(editingStudent)}
          onClose={() => setEditingStudent(null)}
          title={isKhmer ? 'កែសម្រួលគណនី & ថ្លៃសិក្សាសិស្ស' : 'Edit Student Account & Tuition'}
          subtitle={editingStudent.fullName}
          maxWidth="sm"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ឈ្មោះពេញរបស់សិស្ស (Full Name)' : 'Student Full Name'} *
              </label>
              <input
                type="text"
                required
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold text-zinc-900 focus:border-zinc-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'លេខទូរស័ព្ទទំនាក់ទំនង' : 'Phone Number'}
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="012 345 678"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold text-zinc-900 focus:border-zinc-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'កាលបរិច្ឆេទបង់ថ្លៃសិក្សា ($15)' : 'Tuition Deadline ($15)'}
              </label>
              <input
                type="text"
                value={editPaymentDeadline}
                onChange={(e) => setEditPaymentDeadline(e.target.value)}
                placeholder="28-Aug-26"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold text-zinc-900 focus:border-zinc-800 outline-none"
              />
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
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold focus:border-zinc-800 outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                {isKhmer ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
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
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-700">{isKhmer ? 'អត្តលេខស្វ័យប្រវត្តិ៖' : 'Auto Student ID:'}</span>
              <span className="px-2.5 py-1 rounded bg-zinc-200 text-zinc-950 font-mono font-bold text-xs">{getNextAutoStudentId()}</span>
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
                placeholder="ឧ. សុខ បញ្ញា"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold text-zinc-900 focus:border-zinc-800 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'លេខទូរស័ព្ទ' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="012 345 678"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold text-zinc-900 focus:border-zinc-800 outline-none"
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
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold text-zinc-900 focus:border-zinc-800 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                {isKhmer ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
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
