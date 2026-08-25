import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { StudentSubmissionModal } from '../../components/assignments/StudentSubmissionModal';
import { TeacherGradingModal } from '../../components/assignments/TeacherGradingModal';
import { Assignment, AssignmentAttachment, AssignmentSubmission, SubjectCode } from '../../types';
import { MonthlyExamsPage } from '../exams/MonthlyExamsPage';
import { PracticalExamsPage } from '../exams/PracticalExamsPage';
import {
  ClipboardList,
  Plus,
  Clock,
  Download,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Upload,
  Calendar,
  X,
  Image as ImageIcon,
  File,
  Eye,
  Trash2,
  Paperclip,
  Trophy,
  Award
} from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const { isStaff, isStudent, currentUser } = useAuth();
  const { isKhmer, t } = useLanguage();
  const {
    assignments,
    classes,
    createAssignment,
    deleteAssignment,
    submissions
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'exams' | 'assignments' | 'practicals'>('exams');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignmentForStudent, setSelectedAssignmentForStudent] = useState<Assignment | null>(null);
  const [selectedSubmissionForTeacher, setSelectedSubmissionForTeacher] = useState<AssignmentSubmission | null>(null);
  const [filterClass, setFilterClass] = useState<string>('all');

  // Create Assignment Form State
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || 'class-10a');
  const [subjectCode, setSubjectCode] = useState<SubjectCode>('excel');
  const [deadline, setDeadline] = useState('2026-08-28');
  const [maxScore, setMaxScore] = useState(100);
  const [instructions, setInstructions] = useState('');
  const [attachments, setAttachments] = useState<AssignmentAttachment[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // File Upload Handler with image preview & validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    const validExtensions = ['pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'jpeg', 'png', 'webp'];
    const maxSizeBytes = 15 * 1024 * 1024; // 15MB limit

    Array.from(files).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!validExtensions.includes(ext)) {
        setUploadError(`Unsupported file format: .${ext}. Please use PDF, Word, Excel, PPTX, JPG, PNG, or WEBP.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        setUploadError(`File ${file.name} is too large (> 15MB).`);
        return;
      }

      const isImg = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      // Read as DataURL for image preview
      const reader = new FileReader();
      reader.onload = () => {
        const newAttachment: AssignmentAttachment = {
          id: `att-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: isImg ? 'image' : (ext as any),
          sizeFormatted: sizeStr,
          dataUrl: reader.result as string,
          isImage: isImg
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createAssignment({
      title,
      classId,
      subjectCode,
      deadline,
      maxScore: Number(maxScore),
      instructions,
      attachments
    });

    setShowCreateModal(false);
    setTitle('');
    setInstructions('');
    setAttachments([]);
    setUploadError(null);
  };

  const filteredAssignments = assignments.filter(a => {
    if (filterClass === 'all') return true;
    return a.classId === filterClass;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-100/90 rounded-2xl border border-zinc-200/90 max-w-2xl">
        <button
          onClick={() => setActiveSubTab('exams')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'exams'
              ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
              : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          <Trophy className="w-4 h-4 text-zinc-800" />
          <span>{isKhmer ? 'លទ្ធផលប្រឡងប្រចាំខែ (July Exam)' : 'July Exam Ledger & Top List'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('assignments')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'assignments'
              ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
              : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          <ClipboardList className="w-4 h-4 text-zinc-800" />
          <span>{isKhmer ? 'កិច្ចការផ្ទះ & លំហាត់' : 'Assignments & Homework'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('practicals')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'practicals'
              ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
              : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          <Award className="w-4 h-4 text-zinc-800" />
          <span>{isKhmer ? 'តេស្តអនុវត្តផ្ទាល់' : 'Practical Lab Exams'}</span>
        </button>
      </div>

      {/* Subtab View 1: Official Monthly Exams & Top Show List */}
      {activeSubTab === 'exams' && (
        <MonthlyExamsPage />
      )}

      {/* Subtab View 2: Practical Exams */}
      {activeSubTab === 'practicals' && (
        <PracticalExamsPage />
      )}

      {/* Subtab View 3: Homework & Assignments List */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2.5">
                <ClipboardList className="w-6 h-6 text-zinc-900" />
                {t('title.assignments', undefined, 'Assignments & File Submissions')}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                {isKhmer
                  ? 'កិច្ចការផ្ទះ លំហាត់អនុវត្តកុំព្យូទ័រ និងការកែដាក់ពិន្ទុជូនសិស្ស។'
                  : 'Practical computer assignments, image worksheets, and student homework grading.'}
              </p>
            </div>

            {isStaff && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-zinc-300" />
                <span>{isKhmer ? 'បង្កើតកិច្ចការថ្មី' : 'Create Assignment'}</span>
              </button>
            )}
          </div>

          {/* Assignments List */}
          <div className="space-y-5">
            {/* Filter Bar */}
            {isStaff && (
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-zinc-200 shadow-xs overflow-x-auto">
              <button
                onClick={() => setFilterClass('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterClass === 'all'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-zinc-50'
                }`}
              >
                {isKhmer ? 'គ្រប់ថ្នាក់ទាំងអស់' : 'All Classes'}
              </button>
              {classes.map(c => (
                <button
                  key={c.id}
                  onClick={() => setFilterClass(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterClass === c.id
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-zinc-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAssignments.map((assignment) => {
              const mySubmission = submissions.find(
                s => s.assignmentId === assignment.id && s.studentId === currentUser.id
              );
              const classSubs = submissions.filter(s => s.assignmentId === assignment.id);

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-3xl p-6 border border-zinc-200 hover:border-zinc-300 shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-zinc-800 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200 uppercase">
                        {assignment.subjectCode} • {assignment.className}
                      </span>
                      {isStudent && (
                        mySubmission ? (
                          <Badge variant={mySubmission.status === 'checked' ? 'green' : 'black'} size="sm">
                            {mySubmission.status === 'checked'
                              ? isKhmer ? `ពិន្ទុ៖ ${mySubmission.score}/${mySubmission.maxScore}` : `Graded: ${mySubmission.score}/${mySubmission.maxScore}`
                              : isKhmer ? 'បានបញ្ជូន' : 'Submitted'}
                          </Badge>
                        ) : (
                          <Badge variant="amber" size="sm">
                            {isKhmer ? 'មិនទាន់ធ្វើ' : 'Not Started'}
                          </Badge>
                        )
                      )}
                      {isStaff && (
                        <Badge variant="slate" size="sm">
                          {classSubs.length}/{assignment.totalStudents || 35} {isKhmer ? 'បានបញ្ជូន' : 'Submitted'}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{assignment.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {assignment.instructions}
                      </p>
                    </div>

                    {/* Attached Images/Files Indicator */}
                    {assignment.attachments && assignment.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {assignment.attachments.map((att) => (
                          <span
                            key={att.id}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-[10px] font-bold text-zinc-700"
                          >
                            {att.isImage ? (
                              <ImageIcon className="w-3 h-3 text-zinc-700" />
                            ) : (
                              <FileText className="w-3 h-3 text-zinc-700" />
                            )}
                            <span className="truncate max-w-[120px]">{att.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-700" />
                        <span>{isKhmer ? 'ផុតកំណត់៖' : 'Due:'} <strong>{assignment.deadline}</strong></span>
                      </div>
                      <span className="font-mono font-bold text-slate-700">{assignment.maxScore} {isKhmer ? 'ពិន្ទុ' : 'Pts'}</span>
                    </div>

                    {isStudent ? (
                      <button
                        onClick={() => setSelectedAssignmentForStudent(assignment)}
                        className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-zinc-300" />
                        <span>
                          {mySubmission
                            ? isKhmer ? 'ពិនិត្យមើល ឬកែប្រែកិច្ចការ' : 'View / Update Submission'
                            : isKhmer ? 'បើក និងបញ្ជូនកិច្ចការ' : 'Open & Submit Work'}
                        </span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const firstSub = classSubs[0];
                            if (firstSub) {
                              setSelectedSubmissionForTeacher(firstSub);
                            }
                          }}
                          disabled={classSubs.length === 0}
                          className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4 text-zinc-300" />
                          <span>{isKhmer ? 'កែដាក់ពិន្ទុ' : 'Grade Submissions'}</span>
                        </button>
                        <button
                          onClick={() => deleteAssignment(assignment.id)}
                          className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}

      {/* Redesigned Create Assignment Modal with Multi-File & Image Upload */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={isKhmer ? 'បង្កើតកិច្ចការ ឬលំហាត់ថ្មី' : 'Create New Assignment'}
          subtitle={isKhmer ? 'បង្ហោះរូបភាពលំហាត់ ឯកសារកិច្ចការ និងកំណត់ថ្ងៃផុតកំណត់' : 'Publish homework with instruction images, worksheets, and deadlines'}
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ចំណងជើងកិច្ចការ' : 'Assignment Title'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isKhmer ? 'ឧទាហរណ៍៖ លំហាត់ Excel អនុវត្តរូបមន្ត IF និង VLOOKUP' : 'e.g. Excel Practical Homework: IF & VLOOKUP Formulas'}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'ថ្នាក់រៀន' : 'Class'}
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'មុខវិជ្ជា' : 'Subject'}
                </label>
                <select
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value as SubjectCode)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  <option value="excel">Microsoft Excel</option>
                  <option value="word">Microsoft Word</option>
                  <option value="typing">Touch Typing</option>
                  <option value="basics">Computer Basics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'ថ្ងៃផុតកំណត់' : 'Deadline'}
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ការណែនាំពីកិច្ចការ' : 'Instructions & Guidelines'}
              </label>
              <textarea
                rows={3}
                required
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={isKhmer ? 'សរសេរការណែនាំ ឬជំហានអនុវត្តសម្រាប់សិស្ស...' : 'Write assignment instructions or describe the attached worksheet photo...'}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none leading-relaxed"
              />
            </div>

            {/* Drag and Drop File Upload Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>{isKhmer ? 'ឯកសារ ឬរូបភាពលំហាត់ភ្ជាប់ជាមួយ' : 'Attach Files & Exercise Photos (Multi-Upload)'}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  PDF, DOCX, XLSX, PPTX, JPG, PNG, WEBP (Max 15MB)
                </span>
              </label>

              <div className="border-2 border-dashed border-slate-200 hover:border-pink-400 bg-slate-50/70 rounded-2xl p-4 text-center transition-colors">
                <input
                  type="file"
                  multiple
                  id="assignment-file-upload"
                  accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="assignment-file-upload"
                  className="cursor-pointer flex flex-col items-center gap-1.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-pink-700">
                    {isKhmer ? 'ចុចទីនេះដើម្បីជ្រើសរើសឯកសារ ឬរូបភាព' : 'Click to browse files or drop photos here'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isKhmer ? 'អាចជ្រើសរើសឯកសារ ឬរូបភាពច្រើនក្នុងពេលតែមួយ' : 'Supports multiple attachments at once'}
                  </span>
                </label>
              </div>

              {uploadError && (
                <p className="text-xs font-semibold text-rose-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{uploadError}</span>
                </p>
              )}

              {/* Uploaded Attachments List with Image Previews */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    {isKhmer ? `ឯកសារបានភ្ជាប់ (${attachments.length})៖` : `Attached files (${attachments.length}):`}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {att.isImage && att.dataUrl ? (
                            <img
                              src={att.dataUrl}
                              alt={att.name}
                              className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{att.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{att.sizeFormatted}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg shrink-0"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                {t('action.cancel', undefined, 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                {isKhmer ? 'ផ្សព្វផ្សាយកិច្ចការ' : 'Publish Assignment'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* STUDENT SUBMISSION MODAL */}
      {selectedAssignmentForStudent && (
        <StudentSubmissionModal
          assignment={selectedAssignmentForStudent}
          onClose={() => setSelectedAssignmentForStudent(null)}
        />
      )}

      {/* TEACHER GRADING MODAL */}
      {selectedSubmissionForTeacher && (
        <TeacherGradingModal
          submission={selectedSubmissionForTeacher}
          onClose={() => setSelectedSubmissionForTeacher(null)}
        />
      )}
    </div>
  );
};
