import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { MonthlyExam, MonthlyExamStudentScore } from '../../types';
import { downloadMonthlyExamPdf } from '../../utils/pdfMonthlyExamExport';
import {
  Award,
  Trophy,
  Medal,
  Search,
  Plus,
  Edit,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Users,
  Sparkles,
  BookOpen,
  Keyboard,
  CheckSquare,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';

export const MonthlyExamsPage: React.FC = () => {
  const { currentUser, isStaff, isStudent, allProfiles } = useAuth();
  const { isKhmer, t } = useLanguage();
  const {
    classes,
    selectedClassId,
    setSelectedClassId,
    monthlyExams,
    saveMonthlyExam,
    updateMonthlyExamScore,
    saveTypingTestResult
  } = useApp();

  const [selectedExamId, setSelectedExamId] = useState<string>(
    monthlyExams[0]?.id || 'exam-july-2026-ciis-530'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'female' | 'male'>('all');

  // Editing Score Modal State
  const [editingScoreRecord, setEditingScoreRecord] = useState<MonthlyExamStudentScore | null>(null);
  const [editAtt, setEditAtt] = useState(90);
  const [editTyping, setEditTyping] = useState(25);
  const [editQuiz, setEditQuiz] = useState(70);
  const [editMonthly, setEditMonthly] = useState(70);
  const [editOther, setEditOther] = useState('');

  // Add New Student Score Modal State
  const [showAddScoreModal, setShowAddScoreModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'female' | 'male'>('female');
  const [newStudentId, setNewStudentId] = useState('');
  const [newAtt, setNewAtt] = useState(90);
  const [newTyping, setNewTyping] = useState(25);
  const [newQuiz, setNewQuiz] = useState(70);
  const [newMonthly, setNewMonthly] = useState(70);
  const [newOther, setNewOther] = useState('');

  // Interactive Live Exam Modal State (Students/Teachers test simulation)
  const [showTakeExamModal, setShowTakeExamModal] = useState(false);
  const [examStep, setExamStep] = useState<'intro' | 'quiz' | 'typing' | 'summary'>('intro');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [typingInput, setTypingInput] = useState('');
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [simulatedWpm, setSimulatedWpm] = useState(35);
  const [simulatedQuizScore, setSimulatedQuizScore] = useState(80);

  const activeExam: MonthlyExam | undefined = 
    monthlyExams.find(e => e.id === selectedExamId) || monthlyExams[0];

  // Helper to compute Mention from Average Score
  const calculateMention = (avg: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' => {
    if (avg >= 85) return 'A';
    if (avg >= 70) return 'B';
    if (avg >= 65) return 'C';
    if (avg >= 50) return 'D';
    if (avg >= 30) return 'E';
    return 'F';
  };

  // Filtered & Ranked Student Records
  const sortedRecords = useMemo(() => {
    if (!activeExam?.records) return [];
    return [...activeExam.records].sort((a, b) => b.average - a.average);
  }, [activeExam]);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return sortedRecords.filter(r => {
      const matchesSearch = 
        r.studentName.toLowerCase().includes(q) ||
        (r.studentId && r.studentId.toLowerCase().includes(q)) ||
        (r.mention && r.mention.toLowerCase().includes(q)) ||
        (r.other && r.other.toLowerCase().includes(q));

      const isFemale = r.gender === 'female' || r.gender === 'ស';
      const isMale = r.gender === 'male' || r.gender === 'ប';
      const matchesGender = 
        filterGender === 'all' || 
        (filterGender === 'female' && isFemale) ||
        (filterGender === 'male' && isMale);

      return matchesSearch && matchesGender;
    });
  }, [sortedRecords, searchQuery, filterGender]);

  // Top 3 Podium Students
  const top1 = sortedRecords[0];
  const top2 = sortedRecords[1];
  const top3 = sortedRecords[2];

  // Open Edit Modal
  const handleOpenEditModal = (rec: MonthlyExamStudentScore) => {
    setEditingScoreRecord(rec);
    setEditAtt(rec.attendance);
    setEditTyping(rec.typing);
    setEditQuiz(rec.quiz);
    setEditMonthly(rec.monthlyTest);
    setEditOther(rec.other || '');
  };

  // Submit Edit Score
  const handleSaveEditedScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScoreRecord || !activeExam) return;

    const total = editAtt + editTyping + editQuiz + editMonthly;
    const average = Number((total / 4).toFixed(2));
    const mention = calculateMention(average);

    const updated: MonthlyExamStudentScore = {
      ...editingScoreRecord,
      attendance: editAtt,
      typing: editTyping,
      quiz: editQuiz,
      monthlyTest: editMonthly,
      total,
      average,
      mention,
      other: editOther
    };

    updateMonthlyExamScore(activeExam.id, updated);
    setEditingScoreRecord(null);
  };

  // Submit New Student Score
  const handleAddStudentScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !activeExam) return;

    const total = newAtt + newTyping + newQuiz + newMonthly;
    const average = Number((total / 4).toFixed(2));
    const mention = calculateMention(average);

    const newRecord: MonthlyExamStudentScore = {
      id: `rec-${Date.now()}`,
      no: sortedRecords.length + 1,
      studentId: newStudentId.trim() || `STD-${String(sortedRecords.length + 1).padStart(3, '0')}`,
      studentName: newStudentName.trim(),
      gender: newStudentGender,
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
    setShowAddScoreModal(false);
    setNewStudentName('');
    setNewStudentId('');
    setNewOther('');
  };

  // Trigger PDF Export
  const handleExportPDF = () => {
    if (!activeExam) return;
    downloadMonthlyExamPdf({
      reportTitle: activeExam.title,
      subject: activeExam.subject + ' 📖💻🖲️',
      shift: activeExam.shift,
      dateStr: `CIIS, Date: ${activeExam.examDate}`,
      teacherName: activeExam.teacherName,
      directorName: activeExam.directorName,
      records: sortedRecords
    });
  };

  // Interactive Live Exam Flow
  const handleStartExam = () => {
    setExamStep('quiz');
    setQuizAnswers({});
    setTypingInput('');
    setTypingStartTime(Date.now());
  };

  const handleFinishQuiz = () => {
    // Calculate Quiz Score
    let correctCount = 0;
    const questions = activeExam?.quizQuestions || [];
    questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const quizScore = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 80;
    setSimulatedQuizScore(quizScore);
    setExamStep('typing');
    setTypingStartTime(Date.now());
  };

  const handleFinishTyping = () => {
    const elapsedSeconds = typingStartTime ? Math.max(1, (Date.now() - typingStartTime) / 1000) : 30;
    const words = typingInput.trim().split(/\s+/).filter(Boolean).length;
    const calculatedWpm = Math.min(60, Math.max(15, Math.round((words / elapsedSeconds) * 60)));
    setSimulatedWpm(calculatedWpm);

    // Save typing result to system
    saveTypingTestResult({
      studentId: currentUser?.id || 'std-current',
      studentName: currentUser?.fullName || 'Active Student',
      wpm: calculatedWpm,
      accuracyPercentage: 96,
      correctKeystrokes: typingInput.length,
      errorKeystrokes: 2,
      timeSpentSeconds: Math.round(elapsedSeconds),
      difficulty: 'intermediate'
    });

    setExamStep('summary');
  };

  const typingPromptSample = 'Microsoft Word and Microsoft Excel are essential digital skills for every computer student at CIIS school.';

  return (
    <div className="space-y-7 max-w-7xl mx-auto font-sans pb-12">
      
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-lg bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-wider">
              {activeExam?.month || 'July 2026'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-zinc-100 text-zinc-800 text-[11px] font-bold border border-zinc-200">
              {activeExam?.shift || 'Shift Evening 5:30-6:30'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-zinc-900" />
            <span>{isKhmer ? 'លទ្ធផលប្រឡងប្រចាំខែកក្កដា (Result for July)' : 'July Examination Results & Leaderboard'}</span>
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            {isKhmer 
              ? 'តារាងពិន្ទុផ្លូវការ វត្តមាន វាយអក្សរ កម្រងសំណួរ និងការប្រឡងប្រចាំខែកុំព្យូទ័រ' 
              : 'Official score ledger, attendance, typing speed, quizzes, and monthly practical computer test.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            title="Print Official Exam Sheet"
          >
            <Printer className="w-4 h-4 text-zinc-700" />
            <span>{isKhmer ? 'បោះពុម្ពតារាងផ្លូវការ' : 'Print Official PDF'}</span>
          </button>

          <button
            onClick={() => {
              setShowTakeExamModal(true);
              setExamStep('intro');
            }}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-zinc-800" />
            <span>{isKhmer ? 'ធ្វើតេស្តប្រឡងផ្ទាល់' : 'Take Online Exam'}</span>
          </button>

          {isStaff && (
            <button
              onClick={() => setShowAddScoreModal(true)}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-zinc-300" />
              <span>{isKhmer ? 'បញ្ចូលពិន្ទុសិស្សថ្មី' : 'Add Student Score'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TOP SHOW LIST (Podium Leaderboard: 1st, 2nd, 3rd Honors) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-zinc-950 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-zinc-800" />
            <span>{isKhmer ? 'តារាងកិត្តិយសសិស្សឆ្នើម (Top Show List - Honors Podium)' : 'Top Show List (Honor Roll)'}</span>
          </h2>
          <span className="text-xs font-bold text-zinc-500">
            {isKhmer ? 'កាលបរិច្ឆេទ៖ ថ្ងៃទី ៣១ ខែកក្កដា ឆ្នាំ២០២៦' : 'Exam Date: Friday, July 31, 2026'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 🥇 1st Place (Gold Medal) */}
          {top1 && (
            <div className="bg-white rounded-2xl p-5 border-2 border-zinc-900 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4">
              <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-100 rounded-bl-full -z-0 opacity-60" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-black text-lg shadow-xs">
                      🥇
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-white text-[10px] font-extrabold uppercase tracking-wider">
                        Rank 1 • ជើងឯក
                      </span>
                      <h3 className="font-black text-zinc-950 text-base mt-0.5">{top1.studentName}</h3>
                      <p className="text-[11px] text-zinc-500 font-mono font-bold">{top1.studentId || 'STD-008'}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-zinc-100 text-zinc-900 font-black text-xs border border-zinc-200">
                    Mention: {top1.mention}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">{isKhmer ? 'មធ្យមភាគ' : 'Average'}</span>
                    <span className="text-lg font-black text-zinc-950">{top1.average.toFixed(2)}%</span>
                  </div>
                  <div className="border-l border-zinc-200 pl-2">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">{isKhmer ? 'ពិន្ទុសរុប' : 'Total Score'}</span>
                    <span className="text-lg font-black text-zinc-900">{top1.total} <span className="text-xs font-normal text-zinc-400">/400</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-zinc-100/70 border border-zinc-200/60">
                    <span className="text-[9px] text-zinc-500 block font-bold">Att</span>
                    <span className="font-bold text-zinc-900">{top1.attendance}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100/70 border border-zinc-200/60">
                    <span className="text-[9px] text-zinc-500 block font-bold">Typing</span>
                    <span className="font-bold text-zinc-900">{top1.typing} WPM</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100/70 border border-zinc-200/60">
                    <span className="text-[9px] text-zinc-500 block font-bold">Quiz</span>
                    <span className="font-bold text-zinc-900">{top1.quiz}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100/70 border border-zinc-200/60">
                    <span className="text-[9px] text-zinc-500 block font-bold">Monthly</span>
                    <span className="font-bold text-zinc-900">{top1.monthlyTest}</span>
                  </div>
                </div>
              </div>

              {top1.other && (
                <p className="text-[11px] text-zinc-600 font-medium italic border-t border-zinc-100 pt-2">
                  "{top1.other}"
                </p>
              )}
            </div>
          )}

          {/* 🥈 2nd Place (Silver Medal) */}
          {top2 && (
            <div className="bg-white rounded-2xl p-5 border border-zinc-300 shadow-xs relative overflow-hidden flex flex-col justify-between space-y-4">
              <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-black text-lg border border-zinc-200 shadow-xs">
                      🥈
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-900 text-[10px] font-extrabold uppercase tracking-wider">
                        Rank 2 • លេខ ២
                      </span>
                      <h3 className="font-black text-zinc-950 text-base mt-0.5">{top2.studentName}</h3>
                      <p className="text-[11px] text-zinc-500 font-mono font-bold">{top2.studentId || 'STD-012'}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-zinc-100 text-zinc-900 font-black text-xs border border-zinc-200">
                    Mention: {top2.mention}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">{isKhmer ? 'មធ្យមភាគ' : 'Average'}</span>
                    <span className="text-lg font-black text-zinc-950">{top2.average.toFixed(2)}%</span>
                  </div>
                  <div className="border-l border-zinc-200 pl-2">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">{isKhmer ? 'ពិន្ទុសរុប' : 'Total Score'}</span>
                    <span className="text-lg font-black text-zinc-900">{top2.total} <span className="text-xs font-normal text-zinc-400">/400</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-zinc-100/70 border border-zinc-200/60">
                    <span className="text-[9px] text-zinc-500 block font-bold">Att</span>
                    <span className="font-bold text-zinc-900">{top2.attendance}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100/70 border border-zinc-200/60">
                    <span className="text-[9px] text-zinc-500 block font-bold">Typing</span>
                    <span className="font-bold text-zinc-900">{top2.typing} WPM</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100/70 border border-zinc-200/60">
                    <span className="text-[9px] text-zinc-500 block font-bold">Quiz</span>
                    <span className="font-bold text-zinc-900">{top2.quiz}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100/70 border border-zinc-200/60">
                    <span className="text-[9px] text-zinc-500 block font-bold">Monthly</span>
                    <span className="font-bold text-zinc-900">{top2.monthlyTest}</span>
                  </div>
                </div>
              </div>

              {top2.other && (
                <p className="text-[11px] text-zinc-600 font-medium italic border-t border-zinc-100 pt-2">
                  "{top2.other}"
                </p>
              )}
            </div>
          )}

          {/* 🥉 3rd Place (Bronze Medal) */}
          {top3 && (
            <div className="bg-white rounded-2xl p-5 border border-zinc-300 shadow-xs relative overflow-hidden flex flex-col justify-between space-y-4">
              <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-black text-lg border border-zinc-200 shadow-xs">
                      🥉
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-900 text-[10px] font-extrabold uppercase tracking-wider">
                        Rank 2 (Tie) • លេខ ២
                      </span>
                      <h3 className="font-black text-zinc-950 text-base mt-0.5">{top3.studentName}</h3>
                      <p className="text-[11px] text-zinc-500 font-mono font-bold">{top3.studentId || 'STD-010'}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-zinc-100 text-zinc-900 font-black text-xs border border-zinc-200">
                    Mention: {top3.mention}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">{isKhmer ? 'មធ្យមភាគ' : 'Average'}</span>
                    <span className="text-lg font-black text-zinc-950">{top3.average.toFixed(2)}%</span>
                  </div>
                  <div className="border-l border-zinc-200 pl-2">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">{isKhmer ? 'ពិន្ទុសរុប' : 'Total Score'}</span>
                    <span className="text-lg font-black text-zinc-900">{top3.total} <span className="text-xs font-normal text-zinc-400">/400</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-zinc-100/70 border border-zinc-200/60">
                    <span className="text-[9px] text-zinc-500 block font-bold">Att</span>
                    <span className="font-bold text-zinc-900">{top3.attendance}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100/70 border border-zinc-200/60">
                    <span className="text-[9px] text-zinc-500 block font-bold">Typing</span>
                    <span className="font-bold text-zinc-900">{top3.typing} WPM</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100/70 border border-zinc-200/60">
                    <span className="text-[9px] text-zinc-500 block font-bold">Quiz</span>
                    <span className="font-bold text-zinc-900">{top3.quiz}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100/70 border border-zinc-200/60">
                    <span className="text-[9px] text-zinc-500 block font-bold">Monthly</span>
                    <span className="font-bold text-zinc-900">{top3.monthlyTest}</span>
                  </div>
                </div>
              </div>

              {top3.other && (
                <p className="text-[11px] text-zinc-600 font-medium italic border-t border-zinc-100 pt-2">
                  "{top3.other}"
                </p>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 3. Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isKhmer ? 'ស្វែងរកតាមឈ្មោះ, ចំណាត់ថ្នាក់, ឬនិទ្ទេស...' : 'Search student name, rank, or grade mention...'}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 font-medium text-zinc-900"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-bold text-zinc-500">{isKhmer ? 'តម្រៀបតាមភេទ៖' : 'Filter Sex:'}</span>
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
                filterGender === 'female' ? 'bg-rose-100 text-rose-800' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              {isKhmer ? 'ស្រី (ស)' : 'Female (ស)'}
            </button>
            <button
              onClick={() => setFilterGender('male')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterGender === 'male' ? 'bg-sky-100 text-sky-800' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              {isKhmer ? 'ប្រុស (ប)' : 'Male (ប)'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Official Ledger Table (Exact Paper Replica) */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-zinc-800" />
            <h3 className="font-extrabold text-zinc-950 text-xs uppercase tracking-wider">
              {isKhmer ? 'តារាងពិន្ទុ & ចំណាត់ថ្នាក់ប្រឡងផ្លូវការ (Official Result Ledger)' : 'Official Exam Score Ledger'}
            </h3>
          </div>
          <span className="text-xs font-bold text-zinc-500 font-mono">
            {filteredRecords.length} {isKhmer ? 'នាក់' : 'Students Listed'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-100/80 border-b border-zinc-200 text-[11px] font-extrabold text-zinc-600 uppercase tracking-wider text-center">
                <th className="py-3 px-3 w-12">Nº</th>
                <th className="py-3 px-4 text-left min-w-[150px]">NAME</th>
                <th className="py-3 px-3 w-14">Sex</th>
                <th className="py-3 px-3 w-24">Attendance</th>
                <th className="py-3 px-3 w-20">Typing</th>
                <th className="py-3 px-3 w-20">Quiz</th>
                <th className="py-3 px-3 w-28">Monthly test</th>
                <th className="py-3 px-3 w-20">Total</th>
                <th className="py-3 px-3 w-24">Average</th>
                <th className="py-3 px-3 w-16">Rank</th>
                <th className="py-3 px-3 w-20">Mention</th>
                <th className="py-3 px-4 text-left min-w-[140px]">Other</th>
                {isStaff && <th className="py-3 px-3 w-20 text-right">Edit</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs font-medium text-center">
              {filteredRecords.map((r, idx) => {
                const isFemale = r.gender === 'female' || r.gender === 'ស';

                return (
                  <tr
                    key={r.id}
                    className="hover:bg-zinc-50/80 transition-colors"
                  >
                    {/* Nº */}
                    <td className="py-3.5 px-3 font-bold text-zinc-900">
                      {r.no || idx + 1}
                    </td>

                    {/* NAME */}
                    <td className="py-3.5 px-4 text-left font-bold text-zinc-950 font-sans">
                      <div className="flex items-center gap-2">
                        <span>{r.studentName}</span>
                        {r.rank === 1 && <span title="Rank 1">🥇</span>}
                        {r.rank === 2 && <span title="Rank 2">🥈</span>}
                        {r.rank === 3 && <span title="Rank 3">🥉</span>}
                      </div>
                    </td>

                    {/* Sex */}
                    <td className="py-3.5 px-3">
                      {isFemale ? (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                          ស
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold text-[10px] border border-sky-200">
                          ប
                        </span>
                      )}
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-3 font-mono text-zinc-800">
                      {r.attendance}
                    </td>

                    {/* Typing */}
                    <td className="py-3.5 px-3 font-mono font-bold text-zinc-900">
                      {r.typing}
                    </td>

                    {/* Quiz */}
                    <td className="py-3.5 px-3 font-mono text-zinc-800">
                      {r.quiz}
                    </td>

                    {/* Monthly test */}
                    <td className="py-3.5 px-3 font-mono text-zinc-800">
                      {r.monthlyTest}
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-3 font-mono font-black text-zinc-950">
                      {r.total}
                    </td>

                    {/* Average */}
                    <td className="py-3.5 px-3 font-mono font-black text-zinc-950">
                      {typeof r.average === 'number' ? r.average.toFixed(2) : r.average}
                    </td>

                    {/* Rank */}
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-lg font-black text-xs font-mono ${
                        r.rank === 1
                          ? 'bg-zinc-900 text-white'
                          : r.rank === 2
                          ? 'bg-zinc-200 text-zinc-900'
                          : r.rank === 3
                          ? 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                          : 'text-zinc-700'
                      }`}>
                        #{r.rank}
                      </span>
                    </td>

                    {/* Mention */}
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-black ${
                        r.mention === 'A' || r.mention === 'B'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : r.mention === 'C'
                          ? 'bg-zinc-100 text-zinc-900 border border-zinc-200'
                          : r.mention === 'D'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : r.mention === 'E'
                          ? 'bg-orange-50 text-orange-800 border border-orange-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {r.mention}
                      </span>
                    </td>

                    {/* Other */}
                    <td className="py-3.5 px-4 text-left text-[11px] text-zinc-500 truncate max-w-[150px]">
                      {r.other || '-'}
                    </td>

                    {/* Action Edit */}
                    {isStaff && (
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleOpenEditModal(r)}
                          className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
                          title="Edit Score"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Meta & Signatures Banner */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-800" />
            <span>
              <strong>{isKhmer ? 'គ្រូទទួលបន្ទុកថ្នាក់៖' : 'Class Teacher:'}</strong> {activeExam?.teacherName || 'NUN LANGDY'} • <strong>{isKhmer ? 'នាយកសាលា៖' : 'Director:'}</strong> {activeExam?.directorName || 'ផល ស្រីណាខ'}
            </span>
          </div>
          <span className="font-mono text-zinc-500 font-bold">
            {activeExam?.examDate || 'Friday, July 31, 2026'}
          </span>
        </div>
      </div>

      {/* 5. EDIT SCORE MODAL */}
      {editingScoreRecord && (
        <Modal
          isOpen={!!editingScoreRecord}
          onClose={() => setEditingScoreRecord(null)}
          title={isKhmer ? `កែសម្រួលពិន្ទុ៖ ${editingScoreRecord.studentName}` : `Edit Exam Scores: ${editingScoreRecord.studentName}`}
          subtitle={isKhmer ? 'បញ្ចូលពិន្ទុវត្តមាន វាយអក្សរ កម្រងសំណួរ និងការប្រឡងប្រចាំខែ' : 'Update attendance, typing WPM, quiz, and monthly test scores'}
          maxWidth="md"
        >
          <form onSubmit={handleSaveEditedScore} className="space-y-4">
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

            {/* Calculated Preview */}
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-500 font-bold block">{isKhmer ? 'ពិន្ទុសរុប (Total)' : 'Total Sum:'}</span>
                <span className="text-sm font-black text-zinc-950 font-mono">{editAtt + editTyping + editQuiz + editMonthly} / 400</span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block">{isKhmer ? 'មធ្យមភាគ (Average)' : 'Average:'}</span>
                <span className="text-sm font-black text-zinc-950 font-mono">{((editAtt + editTyping + editQuiz + editMonthly) / 4).toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block">{isKhmer ? 'និទ្ទេស (Mention)' : 'Mention:'}</span>
                <span className="text-sm font-black text-zinc-950">{calculateMention((editAtt + editTyping + editQuiz + editMonthly) / 4)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'កំណត់ចំណាំផ្សេងៗ (Other / Notes)' : 'Other Notes'}
              </label>
              <input
                type="text"
                value={editOther}
                onChange={(e) => setEditOther(e.target.value)}
                placeholder="e.g. Excellent practical skills"
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-medium text-zinc-900 focus:border-zinc-800"
              />
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingScoreRecord(null)}
                className="px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                {t('action.cancel', undefined, 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isKhmer ? 'រក្សាទុកការកែប្រែ' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 6. ADD STUDENT SCORE MODAL */}
      {showAddScoreModal && (
        <Modal
          isOpen={showAddScoreModal}
          onClose={() => setShowAddScoreModal(false)}
          title={isKhmer ? 'បញ្ចូលពិន្ទុសិស្សថ្មីក្នុងតារាងប្រឡង' : 'Add Student Exam Score'}
          subtitle={isKhmer ? 'បញ្ចូលឈ្មោះ ភេទ វត្តមាន វាយអក្សរ កម្រងសំណួរ និងការប្រឡងប្រចាំខែ' : 'Enter student exam records for July ledger'}
          maxWidth="md"
        >
          <form onSubmit={handleAddStudentScoreSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'ឈ្មោះពេញរបស់សិស្ស' : 'Full Name'} *
              </label>
              <input
                type="text"
                required
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder={isKhmer ? 'ឧ. សុខ បញ្ញា' : 'e.g. Sok Panha'}
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
                    onClick={() => setNewStudentGender('female')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      newStudentGender === 'female'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-white border-zinc-200 text-zinc-600'
                    }`}
                  >
                    {isKhmer ? 'ស្រី (ស)' : 'Female'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStudentGender('male')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      newStudentGender === 'male'
                        ? 'bg-sky-50 border-sky-300 text-sky-800'
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
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono font-bold text-zinc-900 focus:border-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Att (100)
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
                onClick={() => setShowAddScoreModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                {t('action.cancel', undefined, 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isKhmer ? 'បញ្ចូលពិន្ទុ' : 'Add Score Record'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 7. INTERACTIVE LIVE EXAM MODAL */}
      {showTakeExamModal && (
        <Modal
          isOpen={showTakeExamModal}
          onClose={() => setShowTakeExamModal(false)}
          title={isKhmer ? 'ការប្រឡង & តេស្តផ្ទាល់ (Interactive Computer Examination)' : 'Interactive Computer Exam'}
          subtitle={isKhmer ? 'កម្រងសំណួរទ្រឹស្តី + ការប្រឡងវាយអក្សរផ្ទាល់' : 'Theory Quiz & Live Typing Speed Assessment'}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {examStep === 'intro' && (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mx-auto text-2xl shadow-sm">
                  📝
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-zinc-950">
                    {isKhmer ? 'ការប្រឡងប្រចាំខែកក្កដា - មុខវិជ្ជាកុំព្យូទ័រ' : 'July Computer Examination'}
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    {isKhmer 
                      ? 'ការប្រឡងរួមមាន ២ ផ្នែក៖ ផ្នែកទី១ សំណួរទ្រឹស្តីកុំព្យូទ័រ & Microsoft Office, ផ្នែកទី២ តេស្តល្បឿនវាយអក្សរ Touch Typing WPM។'
                      : 'The exam includes 2 sections: Section 1 Computer Theory & Office Quiz, Section 2 Live Touch Typing Assessment.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left text-xs pt-2">
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 font-bold block uppercase">ផ្នែកទី ១</span>
                    <strong className="text-zinc-900 font-bold">កម្រងសំណួរ (Quiz)</strong>
                    <span className="text-[11px] text-zinc-500 block">4 Questions • 100 Pts</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 font-bold block uppercase">ផ្នែកទី ២</span>
                    <strong className="text-zinc-900 font-bold">វាយអក្សរ (Typing)</strong>
                    <span className="text-[11px] text-zinc-500 block">Speed & Accuracy Test</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleStartExam}
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {isKhmer ? 'ចាប់ផ្តើមធ្វើការប្រឡង' : 'Start Exam Now'}
                  </button>
                </div>
              </div>
            )}

            {examStep === 'quiz' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                  <span className="text-xs font-extrabold uppercase text-zinc-500">
                    ផ្នែកទី ១ ៖ សំណួរទ្រឹស្តី & រូបមន្តកុំព្យូទ័រ
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-900">
                    {Object.keys(quizAnswers).length} / {activeExam?.quizQuestions?.length || 4} បានឆ្លើយ
                  </span>
                </div>

                <div className="space-y-4">
                  {(activeExam?.quizQuestions || []).map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2.5">
                      <p className="text-xs font-black text-zinc-950">
                        {idx + 1}. {q.questionKhmer}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isSelected = quizAnswers[q.id] === opt.label;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.label }))}
                              className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono ${
                                isSelected ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-900'
                              }`}>
                                {opt.label}
                              </span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-end">
                  <button
                    onClick={handleFinishQuiz}
                    className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>{isKhmer ? 'បន្តទៅផ្នែកតេស្តវាយអក្សរ (Next)' : 'Continue to Typing Test'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {examStep === 'typing' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                  <span className="text-xs font-extrabold uppercase text-zinc-500">
                    ផ្នែកទី ២ ៖ តេស្តល្បឿនវាយអក្សរ (Touch Typing Test)
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-900">
                    Live WPM Assessment
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">អត្ថបទត្រូវវាយ៖</span>
                  <p className="text-xs text-zinc-900 font-mono leading-relaxed bg-white p-3 rounded-lg border border-zinc-200">
                    {typingPromptSample}
                  </p>
                </div>

                <div>
                  <textarea
                    rows={3}
                    autoFocus
                    value={typingInput}
                    onChange={(e) => setTypingInput(e.target.value)}
                    placeholder="វាយអត្ថបទខាងលើនៅទីនេះ (Type the prompt here)..."
                    className="w-full p-3.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-800 outline-none font-mono text-zinc-900"
                  />
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-end">
                  <button
                    onClick={handleFinishTyping}
                    className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {isKhmer ? 'បញ្ចប់ & គណនាពិន្ទុ' : 'Finish & Calculate Score'}
                  </button>
                </div>
              </div>
            )}

            {examStep === 'summary' && (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mx-auto text-2xl shadow-sm">
                  🎉
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-zinc-950">
                    {isKhmer ? 'បានបញ្ចប់ការប្រឡងដោយជោគជ័យ!' : 'Examination Completed!'}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {isKhmer ? 'លទ្ធផលត្រូវបានកត់ត្រាចូលក្នុងប្រព័ន្ធដោយស្វ័យប្រវត្ត' : 'Scores have been calculated and recorded.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto text-center pt-2">
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 font-bold block uppercase">វត្តមាន</span>
                    <span className="text-base font-black text-zinc-950">100%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 font-bold block uppercase">វាយអក្សរ</span>
                    <span className="text-base font-black text-zinc-950">{simulatedWpm} WPM</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 font-bold block uppercase">Quiz</span>
                    <span className="text-base font-black text-zinc-950">{simulatedQuizScore}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 font-bold block uppercase">មធ្យមភាគ</span>
                    <span className="text-base font-black text-zinc-950">
                      {((100 + simulatedWpm + simulatedQuizScore + 75) / 4).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => setShowTakeExamModal(false)}
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {isKhmer ? 'បិទផ្ទាំងប្រឡង' : 'Close'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
};
