import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { CommunityPost, DirectWorkSubmission, SubjectCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { getDefaultAvatar } from '../../services/avatarLibrary';
import {
  MessageSquare,
  Plus,
  Send,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Pin,
  Trash2,
  Paperclip,
  Upload,
  UserCheck,
  Search,
  MessageCircle,
  HelpCircle,
  FolderDown,
  Clock
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const { currentUser, isStaff, isStudent } = useAuth();
  const { isKhmer, t } = useLanguage();
  const {
    communityPosts,
    createCommunityPost,
    addCommunityComment,
    togglePinPost,
    deletePost,
    directSubmissions,
    sendWorkToTeacher,
    reviewDirectSubmission
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'announcements' | 'questions' | 'submissions'>('all');
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showSendToTeacherModal, setShowSendToTeacherModal] = useState(false);
  const [reviewingSubmission, setReviewingSubmission] = useState<DirectWorkSubmission | null>(null);

  // General Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postSubject, setPostSubject] = useState<SubjectCode>('excel');
  const [postCategory, setPostCategory] = useState<CommunityPost['category']>('discussion');
  const [postAttachmentName, setPostAttachmentName] = useState('');

  // Send Work to Teacher Form State
  const [sendSubject, setSendSubject] = useState('Excel Practice Exercise');
  const [sendMessage, setSendMessage] = useState('');
  const [sendFileName, setSendFileName] = useState('');

  // Teacher Review State
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewScore, setReviewScore] = useState<number>(95);

  // Comment input state per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    createCommunityPost({
      title: postTitle,
      content: postContent,
      subjectCode: postSubject,
      category: postCategory,
      attachmentName: postAttachmentName || undefined,
      attachmentType: postAttachmentName.endsWith('.xlsx') ? 'xlsx' : 'docx',
      attachmentSize: postAttachmentName ? '120 KB' : undefined,
      isAnnouncement: isStaff && postCategory === 'announcement'
    });

    setShowCreatePostModal(false);
    setPostTitle('');
    setPostContent('');
    setPostAttachmentName('');
  };

  const handleSendToTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendSubject.trim() || !sendMessage.trim()) return;

    sendWorkToTeacher({
      subject: sendSubject,
      message: sendMessage,
      attachmentName: sendFileName || 'Exercise_Work.xlsx',
      attachmentType: sendFileName.endsWith('.docx') ? 'docx' : 'xlsx',
      attachmentSize: '75 KB'
    });

    setShowSendToTeacherModal(false);
    setSendMessage('');
    setSendFileName('');
    alert('Your work note has been sent directly to Nun Langdy (Head Teacher)!');
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingSubmission) return;

    reviewDirectSubmission(
      reviewingSubmission.id,
      reviewFeedback || 'Good job on this exercise!',
      reviewScore
    );
    setReviewingSubmission(null);
    setReviewFeedback('');
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    addCommunityComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Filter posts
  const filteredPosts = communityPosts
    .filter(p => {
      if (activeTab === 'announcements') return p.isAnnouncement || p.category === 'announcement';
      if (activeTab === 'questions') return p.category === 'question';
      return true;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-pink-700" />
            {t('title.community', undefined, 'Class & School Community')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'ទំនាក់ទំនងរៀនសូត្រ សេចក្តីជូនដំណឹងរបស់គ្រូ សំណួរសិស្ស និងការផ្ញើឯកសារកិច្ចការផ្ទាល់។'
              : 'Academic communication, teacher announcements, student questions, and direct file notes.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isStudent && (
            <button
              onClick={() => setShowSendToTeacherModal(true)}
              className="px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-xl border border-pink-200 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Paperclip className="w-4 h-4" />
              <span>{t('action.send_to_teacher', undefined, 'Send Work to Teacher')}</span>
            </button>
          )}

          <button
            onClick={() => setShowCreatePostModal(true)}
            className="px-4 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('action.create_post', undefined, 'Create Post')}</span>
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'all' ? 'bg-pink-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isKhmer ? 'ការពិភាក្សាទាំងអស់' : 'All Discussions'}
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'announcements' ? 'bg-pink-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isKhmer ? 'សេចក្តីជូនដំណឹងរបស់គ្រូ' : 'Teacher Announcements'}
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'questions' ? 'bg-pink-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isKhmer ? 'សំណួរសិស្ស' : 'Student Questions'}
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'submissions' ? 'bg-pink-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderDown className="w-3.5 h-3.5" />
          <span>{isKhmer ? `កិច្ចការផ្ញើផ្ទាល់ (${directSubmissions.length})` : `Student Submissions (${directSubmissions.length})`}</span>
        </button>
      </div>

      {/* Direct Student Submissions Tab (Send to Teacher Inbox) */}
      {activeTab === 'submissions' ? (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-800 flex items-center gap-2">
                <FolderDown className="w-4 h-4 text-pink-700" />
                Direct Student Notes & Work Submissions
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                {directSubmissions.length} Total Submissions
              </span>
            </div>

            <div className="space-y-3">
              {directSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-pink-200 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 font-bold text-xs flex items-center justify-center">
                        {sub.studentName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{sub.studentName}</span>
                          <span className="text-xs text-slate-400 font-mono">({sub.studentClass})</span>
                        </div>
                        <p className="text-xs font-bold text-pink-700 mt-0.5">{sub.subject}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={sub.status === 'graded' ? 'green' : 'pink'} size="sm">
                        {sub.status === 'graded' ? `Graded: ${sub.score}/100` : 'Pending Review'}
                      </Badge>
                      {isStaff && (
                        <button
                          onClick={() => {
                            setReviewingSubmission(sub);
                            setReviewFeedback(sub.teacherFeedback || '');
                            setReviewScore(sub.score || 95);
                          }}
                          className="px-3 py-1.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                        >
                          Review & Feedback
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">
                    "{sub.message}"
                  </p>

                  {/* Attached Work File */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-pink-700" />
                      <span className="font-bold text-slate-800">{sub.attachmentName}</span>
                      {sub.attachmentSize && (
                        <span className="text-slate-400 font-mono">({sub.attachmentSize})</span>
                      )}
                    </div>
                    <button
                      onClick={() => alert(`Downloading student work ${sub.attachmentName}`)}
                      className="text-pink-700 font-bold hover:underline"
                    >
                      Download File
                    </button>
                  </div>

                  {sub.teacherFeedback && (
                    <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100 text-xs">
                      <span className="font-bold block">Teacher Feedback:</span>
                      <p className="mt-0.5">{sub.teacherFeedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Academic Posts Stream */
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`bg-white rounded-3xl p-6 border shadow-sm transition-all space-y-4 ${
                post.isPinned ? 'border-pink-300 ring-2 ring-pink-50' : 'border-slate-200/80'
              }`}
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar || getDefaultAvatar(post.authorRole, post.authorName)}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-pink-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{post.authorName}</span>
                      <Badge
                        variant={post.authorRole === 'teacher' ? 'pink' : 'slate'}
                        size="sm"
                      >
                        {post.authorRole.replace('_', ' ')}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {post.authorClass || 'Computer Science'} • {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {post.isPinned && (
                    <span className="px-2.5 py-1 bg-pink-100 text-pink-700 text-[10px] font-bold rounded-lg flex items-center gap-1">
                      <Pin className="w-3 h-3" />
                      <span>Pinned Announcement</span>
                    </span>
                  )}
                  {isStaff && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">{post.title}</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Attached Document / File */}
              {post.attachmentName && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-pink-700" />
                    <span className="font-bold text-slate-800">{post.attachmentName}</span>
                  </div>
                  <button
                    onClick={() => alert(`Downloading attachment ${post.attachmentName}`)}
                    className="text-pink-700 font-bold hover:underline"
                  >
                    Download
                  </button>
                </div>
              )}

              {/* Comments Stream */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5 text-xs">
                    <img
                      src={comment.authorAvatar || getDefaultAvatar(comment.authorRole, comment.authorName)}
                      alt={comment.authorName}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{comment.authorName}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{comment.authorRole}</span>
                      </div>
                      <p className="text-slate-700 mt-0.5 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {/* Add Reply Bar */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendComment(post.id);
                    }}
                    placeholder="Write an academic reply or answer..."
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none"
                  />
                  <button
                    onClick={() => handleSendComment(post.id)}
                    className="p-2 bg-pink-700 hover:bg-pink-800 text-white rounded-xl shadow-xs transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE POST MODAL */}
      {showCreatePostModal && (
        <Modal
          isOpen={showCreatePostModal}
          onClose={() => setShowCreatePostModal(false)}
          title="Create Discussion Post"
          subtitle="Share learning questions, study tips, or class announcements"
          maxWidth="2xl"
        >
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Post Title
              </label>
              <input
                type="text"
                required
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="e.g. Question about formatting tables in MS Word"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={postSubject}
                  onChange={(e) => setPostSubject(e.target.value as SubjectCode)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  <option value="excel">Microsoft Excel</option>
                  <option value="word">Microsoft Word</option>
                  <option value="typing">Typing Speed</option>
                  <option value="basics">Computer Basics</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  <option value="discussion">General Question / Tip</option>
                  <option value="question">Academic Question</option>
                  {isStaff && <option value="announcement">Teacher Announcement (Pinned)</option>}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Message Content
              </label>
              <textarea
                rows={4}
                required
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Write your explanation or question clearly..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attach File or Screenshot (Optional)
              </label>
              <input
                type="text"
                value={postAttachmentName}
                onChange={(e) => setPostAttachmentName(e.target.value)}
                placeholder="e.g. Screenshot.png or Exercise_Question.xlsx"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreatePostModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Publish Post
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* SEND WORK TO TEACHER MODAL FOR STUDENTS */}
      {showSendToTeacherModal && (
        <Modal
          isOpen={showSendToTeacherModal}
          onClose={() => setShowSendToTeacherModal(false)}
          title="Send Work to Teacher"
          subtitle="Directly submit your completed file or question note to Nun Langdy (Head Teacher)"
          maxWidth="2xl"
        >
          <form onSubmit={handleSendToTeacher} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject / Topic
              </label>
              <input
                type="text"
                required
                value={sendSubject}
                onChange={(e) => setSendSubject(e.target.value)}
                placeholder="e.g. Excel Practice Exercise 03"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Message for Teacher
              </label>
              <textarea
                rows={3}
                required
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
                placeholder="Teacher, I have completed the exercise. Please check my formula calculations."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attach Your Completed File
              </label>
              <input
                type="text"
                required
                value={sendFileName}
                onChange={(e) => setSendFileName(e.target.value)}
                placeholder="e.g. CHAN_Vichea_Exercise_03.xlsx"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSendToTeacherModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send to Teacher</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* TEACHER REVIEW SUBMISSION MODAL */}
      {reviewingSubmission && (
        <Modal
          isOpen={true}
          onClose={() => setReviewingSubmission(null)}
          title={`Review Note: ${reviewingSubmission.studentName}`}
          subtitle={`${reviewingSubmission.subject} • Submitted on ${new Date(reviewingSubmission.submittedAt).toLocaleDateString()}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveReview} className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800">Student Note:</span>
              <p className="text-slate-600 leading-relaxed">"{reviewingSubmission.message}"</p>
            </div>

            <div className="p-3 bg-pink-50 rounded-xl border border-pink-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-pink-700" />
                <span className="font-bold text-slate-800">{reviewingSubmission.attachmentName}</span>
              </div>
              <button
                type="button"
                onClick={() => alert(`Downloading ${reviewingSubmission.attachmentName}`)}
                className="text-pink-700 font-bold hover:underline"
              >
                Download & Review
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Score Awarded (out of 100)
              </label>
              <input
                type="number"
                value={reviewScore}
                onChange={(e) => setReviewScore(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teacher Feedback Message
              </label>
              <textarea
                rows={3}
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                placeholder="Write feedback for the student..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewingSubmission(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Save Feedback & Mark Graded
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
