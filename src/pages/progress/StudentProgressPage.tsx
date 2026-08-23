import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  Keyboard,
  FileSpreadsheet,
  FileText,
  Laptop
} from 'lucide-react';

export const StudentProgressPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { isKhmer, t } = useLanguage();
  const { studentAnalytics, typingResults, learningActivities, submissions, lessons } = useApp();

  const myAnalytics = studentAnalytics.find(s => s.studentId === currentUser.id) || {
    overallProgressPercentage: 85,
    attendancePercentage: 95,
    wordScorePercentage: 82,
    excelScorePercentage: 76,
    typingWpm: 42,
    typingAccuracy: 94,
    computerBasicsPercentage: 88,
    completedLessonsCount: 6,
    totalLessonsCount: 8,
    submittedAssignmentsCount: 3,
    totalAssignmentsCount: 3
  };

  const myTyping = typingResults.filter(t => t.studentId === currentUser.id);
  const myActivities = learningActivities.filter(a => a.studentId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-pink-700" />
            {t('title.progress', undefined, 'My Visual Learning Progress & Skills Mastery')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'តាមដានសមត្ថភាពមុខវិជ្ជាកុំព្យូទ័រ ប្រវត្តិនៃការប្រគល់កិច្ចការ និងកម្រិតល្បឿនវាយអក្សរ។'
              : 'Track your computer subjects competency, homework submission history, and typing speed milestones.'}
          </p>
        </div>
      </div>

      {/* Overall Score Dial Banner */}
      <div className="bg-gradient-to-br from-pink-700 via-pink-800 to-pink-900 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-pink-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <Badge variant="pink" size="sm" className="bg-white/10 text-pink-100 border-white/20">
            {isKhmer ? 'ពិន្ទុវាយតម្លៃសមត្ថភាពសរុប' : 'Overall Competency Score'}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isKhmer ? `${currentUser.fullName} កំពុងរៀនបានយ៉ាងល្អ!` : `${currentUser.fullName} is performing excellently!`}
          </h2>
          <p className="text-pink-100/90 text-xs sm:text-sm max-w-lg">
            {isKhmer
              ? 'អ្នកបានបញ្ចប់ ៨៥% នៃកម្មវិធីសិក្សាកុំព្យូទ័រថ្នាក់ទី ១០ រួមទាំងលំហាត់ Excel និងការវាយអក្សរ។'
              : 'You have mastered 85% of your Grade 10 computer curriculum including Excel formulas and typing.'}
          </p>
        </div>

        <div className="w-28 h-28 rounded-full border-4 border-pink-400/40 bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center shrink-0">
          <span className="text-3xl font-black">{myAnalytics.overallProgressPercentage}%</span>
          <span className="text-[10px] uppercase font-bold text-pink-200">{isKhmer ? 'សមត្ថភាព' : 'Mastery'}</span>
        </div>
      </div>

      {/* 4 Core Competency Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Microsoft Word</span>
            <FileText className="w-4 h-4 text-pink-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">{myAnalytics.wordScorePercentage}%</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-pink-700 h-full rounded-full" style={{ width: `${myAnalytics.wordScorePercentage}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Microsoft Excel</span>
            <FileSpreadsheet className="w-4 h-4 text-pink-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">{myAnalytics.excelScorePercentage}%</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-pink-700 h-full rounded-full" style={{ width: `${myAnalytics.excelScorePercentage}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{isKhmer ? 'ល្បឿនវាយអក្សរ' : 'Typing Speed'}</span>
            <Keyboard className="w-4 h-4 text-pink-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">{myAnalytics.typingWpm} WPM</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-pink-700 h-full rounded-full" style={{ width: `${Math.min(100, myAnalytics.typingWpm * 1.5)}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500">{isKhmer ? 'វត្តមានរៀនសូត្រ' : 'Attendance Rate'}</span>
            <CheckCircle2 className="w-4 h-4 text-pink-800" />
          </div>
          <p className="text-2xl font-black text-zinc-950">{myAnalytics.attendancePercentage}%</p>
          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-pink-800 to-pink-950 h-full rounded-full" style={{ width: `${myAnalytics.attendancePercentage}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
