import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Assignment } from '../../types';
import {
  Upload,
  FileCheck,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Eye,
  Paperclip
} from 'lucide-react';

interface StudentSubmissionModalProps {
  assignment: Assignment;
  onClose: () => void;
}

export const StudentSubmissionModal: React.FC<StudentSubmissionModalProps> = ({
  assignment,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { submissions, submitAssignment } = useApp();
  const { isKhmer, t } = useLanguage();

  const mySubmission = submissions.find(
    (s) => s.assignmentId === assignment.id && s.studentId === currentUser.id
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentNotes, setStudentNotes] = useState<string>(mySubmission?.studentNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [previewImageModalUrl, setPreviewImageModalUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !mySubmission) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(assignment.id, {
        fileName: selectedFile ? selectedFile.name : (mySubmission?.fileName || 'Exercise.xlsx'),
        fileType: selectedFile ? (selectedFile.name.split('.').pop() || 'file') : (mySubmission?.fileType || 'xlsx'),
        fileSizeBytes: selectedFile ? selectedFile.size : (mySubmission?.fileSizeBytes || 50000),
        studentNotes
      });

      setIsSubmitting(false);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isKhmer ? `បញ្ជូនកិច្ចការ៖ ${assignment.title}` : `Submit: ${assignment.title}`}
      subtitle={`${assignment.subjectCode.toUpperCase()} • ${assignment.className || 'Grade 10A'}`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Assignment Info Details */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold">{isKhmer ? 'កាលបរិច្ឆេទផុតកំណត់៖' : 'Due Date:'}</span>
            <span className="font-bold text-pink-700">{assignment.deadline}</span>
          </div>

          <div className="text-xs text-slate-700">
            <span className="font-bold block text-slate-900 mb-1">{isKhmer ? 'សេចក្តីណែនាំអំពីកិច្ចការ៖' : 'Task Instructions:'}</span>
            <p className="leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-slate-200/60">
              {assignment.instructions}
            </p>
          </div>

          {/* Attached Files & Exercise Photos */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                {isKhmer ? `ឯកសារភ្ជាប់ និងរូបភាពលំហាត់ (${assignment.attachments.length})` : `Attached Assignment Materials (${assignment.attachments.length})`}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {assignment.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {att.isImage ? (
                        <ImageIcon className="w-4 h-4 text-pink-700 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-pink-700 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 truncate block">{att.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{att.sizeFormatted}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {att.isImage && att.dataUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewImageModalUrl(att.dataUrl!)}
                          className="px-2 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 text-[10px] font-bold rounded-md"
                        >
                          {isKhmer ? 'មើលរូប' : 'View'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => alert(`Downloading ${att.name}`)}
                        className="p-1 text-slate-500 hover:text-pink-700 rounded-md"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Existing Submission Status */}
        {mySubmission && (
          <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{isKhmer ? 'ស្ថានភាពកិច្ចការរបស់អ្នក' : 'Your Current Submission'}</span>
              <Badge
                variant={
                  mySubmission.status === 'checked'
                    ? 'green'
                    : mySubmission.status === 'needs_correction'
                    ? 'amber'
                    : 'pink'
                }
                size="sm"
              >
                {mySubmission.status === 'checked'
                  ? (isKhmer ? `បានកែរួច (${mySubmission.score}/${mySubmission.maxScore} ពិន្ទុ)` : `Checked (${mySubmission.score}/${mySubmission.maxScore} Pts)`)
                  : (isKhmer ? 'បានបញ្ជូន - រង់ចាំលោកគ្រូកែ' : 'Submitted for Teacher Review')}
              </Badge>
            </div>

            <div className="p-3 rounded-xl bg-white border border-pink-100 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-pink-700" />
                <div>
                  <span className="font-bold text-slate-900 block">{mySubmission.fileName}</span>
                  <span className="text-[10px] text-slate-400">
                    {isKhmer ? 'បានបញ្ជូននៅ ' : 'Submitted on '} {new Date(mySubmission.submittedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {mySubmission.teacherFeedback && (
              <div className="p-3 rounded-xl bg-white border border-pink-100 text-xs space-y-1">
                <span className="font-bold text-pink-900 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {isKhmer ? `មតិកែលម្អរបស់គ្រូ (${mySubmission.gradedByName})៖` : `Teacher Feedback (${mySubmission.gradedByName}):`}
                </span>
                <p className="text-slate-600 pl-5 leading-relaxed">{mySubmission.teacherFeedback}</p>
              </div>
            )}
          </div>
        )}

        {/* Upload Completed Work Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isKhmer ? 'ជ្រើសរើសឯកសារកិច្ចការរបស់អ្នក (.docx, .xlsx, .pdf)' : 'Select Your Completed File (.docx, .xlsx, .pdf)'}
            </label>
            <div className="p-4 border-2 border-dashed border-slate-200 hover:border-pink-300 rounded-2xl bg-slate-50/50 text-center space-y-2 cursor-pointer transition-colors">
              <Upload className="w-6 h-6 text-pink-700 mx-auto" />
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="student-file-input"
              />
              <label htmlFor="student-file-input" className="cursor-pointer block">
                <span className="text-xs font-bold text-pink-700 hover:underline">
                  {selectedFile ? selectedFile.name : (isKhmer ? 'ចុចដើម្បីជ្រើសរើសឯកសារពីកុំព្យូទ័រ' : 'Click to browse files')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {isKhmer ? 'ទំហំអតិបរមា ២៥ MB' : 'Maximum file size: 25 MB'}
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isKhmer ? 'សារ ឬកំណត់ចំណាំផ្ញើជូនលោកគ្រូ' : 'Student Note or Comment to Teacher'}
            </label>
            <textarea
              rows={2}
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder={isKhmer ? 'សរសេរសំណួរ ឬបញ្ជាក់អំពីចំណុចដែលបានអនុវត្ត...' : 'Optional comment for the teacher...'}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isKhmer ? 'កិច្ចការត្រូវបានបញ្ជូនដោយជោគជ័យ!' : 'Assignment submitted successfully!'}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              {t('action.cancel', undefined, 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!selectedFile && !mySubmission)}
              className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>{isKhmer ? 'បញ្ជូនកិច្ចការ' : 'Submit Assignment'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Image Preview Modal */}
      {previewImageModalUrl && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewImageModalUrl(null)}
          title={isKhmer ? 'មើលរូបភាពលំហាត់' : 'Assignment Exercise Image'}
          maxWidth="3xl"
        >
          <div className="space-y-4 text-center">
            <img
              src={previewImageModalUrl}
              alt="Exercise Preview"
              className="max-h-[70vh] mx-auto rounded-2xl border border-slate-200 shadow-md object-contain"
            />
            <button
              onClick={() => setPreviewImageModalUrl(null)}
              className="px-4 py-2 bg-pink-700 text-white font-bold text-xs rounded-xl"
            >
              {t('action.close', undefined, 'Close')}
            </button>
          </div>
        </Modal>
      )}
    </Modal>
  );
};
