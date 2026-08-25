import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { MonkeytypeArena, MonkeytypeResultData } from '../../components/typing/MonkeytypeArena';
import {
  Keyboard,
  Trophy,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  Search,
  History,
  TrendingUp,
  Award,
  PlusCircle,
  X,
  Target,
  Clock,
  Globe
} from 'lucide-react';

export const TypingTestPage: React.FC = () => {
  const { currentUser, isTeacher } = useAuth();
  const { typingResults, saveTypingTestResult, classes } = useApp();
  const { isKhmer } = useLanguage();

  // Mode tabs: Arena, Global Leaderboard, and My History (for both students and teachers)
  const [activeTab, setActiveTab] = useState<'arena' | 'leaderboard' | 'history'>('arena');

  // Global Exam Results View Filters
  const [examSearch, setExamSearch] = useState('');
  const [examClassFilter, setExamClassFilter] = useState('all');
  const [examDurationFilter, setExamDurationFilter] = useState<number | 'all'>('all');

  // Teacher Create Drill Modal
  const [showCreateDrillModal, setShowCreateDrillModal] = useState(false);
  const [drillTitle, setDrillTitle] = useState('');
  const [drillText, setDrillText] = useState('');
  const [drillClass, setDrillClass] = useState('all');
  const [activeCustomDrill, setActiveCustomDrill] = useState<string | null>(null);

  // Handle when a student or teacher finishes a test
  const handleTestComplete = (data: MonkeytypeResultData) => {
    saveTypingTestResult({
      studentId: currentUser?.id || 'guest',
      studentName: currentUser?.fullName || (isTeacher ? 'Faculty Teacher' : 'Student'),
      studentCode: currentUser?.studentId || (isTeacher ? 'FAC-001' : 'STD-001'),
      className: currentUser?.className || 'CIIS Computer {5:30-6:30}',
      wpm: data.wpm,
      accuracyPercentage: data.accuracy,
      correctKeystrokes: data.correctChars,
      errorKeystrokes: data.incorrectChars,
      timeSpentSeconds: data.timeSpent,
      durationSeconds: typeof data.modeOption === 'number' ? data.modeOption : data.timeSpent,
      difficulty: data.wpm >= 60 ? 'advanced' : data.wpm >= 30 ? 'intermediate' : 'beginner'
    });
  };

  // Student/User specific history
  const myHistory = typingResults.filter(
    (r) => r.studentId === currentUser?.id || r.studentName === currentUser?.fullName
  );
  const myBestWpm = myHistory.length > 0 ? Math.max(...myHistory.map((r) => r.wpm)) : 0;
  const myAvgAcc = myHistory.length > 0
    ? Math.round(myHistory.reduce((a, b) => a + b.accuracyPercentage, 0) / myHistory.length)
    : 100;

  // Filtered typing results for Global School Leaderboard
  const filteredExamResults = typingResults
    .filter((r) => {
      const q = examSearch.toLowerCase().trim();
      const matchSearch =
        r.studentName.toLowerCase().includes(q) ||
        (r.studentCode && r.studentCode.toLowerCase().includes(q)) ||
        (r.className && r.className.toLowerCase().includes(q));
      const matchClass = examClassFilter === 'all' || r.className?.includes(examClassFilter);
      const matchDuration =
        examDurationFilter === 'all' || (r.durationSeconds || 60) === examDurationFilter;
      return matchSearch && matchClass && matchDuration;
    })
    .sort((a, b) => b.wpm - a.wpm); // Sort by highest WPM (Leaderboard)

  const handleExportTypingExcel = () => {
    const headers = [
      'Rank',
      'Student ID',
      'Student Name',
      'Class',
      'WPM (Speed)',
      'Accuracy (%)',
      'Errors',
      'Duration (s)',
      'Grade / Status',
      'Date'
    ];
    const rows = filteredExamResults.map((r, i) => [
      `#${i + 1}`,
      r.studentCode || 'N/A',
      r.studentName,
      r.className || 'CIIS Computer',
      `${r.wpm} WPM`,
      `${r.accuracyPercentage}%`,
      r.errorKeystrokes,
      `${r.durationSeconds || 60}s`,
      r.wpm >= 50 ? 'Distinction' : r.wpm >= 25 ? 'Pass' : 'Needs Practice',
      r.createdAt.split('T')[0]
    ]);
    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.map((c) => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CIIS_Touch_Typing_Results_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold border border-zinc-200 mb-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-zinc-700" />
            <span className="font-mono uppercase">{isKhmer ? 'កន្លែងហ្វឹកហាត់វាយអក្សរ CIIS' : 'CIIS TOUCH TYPING LAB'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            {isKhmer ? 'កន្លែងហ្វឹកហាត់ & វាស់ល្បឿនវាយអក្សរ (Touch Typing)' : 'CIIS Touch Typing Speed Lab'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'ប្រព័ន្ធវាស់ល្បឿនវាយអក្សរផ្លូវការរបស់សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស គាំទ្រភាសាខ្មែរ អង់គ្លេស និងការប្រកួតប្រជែងសកល។'
              : 'Official CIIS Touch Typing Speed Lab with real-time accuracy evaluation, Khmer and English keyboard drills, and school leaderboard.'}
          </p>
        </div>

        {/* Global Tab Navigation */}
        <div className="flex items-center p-1 bg-zinc-100 rounded-2xl border border-zinc-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('arena')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'arena'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>{isKhmer ? 'ការវាយអក្សរ' : 'Typing Arena'}</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isKhmer ? 'ចំណាត់ថ្នាក់សកល' : 'Global Leaderboard'}</span>
            <span className="px-1.5 py-0.2 bg-zinc-200 text-zinc-800 rounded-full text-[9px] font-bold font-mono">
              {typingResults.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{isKhmer ? 'ប្រវត្តិផ្ទាល់ខ្លួន' : 'My History'}</span>
            <span className="px-1.5 py-0.2 bg-zinc-200 text-zinc-800 rounded-full text-[9px] font-bold font-mono">
              {myHistory.length}
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. TYPING ARENA                                                */}
      {/* ============================================================== */}
      {activeTab === 'arena' && (
        <div className="space-y-6">
          
          {/* Main Container with Deep Slate Canvas */}
          <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden">
            <MonkeytypeArena
              onTestComplete={handleTestComplete}
              customInitialText={activeCustomDrill || undefined}
            />
          </div>

          {/* Quick Stats Pill Bar */}
          {myHistory.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold border border-zinc-200">
                  <Trophy className="w-5 h-5 text-zinc-800" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {isKhmer ? 'ល្បឿនខ្ពស់បំផុតរបស់ខ្ញុំ' : 'My Personal Best'}
                  </p>
                  <p className="text-xl font-black text-zinc-950">
                    {myBestWpm} <span className="text-xs text-slate-400 font-mono">WPM</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold border border-zinc-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {isKhmer ? 'ភាពត្រឹមត្រូវជាមធ្យម' : 'Average Accuracy'}
                  </p>
                  <p className="text-xl font-black text-slate-900">
                    {myAvgAcc}%
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {isKhmer ? 'ចំណាត់ថ្នាក់ជំនាញ' : 'Typing Rank'}
                  </p>
                  <p className="text-xl font-black text-purple-900 font-mono">
                    {myBestWpm >= 80 ? 'Master' : myBestWpm >= 50 ? 'Pro' : myBestWpm >= 30 ? 'Apprentice' : 'Novice'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* 2. GLOBAL SCHOOL LEADERBOARD TAB (STUDENTS & TEACHERS)         */}
      {/* ============================================================== */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          
          {/* Top Global KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {isKhmer ? 'ល្បឿនខ្ពស់បំផុតទូទាំងសាលា' : 'School Speed Record'}
                </p>
                <p className="text-xl font-black text-amber-900">
                  {typingResults.length > 0 ? Math.max(...typingResults.map((r) => r.wpm)) : 0} WPM
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-pink-100 text-pink-900 flex items-center justify-center font-black">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {isKhmer ? 'ចំនួនតេស្តសរុបទាំងអស់' : 'Total Global Records'}
                </p>
                <p className="text-xl font-black text-slate-900">
                  {typingResults.length} {isKhmer ? 'លើក' : 'Records'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {isKhmer ? 'ល្បឿនមធ្យមសាលារៀន' : 'Average School Speed'}
                </p>
                <p className="text-xl font-black text-emerald-900">
                  {typingResults.length > 0
                    ? Math.round(typingResults.reduce((a, b) => a + b.wpm, 0) / typingResults.length)
                    : 0}{' '}
                  WPM
                </p>
              </div>
            </div>
          </div>

          {/* Search, Filter & Actions Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={examSearch}
                onChange={(e) => setExamSearch(e.target.value)}
                placeholder={isKhmer ? 'ស្វែងរកតាមឈ្មោះសិស្ស, អត្តលេខ...' : 'Search student name, ID...'}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              {/* Class filter */}
              <select
                value={examClassFilter}
                onChange={(e) => setExamClassFilter(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">{isKhmer ? 'គ្រប់ថ្នាក់ទាំងអស់' : 'All Classes'}</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Duration filter */}
              <select
                value={examDurationFilter}
                onChange={(e) =>
                  setExamDurationFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">{isKhmer ? 'គ្រប់នាទីទាំងអស់' : 'All Durations'}</option>
                <option value={15}>15s</option>
                <option value={30}>30s</option>
                <option value={60}>60s (1 min)</option>
                <option value={120}>120s (2 min)</option>
              </select>

              {/* Teacher Create Custom Class Drill Button */}
              {isTeacher && (
                <button
                  onClick={() => setShowCreateDrillModal(true)}
                  className="px-3.5 py-2 bg-pink-800 hover:bg-pink-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isKhmer ? 'បង្កើតតេស្តថ្នាក់រៀន' : 'Create Class Drill'}</span>
                </button>
              )}

              {/* Export Button */}
              <button
                onClick={handleExportTypingExcel}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{isKhmer ? 'ទាញយក Excel' : 'Export CSV'}</span>
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">{isKhmer ? 'ចំណាត់ថ្នាក់' : 'Rank'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'អត្តលេខ' : 'Student ID'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'ឈ្មោះសិស្ស' : 'Student Name'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'ថ្នាក់រៀន' : 'Class'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'ល្បឿន WPM' : 'Speed (WPM)'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'ភាពត្រឹមត្រូវ' : 'Accuracy'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'កំហុស' : 'Errors'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'រយៈពេល' : 'Duration'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'និទ្ទេស' : 'Grade'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'កាលបរិច្ឆេទ' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredExamResults.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 font-mono">
                        {isKhmer ? 'មិនទាន់មានលទ្ធផលប្រឡងវាយអក្សរនៅឡើយទេ' : 'No typing test results found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredExamResults.map((res, index) => {
                      const isTop3 = index < 3;
                      const isCurrentUser =
                        res.studentId === currentUser?.id || res.studentName === currentUser?.fullName;

                      const wpmColor =
                        res.wpm >= 60
                          ? 'bg-pink-100 text-pink-900 border-pink-300 font-black'
                          : res.wpm >= 40
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-black'
                          : res.wpm >= 25
                          ? 'bg-blue-100 text-blue-900 border-blue-200'
                          : 'bg-slate-100 text-slate-700';

                      return (
                        <tr
                          key={res.id || index}
                          className={`transition-colors ${
                            isCurrentUser ? 'bg-pink-50/70 font-bold' : 'hover:bg-slate-50/70'
                          }`}
                        >
                          {/* Rank */}
                          <td className="py-3.5 px-4 font-bold">
                            {isTop3 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black border border-amber-300">
                                <Trophy className="w-3 h-3 text-amber-700 shrink-0" />
                                <span>#{index + 1}</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 font-mono">#{index + 1}</span>
                            )}
                          </td>

                          {/* Student ID */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                            {res.studentCode || `STD-${String(index + 1).padStart(3, '0')}`}
                          </td>

                          {/* Student Name */}
                          <td className="py-3.5 px-4 font-extrabold text-slate-900">
                            {res.studentName}
                            {isCurrentUser && (
                              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-pink-100 text-pink-800 font-normal">
                                {isKhmer ? 'ខ្ញុំ' : 'You'}
                              </span>
                            )}
                          </td>

                          {/* Class Name */}
                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                            {res.className || 'CIIS Computer'}
                          </td>

                          {/* WPM (Speed) */}
                          <td className="py-3.5 px-4">
                            <span className={`px-3 py-1 rounded-xl text-xs border font-mono ${wpmColor}`}>
                              {res.wpm} WPM
                            </span>
                          </td>

                          {/* Accuracy */}
                          <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">
                            {res.accuracyPercentage}%
                          </td>

                          {/* Errors */}
                          <td className="py-3.5 px-4 text-rose-600 font-bold font-mono">
                            {res.errorKeystrokes || 0}
                          </td>

                          {/* Duration */}
                          <td className="py-3.5 px-4 text-slate-500 font-mono">
                            {res.durationSeconds || 60}s
                          </td>

                          {/* Grade */}
                          <td className="py-3.5 px-4">
                            {res.wpm >= 50 && res.accuracyPercentage >= 95 ? (
                              <span className="px-2 py-0.5 rounded-md bg-pink-100 text-pink-900 font-bold text-[10.5px]">
                                {isKhmer ? 'ល្អប្រសើរ (Distinction)' : 'Distinction'}
                              </span>
                            ) : res.wpm >= 25 && res.accuracyPercentage >= 85 ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10.5px]">
                                {isKhmer ? 'ជាប់ (Pass)' : 'Pass'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10.5px]">
                                {isKhmer ? 'ហ្វឹកហាត់បន្ថែម' : 'Needs Practice'}
                              </span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[10.5px]">
                            {res.createdAt.split('T')[0]}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 3. MY TEST HISTORY TAB                                         */}
      {/* ============================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {isKhmer ? 'ប្រវត្តិការធ្វើតេស្តវាយអក្សរផ្ទាល់ខ្លួន' : 'My Personal Typing History'}
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {myHistory.length} {isKhmer ? 'លើក' : 'attempts logged'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">{isKhmer ? 'ល្បឿន WPM' : 'Speed (WPM)'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'ភាពត្រឹមត្រូវ' : 'Accuracy'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'កំហុស' : 'Errors'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'រយៈពេល' : 'Duration'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'ចំណាត់ថ្នាក់' : 'Rating'}</th>
                    <th className="py-3 px-4">{isKhmer ? 'កាលបរិច្ឆេទ' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {myHistory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                        {isKhmer ? 'មិនទាន់មានប្រវត្តិធ្វើតេស្តនៅឡើយទេ។ ចាប់ផ្តើមធ្វើតេស្តឥឡូវនេះ!' : 'No tests recorded yet. Start practicing in the Typing Arena!'}
                      </td>
                    </tr>
                  ) : (
                    myHistory.map((res, i) => (
                      <tr key={res.id || i} className="hover:bg-pink-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400">#{i + 1}</td>
                        <td className="py-3.5 px-4 font-black font-mono text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg inline-block my-2 border border-pink-200">
                          {res.wpm} WPM
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">
                          {res.accuracyPercentage}%
                        </td>
                        <td className="py-3.5 px-4 text-rose-600 font-bold font-mono">
                          {res.errorKeystrokes || 0}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono">
                          {res.durationSeconds || 60}s
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          {res.wpm >= 60 ? (
                            <span className="text-pink-800">Master</span>
                          ) : res.wpm >= 40 ? (
                            <span className="text-emerald-700">Pro</span>
                          ) : (
                            <span className="text-blue-700">Apprentice</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[10.5px]">
                          {res.createdAt.split('T')[0]}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. TEACHER CREATE CLASS DRILL MODAL                            */}
      {/* ============================================================== */}
      {showCreateDrillModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-100 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-800 flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  {isKhmer ? 'បង្កើតលំហាត់វាយអក្សរសម្រាប់ថ្នាក់រៀន' : 'Create Custom Class Typing Drill'}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateDrillModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  {isKhmer ? 'ចំណងជើងលំហាត់' : 'Drill Title'}
                </label>
                <input
                  type="text"
                  value={drillTitle}
                  onChange={(e) => setDrillTitle(e.target.value)}
                  placeholder="e.g., Computer Hardware & Basics Drill"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-pink-600 outline-none"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  {isKhmer ? 'ជ្រើសរើសថ្នាក់រៀន' : 'Target Class'}
                </label>
                <select
                  value={drillClass}
                  onChange={(e) => setDrillClass(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-pink-600 outline-none"
                >
                  <option value="all">{isKhmer ? 'គ្រប់ថ្នាក់ទាំងអស់' : 'All Classes'}</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  {isKhmer ? 'អត្ថបទសម្រាប់វាយអក្សរ' : 'Drill Text Content'}
                </label>
                <textarea
                  rows={5}
                  value={drillText}
                  onChange={(e) => setDrillText(e.target.value)}
                  placeholder="Paste or write the exact text passage students will practice..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-pink-600 outline-none resize-none font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowCreateDrillModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                {isKhmer ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (drillText.trim()) {
                    setActiveCustomDrill(drillText.trim());
                    setShowCreateDrillModal(false);
                    setActiveTab('arena');
                  }
                }}
                disabled={!drillText.trim()}
                className="px-5 py-2 rounded-xl bg-pink-800 text-white text-xs font-black hover:bg-pink-900 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isKhmer ? 'រក្សាទុក & ចាប់ផ្តើម' : 'Publish & Test Drill'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
