import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { AssignmentSubmission, SubmissionStatus } from '../../types';
import {
  FileCheck,
  Download,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Award,
  Sliders,
  UserCheck
} from 'lucide-react';

interface TeacherGradingModalProps {
  submission: AssignmentSubmission | null;
  onClose: () => void;
}

export const TeacherGradingModal: React.FC<TeacherGradingModalProps> = ({
  submission,
  onClose,
}) => {
  const { gradeSubmission, assignments } = useApp();
  const { isKhmer, t } = useLanguage();

  if (!submission) return null;

  const assignment = assignments.find((a) => a.id === submission.assignmentId);
  const rubric = assignment?.rubric || [
    { id: 'r1', criteria: isKhmer ? 'ភាពត្រឹមត្រូវនៃរូបមន្ត និងអនុគមន៍' : 'Formula Accuracy & Function Logic', maxPoints: 50 },
    { id: 'r2', criteria: isKhmer ? 'ការរៀបចំតារាង និងទម្រង់អក្សរ' : 'Cell Formatting & Table Presentation', maxPoints: 50 },
  ];

  const [score, setScore] = useState<number>(submission.score !== undefined ? submission.score : 85);
  const [feedback, setFeedback] = useState<string>(
    submission.teacherFeedback || (isKhmer ? 'កិច្ចការល្អណាស់។ សូមពិនិត្យមើលលំហាត់រូបមន្តប្រៀបធៀបឡើងវិញបន្ថែមទៀត។' : 'Good effort on the exercise. Review questions with comparison operators.')
  );
  const [rubricScores, setRubricScores] = useState<Record<string, number>>(() => {
    return submission.rubricScores || {
      r1: 42,
      r2: 43,
    };
  });

  const handleRubricScoreChange = (rubricId: string, val: number) => {
    const updated = { ...rubricScores, [rubricId]: val };
    setRubricScores(updated);
    const sum = Object.values(updated).reduce((a, b) => a + b, 0);
    setScore(sum);
  };

  const handleSaveGrade = (status: SubmissionStatus = 'checked') => {
    gradeSubmission(submission.id, {
      score,
      teacherFeedback: feedback,
      status,
      rubricScores
    });
    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isKhmer ? `កែពិន្ទុកិច្ចការ៖ ${submission.studentName}` : `Grade Work: ${submission.studentName}`}
      subtitle={`${submission.studentClass} (${submission.studentCode}) • ${submission.fileName}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Student File Card */}
        <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">{submission.fileName}</span>
              <span className="text-[11px] text-slate-400">
                {isKhmer ? 'បានបញ្ជូននៅ៖ ' : 'Submitted: '} {new Date(submission.submittedAt).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => alert(`Downloading student work: ${submission.fileName}`)}
            className="px-3 py-1.5 bg-white hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-xl border border-pink-200 shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{isKhmer ? 'ទាញយកឯកសារ' : 'Download'}</span>
          </button>
        </div>

        {/* Rubric Evaluation Sliders */}
        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
            {isKhmer ? 'បន្ទាត់វាយតម្លៃតាមលក្ខណៈវិនិច្ឆ័យ (Rubric)' : 'Rubric Criteria Scoring'}
          </span>
          <div className="space-y-3">
            {rubric.map((r) => (
              <div key={r.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{r.criteria}</span>
                  <span className="font-mono font-bold text-pink-700">
                    {rubricScores[r.id] || 0} / {r.maxPoints} pts
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={r.maxPoints}
                  value={rubricScores[r.id] || 0}
                  onChange={(e) => handleRubricScoreChange(r.id, parseInt(e.target.value))}
                  className="w-full accent-pink-700"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Total Score & Feedback */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-pink-900 text-white">
            <div>
              <span className="text-xs text-pink-200 font-semibold uppercase">{isKhmer ? 'ពិន្ទុសរុប' : 'Total Score'}</span>
              <p className="text-2xl font-black">{score} / {submission.maxScore}</p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm">
              {Math.round((score / submission.maxScore) * 100)}% ({score >= 50 ? (isKhmer ? 'ជាប់' : 'Pass') : (isKhmer ? 'ធ្លាក់' : 'Fail')})
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isKhmer ? 'មតិកែលម្អរបស់គ្រូជូនសិស្ស' : 'Teacher Feedback & Notes for Student'}
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={isKhmer ? 'សរសេរមតិកែលម្អលើកទឹកចិត្ត ឬចំណុចត្រូវបំពេញបន្ថែម...' : 'Provide constructive feedback for the student...'}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleSaveGrade('needs_correction')}
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors"
          >
            {isKhmer ? 'ស្នើសុំឲ្យសិស្សកែឡើងវិញ' : 'Request Resubmission'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              {t('action.cancel', undefined, 'Cancel')}
            </button>
            <button
              type="button"
              onClick={() => handleSaveGrade('checked')}
              className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isKhmer ? 'រក្សាទុក & ប្រគល់ពិន្ទុ' : 'Save & Return Grade'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
