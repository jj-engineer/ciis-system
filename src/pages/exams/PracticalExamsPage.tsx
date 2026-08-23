import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { PracticalExam, PracticalExamResult, PracticalExamTask, SubjectCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { getStudentAvatar } from '../../services/avatarLibrary';
import {
  Award,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Trash2,
  FileText,
  FileSpreadsheet,
  Users,
  CheckSquare,
  Edit,
  Save,
  Filter,
  Eye,
  ArrowRight
} from 'lucide-react';

export const PracticalExamsPage: React.FC = () => {
  const { currentUser, isStaff, isStudent, allProfiles } = useAuth();
  const { isKhmer, t } = useLanguage();
  const {
    practicalExams,
    createPracticalExam,
    practicalResults,
    savePracticalResult,
    classes
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'exams' | 'results'>('exams');
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [selectedExamForResults, setSelectedExamForResults] = useState<PracticalExam | null>(practicalExams[0] || null);
  const [gradingStudentModal, setGradingStudentModal] = useState<{
    exam: PracticalExam;
    student: any;
    result?: PracticalExamResult;
  } | null>(null);

  const [searchStudent, setSearchStudent] = useState('');
  const [filterClassId, setFilterClassId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Create Practical Exam Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectCode>('word');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || 'class-10a');
  const [newDate, setNewDate] = useState('2026-08-28');
  const [newStartTime, setNewStartTime] = useState('08:00');
  const [newDuration, setNewDuration] = useState(60);
  const [newMaxScore, setNewMaxScore] = useState(100);
  const [newInstructions, setNewInstructions] = useState('');
  const [tasks, setTasks] = useState<PracticalExamTask[]>([
    {
      id: 't-1',
      orderIndex: 1,
      title: 'Task 1: Text Formatting & Typography',
      description: 'Set Title to 18pt Bold, Body to 11pt with 1.15 line spacing.',
      maxMarks: 20
    },
    {
      id: 't-2',
      orderIndex: 2,
      title: 'Task 2: Create & Style Table',
      description: 'Insert a 4x5 table with header row and clean cell padding.',
      maxMarks: 20
    }
  ]);

  // Grading Modal Form State
  const [editingTaskScores, setEditingTaskScores] = useState<Record<string, number>>({});
  const [editingFeedback, setEditingFeedback] = useState('');

  // Handle Add Task to Exam
  const handleAddTask = () => {
    const nextIdx = tasks.length + 1;
    const newTask: PracticalExamTask = {
      id: `task-${Date.now()}-${nextIdx}`,
      orderIndex: nextIdx,
      title: `Task ${nextIdx}: New Practical Task`,
      description: 'Describe the practical computer task required for this exercise...',
      maxMarks: 20
    };
    setTasks([...tasks, newTask]);
  };

  const handleRemoveTask = (id: string) => {
    if (tasks.length <= 1) {
      alert('An exam must contain at least 1 task.');
      return;
    }
    setTasks(tasks.filter(t => t.id !== id).map((t, idx) => ({ ...t, orderIndex: idx + 1 })));
  };

  const handleTaskChange = (id: string, field: keyof PracticalExamTask, value: any) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const totalMarks = tasks.reduce((sum, t) => sum + Number(t.maxMarks || 0), 0);
    const cls = classes.find(c => c.id === newClassId);

    createPracticalExam({
      title: newTitle,
      subjectCode: newSubject,
      classId: newClassId,
      className: cls ? cls.name : 'Grade 10A',
      examDate: newDate,
      startTime: newStartTime,
      durationMinutes: Number(newDuration),
      maxScore: totalMarks,
      instructions: newInstructions || 'Complete all practical exam tasks on the lab computer.',
      tasks
    });

    setShowCreateExamModal(false);
    setNewTitle('');
    setNewInstructions('');
  };

  // Open Grading for Student
  const handleOpenGrading = (student: any) => {
    if (!selectedExamForResults) return;
    const existingResult = practicalResults.find(
      r => r.examId === selectedExamForResults.id && r.studentId === student.id
    );

    const initialScores: Record<string, number> = {};
    selectedExamForResults.tasks.forEach(t => {
      initialScores[t.id] = existingResult?.taskScores[t.id] ?? t.maxMarks;
    });

    setEditingTaskScores(initialScores);
    setEditingFeedback(existingResult?.teacherFeedback || '');
    setGradingStudentModal({
      exam: selectedExamForResults,
      student,
      result: existingResult
    });
  };

  // Save Graded Student Result
  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingStudentModal) return;

    const { exam, student } = gradingStudentModal;
    const totalAwarded = Object.values(editingTaskScores).reduce((a, b) => a + Number(b || 0), 0);
    const percentage = Math.round((totalAwarded / exam.maxScore) * 100);

    let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (percentage >= 85) grade = 'A';
    else if (percentage >= 75) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    savePracticalResult({
      examId: exam.id,
      examTitle: exam.title,
      classId: exam.classId,
      className: exam.className,
      studentId: student.id,
      studentName: student.fullName,
      studentCode: student.studentId || 'STD-2026-001',
      taskScores: editingTaskScores,
      totalScore: totalAwarded,
      maxScore: exam.maxScore,
      percentage,
      grade,
      isPass: percentage >= 50,
      teacherFeedback: editingFeedback
    });

    setGradingStudentModal(null);
  };

  // Student practical exam list
  const studentExams = practicalExams.filter(e => e.classId === currentUser.classId || !currentUser.classId);

  // Class Students list for Teacher Results view
  const targetClassStudents = allProfiles.filter(
    p => p.role === 'student' && (!selectedExamForResults || p.classId === selectedExamForResults.classId)
  );

  const filteredClassStudents = targetClassStudents.filter(student => {
    const res = practicalResults.find(r => r.examId === selectedExamForResults?.id && r.studentId === student.id);
    const matchesSearch = student.fullName.toLowerCase().includes(searchStudent.toLowerCase()) ||
                          (student.studentId && student.studentId.toLowerCase().includes(searchStudent.toLowerCase()));
    
    if (filterStatus === 'completed') return matchesSearch && !!res?.isCompleted;
    if (filterStatus === 'not_completed') return matchesSearch && !res?.isCompleted;
    return matchesSearch;
  });

  // Calculate Result summary stats
  const completedCount = targetClassStudents.filter(
    s => practicalResults.some(r => r.examId === selectedExamForResults?.id && r.studentId === s.id && r.isCompleted)
  ).length;
  const notCompletedCount = Math.max(0, targetClassStudents.length - completedCount);
  const examResultsList = practicalResults.filter(r => r.examId === selectedExamForResults?.id);
  const avgPercentage = examResultsList.length > 0
    ? Math.round(examResultsList.reduce((acc, r) => acc + r.percentage, 0) / examResultsList.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Award className="w-6 h-6 text-pink-700" />
            {t('exam.practical_exams', undefined, 'Computer Practical Exams')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isStaff
              ? isKhmer ? 'បង្កើតវិញ្ញាសាប្រឡងអនុវត្ត បញ្ចូលពិន្ទុតាមលំហាត់ និងតាមដាននិទ្ទេសសិស្ស។' : 'Create practical exams with structured tasks, enter marks, and track student grades.'
              : isKhmer ? 'ពិនិត្យមើលកាលវិភាគប្រឡងអនុវត្ត និងលទ្ធផលពិន្ទុដែលបានកែរួច។' : 'View your scheduled practical exams and your verified exam scores.'}
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setShowCreateExamModal(true)}
            className="px-4 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isKhmer ? 'បង្កើតការប្រឡងអនុវត្តថ្មី' : 'Create Practical Exam'}</span>
          </button>
        )}
      </div>

      {/* Teacher Tabs: [ Exams ] [ Results ] */}
      {isStaff && (
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs max-w-md">
          <button
            onClick={() => setActiveSubTab('exams')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'exams'
                ? 'bg-pink-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isKhmer ? 'គ្រប់គ្រងការប្រឡង' : 'Exams Management'}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('results')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'results'
                ? 'bg-pink-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>{isKhmer ? 'លទ្ធផល & កែពិន្ទុសិស្ស' : 'Student Exam Results'}</span>
          </button>
        </div>
      )}

      {/* STUDENT VIEW */}
      {isStudent && (
        <div className="space-y-6">
          {/* Upcoming Exams */}
          <div className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-700" />
              Upcoming Practical Exams
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentExams.map((exam) => {
                const myResult = practicalResults.find(
                  r => r.examId === exam.id && r.studentId === currentUser.id
                );
                return (
                  <div
                    key={exam.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-100 uppercase">
                          {exam.subjectCode} • {exam.className}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-2">{exam.title}</h3>
                      </div>
                      <Badge variant={myResult?.isCompleted ? 'green' : 'purple'} size="sm">
                        {myResult?.isCompleted ? 'Completed' : 'Scheduled'}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{exam.instructions}</p>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-bold">Date:</span>
                        <span>{exam.examDate} at {exam.startTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-bold">Duration:</span>
                        <span>{exam.durationMinutes} Minutes</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-bold">Total Practical Tasks:</span>
                        <span>{exam.tasks.length} Tasks ({exam.maxScore} Marks)</span>
                      </div>
                    </div>

                    {/* Tasks Breakdown */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Exam Tasks:
                      </span>
                      {exam.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-slate-800">{task.title}</span>
                          <span className="font-mono font-bold text-pink-700">{task.maxMarks} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Graded Exam Results for Logged in Student */}
          <div className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wide text-zinc-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pink-800" />
              My Completed Exam Results
            </h2>

            <div className="space-y-4">
              {practicalResults.filter(r => r.studentId === currentUser.id).map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
                    <div>
                      <h3 className="text-base font-extrabold text-zinc-950">{res.examTitle}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Graded by {res.gradedByName} • {new Date(res.gradedAt || '').toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-2xl font-black text-pink-900 font-mono">
                          {res.totalScore} / {res.maxScore}
                        </span>
                        <span className="text-[11px] text-zinc-400 block font-bold">
                          {res.percentage}% Score
                        </span>
                      </div>
                      <Badge variant="pink" size="md">
                        Grade {res.grade} • Passed
                      </Badge>
                    </div>
                  </div>

                  {/* Task Score Breakdown */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                      Task Score Breakdown
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(res.taskScores).map(([taskId, score]) => (
                        <div key={taskId} className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
                          <span className="text-zinc-700 font-medium">{taskId}</span>
                          <span className="font-mono font-bold text-zinc-950">{score} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {res.teacherFeedback && (
                    <div className="p-3.5 bg-pink-950/10 text-pink-950 rounded-2xl border border-pink-200 text-xs space-y-1">
                      <span className="font-bold block text-pink-900">Teacher Feedback:</span>
                      <p className="leading-relaxed">{res.teacherFeedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TEACHER VIEW: TAB 1: EXAMS LIST */}
      {isStaff && activeSubTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {practicalExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-pink-300 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-100 uppercase">
                    {exam.subjectCode} • {exam.className}
                  </span>
                  <Badge variant="pink" size="sm">{exam.maxScore} Marks</Badge>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{exam.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {exam.instructions}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs space-y-1.5 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Exam Date:</span>
                    <span className="font-bold text-slate-900">{exam.examDate} ({exam.startTime})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Duration:</span>
                    <span className="font-bold text-slate-900">{exam.durationMinutes} Minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Tasks Count:</span>
                    <span className="font-bold text-slate-900">{exam.tasks.length} Tasks</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Tasks Preview
                  </span>
                  {exam.tasks.slice(0, 3).map((t) => (
                    <div key={t.id} className="text-xs flex items-center justify-between text-slate-700 py-1 border-b border-slate-100">
                      <span className="truncate">{t.title}</span>
                      <span className="font-mono font-bold text-pink-700 shrink-0 ml-2">{t.maxMarks} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedExamForResults(exam);
                    setActiveSubTab('results');
                  }}
                  className="flex-1 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Grade / View Results</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TEACHER VIEW: TAB 2: EXAM RESULTS & GRADING */}
      {isStaff && activeSubTab === 'results' && (
        <div className="space-y-6">
          {/* Exam Selector & Stats Banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Active Practical Exam
                </span>
                <select
                  value={selectedExamForResults?.id || ''}
                  onChange={(e) => {
                    const found = practicalExams.find(ex => ex.id === e.target.value);
                    if (found) setSelectedExamForResults(found);
                  }}
                  className="mt-1 text-base font-extrabold text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl outline-none"
                >
                  {practicalExams.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.title} ({ex.className})</option>
                  ))}
                </select>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Students</span>
                  <span className="text-base font-black text-slate-900">{targetClassStudents.length}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Completed</span>
                  <span className="text-base font-black text-emerald-700">{completedCount}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Pending</span>
                  <span className="text-base font-black text-amber-700">{notCompletedCount}</span>
                </div>
                <div className="p-3 bg-pink-50 rounded-2xl border border-pink-100">
                  <span className="text-[10px] uppercase font-bold text-pink-800 block">Average</span>
                  <span className="text-base font-black text-pink-700">{avgPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Search student by name or ID..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {['all', 'completed', 'not_completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      filterStatus === st
                        ? 'bg-pink-700 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Student Results Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredClassStudents.map((student) => {
                    const res = practicalResults.find(
                      r => r.examId === selectedExamForResults?.id && r.studentId === student.id
                    );

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <img
                            src={student.avatarUrl || getStudentAvatar(student.studentId || student.fullName)}
                            alt={student.fullName}
                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                          />
                          <span>{student.fullName}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-500">
                          {student.studentId || 'STD-2026-001'}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {res ? `${res.totalScore} / ${res.maxScore}` : '—'}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold">
                          {res ? `${res.percentage}%` : '—'}
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          {res ? (
                            <Badge variant={res.grade === 'A' ? 'green' : res.grade === 'B' ? 'pink' : 'slate'} size="sm">
                              Grade {res.grade}
                            </Badge>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {res?.isCompleted ? (
                            <Badge variant="green" size="sm">Passed</Badge>
                          ) : (
                            <Badge variant="amber" size="sm">Not Graded</Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenGrading(student)}
                            className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-xl border border-pink-200 transition-colors"
                          >
                            {res ? 'Edit Marks' : 'Enter Marks'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PRACTICAL EXAM MODAL */}
      {showCreateExamModal && (
        <Modal
          isOpen={showCreateExamModal}
          onClose={() => setShowCreateExamModal(false)}
          title="Create Practical Exam"
          subtitle="Add computer practical tasks, mark weights, and schedule"
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateExamSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Exam Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Microsoft Word Practical Exam - Final"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as SubjectCode)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  <option value="word">Word</option>
                  <option value="excel">Excel</option>
                  <option value="typing">Typing</option>
                  <option value="basics">Basics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
                <select
                  value={newClassId}
                  onChange={(e) => setNewClassId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Exam Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Exam Instructions
              </label>
              <textarea
                rows={2}
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                placeholder="Overall instructions for students taking this practical exam..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            {/* Dynamic Exam Tasks List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Practical Exam Tasks ({tasks.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="px-3 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-lg border border-pink-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {tasks.map((task, idx) => (
                  <div key={task.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => handleTaskChange(task.id, 'title', e.target.value)}
                        placeholder={`Task ${idx + 1} Title`}
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                      />
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={task.maxMarks}
                          onChange={(e) => handleTaskChange(task.id, 'maxMarks', Number(e.target.value))}
                          className="w-16 px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono font-bold text-right outline-none"
                        />
                        <span className="text-xs text-slate-400 font-bold">pts</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTask(task.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={task.description}
                      onChange={(e) => handleTaskChange(task.id, 'description', e.target.value)}
                      placeholder="Task description & rubric expectations..."
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="p-3 bg-pink-50 rounded-xl border border-pink-100 flex items-center justify-between text-xs">
                <span className="font-bold text-pink-900">Total Exam Maximum Score:</span>
                <span className="font-mono font-black text-pink-700 text-sm">
                  {tasks.reduce((sum, t) => sum + Number(t.maxMarks || 0), 0)} Marks
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateExamModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Publish Exam
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* STUDENT GRADING MODAL */}
      {gradingStudentModal && (
        <Modal
          isOpen={true}
          onClose={() => setGradingStudentModal(null)}
          title={`Grade Student: ${gradingStudentModal.student.fullName}`}
          subtitle={`${gradingStudentModal.exam.title} • ${gradingStudentModal.student.studentId || 'Grade 10A'}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveResult} className="space-y-4">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Task-by-Task Marks Scoring
              </label>

              {gradingStudentModal.exam.tasks.map((task) => (
                <div key={task.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900">{task.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{task.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={task.maxMarks}
                      value={editingTaskScores[task.id] ?? 0}
                      onChange={(e) => setEditingTaskScores({
                        ...editingTaskScores,
                        [task.id]: Number(e.target.value)
                      })}
                      className="w-16 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono font-bold text-center outline-none focus:border-pink-600"
                    />
                    <span className="text-xs font-mono font-bold text-slate-400">/ {task.maxMarks}</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teacher Feedback & Guidance
              </label>
              <textarea
                rows={3}
                value={editingFeedback}
                onChange={(e) => setEditingFeedback(e.target.value)}
                placeholder="e.g. Good formatting on table. Check spacing on headers..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none leading-relaxed"
              />
            </div>

            {/* Auto Total & Grade Calculation Preview */}
            <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-pink-800 uppercase block">Total Awarded Score</span>
                <span className="text-xl font-black text-pink-700 font-mono">
                  {Object.values(editingTaskScores).reduce((a, b) => a + Number(b || 0), 0)} / {gradingStudentModal.exam.maxScore}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-pink-800 uppercase block">Calculated Grade</span>
                <span className="text-base font-black text-slate-900">
                  {Math.round((Object.values(editingTaskScores).reduce((a, b) => a + Number(b || 0), 0) / gradingStudentModal.exam.maxScore) * 100)}% (Grade A)
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setGradingStudentModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Student Grade</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
