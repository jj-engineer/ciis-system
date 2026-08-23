import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { DirectWorkSubmission } from '../../types';
import {
  Upload,
  FolderDown,
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Search,
  Plus,
  Paperclip,
  BookOpen,
  Send,
  User,
  Clock
} from 'lucide-react';

export const StudentWorkUploadPage: React.FC = () => {
  const { currentUser, isStaff, isStudent } = useAuth();
  const {
    directSubmissions,
    sendWorkToTeacher,
    reviewDirectSubmission,
    lessons
  } = useApp();
  const { isKhmer, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'submissions' | 'handouts'>('submissions');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState<DirectWorkSubmission | null>(null);

  // Student Upload Form
  const [subjectTitle, setSubjectTitle] = useState('Word Practical Document Work');
  const [notesMessage, setNotesMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Teacher Review Form
  const [reviewScore, setReviewScore] = useState<number>(95);
  const [reviewFeedback, setReviewFeedback] = useState('');

  const handleStudentUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectTitle.trim()) return;

    sendWorkToTeacher({
      subject: subjectTitle,
      message: notesMessage || 'Student exercise submission.',
      attachmentName: selectedFile ? selectedFile.name : 'Completed_Exercise.docx',
      attachmentType: selectedFile?.name.endsWith('.xlsx') ? 'xlsx' : 'docx',
      attachmentSize: selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : '145 KB'
    });

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadModal(false);
      setSubjectTitle('');
      setNotesMessage('');
      setSelectedFile(null);
    }, 1000);
  };

  const handleTeacherGrade = (submissionId: string) => {
    reviewDirectSubmission(
      submissionId,
      reviewFeedback || (isKhmer ? 'កិច្ចការល្អណាស់! បានពិនិត្យ និងផ្តល់ពិន្ទុរួចរាល់។' : 'Great work! Reviewed and approved.'),
      reviewScore
    );
    setShowGradingModal(null);
  };

  // Filter submissions
  const displayedSubmissions = isStudent
    ? directSubmissions.filter(s => s.studentId === currentUser.id)
    : directSubmissions;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Upload className="w-6 h-6 text-pink-700" />
            {isKhmer ? 'កន្លែងផ្ញើកិច្ចការ & មេរៀន (Upload Your Work / Lessons)' : 'Upload Your Work & Study Lessons'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isStudent
              ? isKhmer ? 'ផ្ញើឯកសារ Word (.docx), Excel (.xlsx) ឬរូបភាពលំហាត់ផ្ទាល់ទៅកាន់លោកគ្រូ។' : 'Upload your Word (.docx) or Excel (.xlsx) homework files directly to the teacher.'
              : isKhmer ? 'ប្រអប់ទទួល និងកែពិន្ទុកិច្ចការសិស្សដែលបានផ្ញើផ្ទាល់ និងចែករំលែកឯកសារមេរៀន។' : 'Teacher review inbox for student Word/Excel file uploads and study handout distribution.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isStudent && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>{isKhmer ? 'ផ្ញើកិច្ចការទៅគ្រូ' : 'Upload Work to Teacher'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs max-w-md">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'submissions'
              ? 'bg-pink-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderDown className="w-4 h-4" />
          <span>{isKhmer ? `កិច្ចការផ្ញើផ្ទាល់ (${displayedSubmissions.length})` : `Uploaded Work (${displayedSubmissions.length})`}</span>
        </button>
        <button
          onClick={() => setActiveTab('handouts')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'handouts'
              ? 'bg-pink-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isKhmer ? 'ឯកសារមេរៀន & សៀវភៅ' : 'Study Handouts & Lessons'}</span>
        </button>
      </div>

      {/* SUBMISSIONS INBOX TAB */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {displayedSubmissions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center max-w-lg mx-auto space-y-4 my-6">
              <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-700 flex items-center justify-center mx-auto border border-pink-100">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {isKhmer ? 'មិនទាន់មានកិច្ចការផ្ញើនៅឡើយទេ' : 'No uploaded submissions yet'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isStudent
                    ? isKhmer ? 'ចុចប៊ូតុង "ផ្ញើកិច្ចការទៅគ្រូ" ខាងលើ ដើម្បីផ្ញើឯកសារ Word ឬ Excel របស់អ្នក។' : 'Click "Upload Work to Teacher" to send your Word or Excel files.'
                    : isKhmer ? 'ឯកសារកិច្ចការដែលសិស្សផ្ញើផ្ទាល់ នឹងបង្ហាញនៅទីនេះ។' : 'Student direct uploads will appear here for grading.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {displayedSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-pink-300 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-700 flex items-center justify-center shrink-0 border border-pink-100">
                      {sub.attachmentType === 'xlsx' ? (
                        <FileSpreadsheet className="w-6 h-6" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{sub.subject}</h4>
                        <Badge variant={sub.status === 'graded' || sub.status === 'reviewed' || sub.status === 'checked' ? 'green' : 'pink'} size="sm">
                          {sub.status === 'graded' || sub.status === 'reviewed' || sub.status === 'checked'
                            ? (isKhmer ? `បានកែរួច (${sub.score || 95}/100)` : `Graded (${sub.score || 95}/100)`)
                            : (isKhmer ? 'រង់ចាំគ្រូកែ' : 'Pending Review')}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="text-slate-800 font-semibold">{sub.studentName} ({sub.studentClass})</span>
                        <span>•</span>
                        <span className="font-mono text-pink-700 font-bold">{sub.attachmentName} ({sub.attachmentSize})</span>
                        <span>•</span>
                        <span className="text-slate-400">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                      </div>

                      {sub.message && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200/60 max-w-xl">
                          "{sub.message}"
                        </p>
                      )}

                      {sub.teacherFeedback && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100 text-xs space-y-0.5 max-w-xl">
                          <span className="font-bold block">
                            {isKhmer ? 'មតិកែលម្អរបស់គ្រូ៖' : 'Teacher Feedback:'}
                          </span>
                          <p>{sub.teacherFeedback}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => alert(`Downloading student work: ${sub.attachmentName}`)}
                      className="px-3.5 py-2 bg-slate-50 hover:bg-pink-50 hover:text-pink-700 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isKhmer ? 'ទាញយក' : 'Download'}</span>
                    </button>

                    {isStaff && (
                      <button
                        onClick={() => {
                          setShowGradingModal(sub);
                          setReviewScore(sub.score || 95);
                          setReviewFeedback(sub.teacherFeedback || '');
                        }}
                        className="px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{sub.status === 'graded' || sub.status === 'reviewed' ? (isKhmer ? 'កែឡើងវិញ' : 'Re-Grade') : (isKhmer ? 'កែពិន្ទុ' : 'Grade Work')}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STUDY HANDOUTS & LESSONS TAB */}
      {activeTab === 'handouts' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                {isKhmer ? 'ឯកសារមេរៀន និងសន្លឹកកិច្ចការសម្រាប់ទាញយក' : 'Available Study Guides & Lesson Handouts'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isKhmer ? 'ឯកសារជំនួយស្មារតី Word, Excel និងរូបមន្តដែលគ្រូបានចែករំលែក' : 'Lesson materials, reference PDFs, and starter workbooks'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-pink-200 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-pink-700">{lesson.subjectCode}</span>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{lesson.title}</h4>
                    <p className="text-[11px] text-slate-500">{lesson.estimatedMinutes} {isKhmer ? 'នាទី' : 'mins'} study guide</p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading handout for: ${lesson.title}`)}
                  className="p-2 bg-white hover:bg-pink-50 text-pink-700 rounded-xl border border-slate-200 transition-colors shrink-0"
                  title="Download lesson file"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Upload Modal */}
      {showUploadModal && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title={isKhmer ? 'ផ្ញើកិច្ចការផ្ទាល់ទៅកាន់គ្រូ' : 'Upload Work to Teacher'}
          subtitle={isKhmer ? 'បញ្ចូលឯកសារ Word (.docx), Excel (.xlsx) ឬរូបភាពលំហាត់' : 'Send completed computer document or spreadsheet directly to instructor'}
          maxWidth="md"
        >
          <form onSubmit={handleStudentUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ចំណងជើងកិច្ចការ ឬឈ្មោះមេរៀន' : 'Assignment / Work Title'}
              </label>
              <input
                type="text"
                required
                value={subjectTitle}
                onChange={(e) => setSubjectTitle(e.target.value)}
                placeholder="e.g. Excel Salary Sheet Exercise"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ជ្រើសរើសឯកសារ (.docx, .xlsx, .pdf, .png)' : 'Select Document or Spreadsheet File'}
              </label>
              <div className="p-4 border-2 border-dashed border-slate-200 hover:border-pink-300 rounded-2xl bg-slate-50/60 text-center space-y-1.5 cursor-pointer">
                <Upload className="w-6 h-6 text-pink-700 mx-auto" />
                <input
                  type="file"
                  id="direct-upload-file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                <label htmlFor="direct-upload-file" className="cursor-pointer block">
                  <span className="text-xs font-bold text-pink-700 hover:underline">
                    {selectedFile ? selectedFile.name : (isKhmer ? 'ចុចដើម្បីជ្រើសរើសឯកសារ' : 'Click to browse files')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {isKhmer ? 'គាំទ្រឯកសារ Word, Excel, PDF ឬរូបភាព' : 'Supports Word, Excel, PDF, or screenshots'}
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'សារ ឬសំណួរផ្ញើជូនគ្រូ' : 'Note or Questions for Teacher'}
              </label>
              <textarea
                rows={2}
                value={notesMessage}
                onChange={(e) => setNotesMessage(e.target.value)}
                placeholder={isKhmer ? 'សរសេរសារខ្លីជូនលោកគ្រូ...' : 'Optional comment for instructor...'}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500/20"
              />
            </div>

            {uploadSuccess && (
              <div className="p-3 bg-pink-950/10 text-pink-950 border border-pink-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-800" />
                <span>{isKhmer ? 'កិច្ចការត្រូវបានផ្ញើជូនលោកគ្រូជោគជ័យ!' : 'Work uploaded successfully to teacher!'}</span>
              </div>
            )}

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-950"
              >
                {t('action.cancel', undefined, 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-pink-800 to-pink-950 hover:from-pink-700 hover:to-pink-900 text-white font-extrabold text-xs rounded-xl shadow-md shadow-pink-950/20 transition-all flex items-center gap-1.5 cursor-pointer border border-pink-700/30"
              >
                <Send className="w-4 h-4 text-pink-300" />
                <span>{isKhmer ? 'ផ្ញើកិច្ចការ' : 'Send to Teacher'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Teacher Grading & Feedback Modal */}
      {showGradingModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowGradingModal(null)}
          title={isKhmer ? `កែពិន្ទុ៖ ${showGradingModal.studentName}` : `Grade Submission: ${showGradingModal.studentName}`}
          subtitle={`${showGradingModal.studentClass} • ${showGradingModal.attachmentName}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-pink-50 rounded-2xl border border-pink-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">{showGradingModal.attachmentName}</span>
                <span className="text-[10px] text-slate-500 font-mono">{showGradingModal.attachmentSize}</span>
              </div>
              <button
                onClick={() => alert(`Downloading ${showGradingModal.attachmentName}`)}
                className="px-3 py-1.5 bg-white text-pink-700 hover:bg-pink-100 text-xs font-bold rounded-xl border border-pink-200 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'ទាញយក' : 'Download'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ពិន្ទុដែលផ្តល់ជូន (លើ ១០០)' : 'Score (Out of 100)'}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={reviewScore}
                onChange={(e) => setReviewScore(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-bold font-mono text-pink-700 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'មតិកែលម្អរបស់គ្រូ' : 'Teacher Constructive Feedback'}
              </label>
              <textarea
                rows={3}
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                placeholder={isKhmer ? 'សរសេរមតិលើកទឹកចិត្ត ឬចំណុចកែលម្អ...' : 'Leave feedback for the student...'}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowGradingModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                {t('action.cancel', undefined, 'Cancel')}
              </button>
              <button
                type="button"
                onClick={() => handleTeacherGrade(showGradingModal.id)}
                className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isKhmer ? 'រក្សាទុកពិន្ទុ' : 'Save & Return Grade'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
