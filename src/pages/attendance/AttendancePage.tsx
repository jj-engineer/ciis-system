import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getStudentAvatar } from '../../services/avatarLibrary';
import { Badge, BadgeVariant } from '../../components/common/Badge';
import { AttendanceStatus } from '../../types';
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
  Printer
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { allProfiles, currentUser } = useAuth();
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

  const [selectedDate, setSelectedDate] = useState<string>('2026-08-21');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'daily' | 'history'>('daily');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

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

  // Re-sync local draft when selectedClass or date changes
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
  }, [selectedClassId, selectedDate, attendance]);

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
    setSaveSuccessMsg('All students marked Present!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
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
    setSaveSuccessMsg(`Attendance saved successfully for ${selectedDate}!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Download as PDF (.pdf) with the 7 required columns
  const handleDownloadPDF = () => {
    const records = classStudents.map((s, index) => {
      const draft = draftStatuses[s.id] || { status: 'present', note: '' };
      return {
        no: index + 1,
        studentName: s.fullName,
        isPresent: draft.status === 'present',
        isAbsent: draft.status === 'absent',
        isLate: draft.status === 'late',
        isPermission: draft.status === 'permission',
        isSick: draft.status === 'sick'
      };
    });

    downloadAttendancePdf({
      schoolName: isKhmer ? 'សាលារៀនស៊ី អាយ អាយ អេស (CIIS)' : 'COMMUNITY INTERNAL INSPIRATION SCHOOL (CIIS)',
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

      return {
        no: index + 1,
        studentId: s.studentId || `STD-2026-${String(index + 1).padStart(3, '0')}`,
        fullName: s.fullName,
        gender: index % 2 === 0 ? 'M' : 'F',
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
      schoolName: isKhmer ? 'សាលារៀនស៊ី អាយ អាយ អេស (CIIS)' : 'COMMUNITY INTERNAL INSPIRATION SCHOOL (CIIS)',
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

  // Students with low attendance (<80%)
  const lowAttendanceStudents = studentAnalytics.filter((s) => s.attendancePercentage < 80);

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
            <CheckSquare className="w-6 h-6 text-pink-700" />
            {t('title.attendance', undefined, 'Fast Attendance Management')}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            {isKhmer
              ? 'ស្រង់វត្តមានសិស្សប្រចាំថ្ងៃក្នុងថ្នាក់រៀនបានលឿន និងត្រឹមត្រូវ។'
              : 'Record official daily student attendance rapidly and accurately.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            title="Download clean 7-column PDF attendance sheet (.pdf)"
          >
            <FileText className="w-4 h-4" />
            <span>{isKhmer ? 'ទាញយកជា PDF (.pdf)' : 'Download as PDF (.pdf)'}</span>
          </button>
          <button
            onClick={() => handleExportExcel('excel_table')}
            className="px-3.5 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-xl border border-pink-200 shadow-xs transition-all flex items-center gap-1.5"
            title="Download formatted Excel table"
          >
            <FileSpreadsheet className="w-4 h-4 text-pink-700" />
            <span>{isKhmer ? 'តារាង Excel (.xls)' : 'Excel (.xls)'}</span>
          </button>
          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{t('action.save_attendance', undefined, 'Save Attendance')}</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}



      {/* Controls Bar: Class, Date, Mark All Present, Live Counter */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Class Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Class:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-transparent font-bold text-xs text-slate-900 outline-none cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.studentCount} Students)
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <CalendarIcon className="w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent font-bold text-xs text-slate-900 outline-none cursor-pointer"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'daily' ? 'bg-white text-pink-700 shadow-xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Daily Sheet
              </button>
              <button
                onClick={() => setViewMode('history')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'history' ? 'bg-white text-pink-700 shadow-xs font-bold' : 'hover:text-slate-900'
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
              className="w-full sm:w-auto px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-xl border border-pink-200 shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Select All as Present</span>
            </button>
          </div>
        </div>

        {/* Live Attendance Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-slate-100">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Class Rate</span>
            <span className="text-base font-black text-pink-700">{attendanceRate}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Present</span>
            <span className="text-base font-black text-emerald-700">{presentCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-center">
            <span className="text-[10px] uppercase font-bold text-rose-800 block">Absent</span>
            <span className="text-base font-black text-rose-700">{absentCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Late</span>
            <span className="text-base font-black text-amber-700">{lateCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-center">
            <span className="text-[10px] uppercase font-bold text-sky-800 block">Permission</span>
            <span className="text-base font-black text-sky-700">{permissionCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-center">
            <span className="text-[10px] uppercase font-bold text-purple-800 block">Sick</span>
            <span className="text-base font-black text-purple-700">{sickCount}</span>
          </div>
        </div>
      </div>

      {/* Student List View / Table */}
      {viewMode === 'daily' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Search bar above list */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student name or ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 transition-all"
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold shrink-0">
              Showing {filteredStudents.length} students
            </span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Student ID</th>
                  <th className="py-3 px-4">Mark Status (1-Click)</th>
                  <th className="py-3 px-4">Note / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredStudents.map((student) => {
                  const draft = draftStatuses[student.id] || { status: 'present', note: '' };
                  return (
                    <tr key={student.id} className="hover:bg-pink-50/30 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatarUrl || getStudentAvatar(student.studentId || student.fullName)}
                            alt={student.fullName}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{student.fullName}</span>
                            <span className="text-[10px] text-slate-500">{selectedClass?.name}</span>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-3 px-3 font-mono font-medium text-slate-600">
                        {student.studentId || 'STD-001'}
                      </td>

                      {/* Status Toggle Pills */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                          {(['present', 'absent', 'late', 'permission', 'sick'] as AttendanceStatus[]).map((st) => {
                            const isSelected = draft.status === st;
                            const cfg = statusConfig[st];
                            const Icon = cfg.icon;

                            let activeBg = 'bg-pink-700 text-white shadow-xs';
                            if (st === 'present') activeBg = 'bg-emerald-600 text-white shadow-xs';
                            if (st === 'absent') activeBg = 'bg-rose-600 text-white shadow-xs';
                            if (st === 'late') activeBg = 'bg-amber-600 text-white shadow-xs';
                            if (st === 'permission') activeBg = 'bg-sky-600 text-white shadow-xs';
                            if (st === 'sick') activeBg = 'bg-purple-600 text-white shadow-xs';

                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStatusChange(student.id, st)}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all ${
                                  isSelected
                                    ? activeBg
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
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
                          placeholder="Add note (traffic, fever...)"
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:bg-white transition-all placeholder:text-slate-400"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="md:hidden divide-y divide-slate-100 p-2 space-y-3">
            {filteredStudents.map((student) => {
              const draft = draftStatuses[student.id] || { status: 'present', note: '' };
              return (
                <div key={student.id} className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={student.avatarUrl || getStudentAvatar(student.studentId || student.fullName)}
                        alt={student.fullName}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{student.fullName}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">{student.studentId}</span>
                      </div>
                    </div>
                    <Badge variant={statusConfig[draft.status].variant} size="sm">
                      {statusConfig[draft.status].label}
                    </Badge>
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
                              ? 'bg-pink-700 text-white border-pink-700'
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
    </div>
  );
};
