// TypeScript definitions for សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស (CIIS) LMS

export type UserRole = 'teacher' | 'student' | 'admin' | 'assistant_teacher';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'permission' | 'sick';
export type SubmissionStatus = 'not_started' | 'draft' | 'submitted' | 'late' | 'checked' | 'needs_correction';
export type SubjectCode = 'word' | 'excel' | 'typing' | 'basics' | 'general';
export type DeviceStatus = 'active' | 'idle' | 'offline';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  id: string;
  studentId?: string; // e.g. "STD-001"
  fullName: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  avatarUrl?: string;
  classId?: string;
  className?: string;
  phone?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. "Grade 10A"
  grade: string;
  room: string;
  teacherId: string;
  teacherName: string;
  assistantId?: string;
  assistantName?: string;
  studentCount: number;
  scheduleDescription: string;
  subjectSummary: string[];
  academicYear: string;
}

export interface SubjectInfo {
  code: SubjectCode;
  title: string;
  description: string;
  iconName: string;
  totalLessons: number;
}

export interface LessonMaterial {
  id: string;
  lessonId: string;
  classId?: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileType: 'docx' | 'xlsx' | 'pptx' | 'pdf' | 'zip' | 'image';
  fileSizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface LessonShortcut {
  keyCombo: string;
  actionDescription: string;
}

export interface Lesson {
  id: string;
  subjectCode: SubjectCode;
  chapterNumber: number;
  chapterTitle: string;
  lessonNumber: number;
  title: string;
  summary: string;
  contentMarkdown: string;
  videoUrl?: string;
  estimatedMinutes: number;
  keyShortcuts?: LessonShortcut[];
  materials?: LessonMaterial[];
  isCompleted?: boolean;
}

export interface RubricItem {
  id: string;
  criteria: string;
  maxPoints: number;
}

export interface AssignmentAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'jpg' | 'png' | 'webp' | 'image' | 'file';
  sizeFormatted: string;
  dataUrl?: string;
  isImage?: boolean;
}

export interface Assignment {
  id: string;
  classId: string;
  className: string;
  subjectCode: SubjectCode;
  lessonId?: string;
  title: string;
  instructions: string;
  description?: string;
  attachments?: AssignmentAttachment[];
  starterFileName?: string;
  starterFileType?: string;
  starterFileSize?: string;
  deadline: string;
  maxScore: number;
  rubric?: RubricItem[];
  createdByName: string;
  createdAt: string;
  submissionCount?: number;
  totalStudents?: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle?: string;
  subjectCode?: SubjectCode;
  studentId: string;
  studentName: string;
  studentCode: string;
  studentClass: string;
  status: SubmissionStatus;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  fileDataUrl?: string;
  studentNotes?: string;
  score?: number;
  maxScore: number;
  teacherFeedback?: string;
  rubricScores?: Record<string, number>;
  gradedByName?: string;
  gradedAt?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
  recordedByName: string;
  recordedAt: string;
}

export interface TypingTestItem {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  textContent: string;
  durationSeconds: number;
}

export interface TypingResult {
  id: string;
  studentId: string;
  studentName: string;
  studentCode?: string;
  className?: string;
  wpm: number;
  accuracyPercentage: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
  timeSpentSeconds: number;
  durationSeconds?: number;
  difficulty: DifficultyLevel;
  createdAt: string;
}

// -------------------------------------------------------------
// PRACTICAL EXAMS MODULE TYPES
// -------------------------------------------------------------
export interface PracticalExamTask {
  id: string;
  orderIndex: number;
  title: string;
  description: string;
  maxMarks: number;
  optionalAttachmentName?: string;
  optionalAttachmentUrl?: string;
}

export interface PracticalExam {
  id: string;
  title: string;
  subjectCode: SubjectCode;
  classId: string;
  className: string;
  examDate: string;
  startTime: string;
  durationMinutes: number;
  maxScore: number;
  instructions: string;
  tasks: PracticalExamTask[];
  createdByName: string;
  createdAt: string;
}

export interface PracticalExamResult {
  id: string;
  examId: string;
  examTitle: string;
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  taskScores: Record<string, number>; // taskId -> marks awarded
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  isPass: boolean;
  teacherFeedback?: string;
  isCompleted: boolean;
  gradedByName?: string;
  gradedAt?: string;
}

// -------------------------------------------------------------
// EXCEL PRACTICE LAB TYPES
// -------------------------------------------------------------
export type ExcelPracticeCategory = 
  | 'Basic Formatting' 
  | 'Tables' 
  | 'Formulas' 
  | 'Functions' 
  | 'Sorting & Filtering' 
  | 'Data Entry' 
  | 'Practical Tasks';

export interface ExcelPracticeTask {
  id: string;
  title: string;
  category: ExcelPracticeCategory;
  classId: string;
  className: string;
  difficulty: DifficultyLevel;
  description: string;
  requirements: string[];
  starterTemplateName?: string;
  starterTemplateType?: 'xlsx' | 'pdf' | 'docx' | 'image';
  starterTemplateSize?: string;
  maxScore: number;
  createdByName: string;
  createdAt: string;
}

