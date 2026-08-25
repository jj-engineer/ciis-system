import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../../components/common/Modal';
import { MonthlyExam, MonthlyExamStudentScore } from '../../types';
import { downloadMonthlyExamPdf } from '../../utils/pdfMonthlyExamExport';
import {
  FileText,
  Search,
  Plus,
  Edit2,
  Printer,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  BarChart3
} from 'lucide-react';

export const MonthlyExamsPage: React.FC = () => {
  const { isStaff } = useAuth();
  const { isKhmer } = useLanguage();
  const {
    classes,
    selectedClassId,
    setSelectedClassId,
    monthlyExams,
    updateMonthlyExamScore
  } = useApp();

  const [selectedExamId, setSelectedExamId] = useState<string>(
    monthlyExams[0]?.id || 'exam-july-2026-ciis-530'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'female' | 'male'>('all');
  const [showGradingScale, setShowGradingScale] = useState(false);

  // Score Edit Modal
  const [editingRecord, setEditingRecord] = useState<MonthlyExamStudentScore | null>(null);
  const [editAtt, setEditAtt] = useState<number>(90);
  const [editTyping, setEditTyping] = useState<number>(25);
  const [editQuiz, setEditQuiz] = useState<number>(70);
  const [editMonthly, setEditMonthly] = useState<number>(70);
  const [editOther, setEditOther] = useState<string>('');

  // Add New Score Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'female' | 'male'>('female');
  const [newStudentId, setNewStudentId] = useState('');
  const [newAtt, setNewAtt] = useState<number>(90);
  const [newTyping, setNewTyping] = useState<number>(25);
  const [newQuiz, setNewQuiz] = useState<number>(70);
  const [newMonthly, setNewMonthly] = useState<number>(70);
  const [newOther, setNewOther] = useState('');

  const activeExam: MonthlyExam | undefined =
    monthlyExams.find(e => e.id === selectedExamId) || monthlyExams[0];

  // Standard Global Grade Calculator
  const computeGrade = (avg: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' => {
    if (avg >= 85) return 'A';
    if (avg >= 75) return 'B';
    if (avg >= 65) return 'C';
    if (avg >= 50) return 'D';
    if (avg >= 30) return 'E';
    return 'F';
  };

  // Sort and rank all records by average descending
  const sortedRecords = useMemo(() => {
    if (!activeExam?.records) return [];
    return [...activeExam.records].sort((a, b) => b.average - a.average);
  }, [activeExam]);

  // Filter by search query and gender
  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return sortedRecords.filter(r => {
      const matchesSearch =
        r.studentName.toLowerCase().includes(q) ||
        (r.studentId && r.studentId.toLowerCase().includes(q)) ||
        (r.mention && r.mention.toLowerCase().includes(q));

      const isFemale = r.gender === 'female' || r.gender === 'ស';
      const isMale = r.gender === 'male' || r.gender === 'ប';
      const matchesGender =
        filterGender === 'all' ||
        (filterGender === 'female' && isFemale) ||
        (filterGender === 'male' && isMale);

      return matchesSearch && matchesGender;
    });
  }, [sortedRecords, searchQuery, filterGender]);

  // Aggregate Metrics
  const totalStudents = sortedRecords.length;
  const femaleCount = sortedRecords.filter(r => r.gender === 'female' || r.gender === 'ស').length;
  const maleCount = sortedRecords.filter(r => r.gender === 'male' || r.gender === 'ប').length;
  const classAvg = totalStudents > 0
    ? (sortedRecords.reduce((sum, r) => sum + r.average, 0) / totalStudents).toFixed(2)
    : '0.00';
  const passedStudents = sortedRecords.filter(r => r.average >= 50).length;
  const passRate = totalStudents > 0
    ? ((passedStudents / totalStudents) * 100).toFixed(1)
    : '0.0';
  const highestStudent = sortedRecords[0];

  // Top 3 Highlights
  const top1 = sortedRecords[0];
  const top2 = sortedRecords[1];
  const top3 = sortedRecords[2];

  const handleOpenEdit = (rec: MonthlyExamStudentScore) => {
    setEditingRecord(rec);
    setEditAtt(rec.attendance);
    setEditTyping(rec.typing);
    setEditQuiz(rec.quiz);
    setEditMonthly(rec.monthlyTest);
    setEditOther(rec.other || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord || !activeExam) return;

    const total = editAtt + editTyping + editQuiz + editMonthly;
    const average = Number((total / 4).toFixed(2));
    const mention = computeGrade(average);

    const updated: MonthlyExamStudentScore = {
      ...editingRecord,
      attendance: editAtt,
      typing: editTyping,
      quiz: editQuiz,
      monthlyTest: editMonthly,
      total,
      average,
      mention,
      other: editOther.trim()
    };

    updateMonthlyExamScore(activeExam.id, updated);
    setEditingRecord(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !activeExam) return;

    const total = newAtt + newTyping + newQuiz + newMonthly;
    const average = Number((total / 4).toFixed(2));
    const mention = computeGrade(average);

    const newRecord: MonthlyExamStudentScore = {
      id: `rec-${Date.now()}`,
      no: sortedRecords.length + 1,
      studentId: newStudentId.trim() || `STD-${String(sortedRecords.length + 1).padStart(3, '0')}`,
      studentName: newName.trim(),
      gender: newGender,
      attendance: newAtt,
      typing: newTyping,
      quiz: newQuiz,
      monthlyTest: newMonthly,
      total,
      average,
      rank: sortedRecords.length + 1,
      mention,
      other: newOther.trim()
    };

    updateMonthlyExamScore(activeExam.id, newRecord);
    setShowAddModal(false);
    setNewName('');
    setNewStudentId('');
    setNewOther('');
  };

  const handleExportPDF = () => {
    if (!activeExam) return;
    downloadMonthlyExamPdf({
      reportTitle: activeExam.title,
      subject: activeExam.subject,
      shift: activeExam.shift,
      dateStr: `CIIS, Date: ${activeExam.examDate}`,
      teacherName: activeExam.teacherName,
      directorName: activeExam.directorName,
      records: sortedRecords
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* 1. Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider">
              {activeExam?.month || 'July 2026'}
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] font-bold border border-zinc-200">
              {activeExam?.shift || 'Evening 5:30 - 6:30'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-800" />
            <span>{isKhmer ? 'តារាងពិន្ទុ & លទ្ធផលប្រឡងប្រចាំខែ' : 'Monthly Examination & Grading System'}</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isKhmer
              ? 'គណនាពិន្ទុរួមដោយស្វ័យប្រវត្តិ៖ វត្តមាន (១០០) + វាយអក្សរ (WPM) + កម្រងសំណួរ (១០០) + ប្រឡងប្រចាំខែ (១០០)'
              : 'Automated 4-component score ledger: Attendance (100) + Touch Typing (WPM) + Quiz (100) + Monthly Test (100).'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-zinc-700" />
            <span>{isKhmer ? 'បោះពុម្ពតារាង' : 'Print / Export Sheet'}</span>
          </button>

          {isStaff && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-zinc-300" />
              <span>{isKhmer ? 'បញ្ចូលពិន្ទុសិស្ស' : 'Enter Student Score'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Global Key Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-1">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
            {isKhmer ? 'សិស្សបានប្រឡង' : 'Total Examined'}
          </span>
          <p className="text-xl font-black text-zinc-950 font-mono">
            {totalStudents} <span className="text-xs font-normal text-zinc-500">({femaleCount} F • {maleCount} M)</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-1">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
            {isKhmer ? 'មធ្យមភាគរួមថ្នាក់' : 'Class Average'}
          </span>
          <p className="text-xl font-black text-zinc-950 font-mono">
            {classAvg}% <span className="text-xs font-bold text-zinc-500">({computeGrade(Number(classAvg))})</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-1">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
            {isKhmer ? 'ពិន្ទុខ្ពស់បំផុត' : 'Top Performer'}
          </span>
          <p className="text-sm sm:text-base font-black text-zinc-950 truncate">
            {highestStudent ? highestStudent.studentName : '-'} <span className="text-xs text-zinc-500">({highestStudent?.average}%)</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-1">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
            {isKhmer ? 'អត្រាប្រឡងជាប់' : 'Pass Rate (>=50%)'}
          </span>
          <p className="text-xl font-black text-zinc-950 font-mono">
            {passRate}% <span className="text-xs font-normal text-zinc-500">({passedStudents}/{totalStudents})</span>
          </p>
        </div>
      </div>

      {/* 3. Clean Leaderboard Highlights (Top 3 Ranks) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top1 && (
          <div className="p-4 rounded-2xl bg-white border-2 border-zinc-900 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider">
                Rank 1 • {isKhmer ? 'ចំណាត់ថ្នាក់លេខ ១' : 'First Place'}
              </span>
              <span className="font-mono text-xs font-black text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
                Grade {top1.mention}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-zinc-950 text-sm">{top1.studentName}</h3>
                <p className="text-[11px] text-zinc-400 font-mono">{top1.studentId || 'STD-008'}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-zinc-950 font-mono">{top1.average.toFixed(2)}%</span>
                <span className="text-[10px] text-zinc-400 block font-mono">{top1.total} / 400 pts</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center text-[10px] pt-1 border-t border-zinc-100 font-mono text-zinc-600">
              <div>Att: {top1.attendance}</div>
              <div>Typing: {top1.typing}</div>
              <div>Quiz: {top1.quiz}</div>
              <div>Exam: {top1.monthlyTest}</div>
            </div>
          </div>
        )}

        {top2 && (
          <div className="p-4 rounded-2xl bg-white border border-zinc-300 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-900 text-[10px] font-bold uppercase tracking-wider">
                Rank 2 • {isKhmer ? 'ចំណាត់ថ្នាក់លេខ ២' : 'Second Place'}
              </span>
              <span className="font-mono text-xs font-black text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
                Grade {top2.mention}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-zinc-950 text-sm">{top2.studentName}</h3>
                <p className="text-[11px] text-zinc-400 font-mono">{top2.studentId || 'STD-012'}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-zinc-950 font-mono">{top2.average.toFixed(2)}%</span>
                <span className="text-[10px] text-zinc-400 block font-mono">{top2.total} / 400 pts</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center text-[10px] pt-1 border-t border-zinc-100 font-mono text-zinc-600">
              <div>Att: {top2.attendance}</div>
              <div>Typing: {top2.typing}</div>
              <div>Quiz: {top2.quiz}</div>
              <div>Exam: {top2.monthlyTest}</div>
            </div>
          </div>
        )}

        {top3 && (
          <div className="p-4 rounded-2xl bg-white border border-zinc-300 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-900 text-[10px] font-bold uppercase tracking-wider">
                Rank 2 (Tie) • {isKhmer ? 'ចំណាត់ថ្នាក់លេខ ២ ស្ទួន' : 'Second Place (Tie)'}
              </span>
              <span className="font-mono text-xs font-black text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
                Grade {top3.mention}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-zinc-950 text-sm">{top3.studentName}</h3>
                <p className="text-[11px] text-zinc-400 font-mono">{top3.studentId || 'STD-010'}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-zinc-950 font-mono">{top3.average.toFixed(2)}%</span>
                <span className="text-[10px] text-zinc-400 block font-mono">{top3.total} / 400 pts</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center text-[10px] pt-1 border-t border-zinc-100 font-mono text-zinc-600">
              <div>Att: {top3.attendance}</div>
              <div>Typing: {top3.typing}</div>
              <div>Quiz: {top3.quiz}</div>
              <div>Exam: {top3.monthlyTest}</div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isKhmer ? 'ស្វែងរកឈ្មោះ, អត្តលេខ, ឬនិទ្ទេស...' : 'Search student name, ID, or grade...'}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 font-medium text-zinc-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-bold text-zinc-500">{isKhmer ? 'ភេទ៖' : 'Sex:'}</span>
          <div className="flex items-center gap-1 bg-zinc-50 p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => setFilterGender('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterGender === 'all' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              {isKhmer ? 'ទាំងអស់' : 'All'}
            </button>
            <button
              onClick={() => setFilterGender('female')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterGender === 'female' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              {isKhmer ? 'ស្រី (F)' : 'Female'}
            </button>
            <button
              onClick={() => setFilterGender('male')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterGender === 'male' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              {isKhmer ? 'ប្រុស (M)' : 'Male'}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Standard Score Sheet Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider text-center">
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-4 text-left min-w-[140px]">Student Name</th>
                <th className="py-3 px-2 w-12 text-center">Sex</th>
                <th className="py-3 px-3 w-24 text-center">Attendance (100)</th>
                <th className="py-3 px-3 w-20 text-center">Typing (WPM)</th>
                <th className="py-3 px-3 w-20 text-center">Quiz (100)</th>
                <th className="py-3 px-3 w-24 text-center">Monthly Test (100)</th>
                <th className="py-3 px-3 w-20 text-center">Total (400)</th>
                <th className="py-3 px-3 w-24 text-center">Average (%)</th>
                <th className="py-3 px-3 w-16 text-center">Grade</th>
                <th className="py-3 px-3 w-16 text-center">Rank</th>
                <th className="py-3 px-3 w-20 text-center">Status</th>
                {isStaff && <th className="py-3 px-3 w-16 text-right">Edit</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs font-medium text-center">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-zinc-400">
                    {isKhmer ? 'រកមិនឃើញទិន្នន័យសិស្សទេ' : 'No student records found.'}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => {
                  const isFemale = r.gender === 'female' || r.gender === 'ស';
                  const isPass = r.average >= 50;

                  return (
                    <tr key={r.id} className="hover:bg-zinc-50/70 transition-colors">
                      {/* No */}
                      <td className="py-3 px-3 font-mono font-bold text-zinc-700">
                        {r.no || idx + 1}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 text-left font-bold text-zinc-950">
                        <div>
                          <span>{r.studentName}</span>
                          <span className="text-[10px] text-zinc-400 font-mono block">{r.studentId || `STD-${String(idx + 1).padStart(3, '0')}`}</span>
                        </div>
                      </td>

                      {/* Sex */}
                      <td className="py-3 px-2">
                        <span className="px-1.5 py-0.2 rounded font-bold text-[10px] bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {isFemale ? (isKhmer ? 'ស' : 'F') : (isKhmer ? 'ប' : 'M')}
                        </span>
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-3 font-mono text-zinc-800">
                        {r.attendance}
                      </td>

                      {/* Typing */}
                      <td className="py-3 px-3 font-mono font-bold text-zinc-900">
                        {r.typing}
                      </td>

                      {/* Quiz */}
                      <td className="py-3 px-3 font-mono text-zinc-800">
                        {r.quiz}
                      </td>

                      {/* Monthly Test */}
                      <td className="py-3 px-3 font-mono text-zinc-800">
                        {r.monthlyTest}
                      </td>

                      {/* Total */}
                      <td className="py-3 px-3 font-mono font-black text-zinc-950">
                        {r.total}
                      </td>

                      {/* Average */}
                      <td className="py-3 px-3 font-mono font-black text-zinc-950">
                        {typeof r.average === 'number' ? r.average.toFixed(2) : r.average}%
                      </td>

                      {/* Grade */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-black text-xs font-mono ${
                          r.mention === 'A' || r.mention === 'B'
                            ? 'bg-zinc-900 text-white'
                            : r.mention === 'C'
                            ? 'bg-zinc-200 text-zinc-900'
                            : r.mention === 'D'
                            ? 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}>
                          {r.mention}
                        </span>
                      </td>

                      {/* Rank */}
                      <td className="py-3 px-3 font-mono font-bold text-zinc-800">
                        #{r.rank}
                      </td>

                      {/* Pass / Fail */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPass
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isPass ? (isKhmer ? 'ជាប់' : 'Pass') : (isKhmer ? 'ធ្លាក់' : 'Fail')}
                        </span>
                      </td>

                      {/* Actions */}
                      {isStaff && (
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
                            title="Edit Score"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Meta */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
          <span>
            {isKhmer ? 'គ្រូទទួលបន្ទុកថ្នាក់៖' : 'Class Instructor:'} <strong className="text-zinc-900">{activeExam?.teacherName || 'NUN LANGDY'}</strong>
          </span>
          <span className="font-mono">
            {activeExam?.examDate || 'Friday, July 31, 2026'}
          </span>
        </div>
      </div>

      {/* 6. Standard Grading Scale Reference (Collapsible) */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-xs">
        <button
          onClick={() => setShowGradingScale(!showGradingScale)}
          className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-zinc-500" />
            {isKhmer ? 'ស្តង់ដារកម្រិតពិន្ទុ & រូបមន្តគណនា (Global Grading Scale)' : 'Standard Grading Scale & Scoring Formula'}
          </span>
          {showGradingScale ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showGradingScale && (
          <div className="mt-3 pt-3 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="font-black text-zinc-950 block">Grade A</span>
              <span className="text-[11px] text-zinc-500 font-mono block">85.00 - 100%</span>
              <span className="text-[10px] text-zinc-400">{isKhmer ? 'ឆ្នើម' : 'Distinction'}</span>
            </div>

            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="font-black text-zinc-950 block">Grade B</span>
              <span className="text-[11px] text-zinc-500 font-mono block">75.00 - 84.99%</span>
              <span className="text-[10px] text-zinc-400">{isKhmer ? 'ល្អណាស់' : 'Very Good'}</span>
            </div>

            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="font-black text-zinc-950 block">Grade C</span>
              <span className="text-[11px] text-zinc-500 font-mono block">65.00 - 74.99%</span>
              <span className="text-[10px] text-zinc-400">{isKhmer ? 'ល្អ' : 'Good'}</span>
            </div>

            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="font-black text-zinc-950 block">Grade D</span>
              <span className="text-[11px] text-zinc-500 font-mono block">50.00 - 64.99%</span>
              <span className="text-[10px] text-zinc-400">{isKhmer ? 'មធ្យម' : 'Pass'}</span>
            </div>

            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="font-black text-zinc-950 block">Grade E</span>
              <span className="text-[11px] text-zinc-500 font-mono block">30.00 - 49.99%</span>
              <span className="text-[10px] text-zinc-400">{isKhmer ? 'ខ្សោយ' : 'Poor'}</span>
            </div>

            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="font-black text-zinc-950 block">Grade F</span>
              <span className="text-[11px] text-zinc-500 font-mono block">&lt; 30.00%</span>
              <span className="text-[10px] text-zinc-400">{isKhmer ? 'ធ្លាក់' : 'Fail'}</span>
            </div>
          </div>
        )}
      </div>

      {/* 7. Edit Score Modal */}
      {editingRecord && (
        <Modal
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          title={isKhmer ? `កែសម្រួលពិន្ទុ៖ ${editingRecord.studentName}` : `Edit Score: ${editingRecord.studentName}`}
          subtitle={isKhmer ? 'បញ្ចូលពិន្ទុធាតុផ្សំទាំង ៤ ដើម្បីគណនាពិន្ទុសរុប និងមធ្យមភាគ' : 'Enter the 4 scoring components to update total and grade'}
          maxWidth="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Attendance (100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={editAtt}
                  onChange={(e) => setEditAtt(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Typing (WPM)
                </label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  required
                  value={editTyping}
                  onChange={(e) => setEditTyping(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Quiz (100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={editQuiz}
                  onChange={(e) => setEditQuiz(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Monthly Test (100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={editMonthly}
                  onChange={(e) => setEditMonthly(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>
            </div>

            {/* Live Calculation Preview */}
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-zinc-400 text-[10px] block font-sans">Total Sum:</span>
                <strong className="text-zinc-950 font-black">{editAtt + editTyping + editQuiz + editMonthly} / 400</strong>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] block font-sans">Average:</span>
                <strong className="text-zinc-950 font-black">{((editAtt + editTyping + editQuiz + editMonthly) / 4).toFixed(2)}%</strong>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] block font-sans">Grade:</span>
                <strong className="text-zinc-950 font-black font-sans">{computeGrade((editAtt + editTyping + editQuiz + editMonthly) / 4)}</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'កំណត់ចំណាំ (Other)' : 'Notes / Remarks'}
              </label>
              <input
                type="text"
                value={editOther}
                onChange={(e) => setEditOther(e.target.value)}
                placeholder="Optional remarks"
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-medium text-zinc-900 focus:border-zinc-800"
              />
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                {isKhmer ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isKhmer ? 'រក្សាទុក' : 'Save Score'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 8. Add Student Score Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={isKhmer ? 'បញ្ចូលពិន្ទុសិស្សថ្មី' : 'Enter New Student Score'}
          subtitle={isKhmer ? 'បញ្ចូលឈ្មោះ ភេទ និងពិន្ទុទាំង ៤ ផ្នែក' : 'Add student credentials and score components'}
          maxWidth="md"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'ឈ្មោះពេញរបស់សិស្ស' : 'Full Name'} *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. SOK Panha"
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-bold text-zinc-900 focus:border-zinc-800"
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
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white border-zinc-200 text-zinc-600'
                    }`}
                  >
                    {isKhmer ? 'ស្រី (F)' : 'Female'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewGender('male')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      newGender === 'male'
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white border-zinc-200 text-zinc-600'
                    }`}
                  >
                    {isKhmer ? 'ប្រុស (M)' : 'Male'}
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
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Attendance
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={newAtt}
                  onChange={(e) => setNewAtt(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Typing WPM
                </label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  required
                  value={newTyping}
                  onChange={(e) => setNewTyping(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Quiz (100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={newQuiz}
                  onChange={(e) => setNewQuiz(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Monthly (100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={newMonthly}
                  onChange={(e) => setNewMonthly(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                {isKhmer ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isKhmer ? 'បញ្ចូលពិន្ទុ' : 'Save Record'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
