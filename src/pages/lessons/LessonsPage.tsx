import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../../components/common/Modal';
import { Lesson, SubjectCode } from '../../types';
import {
  BookOpen,
  Plus,
  Clock,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Keyboard,
  Laptop,
  FolderOpen
} from 'lucide-react';

export const LessonsPage: React.FC = () => {
  const { isTeacher, isStaff } = useAuth();
  const { lessons, createLesson } = useApp();
  const { isKhmer, t } = useLanguage();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState<SubjectCode>('excel');
  const [chapterTitle, setChapterTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createLesson({
      title,
      subjectCode,
      chapterTitle: chapterTitle || (isKhmer ? 'ជំពូកទី ១៖ ការចាប់ផ្តើម' : 'Chapter 1: Getting Started'),
      summary,
      contentMarkdown,
      estimatedMinutes: Number(estimatedMinutes)
    });

    setShowCreateModal(false);
    setTitle('');
    setChapterTitle('');
    setSummary('');
    setContentMarkdown('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-pink-700" />
            {t('title.lessons', undefined, 'Lessons & Study Guides')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'កម្មវិធីសិក្សាកុំព្យូទ័រជាប្រព័ន្ធ កំណត់ចំណាំមេរៀន និងលំហាត់អនុវត្តជាក់ស្តែង។'
              : 'Structured computer learning curriculum, study notes, and exercises.'}
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isKhmer ? 'បង្ហោះមេរៀនថ្មី' : 'Upload New Lesson'}</span>
          </button>
        )}
      </div>

      {/* Requirement 2: Clean Professional Empty State when no lessons are uploaded */}
      {lessons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-700 flex items-center justify-center mx-auto border border-pink-100 shadow-sm">
            <FolderOpen className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-slate-900">
              {t('empty.lessons_title', undefined, 'No lessons available yet')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {t('empty.lessons_desc', undefined, 'Your lessons will appear here after they are uploaded by the teacher.')}
            </p>
          </div>

          {isStaff ? (
            <div className="pt-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t('empty.lessons_upload_btn', undefined, 'Upload First Lesson')}</span>
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <span className="text-xs text-slate-400 font-semibold">
                {isKhmer ? 'សូមរង់ចាំលោកគ្រូអ្នកគ្រូបង្ហោះមេរៀន...' : 'Waiting for teacher uploads...'}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Lessons Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-100">
                    {lesson.subjectCode.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {lesson.estimatedMinutes} {isKhmer ? 'នាទី' : 'mins'}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug">{lesson.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{lesson.summary}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-pink-700 hover:underline">
                  {isKhmer ? 'មើលមេរៀន →' : 'View Lesson →'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE LESSON MODAL */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={isKhmer ? 'បង្ហោះមេរៀនថ្មី' : 'Upload New Lesson'}
          subtitle={isKhmer ? 'បន្ថែមឯកសារមេរៀន និងសេចក្តីសង្ខេបសម្រាប់សិស្ស' : 'Add structured curriculum material and study notes'}
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateLesson} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ចំណងជើងមេរៀន' : 'Lesson Title'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isKhmer ? 'ឧទាហរណ៍៖ មេរៀនទី ១៖ ការប្រើប្រាស់រូបមន្ត SUM និង AVERAGE' : 'e.g. Lesson 01: Getting Started with Excel Formulas'}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'មុខវិជ្ជា' : 'Subject'}
                </label>
                <select
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value as SubjectCode)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  <option value="excel">Microsoft Excel</option>
                  <option value="word">Microsoft Word</option>
                  <option value="typing">Touch Typing</option>
                  <option value="basics">Computer Basics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'រយៈពេលសិក្សា (នាទី)' : 'Estimated Duration (Mins)'}
                </label>
                <input
                  type="number"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'សេចក្តីសង្ខេបមេរៀន' : 'Lesson Summary'}
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={isKhmer ? 'សេចក្តីសង្ខេបសង្ខេបខ្លីៗនៃមេរៀន...' : 'Brief summary of what students will learn...'}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ខ្លឹមសារមេរៀនលម្អិត' : 'Lesson Content (Markdown / Text)'}
              </label>
              <textarea
                rows={5}
                value={contentMarkdown}
                onChange={(e) => setContentMarkdown(e.target.value)}
                placeholder={isKhmer ? 'សរសេរខ្លឹមសារមេរៀន ជំហានអនុវត្ត ឬតំណភ្ជាប់វីដេអូ...' : 'Write step-by-step instructions or markdown notes...'}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none leading-relaxed font-mono"
              />
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
                {isKhmer ? 'រក្សាទុកមេរៀន' : 'Publish Lesson'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
