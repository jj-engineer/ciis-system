import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { UserProfile } from '../../types';
import {
  ArrowLeft,
  User,
  CheckCircle2,
  Calendar,
  ClipboardList,
  Keyboard,
  FileSpreadsheet,
  FileText,
  Lock,
  Plus,
  MessageSquare,
  Clock,
  Award,
  AlertTriangle
} from 'lucide-react';

interface StudentProfilePageProps {
  student: UserProfile;
  onBack: () => void;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({
  student,
  onBack,
}) => {
  const { isStaff, currentUser } = useAuth();
  const { isKhmer, t } = useLanguage();
  const {
    studentAnalytics,
    submissions,
    typingResults,
    learningActivities,
    studentNotes,
    addStudentNote,
    lessons
  } = useApp();

  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'academic' | 'behavior' | 'attendance'>('academic');

  const analytics = studentAnalytics.find(a => a.studentId === student.id) || {
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
    totalAssignmentsCount: 3,
    needsAttention: false
  };

  const studentSubs = submissions.filter(s => s.studentId === student.id);
  const studentTyping = typingResults.filter(t => t.studentId === student.id);
  const studentActs = learningActivities.filter(a => a.studentId === student.id);
  const notes = studentNotes.filter(n => n.studentId === student.id);

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    addStudentNote({
      studentId: student.id,
      studentName: student.fullName,
      content: newNoteContent,
      category: newNoteCategory,
      isPrivateToTeachers: true
    });
    setShowAddNoteModal(false);
    setNewNoteContent('');
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Student Profile: {student.fullName}
          </h1>
          <p className="text-xs text-slate-500">
            {student.studentId || 'STD-2026-001'} • {student.className || 'Grade 10A'}
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shrink-0 border border-zinc-800 shadow-xs">
            <User className="w-10 h-10 text-zinc-100" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{student.fullName}</h2>
              {student.gender === 'female' ? (
                <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                  {isKhmer ? 'ស្រី (ស)' : 'Female'}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
                  {isKhmer ? 'ប្រុស (ប)' : 'Male'}
                </span>
              )}
              <Badge variant="slate" size="sm">{student.className || 'CIIS Computer'}</Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono">Student ID: {student.studentId || 'STD-001'}</p>
            <p className="text-xs text-slate-500">
              {isKhmer ? 'លេខទូរស័ព្ទ៖' : 'Phone:'} <strong className="text-zinc-900 font-mono">{student.phone || '012 345 678'}</strong>
            </p>
            <p className="text-xs text-slate-500">
              {isKhmer ? 'កាលបរិច្ឆេទបង់ថ្លៃសិក្សា ($15)៖' : 'Tuition Deadline ($15):'} <strong className="text-zinc-900 font-mono">{student.paymentDeadline || '28-Aug-26'}</strong>
            </p>
          </div>
        </div>

        {/* Big Overall Grade Badge */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center w-full md:w-48 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
            {isKhmer ? 'លទ្ធផលសិក្សារួម' : 'Overall Competency'}
          </span>
          <span className="text-3xl font-black text-zinc-900 block my-0.5">
            {analytics.overallProgressPercentage}%
          </span>
          <span className="text-[11px] text-zinc-700 font-bold">
            {analytics.overallProgressPercentage >= 80 ? (isKhmer ? 'និទ្ទេស A (ឆ្នើម)' : 'Grade A (Top)') : 'Grade B'}
          </span>
        </div>
      </div>

      {/* Subject Breakdown Progress Bars */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-pink-700" />
          Subject Performance Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Attendance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Attendance Rate</span>
              <span className="font-bold text-slate-900">{analytics.attendancePercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${analytics.attendancePercentage < 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${analytics.attendancePercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Microsoft Word */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Microsoft Word</span>
              <span className="font-bold text-slate-900">{analytics.wordScorePercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-600 rounded-full"
                style={{ width: `${analytics.wordScorePercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Microsoft Excel */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Microsoft Excel</span>
              <span className="font-bold text-slate-900">{analytics.excelScorePercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-700 rounded-full"
                style={{ width: `${analytics.excelScorePercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Touch Typing */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Typing Speed</span>
              <span className="font-bold text-slate-900">{analytics.typingWpm} WPM</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-800 rounded-full"
                style={{ width: `${Math.min(100, (analytics.typingWpm / 60) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content: Submissions & Activity vs Teacher Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assignments & Submissions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assignment Submissions History */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-pink-700" />
              Assignment Submissions & Grades
            </h3>

            <div className="divide-y divide-slate-100">
              {studentSubs.map((sub) => (
                <div key={sub.id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 truncate">{sub.fileName}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      Submitted on {new Date(sub.submittedAt).toLocaleDateString()}
                    </p>
                    {sub.teacherFeedback && (
                      <p className="text-[11px] text-pink-800 italic mt-1">"{sub.teacherFeedback}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {sub.status === 'checked' ? (
                      <Badge variant="green" size="sm">Score: {sub.score}/100</Badge>
                    ) : (
                      <Badge variant="pink" size="sm">Submitted</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typing Test Progress History */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-pink-700" />
              Typing Test Results History
            </h3>

            <div className="divide-y divide-slate-100">
              {studentTyping.map((res) => (
                <div key={res.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 capitalize">{res.difficulty} Test</span>
                    <span className="text-[10px] text-slate-400 block">{new Date(res.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-pink-700">{res.wpm} WPM</span>
                    <Badge variant="green" size="sm">{res.accuracyPercentage}% Accuracy</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Teacher Private Notes (Academic & Behavioral) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-pink-700" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Teacher Private Notes</h3>
                  <span className="text-[10px] text-slate-400">Strictly visible to teachers only</span>
                </div>
              </div>

              {isStaff && (
                <button
                  onClick={() => setShowAddNoteModal(true)}
                  className="p-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg transition-colors"
                  title="Add Note"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {notes.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No private notes logged yet.</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800">{note.authorName}</span>
                      <Badge variant="purple" size="sm">{note.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{note.content}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Private Note Modal */}
      {showAddNoteModal && (
        <Modal
          isOpen={showAddNoteModal}
          onClose={() => setShowAddNoteModal(false)}
          title={`Add Note for ${student.fullName}`}
          subtitle="Record private academic or behavioral observations"
        >
          <form onSubmit={handleAddNoteSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Note Category
              </label>
              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
              >
                <option value="academic">Academic Progress</option>
                <option value="attendance">Attendance & Punctuality</option>
                <option value="behavior">Classroom Behavior / Lab Care</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teacher Note Content
              </label>
              <textarea
                rows={3}
                required
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="e.g. Good at practical exercises, but needs extra help with Excel nested IF formulas."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none leading-relaxed"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddNoteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Save Private Note
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