export interface ExcelPracticeSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  submittedFileName: string;
  submittedFileType: string;
  submittedAt: string;
  status: 'submitted' | 'completed' | 'needs_correction' | 'excellent';
  score?: number;
  maxScore: number;
  teacherFeedback?: string;
  gradedByName?: string;
  gradedAt?: string;
}

// -------------------------------------------------------------
// COMPUTER LAB LIVE DEVICE SESSION TYPES
// -------------------------------------------------------------
export interface StudentDeviceSession {
  id: string;
  deviceId: string; // e.g. "LAB-01", "LAB-02", "MOBILE-01"
  studentId: string;
  studentName: string;
  className: string;
  deviceType: 'Desktop PC' | 'Laptop' | 'Tablet' | 'Mobile Phone';
  operatingSystem: 'Windows' | 'macOS' | 'Android' | 'iOS' | 'Linux';
  browser: 'Chrome' | 'Edge' | 'Safari' | 'Firefox' | 'Other';
  status: DeviceStatus;
  ipAddress?: string;
  lastActiveTime: string;
  connectedAt: string;
}

// -------------------------------------------------------------
// SCHOOL COMMUNITY & DIRECT WORK SUBMISSIONS
// -------------------------------------------------------------
export interface DirectWorkSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  studentClass: string;
  subject: string;
  message: string;
  attachmentName: string;
  attachmentType: string;
  attachmentSize?: string;
  status: 'pending' | 'reviewed' | 'graded' | 'checked';
  teacherFeedback?: string;
  score?: number;
  gradedByName?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface LearningActivity {
  id: string;
  studentId: string;
  activityType: 'login' | 'completed_lesson' | 'submitted_assignment' | 'typing_practice' | 'excel_practice' | 'downloaded_material' | 'community_post' | 'exam_completed';
  title: string;
  description: string;
  timestamp: string;
}

export interface StudentAnalytics {
  studentId: string;
  fullName: string;
  studentCode: string;
  className: string;
  overallProgressPercentage: number;
  attendancePercentage: number;
  wordScorePercentage: number;
  excelScorePercentage: number;
  typingWpm: number;
  typingAccuracy: number;
  computerBasicsPercentage: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  submittedAssignmentsCount: number;
  totalAssignmentsCount: number;
  needsAttention: boolean;
  attentionReason?: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  content: string;
  likesCount: number;
  isLikedByMe?: boolean;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorClass?: string;
  authorAvatar?: string;
  subjectCode: SubjectCode;
  category?: 'announcement' | 'question' | 'submission' | 'discussion';
  title: string;
  content: string;
  attachmentName?: string;
  attachmentType?: 'docx' | 'xlsx' | 'pdf' | 'image' | 'pptx';
  attachmentSize?: string;
  isAnnouncement: boolean;
  isPinned: boolean;
  isLocked: boolean;
  likesCount: number;
  isLikedByMe?: boolean;
  comments: CommunityComment[];
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  eventType: 'class' | 'exam' | 'assignment_deadline' | 'holiday' | 'meeting';
  classId?: string;
  className?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
}

export interface SystemNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  iconType: 'bell' | 'assignment' | 'grade' | 'announcement' | 'warning' | 'calendar' | 'exam';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface StudentPrivateNote {
  id: string;
  studentId: string;
  studentName: string;
  authorId: string;
  authorName: string;
  content: string;
  category: 'academic' | 'behavior' | 'attendance' | 'general';
  isPrivateToTeachers: boolean;
  createdAt: string;
}

export interface TeacherReminder {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  dueDate?: string;
  isCompleted: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  autoGenerated?: boolean;
}

export interface QuickAssessmentTask {
  id: string;
  orderIndex: number;
  title: string;
  description: string;
  subjectCode: 'word' | 'excel' | 'basics';
  sampleFormulaOrShortcut?: string;
  maxMarks: number;
}

export interface QuickAssessment {
  id: string;
  title: string;
  subjectCode: SubjectCode;
  classId: string;
  className: string;
  dispatchDate: string;
  durationMinutes: number;
  maxScore: number;
  instructions: string;
  tasks: QuickAssessmentTask[];
  starterTemplateName?: string;
  createdByName: string;
  createdAt: string;
}

export interface QuickAssessmentResult {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  studentClass: string;
  taskScores: Record<string, number>;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  teacherFeedback: string;
  isCompleted: boolean;
  gradedByName: string;
  gradedAt: string;
}

export interface ExcelFormulaResource {
  id: string;
  name: string;
  category: 'math' | 'logical' | 'lookup' | 'text' | 'statistic' | 'date';
  syntax: string;
  khmerDescription: string;
  englishDescription: string;
  exampleData: { label: string; value: string }[];
  exampleResult: string;
  samplePracticalUseCase: string;
}
