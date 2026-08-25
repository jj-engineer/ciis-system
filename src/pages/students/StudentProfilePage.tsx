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
  AlertTriangle,
  Phone,
  DollarSign
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

  const isFemale = student.gender === 'female';

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back Button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 bg-white hover:bg-zinc-100 rounded-xl border border-zinc-200 text-zinc-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2">
            <span>{isKhmer ? 'ប្រវត្តិរូបសិស្ស៖' : 'Student Profile:'}</span>
            <span>{student.fullName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium">
            {student.studentId || 'STD-001'} • {student.className || 'CIIS Computer {5:30-6:30}'}
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5 min-w-0">
          <div className="w-20 h-20 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shrink-0 border border-zinc-800 shadow-xs">
            <User className="w-10 h-10 text-zinc-100" />
          </div>
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-zinc-950">{student.fullName}</h2>
              {isFemale ? (
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                  {isKhmer ? 'ស្រី (ស)' : 'Female'}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
                  {isKhmer ? 'ប្រុស (ប)' : 'Male'}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-xs font-bold border border-zinc-200">
                {student.className || 'CIIS Computer'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-zinc-600">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">{isKhmer ? 'អត្តលេខ៖' : 'ID:'}</span>
                <span className="font-mono font-bold text-zinc-900">{student.studentId || 'STD-001'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-zinc-500 shrink-0" />
                <span className="text-zinc-400 font-bold uppercase text-[10px]">{isKhmer ? 'ទូរស័ព្ទ៖' : 'Phone:'}</span>
                <span className="font-mono font-bold text-zinc-900">{student.phone || '012 345 678'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-zinc-500 shrink-0" />
                <span className="text-zinc-400 font-bold uppercase text-[10px]">{isKhmer ? 'ថ្ងៃផុតកំណត់បង់៖' : 'Payment Deadline:'}</span>
                <span className="font-mono font-bold text-zinc-900">{student.paymentDeadline || '28-Aug-26'} ($15)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">{isKhmer ? 'គណនី៖' : 'Account:'}</span>
                <span className="font-mono text-zinc-700 truncate">{student.username}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Big Overall Competency Badge */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center w-full md:w-48 shrink-0">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
            {isKhmer ? 'លទ្ធផលសិក្សារួម' : 'Overall Grade'}
          </span>
          <span className="text-3xl font-black text-zinc-950 block my-0.5">
            {analytics.overallProgressPercentage}%
          </span>
          <span className="text-[11px] text-zinc-700 font-bold">
            {analytics.overallProgressPercentage >= 80 ? (isKhmer ? 'និទ្ទេស A (ឆ្នើម)' : 'Grade A (Top)') : 'Grade B (Good)'}
          </span>
        </div>
      </div>

      {/* Critical Payment Deadline & Tuition Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 text-white border border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white text-zinc-950 font-black text-[10px] uppercase tracking-wider">
              {isKhmer ? 'សំខាន់ • IMPORTANT' : 'IMPORTANT • REQUIRED'}
            </span>
            <span className="text-xs font-bold text-zinc-300">
              {isKhmer ? 'កាលបរិច្ឆេទផុតកំណត់បង់ថ្លៃសិក្សា' : 'Monthly Tuition Due Date'}
            </span>
          </div>
          <p className="text-lg sm:text-xl font-black text-white font-mono">
            {student.paymentDeadline || '28-Aug-2026'} <span className="text-xs font-bold text-zinc-400 font-sans">($15.00 USD / Month)</span>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-800/80 px-4 py-2.5 rounded-xl border border-zinc-700/80 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">{isKhmer ? 'ស្ថានភាពបង់ប្រាក់' : 'Payment Status'}</span>
            <span className="text-xs font-black text-zinc-100 font-mono">{isKhmer ? 'ត្រូវបង់ថ្ងៃទី ២៨' : 'Due Every 28th'}</span>
          </div>
        </div>
      </div>

      {/* Symmetrical 4-Column Subject Performance Breakdown */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
          <Award className="w-4 h-4 text-zinc-800" />
          <span>{isKhmer ? 'ការវាយតម្លៃមុខវិជ្ជានីមួយៗ' : 'Subject Competency Breakdown'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Attendance */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-700">{isKhmer ? 'វត្តមាន / Attendance' : 'Attendance Rate'}</span>
              <span className="font-black text-zinc-950">{analytics.attendancePercentage}%</span>
            </div>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${analytics.attendancePercentage < 80 ? 'bg-rose-500' : 'bg-zinc-900'}`}
                style={{ width: `${analytics.attendancePercentage}%` }}
              />
            </div>
          </div>

          {/* Microsoft Word */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-700">Microsoft Word</span>
              <span className="font-black text-zinc-950">{analytics.wordScorePercentage}%</span>
            </div>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 rounded-full"
                style={{ width: `${analytics.wordScorePercentage}%` }}
              />
            </div>
          </div>

          {/* Microsoft Excel */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-700">Microsoft Excel</span>
              <span className="font-black text-zinc-950">{analytics.excelScorePercentage}%</span>
            </div>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 rounded-full"
                style={{ width: `${analytics.excelScorePercentage}%` }}
              />
            </div>
          </div>

          {/* Touch Typing */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-700">{isKhmer ? 'វាយអក្សរ / Typing' : 'Touch Typing'}</span>
              <span className="font-black text-zinc-950">{analytics.typingWpm} WPM</span>
            </div>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 rounded-full"
                style={{ width: `${Math.min(100, (analytics.typingWpm / 60) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content: Submissions vs Teacher Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assignments & Submissions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assignment Submissions History */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-3.5">
            <h3 className="font-bold text-zinc-950 text-sm flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-zinc-800" />
              <span>{isKhmer ? 'ប្រវត្តិប្រគល់កិច្ចការ & ពិន្ទុ' : 'Assignment Submissions & Grades'}</span>
            </h3>

            <div className="divide-y divide-zinc-100">
              {studentSubs.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-6">
                  {isKhmer ? 'មិនទាន់មានទិន្នន័យកិច្ចការទេ' : 'No assignment submissions logged yet.'}
                </p>
              ) : (
                studentSubs.map((sub) => (
                  <div key={sub.id} className="py-3 flex items-center justify-between">
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-bold text-zinc-900 truncate">{sub.fileName}</p>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {isKhmer ? 'បានប្រគល់នៅថ្ងៃទី៖ ' : 'Submitted on '}{new Date(sub.submittedAt).toLocaleDateString()}
                      </p>
                      {sub.teacherFeedback && (
                        <p className="text-[11px] text-zinc-700 italic mt-1 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                          "{sub.teacherFeedback}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {sub.status === 'checked' ? (
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-900 font-bold text-xs border border-zinc-200">
                          Score: {sub.score}/100
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-50 text-zinc-700 font-bold text-xs border border-zinc-200">
                          Submitted
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Typing Test Progress History */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-3.5">
            <h3 className="font-bold text-zinc-950 text-sm flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-zinc-800" />
              <span>{isKhmer ? 'ប្រវត្តិតេស្តល្បឿនវាយអក្សរ' : 'Typing Speed Test Records'}</span>
            </h3>

            <div className="divide-y divide-zinc-100">
              {studentTyping.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-6">
                  {isKhmer ? 'មិនទាន់មានទិន្នន័យតេស្តវាយអក្សរទេ' : 'No typing tests completed yet.'}
                </p>
              ) : (
                studentTyping.map((res) => (
                  <div key={res.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 capitalize">{res.difficulty} Test</span>
                      <span className="text-[10px] text-zinc-400 block">{new Date(res.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-zinc-950 font-mono">{res.wpm} WPM</span>
                      <span className="px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-800 text-[11px] font-bold border border-zinc-200">
                        {res.accuracyPercentage}% Accuracy
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Teacher Private Notes (Academic & Behavioral) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-800" />
                <div>
                  <h3 className="font-bold text-zinc-950 text-sm">{isKhmer ? 'កំណត់ចំណាំរបស់គ្រូ' : 'Teacher Notes'}</h3>
                  <span className="text-[10px] text-zinc-400">{isKhmer ? 'ឯកជនសម្រាប់តែគ្រូបង្រៀន' : 'Private to teachers only'}</span>
                </div>
              </div>

              {isStaff && (
                <button
                  onClick={() => setShowAddNoteModal(true)}
                  className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg transition-colors cursor-pointer"
                  title="Add Note"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {notes.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-6">
                  {isKhmer ? 'មិនទាន់មានកំណត់ចំណាំទេ' : 'No private notes logged yet.'}
                </p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-zinc-900">{note.authorName}</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 text-[10px] font-bold uppercase">
                        {note.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 leading-relaxed">{note.content}</p>
                    <span className="text-[10px] text-zinc-400 block pt-1">
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
          title={isKhmer ? `បន្ថែមចំណាំសម្រាប់ ${student.fullName}` : `Add Note for ${student.fullName}`}
          subtitle={isKhmer ? 'កត់ត្រាការសង្កេតលើការសិក្សា ឬអាកប្បកិរិយា' : 'Record private academic or behavioral observations'}
          maxWidth="md"
        >
          <form onSubmit={handleAddNoteSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'ប្រភេទចំណាំ' : 'Note Category'}
              </label>
              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-semibold text-zinc-900 cursor-pointer"
              >
                <option value="academic">{isKhmer ? 'ការសិក្សា & លទ្ធផល (Academic Progress)' : 'Academic Progress'}</option>
                <option value="attendance">{isKhmer ? 'វត្តមាន & ពេលវេលា (Attendance)' : 'Attendance & Punctuality'}</option>
                <option value="behavior">{isKhmer ? 'អាកប្បកិរិយា & ការថែទាំកុំព្យូទ័រ (Behavior)' : 'Classroom Behavior / Lab Care'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'ខ្លឹមសារកំណត់ចំណាំ' : 'Teacher Note Content'}
              </label>
              <textarea
                rows={3}
                required
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder={isKhmer ? 'ឧ. សិស្សរៀនពូកែ និងយល់លឿនលើមេរៀន Word...' : 'e.g. Good at practical exercises, but needs extra help with Excel.'}
                className="w-full p-3 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-800 outline-none leading-relaxed text-zinc-900"
              />
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddNoteModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                {t('action.cancel', undefined, 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isKhmer ? 'រក្សាទុកចំណាំ' : 'Save Note'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
