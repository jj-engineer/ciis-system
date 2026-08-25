import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge, BadgeVariant } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { AttendanceStatus, UserProfile } from '../../types';
import { downloadProfessionalAttendanceExcel } from '../../utils/excelAttendanceExport';
import { downloadAttendancePdf } from '../../utils/pdfAttendanceExport';
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  HeartPulse,
  Calendar as CalendarIcon,
  Download,
  AlertTriangle,
  Search,
  Filter,
  Save,
  CheckCheck,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  Printer,
  User,
  UserPlus,
  UploadCloud,
  Edit3,
  Trash2,
  Plus,
  ListPlus,
  Sparkles,
  Users
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { allProfiles, currentUser, registerStudent, updateStudentCredentials, deleteStudentProfile, getNextAutoStudentId } = useAuth();
  const { isKhmer, t } = useLanguage();
  const {
    classes,
    selectedClassId,
    setSelectedClassId,
    selectedClass,
    attendance,
    saveAttendance,
    studentAnalytics
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>('2026-08-25');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'daily' | 'history'>('daily');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Student Management Modals State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<UserProfile | null>(null);

  // Add Single Student Form
  const [newName, setNewName] = useState<string>('');
  const [newGender, setNewGender] = useState<'female' | 'male'>('female');
  const [newStudentId, setNewStudentId] = useState<string>('');

  // Bulk Upload Form
  const [bulkText, setBulkText] = useState<string>('');

  // Edit Student Form
  const [editName, setEditName] = useState<string>('');
  const [editGender, setEditGender] = useState<'female' | 'male'>('female');
  const [editStudentId, setEditStudentId] = useState<string>('');

  // Filter students belonging to the active class
  const classStudents = allProfiles.filter(
    (p) => p.role === 'student' && (p.classId === selectedClassId || !p.classId)
  );

  // Existing records for selected class and date
  const dateRecords = attendance.filter(
    (a) => a.classId === selectedClassId && a.date === selectedDate
  );

  // Local draft state for quick 1-click toggling
  const [draftStatuses, setDraftStatuses] = useState<Record<string, { status: AttendanceStatus; note: string }>>(() => {
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach((student) => {
      const match = dateRecords.find((r) => r.studentId === student.id);
      map[student.id] = {
        status: match ? match.status : 'present',
        note: match?.note || '',
      };
    });
    return map;
  });

  // Re-sync local draft when selectedClass, date, or student roster changes
  React.useEffect(() => {
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach((student) => {
      const match = attendance.find(
        (r) => r.classId === selectedClassId && r.date === selectedDate && r.studentId === student.id
      );
      map[student.id] = {
        status: match ? match.status : 'present',
        note: match?.note || '',
      };
    });
    setDraftStatuses(map);
  }, [selectedClassId, selectedDate, attendance, allProfiles]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setDraftStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setDraftStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note,
      },
    }));
  };

  // 1-Click "Mark All Present"
  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach((student) => {
      updated[student.id] = {
        status: 'present',
        note: draftStatuses[student.id]?.note || '',
      };
    });
    setDraftStatuses(updated);
    setSaveSuccessMsg(isKhmer ? 'បានកំណត់សិស្សទាំងអស់ជា វត្តមាន!' : 'All students marked Present!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Open Add Student Modal
  const handleOpenAddModal = () => {
    const autoId = getNextAutoStudentId ? getNextAutoStudentId() : `STD-${String(classStudents.length + 1).padStart(3, '0')}`;
    setNewStudentId(autoId);
    setNewName('');
    setNewGender('female');
    setShowAddModal(true);
  };

  // Submit Add Single Student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created = registerStudent({
      fullName: newName.trim(),
      classId: selectedClassId,
      className: selectedClass?.name || 'CIIS Computer {5:30-6:30}',
      gender: newGender,
      studentId: newStudentId.trim() || undefined,
      password: '123'
    });

    setDraftStatuses((prev) => ({
      ...prev,
      [created.id]: { status: 'present', note: '' }
    }));

    setShowAddModal(false);
    setNewName('');
    setSaveSuccessMsg(isKhmer ? `បានបន្ថែមសិស្ស "${created.fullName}" ចូលក្នុងថ្នាក់ដោយជោគជ័យ!` : `Added student "${created.fullName}" successfully!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Submit Bulk Upload / Paste Student List
  const handleBulkUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    let count = 0;

    lines.forEach((line) => {
      // Clean leading numbering e.g. "1. ", "20-", "#3", "1) "
      let clean = line.replace(/^(\d+[\.\-\)]\s*|\#\d+\s*)/, '').trim();
      let gender: 'female' | 'male' = 'male';

      // Detect gender keywords in Khmer or English
      if (clean.includes('ស្រី') || clean.toLowerCase().includes('female') || clean.toLowerCase().includes(',f')) {
        gender = 'female';
        clean = clean.replace(/(,\s*)?(ស្រី|female|F|f)/gi, '').trim();
      } else if (clean.includes('ប្រុស') || clean.toLowerCase().includes('male') || clean.toLowerCase().includes(',m')) {
        gender = 'male';
        clean = clean.replace(/(,\s*)?(ប្រុស|male|M|m)/gi, '').trim();
      }

      if (clean) {
        const created = registerStudent({
          fullName: clean,
          classId: selectedClassId,
          className: selectedClass?.name || 'CIIS Computer {5:30-6:30}',
          gender,
          password: '123'
        });
        setDraftStatuses((prev) => ({ ...prev, [created.id]: { status: 'present', note: '' } }));
        count++;
      }
    });

    setShowUploadModal(false);
    setBulkText('');
    setSaveSuccessMsg(isKhmer ? `បានបញ្ចូលសិស្សចំនួន ${count} នាក់ចូលក្នុងថ្នាក់ដោយជោគជ័យ!` : `Successfully imported ${count} students into class!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Open Edit Modal
  const handleOpenEditModal = (student: UserProfile) => {
    setEditingStudent(student);
    setEditName(student.fullName);
    setEditGender((student.gender as 'female' | 'male') || 'male');
    setEditStudentId(student.studentId || '');
  };

  // Save Edit Student
  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editName.trim()) return;

    updateStudentCredentials(editingStudent.id, {
      fullName: editName.trim(),
      gender: editGender,
      studentId: editStudentId.trim() || undefined
    });

    setEditingStudent(null);
    setSaveSuccessMsg(isKhmer ? `បានកែសម្រួលព័ត៌មាន "${editName}" រួចរាល់!` : `Updated student "${editName}" successfully!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Delete Student
  const handleDeleteStudent = (student: UserProfile) => {
    const msg = isKhmer
      ? `តើអ្នកពិតជាចង់លុបសិស្ស "${student.fullName}" (${student.studentId || ''}) ចេញពីបញ្ជីវត្តមានថ្នាក់នេះមែនទេ?`
      : `Are you sure you want to remove "${student.fullName}" (${student.studentId || ''}) from class attendance?`;

    if (window.confirm(msg)) {
      deleteStudentProfile(student.id);
      setDraftStatuses((prev) => {
        const next = { ...prev };
        delete next[student.id];
        return next;
      });
      setSaveSuccessMsg(isKhmer ? `បានលុបសិស្ស "${student.fullName}" រួចរាល់!` : `Removed student "${student.fullName}"!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  // Save changes to state & storage
  const handleSaveAttendance = () => {
    const payload = classStudents.map((s) => ({
      id: `att-${selectedClassId}-${s.id}-${selectedDate}`,
      classId: selectedClassId,
      studentId: s.id,
      studentName: s.fullName,
      studentCode: s.studentId || 'STD-001',
      date: selectedDate,
      status: draftStatuses[s.id]?.status || 'present',
      note: draftStatuses[s.id]?.note || '',
      recordedByName: currentUser.fullName,
      recordedAt: new Date().toISOString()
    }));

    saveAttendance(payload);
    setSaveSuccessMsg(isKhmer ? `បានរក្សាទុកវត្តមានថ្ងៃ ${selectedDate} ដោយជោគជ័យ!` : `Attendance saved successfully for ${selectedDate}!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Download as PDF (.pdf) with the 7 required columns
  const handleDownloadPDF = () => {
    const records = classStudents.map((s, index) => {
      const draft = draftStatuses[s.id] || { status: 'present', note: '' };
      return {
        no: index + 1,
        studentName: s.fullName,
        gender: s.gender === 'female' ? 'F' : 'M',
        isPresent: draft.status === 'present',
        isAbsent: draft.status === 'absent',
        isLate: draft.status === 'late',
        isPermission: draft.status === 'permission',
        isSick: draft.status === 'sick'
      };
    });

    downloadAttendancePdf({
      schoolName: isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស (CIIS)' : 'CIIS International School',
      reportTitle: 'Official Student Attendance Sheet',
      className: selectedClass?.name || 'CIIS Computer {5:30-6:30}',
      date: selectedDate,
      teacherName: currentUser.fullName,
      academicYear: '2026-2027',
      records
    });
  };

  // Professional Excel Table Export (.xls)
  const handleExportExcel = (format: 'excel_table' | 'csv' = 'excel_table') => {
    const exportItems = classStudents.map((s, index) => {
      const matchAnalytics = studentAnalytics.find(a => a.studentId === s.id);
      const draft = draftStatuses[s.id] || { status: 'present', note: '' };
      const isFemale = s.gender === 'female';

      return {
        no: index + 1,
        studentId: s.studentId || `STD-${String(index + 1).padStart(3, '0')}`,
        fullName: s.fullName,
        gender: isFemale ? (isKhmer ? 'ស្រី (ស)' : 'F') : (isKhmer ? 'ប្រុស (ប)' : 'M'),
        className: selectedClass?.name || 'CIIS Computer {5:30-6:30}',
        status: draft.status === 'present'
          ? (isKhmer ? 'វត្តមាន (មក)' : 'Present')
          : draft.status === 'absent'
          ? (isKhmer ? 'អវត្តមាន (ឈប់)' : 'Absent')
          : draft.status === 'late'
          ? (isKhmer ? 'មកយឺត' : 'Late')
          : draft.status === 'sick'
          ? (isKhmer ? 'ឈឺ' : 'Sick')
          : (isKhmer ? 'សុំច្បាប់' : 'Permission'),
        attendanceRate: matchAnalytics?.attendancePercentage || (draft.status === 'present' ? 95 : 75),
        notes: draft.note || (draft.status === 'present' ? 'ទៀងទាត់' : 'មានការអនុញ្ញាត'),
        standing: (matchAnalytics?.attendancePercentage || 95) >= 80 ? 'Good Standing' : 'Needs Attention'
      };
    });

    downloadProfessionalAttendanceExcel({
      schoolName: isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស (CIIS)' : 'CIIS International School',
      reportTitle: 'តារាងស្រង់វត្តមានសិស្សផ្លូវការ (OFFICIAL ATTENDANCE SHEET)',
      className: selectedClass?.name || 'CIIS Computer {5:30-6:30}',
      date: selectedDate,
      teacherName: currentUser.fullName,
      academicYear: '2026-2027',
      items: exportItems,
      format
    });
  };

  // Counts & Stats
  const total = classStudents.length || 1;
  const presentCount = Object.values(draftStatuses).filter((s) => s.status === 'present').length;
  const absentCount = Object.values(draftStatuses).filter((s) => s.status === 'absent').length;
  const lateCount = Object.values(draftStatuses).filter((s) => s.status === 'late').length;
  const permissionCount = Object.values(draftStatuses).filter((s) => s.status === 'permission').length;
  const sickCount = Object.values(draftStatuses).filter((s) => s.status === 'sick').length;
  const attendanceRate = Math.round((presentCount / total) * 100);

  const filteredStudents = classStudents.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.studentId && s.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const statusConfig: Record<
    AttendanceStatus,
    { label: string; variant: BadgeVariant; icon: React.ComponentType<{ className?: string }> }
  > = {
    present: { label: t('status.present', undefined, 'Present'), variant: 'green', icon: CheckCircle },
    absent: { label: t('status.absent', undefined, 'Absent'), variant: 'red', icon: XCircle },
    late: { label: t('status.late', undefined, 'Late'), variant: 'amber', icon: Clock },
    permission: { label: t('status.permission', undefined, 'Permission'), variant: 'blue', icon: HelpCircle },
    sick: { label: t('status.sick', undefined, 'Sick'), variant: 'purple', icon: HeartPulse },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-zinc-900" />
            {t('title.attendance', undefined, 'Fast Attendance Management')}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            {isKhmer
              ? 'ស្រង់វត្តមានសិស្សប្រចាំថ្ងៃក្នុងថ្នាក់រៀន បន្ថែមសិស្សថ្មី កែសម្រួលឈ្មោះ និងទាញយកឯកសារផ្លូវការ។'
              : 'Record official daily student attendance, manage roster, edit student details, and export records.'}
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Add Student Button */}
          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Add a new student to this class"
          >
            <UserPlus className="w-4 h-4 text-zinc-300" />
            <span>{isKhmer ? '+ បន្ថែមសិស្ស' : '+ Add Student'}</span>
          </button>

          {/* Paste / Upload Roster Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl border border-zinc-300 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Paste multiple student names to batch upload"
          >
            <UploadCloud className="w-4 h-4 text-zinc-700" />
            <span>{isKhmer ? 'ផ្ទុកបញ្ជីសិស្ស' : 'Upload Roster'}</span>
          </button>

          {/* PDF Export */}
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl border border-zinc-200 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download clean 7-column PDF attendance sheet (.pdf)"
          >
            <FileText className="w-4 h-4 text-zinc-600" />
            <span>{isKhmer ? 'PDF (.pdf)' : 'PDF (.pdf)'}</span>
          </button>

          {/* Excel Export */}
          <button
            onClick={() => handleExportExcel('excel_table')}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl border border-zinc-200 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download formatted Excel table"
          >
            <FileSpreadsheet className="w-4 h-4 text-zinc-600" />
            <span>{isKhmer ? 'Excel (.xls)' : 'Excel (.xls)'}</span>
          </button>

          {/* Save Attendance */}
          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4 text-zinc-300" />
            <span>{t('action.save_attendance', undefined, 'Save Attendance')}</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Controls Bar: Class, Date, Mark All Present, Live Counter */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Class Dropdown */}
            <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-200">
              <span className="text-xs font-semibold text-zinc-500">Class:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-transparent font-bold text-xs text-zinc-900 outline-none cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({classStudents.length} Students)
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-200">
              <CalendarIcon className="w-4 h-4 text-zinc-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent font-bold text-xs text-zinc-900 outline-none cursor-pointer"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-xl text-xs font-semibold text-zinc-600 border border-zinc-200">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'daily' ? 'bg-white text-zinc-950 shadow-xs font-bold' : 'hover:text-zinc-900'
                }`}
              >
                Daily Sheet
              </button>
              <button
                onClick={() => setViewMode('history')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'history' ? 'bg-white text-zinc-950 shadow-xs font-bold' : 'hover:text-zinc-900'
                }`}
              >
                History Logs
              </button>
            </div>
          </div>

          {/* Quick Mark All Present Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="w-full sm:w-auto px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl border border-zinc-300 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-zinc-600" />
              <span>Select All as Present</span>
            </button>
          </div>
        </div>

        {/* Live Attendance Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-slate-100">
          <div className="p-2.5 rounded-xl bg-zinc-900 text-white border border-zinc-900 text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Class Rate</span>
            <span className="text-base font-black text-white">{attendanceRate}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Present</span>
            <span className="text-base font-black text-zinc-900">{presentCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Absent</span>
            <span className="text-base font-black text-zinc-900">{absentCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Late</span>
            <span className="text-base font-black text-zinc-900">{lateCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Permission</span>
            <span className="text-base font-black text-zinc-900">{permissionCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Sick</span>
            <span className="text-base font-black text-zinc-900">{sickCount}</span>
          </div>
        </div>
      </div>

      {/* Student List View / Table */}
      {viewMode === 'daily' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Search bar above list */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student name or ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400/20 focus:border-zinc-800 transition-all"
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold shrink-0">
              Showing {filteredStudents.length} students
            </span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-600 uppercase font-bold text-[11px] border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">{isKhmer ? 'សិស្ស' : 'Student'}</th>
                  <th className="py-3 px-3">{isKhmer ? 'ភេទ' : 'Sex'}</th>
                  <th className="py-3 px-3">{isKhmer ? 'អត្តលេខ' : 'Student ID'}</th>
                  <th className="py-3 px-4">{isKhmer ? 'វត្តមាន (១-ចុច)' : 'Mark Status (1-Click)'}</th>
                  <th className="py-3 px-4">{isKhmer ? 'កំណត់ចំណាំ / មូលហេតុ' : 'Note / Reason'}</th>
                  <th className="py-3 px-4 text-center w-24">{isKhmer ? 'សកម្មភាព' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredStudents.map((student, idx) => {
                  const draft = draftStatuses[student.id] || { status: 'present', note: '' };
                  const isFemale = student.gender === 'female';
                  return (
                    <tr key={student.id} className="hover:bg-zinc-50/70 transition-colors">
                      {/* Line Number */}
                      <td className="py-3 px-4 text-center font-mono font-bold text-zinc-400">
                        {idx + 1}
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 border border-zinc-800 shadow-xs">
                            <User className="w-4 h-4 text-zinc-100" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{student.fullName}</span>
                            <span className="text-[10px] text-slate-500">{selectedClass?.name}</span>
                          </div>
                        </div>
                      </td>

                      {/* Sex / ភេទ */}
                      <td className="py-3 px-3">
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

                      {/* Student ID */}
                      <td className="py-3 px-3 font-mono font-medium text-slate-600">
                        {student.studentId || `STD-${String(idx + 1).padStart(3, '0')}`}
                      </td>

                      {/* Status Toggle Pills */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center bg-zinc-100 p-1 rounded-xl gap-1 border border-zinc-200">
                          {(['present', 'absent', 'late', 'permission', 'sick'] as AttendanceStatus[]).map((st) => {
                            const isSelected = draft.status === st;
                            const cfg = statusConfig[st];
                            const Icon = cfg.icon;

                            let activeBg = 'bg-zinc-900 text-white shadow-xs';
                            if (st === 'present') activeBg = 'bg-emerald-700 text-white shadow-xs';
                            if (st === 'absent') activeBg = 'bg-rose-700 text-white shadow-xs';
                            if (st === 'late') activeBg = 'bg-amber-700 text-white shadow-xs';
                            if (st === 'permission') activeBg = 'bg-sky-700 text-white shadow-xs';
                            if (st === 'sick') activeBg = 'bg-purple-700 text-white shadow-xs';

                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStatusChange(student.id, st)}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                                  isSelected
                                    ? activeBg
                                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{cfg.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Note input */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={draft.note}
                          onChange={(e) => handleNoteChange(student.id, e.target.value)}
                          placeholder={isKhmer ? 'កំណត់ចំណាំ (មូលហេតុ...)' : 'Add note...'}
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                        />
                      </td>

                      {/* Actions: Edit / Delete */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(student)}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
                            title={isKhmer ? 'កែប្រែព័ត៌មានសិស្ស' : 'Edit student'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(student)}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title={isKhmer ? 'លុបចេញពីថ្នាក់' : 'Delete student'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="md:hidden divide-y divide-slate-100 p-2 space-y-3">
            {filteredStudents.map((student, idx) => {
              const draft = draftStatuses[student.id] || { status: 'present', note: '' };
              const isFemale = student.gender === 'female';
              return (
                <div key={student.id} className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 border border-zinc-800 shadow-xs">
                        <User className="w-4 h-4 text-zinc-100" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900">{idx + 1}. {student.fullName}</h4>
                          {isFemale ? (
                            <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 text-[9.5px] font-bold border border-rose-200">
                              {isKhmer ? 'ស្រី' : 'F'}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 text-[9.5px] font-bold border border-sky-200">
                              {isKhmer ? 'ប្រុស' : 'M'}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{student.studentId}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(student)}
                        className="p-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(student)}
                        className="p-1 rounded-lg bg-white border border-zinc-200 text-zinc-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 1-Tap status buttons */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 pt-1">
                    {(['present', 'absent', 'late', 'permission', 'sick'] as AttendanceStatus[]).map((st) => {
                      const isSelected = draft.status === st;
                      return (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(student.id, st)}
                          className={`py-1 px-1.5 text-[10px] font-bold rounded-lg border text-center transition-all ${
                            isSelected
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {statusConfig[st].label}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    value={draft.note}
                    onChange={(e) => handleNoteChange(student.id, e.target.value)}
                    placeholder="Note..."
                    className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* History Logs View */
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Historical Attendance Logs</h3>
          <div className="divide-y divide-slate-100">
            {attendance.slice(0, 15).map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{rec.studentName}</span>
                  <span className="text-[11px] text-slate-500">{rec.date} • Recorded by {rec.recordedByName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {rec.note && <span className="text-slate-400 italic text-[11px]">"{rec.note}"</span>}
                  <Badge variant={statusConfig[rec.status].variant} size="sm">
                    {statusConfig[rec.status].label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD SINGLE STUDENT                                               */}
      {/* ========================================================================= */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={isKhmer ? 'បន្ថែមសិស្សថ្មីចូលក្នុងថ្នាក់' : 'Add New Student to Class'}
          subtitle={isKhmer ? `ថ្នាក់៖ ${selectedClass?.name || 'CIIS Computer'}` : `Class: ${selectedClass?.name || 'CIIS Computer'}`}
          maxWidth="md"
        >
          <form onSubmit={handleAddStudentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'ឈ្មោះសិស្សពេញលេញ (Full Name)' : 'Student Full Name'} *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={isKhmer ? 'ឧទាហរណ៍៖ សុខ បញ្ញា ឬ Sok Panha' : 'e.g. Sok Panha'}
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-800 outline-none font-bold text-zinc-900"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  {isKhmer ? 'ភេទ (Gender)' : 'Gender'} *
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
                  {isKhmer ? 'អត្តលេខសិស្ស (ID)' : 'Student ID'}
                </label>
                <input
                  type="text"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  placeholder="STD-020"
                  className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-800 outline-none font-mono font-bold text-zinc-900"
                />
              </div>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-[11px] text-zinc-500 space-y-1">
              <p>• {isKhmer ? 'ពាក្យសម្ងាត់ដំបូងរបស់សិស្សគឺ៖' : 'Initial default password is:'} <strong className="font-mono text-zinc-900">123</strong></p>
              <p>• {isKhmer ? 'សិស្សនឹងត្រូវបញ្ចូលក្នុងបញ្ជីវត្តមាន និងប្រព័ន្ធដោយស្វ័យប្រវត្តិ។' : 'The student will be instantly enrolled into this class roster.'}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                {isKhmer ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isKhmer ? '+ បន្ថែមសិស្ស' : '+ Add Student'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BATCH PASTE & UPLOAD ROSTER                                      */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title={isKhmer ? 'ផ្ទុក ឬបិទភ្ជាប់បញ្ជីឈ្មោះសិស្សជាបណ្តុំ' : 'Batch Paste & Upload Student Roster'}
          subtitle={isKhmer ? `បញ្ចូលសិស្សច្រើននាក់ក្នុងពេលតែមួយទៅក្នុង ${selectedClass?.name || 'CIIS Computer'}` : `Paste multiple student names to import to ${selectedClass?.name || 'CIIS Computer'}`}
          maxWidth="lg"
        >
          <form onSubmit={handleBulkUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'បិទភ្ជាប់បញ្ជីឈ្មោះសិស្ស (១ ជួរ = ១ នាក់)' : 'Paste Student Names (1 line per student)'}
              </label>
              <textarea
                rows={7}
                required
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`1. ផៃ ចិន្តា, ស្រី\n2. សេងវ៉ាក់ វិច្ឆ័យ, ប្រុស\n3. ថេង សុខគីមហួរ, ប្រុស\n4. វ៉ា ធីតា, ស្រី`}
                className="w-full p-3.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-800 outline-none font-medium font-sans text-zinc-900 leading-relaxed"
                autoFocus
              />
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-[11px] text-zinc-600 space-y-1">
              <p className="font-bold text-zinc-900">{isKhmer ? '💡 របៀបប្រើប្រាស់ងាយៗ៖' : '💡 Format Guide:'}</p>
              <p>• {isKhmer ? 'លោកគ្រូអ្នកគ្រូអាច Copy ឈ្មោះពី Telegram/Word/Excel រួច Paste ចូលបាន។' : 'You can copy lines from Telegram, Excel, or Word and paste here.'}</p>
              <p>• {isKhmer ? 'ប្រព័ន្ធនឹងកំណត់លេខសម្គាល់ STD-XXX និងភេទ (ស្រី/ប្រុស) ដោយស្វ័យប្រវត្តិ។' : 'The system will auto-assign Student IDs and detect gender automatically.'}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                {isKhmer ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-zinc-300" />
                <span>{isKhmer ? '📥 បញ្ចូលបញ្ជីសិស្សទាំងនេះ' : '📥 Import Students'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT STUDENT DETAILS                                             */}
      {/* ========================================================================= */}
      {editingStudent && (
        <Modal
          isOpen={Boolean(editingStudent)}
          onClose={() => setEditingStudent(null)}
          title={isKhmer ? 'កែសម្រួលព័ត៌មានសិស្ស' : 'Edit Student Details'}
          subtitle={editingStudent.fullName}
          maxWidth="md"
        >
          <form onSubmit={handleSaveEditStudent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'ឈ្មោះសិស្ស (Full Name)' : 'Full Name'} *
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-800 outline-none font-bold text-zinc-900"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  {isKhmer ? 'ភេទ (Gender)' : 'Gender'} *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditGender('female')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      editGender === 'female'
                        ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-600'
                    }`}
                  >
                    {isKhmer ? 'ស្រី (ស)' : 'Female'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditGender('male')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      editGender === 'male'
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
                  {isKhmer ? 'អត្តលេខសិស្ស (ID)' : 'Student ID'}
                </label>
                <input
                  type="text"
                  value={editStudentId}
                  onChange={(e) => setEditStudentId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-800 outline-none font-mono font-bold text-zinc-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                {isKhmer ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isKhmer ? 'រក្សាទុកការកែប្រែ' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
