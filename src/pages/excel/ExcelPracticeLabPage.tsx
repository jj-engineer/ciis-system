import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  ExcelPracticeCategory,
  ExcelPracticeSubmission,
  ExcelPracticeTask,
  DifficultyLevel
} from '../../types';
import {
  FileSpreadsheet,
  Plus,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Search,
  Filter,
  Save,
  MessageSquare,
  Trash2
} from 'lucide-react';

export const ExcelPracticeLabPage: React.FC = () => {
  const { isStaff, isStudent, currentUser } = useAuth();
  const { isKhmer, t } = useLanguage();
  const {
    excelPracticeTasks,
    createExcelPracticeTask,
    excelPracticeSubmissions,
    submitExcelPracticeWork,
    gradeExcelPracticeSubmission,
    classes
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTask, setSelectedTask] = useState<ExcelPracticeTask | null>(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<ExcelPracticeSubmission | null>(null);

  // Student Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Teacher Grading State
  const [gradeStatus, setGradeStatus] = useState<ExcelPracticeSubmission['status']>('completed');
  const [gradeScore, setGradeScore] = useState<number>(95);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  // Create Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ExcelPracticeCategory>('Tables');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || 'class-10a');
  const [newDifficulty, setNewDifficulty] = useState<DifficultyLevel>('beginner');
  const [newDesc, setNewDesc] = useState('');
  const [newRequirements, setNewRequirements] = useState<string[]>([
    'Enter 10 student names and test scores',
    'Calculate Total Score using =SUM()',
    'Calculate Average Score using =AVERAGE()',
    'Format table header with dark pink background and bold white text'
  ]);
  const [templateFileName, setTemplateFileName] = useState('Student_Score_Template.xlsx');

  const categories: { id: string; label: string }[] = [
    { id: 'All', label: isKhmer ? 'ទាំងអស់' : 'All' },
    { id: 'Basic Formatting', label: isKhmer ? 'ទម្រង់មូលដ្ឋាន (Formatting)' : 'Basic Formatting' },
    { id: 'Tables', label: isKhmer ? 'ការបង្កើតតារាង (Tables)' : 'Tables' },
    { id: 'Formulas', label: isKhmer ? 'រូបមន្តគណនា (Formulas)' : 'Formulas' },
    { id: 'Functions', label: isKhmer ? 'អនុគមន៍ (Functions)' : 'Functions' },
    { id: 'Sorting & Filtering', label: isKhmer ? 'តម្រៀប និងចម្រាញ់ (Sort & Filter)' : 'Sorting & Filtering' },
    { id: 'Data Entry', label: isKhmer ? 'ការបញ្ចូលទិន្នន័យ (Data Entry)' : 'Data Entry' },
    { id: 'Practical Tasks', label: isKhmer ? 'លំហាត់អនុវត្តសរុប (Practical Tasks)' : 'Practical Tasks' }
  ];

  const filteredTasks = excelPracticeTasks.filter(t => {
    if (selectedCategory === 'All') return true;
    return t.category === selectedCategory;
  });

  const handleStudentSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !uploadedFile) return;

    submitExcelPracticeWork(
      selectedTask.id,
      uploadedFile.name,
      uploadedFile.name.split('.').pop() || 'xlsx'
    );

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setSelectedTask(null);
      setUploadedFile(null);
    }, 1200);
  };

  const handleTeacherSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    gradeExcelPracticeSubmission(
      gradingSubmission.id,
      gradeStatus,
      Number(gradeScore),
      gradeFeedback
    );

    setGradingSubmission(null);
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createExcelPracticeTask({
      title: newTitle,
      category: newCategory,
      classId: newClassId,
      className: classes.find(c => c.id === newClassId)?.name || 'Grade 10A',
      difficulty: newDifficulty,
      description: newDesc,
      requirements: newRequirements.filter(r => r.trim().length > 0),
      starterTemplateName: templateFileName || 'Starter_Template.xlsx',
      maxScore: 100
    });

    setShowCreateTaskModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-pink-700" />
            {t('excel.title', undefined, 'Excel Practice Lab')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t('excel.subtitle', undefined, 'Practical spreadsheet exercises, downloadable workbooks, and hands-on formatting tasks.')}
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setShowCreateTaskModal(true)}
            className="px-4 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isKhmer ? 'បង្កើតលំហាត់ Excel ថ្មី' : 'Create Practice Task'}</span>
          </button>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-pink-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Practical Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.map((task) => {
          const mySub = excelPracticeSubmissions.find(
            s => s.taskId === task.id && s.studentId === currentUser.id
          );
          const taskSubs = excelPracticeSubmissions.filter(s => s.taskId === task.id);

          return (
            <div
              key={task.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-pink-300 shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-100 uppercase">
                    {task.category}
                  </span>
                  <Badge variant="purple" size="sm">
                    {task.difficulty}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">{task.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.description}</p>
                </div>

                {/* Requirements Checklist Preview */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    {t('excel.requirements', undefined, 'Task Requirements')}:
                  </span>
                  <ul className="space-y-1">
                    {task.requirements.map((req, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-700 mt-1.5 shrink-0"></span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
                {/* Download Template Button */}
                {task.starterTemplateName && (
                  <button
                    onClick={() => alert(isKhmer ? `កំពុងទាញយកឯកសារគំរូ ${task.starterTemplateName}` : `Downloading template: ${task.starterTemplateName}`)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-pink-700" />
                    <span>{task.starterTemplateName}</span>
                  </button>
                )}

                {/* Student Action / Teacher Review */}
                {isStudent ? (
                  <div>
                    {mySub ? (
                      <div className="p-2.5 bg-pink-950/10 rounded-xl border border-pink-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-pink-950 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-pink-800" />
                          <span>{isKhmer ? `ពិន្ទុ៖ ${mySub.score || 95}/100` : `Score: ${mySub.score || 95}/100`}</span>
                        </div>
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="text-[11px] font-bold text-pink-800 hover:underline cursor-pointer"
                        >
                          {isKhmer ? 'បញ្ជូនឡើងវិញ' : 'Resubmit'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="w-full py-2.5 bg-gradient-to-r from-pink-800 to-pink-950 hover:from-pink-700 hover:to-pink-900 text-white font-extrabold text-xs rounded-xl shadow-md shadow-pink-950/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-pink-700/30"
                      >
                        <Upload className="w-4 h-4 text-pink-300" />
                        <span>{t('excel.upload_work', undefined, 'Upload Completed Work')}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        const first = taskSubs[0];
                        if (first) {
                          setGradingSubmission(first);
                          setGradeScore(first.score || 95);
                          setGradeFeedback(first.teacherFeedback || '');
                        } else {
                          alert(isKhmer ? 'មិនទាន់មានសិស្សបញ្ជូនលំហាត់នេះនៅឡើយទេ' : 'No student submissions received for this task yet.');
                        }
                      }}
                      className="flex-1 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-xl border border-pink-200 transition-colors"
                    >
                      {isKhmer ? `កែពិន្ទុ (${taskSubs.length})` : `Review (${taskSubs.length})`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* STUDENT UPLOAD MODAL */}
      {selectedTask && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          title={isKhmer ? 'បញ្ជូនលំហាត់ Excel' : 'Submit Completed Excel Task'}
          subtitle={selectedTask.title}
          maxWidth="lg"
        >
          <form onSubmit={handleStudentSubmitWork} className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                {t('excel.requirements', undefined, 'Task Requirements')}:
              </span>
              <ul className="space-y-1">
                {selectedTask.requirements.map((r, i) => (
                  <li key={i} className="text-xs text-zinc-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-800 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'ជ្រើសរើសឯកសារ Excel (.xlsx) របស់អ្នក' : 'Select Your Completed .xlsx Workbook'}
              </label>
              <input
                type="file"
                accept=".xlsx,.xls"
                required
                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none"
              />
            </div>

            {uploadSuccess && (
              <div className="p-3 bg-pink-950/10 text-pink-950 text-xs font-bold rounded-xl border border-pink-200 text-center">
                {isKhmer ? 'បានបញ្ជូនលំហាត់ដោយជោគជ័យ!' : 'Workbook uploaded successfully!'}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                {t('action.cancel', undefined, 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>{isKhmer ? 'បញ្ជូនទៅកាន់គ្រូ' : 'Submit Workbook'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* TEACHER REVIEW MODAL */}
      {gradingSubmission && (
        <Modal
          isOpen={true}
          onClose={() => setGradingSubmission(null)}
          title={isKhmer ? `កែពិន្ទុ៖ ${gradingSubmission.studentName}` : `Review Submission: ${gradingSubmission.studentName}`}
          subtitle={`${gradingSubmission.studentClass} • ${gradingSubmission.submittedFileName}`}
          maxWidth="lg"
        >
          <form onSubmit={handleTeacherSaveGrade} className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-pink-700" />
                <span className="font-bold text-slate-800">{gradingSubmission.submittedFileName}</span>
              </div>
              <button
                type="button"
                onClick={() => alert(`Downloading student file: ${gradingSubmission.submittedFileName}`)}
                className="text-pink-700 font-bold hover:underline"
              >
                {t('action.download', undefined, 'Download')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'ស្ថានភាពលទ្ធផល' : 'Status'}
                </label>
                <select
                  value={gradeStatus}
                  onChange={(e) => setGradeStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  <option value="completed">{isKhmer ? 'បានបញ្ចប់ (Completed)' : 'Completed'}</option>
                  <option value="needs_correction">{isKhmer ? 'ត្រូវការកែឡើងវិញ (Needs Correction)' : 'Needs Correction'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'ពិន្ទុ (០-១០០)' : 'Score (0-100)'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'មតិកែលម្អរបស់គ្រូ' : 'Teacher Feedback'}
              </label>
              <textarea
                rows={3}
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
                placeholder={isKhmer ? 'សរសេរការណែនាំ ឬមតិកែលម្អ...' : 'Provide feedback on formula logic and formatting...'}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                {t('action.cancel', undefined, 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                {isKhmer ? 'រក្សាទុកលទ្ធផល' : 'Save Grade'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CREATE PRACTICE TASK MODAL */}
      {showCreateTaskModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowCreateTaskModal(false)}
          title={isKhmer ? 'បង្កើតលំហាត់ Excel ថ្មី' : 'Create Excel Practice Task'}
          subtitle={isKhmer ? 'បន្ថែមលំហាត់តារាងទិន្នន័យជាក់ស្តែងសម្រាប់សិស្ស' : 'Publish hands-on spreadsheet exercise with instructions'}
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ចំណងជើងលំហាត់' : 'Task Title'}
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={isKhmer ? 'ឧទាហរណ៍៖ ការគណនាប្រាក់បៀវត្សបុគ្គលិកដោយប្រើរូបមន្ត' : 'e.g. Employee Payroll Calculation Worksheet'}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'ប្រភេទលំហាត់' : 'Category'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ExcelPracticeCategory)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  <option value="Basic Formatting">Basic Formatting</option>
                  <option value="Tables">Tables</option>
                  <option value="Formulas">Formulas</option>
                  <option value="Functions">Functions</option>
                  <option value="Sorting & Filtering">Sorting & Filtering</option>
                  <option value="Data Entry">Data Entry</option>
                  <option value="Practical Tasks">Practical Tasks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'កម្រិត' : 'Difficulty'}
                </label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ការពិពណ៌នា' : 'Description'}
              </label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder={isKhmer ? 'សេចក្តីពិពណ៌នាអំពីលំហាត់...' : 'Explain the purpose of this spreadsheet drill...'}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateTaskModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                {t('action.cancel', undefined, 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                {isKhmer ? 'បង្កើតលំហាត់' : 'Create Task'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
