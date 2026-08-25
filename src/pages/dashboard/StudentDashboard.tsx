import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDefaultAvatar, getStudentAvatar } from '../../services/avatarLibrary';
import {
  BookOpen,
  ClipboardList,
  Keyboard,
  FileSpreadsheet,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Calendar,
  Laptop,
  Monitor,
  ChevronRight,
  Bell,
  Search,
  Target,
  CheckSquare,
  GraduationCap
} from 'lucide-react';

interface StudentDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ setActiveTab }) => {
  const { currentUser, allProfiles } = useAuth();
  const { isKhmer, t } = useLanguage();
  const {
    lessons,
    assignments,
    submissions,
    practicalExams,
    practicalResults,
    excelPracticeTasks,
    excelPracticeSubmissions,
    typingResults
  } = useApp();

  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id);
  const myCompletedSubs = mySubmissions.filter(s => s.status === 'checked');
  const myExamResults = practicalResults.filter(r => r.studentId === currentUser.id);
  const myTyping = typingResults.filter(t => t.studentId === currentUser.id);
  const bestWpm = myTyping.length > 0 ? Math.max(...myTyping.map(t => t.wpm)) : 48;
  const myPracticeSubs = excelPracticeSubmissions.filter(s => s.studentId === currentUser.id);

  // Class peers for standings leaderboard
  const classmates = allProfiles.filter(p => p.role === 'student');

  return (
    <div className="space-y-6 antialiased">
      
      {/* ========================================================================= */}
      {/* 1. TOP GREETING & HEADER BAR                                              */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2">
        {/* Left: Greeting & Bold Dashboard Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200 text-xs font-bold font-mono">
            <GraduationCap className="w-3.5 h-3.5 text-zinc-700" />
            <span>{isKhmer ? 'សូមស្វាគមន៍មកកាន់ CIIS TECH' : 'WELCOME TO CIIS TECH'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            {isKhmer ? `ការសិក្សារបស់ ${currentUser.fullName}` : `Academic Overview • ${currentUser.fullName}`}
          </h1>
        </div>

        {/* Right: Class Shift Badge + Profile / Notification Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Class Shift Pill */}
          <div className="px-3.5 py-1.5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-zinc-800 font-mono">
              {currentUser.className || 'CIIS Computer {5:30-6:30}'}
            </span>
          </div>

          {/* Quick Notification Bell */}
          <button 
            onClick={() => setActiveTab('assignments')}
            className="w-10 h-10 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-zinc-600 hover:text-zinc-950 transition-all cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-zinc-900 absolute top-2.5 right-2.5 ring-2 ring-white" />
          </button>

          {/* Student Profile Chip */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2.5 bg-white pl-1.5 pr-3.5 py-1 rounded-2xl border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all cursor-pointer"
          >
            <img
              src={currentUser.avatarUrl || getDefaultAvatar('student', currentUser.studentId || currentUser.fullName)}
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-zinc-200 bg-zinc-50"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-zinc-950 leading-tight truncate max-w-[120px]">
                {currentUser.fullName}
              </p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase font-mono">
                {currentUser.studentId || 'STD-001'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN GRID                                                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Next Class Shift Card + Standings Leaderboard Table */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card 1: Next Class Shift */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {isKhmer ? 'វេនសិក្សាបន្ទាប់' : 'Next Class Shift'}
              </span>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs font-bold text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{isKhmer ? 'មើលកាលវិភាគ' : 'View calendar'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Room & Time Metadata Pill */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-600 bg-zinc-50 py-1.5 px-4 rounded-full border border-zinc-200 w-fit mx-auto font-mono">
              <Monitor className="w-3.5 h-3.5 text-zinc-700" />
              <span>CIIS Lab 1</span>
              <span>•</span>
              <span>Mon - Fri • 5:30 PM - 6:30 PM</span>
            </div>

            {/* Center Stage Matchup Layout */}
            <div className="flex items-center justify-around py-3 px-2">
              {/* Left Side: Shift Identity */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs border border-zinc-800 p-2">
                  <Laptop className="w-7 h-7 text-zinc-100" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950">{currentUser.className || 'CIIS Computer'}</h4>
                  <p className="text-[10.5px] text-zinc-400 font-mono">Teacher: Nun Langdy</p>
                </div>
              </div>

              {/* Center VS / LIVE Capsule Badge */}
              <div className="flex flex-col items-center justify-center">
                <span className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-900 font-bold text-xs flex items-center justify-center shadow-xs border border-zinc-200 font-mono">
                  LAB
                </span>
              </div>

              {/* Right Side: Curriculum Focus */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs border border-zinc-800 p-2">
                  <Keyboard className="w-7 h-7 text-zinc-100" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950">
                    {isKhmer ? 'ការអនុវត្តកុំព្យូទ័រ' : 'Practical Lab'}
                  </h4>
                  <p className="text-[10.5px] text-zinc-500 font-bold font-mono">Word • Excel • Typing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Standings Leaderboard */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-bold text-zinc-950">
                  {isKhmer ? 'តារាងចំណាត់ថ្នាក់សិស្សឆ្នើម' : 'Standings & Leaderboard'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {isKhmer ? 'ល្បឿនវាយអក្សរ និងពិន្ទុអនុវត្តកុំព្យូទ័រ' : 'Top students in typing speed & practical scores'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('typing')}
                className="text-xs font-bold text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{isKhmer ? 'មើលទាំងអស់' : 'View all'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Standings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-zinc-400 font-mono font-bold text-[10.5px] uppercase border-b border-zinc-100">
                    <th className="pb-2.5 px-2 text-center w-8">#</th>
                    <th className="pb-2.5 px-3">STUDENT</th>
                    <th className="pb-2.5 px-2 text-center">ATT</th>
                    <th className="pb-2.5 px-2 text-center">WPM</th>
                    <th className="pb-2.5 px-2 text-center">SCORE</th>
                    <th className="pb-2.5 px-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {classmates.slice(0, 5).map((st, idx) => {
                    const isMe = st.id === currentUser.id;
                    return (
                      <tr 
                        key={st.id} 
                        className={`transition-colors ${isMe ? 'bg-zinc-100/80 font-bold' : 'hover:bg-zinc-50'}`}
                      >
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-zinc-400">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={st.avatarUrl || getStudentAvatar(st.studentId || st.fullName)}
                              alt={st.fullName}
                              className="w-7 h-7 rounded-xl object-cover ring-1 ring-zinc-200 shrink-0"
                            />
                            <div>
                              <p className={`font-bold truncate max-w-[130px] ${isMe ? 'text-zinc-950' : 'text-zinc-900'}`}>
                                {st.fullName} {isMe && '(You)'}
                              </p>
                              <p className="text-[9.5px] text-zinc-400 font-mono">{st.studentId || 'STD-001'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-emerald-700 font-bold">
                          100%
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-zinc-950">
                          {isMe ? bestWpm : 45 - idx * 2}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-zinc-600">
                          {95 - idx * 2}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-mono font-bold text-[10px] border border-zinc-200">
                            {idx === 0 ? 'Top 1' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Statistics Card + 2x2 Capsule Cards + Action Banner */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card 1: Academic Statistics */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {isKhmer ? 'ស្ថិតិនៃការសិក្សាផ្ទាល់ខ្លួន' : 'Academic Statistics'}
              </span>
              <button
                onClick={() => setActiveTab('assignments')}
                className="text-xs font-bold text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{isKhmer ? 'មើលកិច្ចការ & ប្រឡង' : 'View assessments'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Segmented Horizontal Progress Bar */}
            <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden flex items-center p-0.5 border border-zinc-200">
              <div className="h-full bg-zinc-900 rounded-full transition-all" style={{ width: '70%' }} />
              <div className="h-full bg-zinc-500 rounded-full transition-all mx-0.5" style={{ width: '15%' }} />
              <div className="h-full bg-emerald-600 rounded-full transition-all mx-0.5" style={{ width: '10%' }} />
              <div className="h-full bg-zinc-300 rounded-full transition-all" style={{ width: '5%' }} />
            </div>

            {/* 4 Metric Stats Under Bar */}
            <div className="grid grid-cols-4 gap-2 text-center pt-1 font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 font-bold block uppercase">TASKS</span>
                <span className="text-lg font-black text-zinc-950">{assignments.length || 12}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-emerald-700 font-bold block uppercase">DONE</span>
                <span className="text-lg font-black text-emerald-700">{myCompletedSubs.length || 10}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-500 font-bold block uppercase">EXAMS</span>
                <span className="text-lg font-black text-zinc-950">{myExamResults.length || 2}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 font-bold block uppercase">WPM</span>
                <span className="text-lg font-black text-zinc-950">{bestWpm}</span>
              </div>
            </div>
          </div>

          {/* Card 2: 2x2 Capsule Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Capsule 1: Attendance Rate */}
            <div 
              onClick={() => setActiveTab('attendance')}
              className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block tracking-wider">
                  MY ATTENDANCE
                </span>
                <p className="text-2xl font-black text-zinc-950 tracking-tight">
                  95%
                </p>
              </div>
            </div>

            {/* Capsule 2: Touch Typing Best */}
            <div 
              onClick={() => setActiveTab('typing')}
              className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shrink-0 border border-zinc-800">
                <Keyboard className="w-6 h-6 text-zinc-100" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block tracking-wider">
                  BEST TYPING
                </span>
                <p className="text-2xl font-black text-zinc-950 tracking-tight">
                  {bestWpm} <span className="text-xs text-zinc-400 font-bold">WPM</span>
                </p>
              </div>
            </div>

            {/* Capsule 3: Completed Tasks */}
            <div 
              onClick={() => setActiveTab('assignments')}
              className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200">
                <Award className="w-6 h-6 text-zinc-800" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block tracking-wider">
                  COMPLETED WORK
                </span>
                <p className="text-2xl font-black text-zinc-950 tracking-tight">
                  {myCompletedSubs.length || 10} <span className="text-xs text-zinc-400 font-bold">Done</span>
                </p>
              </div>
            </div>

            {/* Capsule 4: Overall GPA / Grade */}
            <div 
              onClick={() => setActiveTab('assignments')}
              className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200">
                <Target className="w-6 h-6 text-zinc-800" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block tracking-wider">
                  CURRENT GRADE
                </span>
                <p className="text-2xl font-black text-zinc-950 tracking-tight">
                  A <span className="text-xs text-emerald-700 font-bold">(Top)</span>
                </p>
              </div>
            </div>

          </div>

          {/* Card 3: Featured Action Banner */}
          <div className="rounded-3xl p-6 sm:p-7 bg-zinc-900 text-white border border-zinc-800 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block">
                DAILY GOAL • គោលដៅប្រចាំថ្ងៃ
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight max-w-sm">
                {isKhmer ? 'ហ្វឹកហាត់វាយអក្សរ Touch Typing & រូបមន្ត MS Excel' : 'Practice touch typing & master Microsoft Excel formulas'}
              </h3>
            </div>

            {/* Solid Pill Action Button */}
            <div className="relative z-10 pt-1">
              <button
                onClick={() => setActiveTab('typing')}
                className="px-6 py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>{isKhmer ? 'ចាប់ផ្តើមតេស្តវាយអក្សរ' : 'Start typing test now'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
