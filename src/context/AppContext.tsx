import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { StorageService } from '../services/storage';
import {
  SchoolClass,
  SubjectInfo,
  Lesson,
  Assignment,
  AssignmentAttachment,
  AssignmentSubmission,
  AttendanceRecord,
  TypingTestItem,
  TypingResult,
  PracticalExam,
  PracticalExamResult,
  ExcelPracticeTask,
  ExcelPracticeSubmission,
  StudentDeviceSession,
  DirectWorkSubmission,
  CalendarEvent,
  SystemNotification,
  StudentPrivateNote,
  TeacherReminder,
  CommunityPost,
  LearningActivity,
  StudentAnalytics,
  SubjectCode
} from '../types';

interface AppContextType {
  classes: SchoolClass[];
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  selectedClass: SchoolClass | undefined;
  subjects: SubjectInfo[];
  lessons: Lesson[];
  createLesson: (lessonData: Partial<Lesson>) => void;
  
  // Assignments
  assignments: Assignment[];
  createAssignment: (assignmentData: {
    title: string;
    classId: string;
    subjectCode: SubjectCode;
    deadline: string;
    maxScore: number;
    instructions: string;
    description?: string;
    attachments?: AssignmentAttachment[];
  }) => void;
  deleteAssignment: (assignmentId: string) => void;
  submissions: AssignmentSubmission[];
  submitAssignment: (assignmentId: string, fileData: {
    fileName: string;
    fileType: string;
    fileSizeBytes: number;
    fileDataUrl?: string;
    studentNotes?: string;
  }) => void;
  gradeSubmission: (submissionId: string, gradeData: {
    score: number;
    teacherFeedback: string;
    status?: AssignmentSubmission['status'];
    rubricScores?: Record<string, number>;
  }) => void;

  // Attendance
  attendance: AttendanceRecord[];
  saveAttendance: (records: AttendanceRecord[]) => void;

  // Practical Exams
  practicalExams: PracticalExam[];
  createPracticalExam: (examData: Omit<PracticalExam, 'id' | 'createdByName' | 'createdAt'>) => void;
  practicalResults: PracticalExamResult[];
  savePracticalResult: (resultData: {
    examId: string;
    examTitle: string;
    classId: string;
    className: string;
    studentId: string;
    studentName: string;
    studentCode: string;
    taskScores: Record<string, number>;
    totalScore: number;
    maxScore: number;
    percentage: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    isPass: boolean;
    teacherFeedback?: string;
  }) => void;

  // Excel Practice Lab
  excelPracticeTasks: ExcelPracticeTask[];
  createExcelPracticeTask: (taskData: Omit<ExcelPracticeTask, 'id' | 'createdByName' | 'createdAt'>) => void;
  excelPracticeSubmissions: ExcelPracticeSubmission[];
  submitExcelPracticeWork: (taskId: string, fileName: string, fileType: string) => void;
  gradeExcelPracticeSubmission: (submissionId: string, status: ExcelPracticeSubmission['status'], score: number, feedback: string) => void;

  // Live Computer Lab Devices
  deviceSessions: StudentDeviceSession[];
  registerDeviceSession: (sessionData: Partial<StudentDeviceSession>) => void;
  clearDeviceSession: (sessionId: string) => void;

  // Direct Student-to-Teacher Submissions
  directSubmissions: DirectWorkSubmission[];
  sendWorkToTeacher: (data: {
    subject: string;
    message: string;
    attachmentName: string;
    attachmentType: string;
    attachmentSize?: string;
  }) => void;
  reviewDirectSubmission: (submissionId: string, feedback: string, score?: number) => void;

  // Typing Tests
  typingTests: TypingTestItem[];
  typingResults: TypingResult[];
  saveTypingTestResult: (result: Omit<TypingResult, 'id' | 'createdAt'>) => void;

  // Community
  communityPosts: CommunityPost[];
  createCommunityPost: (postData: {
    title: string;
    content: string;
    subjectCode: SubjectCode;
    category?: CommunityPost['category'];
    attachmentName?: string;
    attachmentType?: CommunityPost['attachmentType'];
    attachmentSize?: string;
    isAnnouncement?: boolean;
  }) => void;
  addCommunityComment: (postId: string, content: string) => void;
  togglePostLike: (postId: string) => void;
  togglePinPost: (postId: string) => void;
  deletePost: (postId: string) => void;

  // Notes & Reminders
  studentNotes: StudentPrivateNote[];
  addStudentNote: (note: Omit<StudentPrivateNote, 'id' | 'authorId' | 'authorName' | 'createdAt'>) => void;
  teacherReminders: TeacherReminder[];
  toggleReminder: (id: string) => void;
  addTeacherReminder: (reminder: Omit<TeacherReminder, 'id' | 'teacherId'>) => void;

  // Calendar & Notifications
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  notifications: SystemNotification[];
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<SystemNotification, 'id' | 'createdAt' | 'isRead'>) => void;

  // Learning Activity & Analytics
  learningActivities: LearningActivity[];
  studentAnalytics: StudentAnalytics[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Safe helper to detect client OS and Browser
function detectClientDevice(): {
  deviceType: StudentDeviceSession['deviceType'];
  os: StudentDeviceSession['operatingSystem'];
  browser: StudentDeviceSession['browser'];
} {
  const ua = navigator.userAgent;
  let deviceType: StudentDeviceSession['deviceType'] = 'Desktop PC';
  let os: StudentDeviceSession['operatingSystem'] = 'Windows';
  let browser: StudentDeviceSession['browser'] = 'Chrome';

  // Device type
  if (/Android|iPhone|iPad|iPod/i.test(ua)) {
    deviceType = /iPad/i.test(ua) ? 'Tablet' : 'Mobile Phone';
  } else if (/Mobi/i.test(ua)) {
    deviceType = 'Mobile Phone';
  }

  // OS
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Macintosh|Mac OS/i.test(ua)) os = 'macOS';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser
  if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';

  return { deviceType, os, browser };
}

import { SplashLoadingModal } from '../components/common/SplashLoadingModal';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isStudent } = useAuth();

  const [classes, setClasses] = useState<SchoolClass[]>(StorageService.getClasses());
  const [selectedClassId, setSelectedClassIdState] = useState<string>(() => {
    const stored = StorageService.getClasses();
    return stored[0]?.id || 'ciis-evening-1';
  });
  const [isClassSplashOpen, setIsClassSplashOpen] = useState(false);
  const [splashClassName, setSplashClassName] = useState('');

  const setSelectedClassId = (newId: string) => {
    if (newId === selectedClassId) return;
    const target = classes.find(c => c.id === newId);
    setSplashClassName(target?.name || 'CIIS Class');
    setIsClassSplashOpen(true);
    setSelectedClassIdState(newId);
    setTimeout(() => {
      setIsClassSplashOpen(false);
    }, 2000);
  };
  const [subjects] = useState<SubjectInfo[]>(StorageService.getSubjects());
  const [lessons, setLessons] = useState<Lesson[]>(StorageService.getLessons());
  const [assignments, setAssignments] = useState<Assignment[]>(StorageService.getAssignments());
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(StorageService.getSubmissions());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(StorageService.getAttendance());
  const [practicalExams, setPracticalExams] = useState<PracticalExam[]>(StorageService.getPracticalExams());
  const [practicalResults, setPracticalResults] = useState<PracticalExamResult[]>(StorageService.getPracticalResults());
  const [excelPracticeTasks, setExcelPracticeTasks] = useState<ExcelPracticeTask[]>(StorageService.getExcelPracticeTasks());
  const [excelPracticeSubmissions, setExcelPracticeSubmissions] = useState<ExcelPracticeSubmission[]>(StorageService.getExcelPracticeSubmissions());
  const [deviceSessions, setDeviceSessions] = useState<StudentDeviceSession[]>(StorageService.getDeviceSessions());
  const [directSubmissions, setDirectSubmissions] = useState<DirectWorkSubmission[]>(StorageService.getDirectSubmissions());
  const [typingTests] = useState<TypingTestItem[]>(StorageService.getTypingTests());
  const [typingResults, setTypingResults] = useState<TypingResult[]>(StorageService.getTypingResults());
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(StorageService.getCommunityPosts());
  const [studentNotes, setStudentNotes] = useState<StudentPrivateNote[]>(StorageService.getStudentNotes());
  const [teacherReminders, setTeacherReminders] = useState<TeacherReminder[]>(StorageService.getTeacherReminders());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(StorageService.getCalendarEvents());
  const [notifications, setNotifications] = useState<SystemNotification[]>(StorageService.getNotifications());
  const [learningActivities, setLearningActivities] = useState<LearningActivity[]>(StorageService.getLearningActivities());
  const [studentAnalytics, setStudentAnalytics] = useState<StudentAnalytics[]>(StorageService.getStudentAnalytics());

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // Auto-register live device session whenever a student logs in or opens the platform
  useEffect(() => {
    if (isStudent && currentUser) {
      const clientInfo = detectClientDevice();
      // Generate deterministic or stored device ID e.g. LAB-01 or MOBILE-01
      let storedDeviceId = sessionStorage.getItem('edutech_device_id');
      if (!storedDeviceId) {
        const prefix = clientInfo.deviceType === 'Mobile Phone' ? 'MOBILE' : 'LAB';
        const num = Math.floor(Math.random() * 18) + 1;
        storedDeviceId = `${prefix}-${num.toString().padStart(2, '0')}`;
        sessionStorage.setItem('edutech_device_id', storedDeviceId);
      }

      const activeSession: StudentDeviceSession = {
        id: `sess-${currentUser.id}`,
        deviceId: storedDeviceId,
        studentId: currentUser.id,
        studentName: currentUser.fullName,
        className: currentUser.className || 'Grade 10A',
        deviceType: clientInfo.deviceType,
        operatingSystem: clientInfo.os,
        browser: clientInfo.browser,
        status: 'active',
        lastActiveTime: new Date().toISOString(),
        connectedAt: new Date().toISOString()
      };

      const updated = StorageService.registerOrUpdateDeviceSession(activeSession);
      setDeviceSessions(updated);
    }
  }, [currentUser?.id, isStudent]);

  // Lessons
  const createLesson = (lessonData: Partial<Lesson>) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      subjectCode: lessonData.subjectCode || 'excel',
      chapterNumber: lessonData.chapterNumber || 1,
      chapterTitle: lessonData.chapterTitle || 'General Chapter',
      lessonNumber: lessonData.lessonNumber || (lessons.length + 1),
      title: lessonData.title || 'Untitled Lesson',
      summary: lessonData.summary || '',
      contentMarkdown: lessonData.contentMarkdown || '',
      estimatedMinutes: lessonData.estimatedMinutes || 30,
      materials: lessonData.materials || [],
      keyShortcuts: lessonData.keyShortcuts || []
    };
    const updated = StorageService.saveLesson(newLesson);
    setLessons(updated);
  };

  // Assignments with multi-attachments
  const createAssignment = (assignmentData: {
    title: string;
    classId: string;
    subjectCode: SubjectCode;
    deadline: string;
    maxScore: number;
    instructions: string;
    description?: string;
    attachments?: AssignmentAttachment[];
  }) => {
    const cls = classes.find(c => c.id === assignmentData.classId);
    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      classId: assignmentData.classId,
      className: cls ? cls.name : 'Grade 10A',
      subjectCode: assignmentData.subjectCode,
      title: assignmentData.title,
      instructions: assignmentData.instructions,
      description: assignmentData.description,
      attachments: assignmentData.attachments || [],
      deadline: assignmentData.deadline,
      maxScore: assignmentData.maxScore,
      createdByName: currentUser.fullName,
      createdAt: new Date().toISOString(),
      submissionCount: 0,
      totalStudents: cls ? cls.studentCount : 35
    };
    const updated = StorageService.saveAssignment(newAssignment);
    setAssignments(updated);

    // Notify students
    addNotification({
      title: `New Assignment: ${newAssignment.title}`,
      message: `Teacher ${currentUser.fullName} posted a new assignment for ${newAssignment.className}. Due on ${newAssignment.deadline}.`,
      iconType: 'assignment',
      linkUrl: 'assignments'
    });
  };

  const deleteAssignment = (assignmentId: string) => {
    const updated = StorageService.deleteAssignment(assignmentId);
    setAssignments(updated);
  };

  const submitAssignment = (assignmentId: string, fileData: {
    fileName: string;
    fileType: string;
    fileSizeBytes: number;
    fileDataUrl?: string;
    studentNotes?: string;
  }) => {
    const targetAssignment = assignments.find(a => a.id === assignmentId);
    const newSub: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId,
      assignmentTitle: targetAssignment?.title || 'Assignment',
      subjectCode: targetAssignment?.subjectCode || 'excel',
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentCode: currentUser.studentId || 'STD-2026-001',
      studentClass: currentUser.className || 'Grade 10A',
      status: 'submitted',
      fileName: fileData.fileName,
      fileType: fileData.fileType,
      fileSizeBytes: fileData.fileSizeBytes,
      fileDataUrl: fileData.fileDataUrl,
      studentNotes: fileData.studentNotes,
      maxScore: targetAssignment ? targetAssignment.maxScore : 100,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = StorageService.saveSubmission(newSub);
    setSubmissions(updated);

    // Log Activity
    const newAct = StorageService.addLearningActivity({
      id: `act-${Date.now()}`,
      studentId: currentUser.id,
      activityType: 'submitted_assignment',
      title: `Submitted: ${targetAssignment?.title || 'Assignment'}`,
      description: `Uploaded ${fileData.fileName}`,
      timestamp: 'Just now'
    });
    setLearningActivities(newAct);

    // Add teacher reminder
    const newRem = StorageService.saveTeacherReminder({
      id: `rem-sub-${Date.now()}`,
      teacherId: 'user-teacher-jame',
      title: `Grading needed: ${currentUser.fullName}`,
      description: `Submitted ${targetAssignment?.title || 'Assignment'} (${fileData.fileName})`,
      isCompleted: false,
      priority: 'normal',
      autoGenerated: true
    });
    setTeacherReminders(newRem);
  };

  const gradeSubmission = (submissionId: string, gradeData: {
    score: number;
    teacherFeedback: string;
    status?: AssignmentSubmission['status'];
    rubricScores?: Record<string, number>;
  }) => {
    const target = submissions.find(s => s.id === submissionId);
    if (!target) return;

    const updatedSub: AssignmentSubmission = {
      ...target,
      score: gradeData.score,
      teacherFeedback: gradeData.teacherFeedback,
      status: gradeData.status || 'checked',
      rubricScores: gradeData.rubricScores,
      gradedByName: currentUser.fullName,
      gradedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = StorageService.saveSubmission(updatedSub);
    setSubmissions(updated);

    // Notify student
    addNotification({
      userId: target.studentId,
      title: `Assignment Graded: ${target.assignmentTitle}`,
      message: `Score: ${gradeData.score}/${target.maxScore}. Feedback: "${gradeData.teacherFeedback}"`,
      iconType: 'grade',
      linkUrl: 'assignments'
    });
  };

  // Attendance
  const saveAttendance = (records: AttendanceRecord[]) => {
    const updated = StorageService.saveAttendanceBatch(records);
    setAttendance(updated);
  };

  // Practical Exams
  const createPracticalExam = (examData: Omit<PracticalExam, 'id' | 'createdByName' | 'createdAt'>) => {
    const newExam: PracticalExam = {
      ...examData,
      id: `exam-${Date.now()}`,
      createdByName: currentUser.fullName,
      createdAt: new Date().toISOString()
    };
    const updated = StorageService.savePracticalExam(newExam);
    setPracticalExams(updated);

    // Add calendar event & notification
    addCalendarEvent({
      title: newExam.title,
      description: `Practical exam testing ${newExam.tasks.length} tasks. Duration: ${newExam.durationMinutes} mins.`,
      eventType: 'exam',
      classId: newExam.classId,
      className: newExam.className,
      date: newExam.examDate,
      startTime: newExam.startTime,
      endTime: '09:30',
      location: 'Lab 1 - Room 204'
    });

    addNotification({
      title: `New Practical Exam Scheduled: ${newExam.title}`,
      message: `Date: ${newExam.examDate} at ${newExam.startTime}. Please prepare your practical computer tasks.`,
      iconType: 'exam',
      linkUrl: 'practicals'
    });
  };

  const savePracticalResult = (resultData: {
    examId: string;
    examTitle: string;
    classId: string;
    className: string;
    studentId: string;
    studentName: string;
    studentCode: string;
    taskScores: Record<string, number>;
    totalScore: number;
    maxScore: number;
    percentage: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    isPass: boolean;
    teacherFeedback?: string;
  }) => {
    const newRes: PracticalExamResult = {
      id: `pres-${resultData.examId}-${resultData.studentId}`,
      ...resultData,
      isCompleted: true,
      gradedByName: currentUser.fullName,
      gradedAt: new Date().toISOString()
    };
    const updated = StorageService.savePracticalResult(newRes);
    setPracticalResults(updated);

    // Notify student
    addNotification({
      userId: resultData.studentId,
      title: `Practical Exam Result: ${resultData.examTitle}`,
      message: `Your score: ${resultData.totalScore}/${resultData.maxScore} (${resultData.percentage}%) - Grade ${resultData.grade}.`,
      iconType: 'grade',
      linkUrl: 'practicals'
    });
  };

  // Excel Practice Lab
  const createExcelPracticeTask = (taskData: Omit<ExcelPracticeTask, 'id' | 'createdByName' | 'createdAt'>) => {
    const newTask: ExcelPracticeTask = {
      ...taskData,
      id: `ept-${Date.now()}`,
      createdByName: currentUser.fullName,
      createdAt: new Date().toISOString()
    };
    const updated = StorageService.saveExcelPracticeTask(newTask);
    setExcelPracticeTasks(updated);

    addNotification({
      title: `New Excel Practice Task: ${newTask.title}`,
      message: `Teacher ${currentUser.fullName} added a new practice task in Excel Practice Lab.`,
      iconType: 'assignment',
      linkUrl: 'excel'
    });
  };

  const submitExcelPracticeWork = (taskId: string, fileName: string, fileType: string) => {
    const task = excelPracticeTasks.find(t => t.id === taskId);
    const newSub: ExcelPracticeSubmission = {
      id: `eps-${Date.now()}`,
      taskId,
      taskTitle: task?.title || 'Excel Practice Task',
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentClass: currentUser.className || 'Grade 10A',
      submittedFileName: fileName,
      submittedFileType: fileType,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      maxScore: task?.maxScore || 100
    };
    const updated = StorageService.saveExcelPracticeSubmission(newSub);
    setExcelPracticeSubmissions(updated);

    // Activity
    const newAct = StorageService.addLearningActivity({
      id: `act-${Date.now()}`,
      studentId: currentUser.id,
      activityType: 'excel_practice',
      title: `Submitted Excel Practice: ${task?.title}`,
      description: `Uploaded ${fileName}`,
      timestamp: 'Just now'
    });
    setLearningActivities(newAct);
  };

  const gradeExcelPracticeSubmission = (submissionId: string, status: ExcelPracticeSubmission['status'], score: number, feedback: string) => {
    const target = excelPracticeSubmissions.find(s => s.id === submissionId);
    if (!target) return;

    const updatedSub: ExcelPracticeSubmission = {
      ...target,
      status,
      score,
      teacherFeedback: feedback,
      gradedByName: currentUser.fullName,
      gradedAt: new Date().toISOString()
    };
    const updated = StorageService.saveExcelPracticeSubmission(updatedSub);
    setExcelPracticeSubmissions(updated);
  };

  // Device Sessions
  const registerDeviceSession = (sessionData: Partial<StudentDeviceSession>) => {
    const newSess: StudentDeviceSession = {
      id: sessionData.id || `sess-${Date.now()}`,
      deviceId: sessionData.deviceId || 'LAB-01',
      studentId: sessionData.studentId || currentUser.id,
      studentName: sessionData.studentName || currentUser.fullName,
      className: sessionData.className || 'Grade 10A',
      deviceType: sessionData.deviceType || 'Desktop PC',
      operatingSystem: sessionData.operatingSystem || 'Windows',
      browser: sessionData.browser || 'Chrome',
      status: sessionData.status || 'active',
      lastActiveTime: new Date().toISOString(),
      connectedAt: sessionData.connectedAt || new Date().toISOString()
    };
    const updated = StorageService.registerOrUpdateDeviceSession(newSess);
    setDeviceSessions(updated);
  };

  const clearDeviceSession = (sessionId: string) => {
    const updated = StorageService.removeDeviceSession(sessionId);
    setDeviceSessions(updated);
  };

  // Direct Student-to-Teacher Submissions
  const sendWorkToTeacher = (data: {
    subject: string;
    message: string;
    attachmentName: string;
    attachmentType: string;
    attachmentSize?: string;
  }) => {
    const newSub: DirectWorkSubmission = {
      id: `dws-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentCode: currentUser.studentId || 'STD-2026-001',
      studentClass: currentUser.className || 'Grade 10A',
      subject: data.subject,
      message: data.message,
      attachmentName: data.attachmentName,
      attachmentType: data.attachmentType,
      attachmentSize: data.attachmentSize || '50 KB',
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    const updated = StorageService.saveDirectSubmission(newSub);
    setDirectSubmissions(updated);

    // Notify Teacher
    addNotification({
      title: `Student Note from ${currentUser.fullName}`,
      message: `${currentUser.fullName} (${currentUser.className}) sent work: "${data.subject}" with attached ${data.attachmentName}.`,
      iconType: 'assignment',
      linkUrl: 'community'
    });
  };

  const reviewDirectSubmission = (submissionId: string, feedback: string, score?: number) => {
    const target = directSubmissions.find(s => s.id === submissionId);
    if (!target) return;

    const updatedSub: DirectWorkSubmission = {
      ...target,
      status: score !== undefined ? 'graded' : 'reviewed',
      teacherFeedback: feedback,
      score,
      reviewedAt: new Date().toISOString()
    };
    const updated = StorageService.saveDirectSubmission(updatedSub);
    setDirectSubmissions(updated);

    // Notify Student
    addNotification({
      userId: target.studentId,
      title: `Teacher Feedback on Your Note`,
      message: `Teacher ${currentUser.fullName} reviewed your "${target.subject}" note: "${feedback}"`,
      iconType: 'grade',
      linkUrl: 'community'
    });
  };

  // Typing Tests
  const saveTypingTestResult = (result: Omit<TypingResult, 'id' | 'createdAt'>) => {
    const newRes: TypingResult = {
      ...result,
      id: `tr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = StorageService.saveTypingResult(newRes);
    setTypingResults(updated);

    // Log Activity
    const newAct = StorageService.addLearningActivity({
      id: `act-${Date.now()}`,
      studentId: result.studentId,
      activityType: 'typing_practice',
      title: `Completed Typing Test (${result.difficulty})`,
      description: `WPM: ${result.wpm} | Accuracy: ${result.accuracyPercentage}%`,
      timestamp: 'Just now'
    });
    setLearningActivities(newAct);
  };

  // Community
  const createCommunityPost = (postData: {
    title: string;
    content: string;
    subjectCode: SubjectCode;
    category?: CommunityPost['category'];
    attachmentName?: string;
    attachmentType?: CommunityPost['attachmentType'];
    attachmentSize?: string;
    isAnnouncement?: boolean;
  }) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      authorClass: currentUser.className || 'Computer Department',
      authorAvatar: currentUser.avatarUrl,
      subjectCode: postData.subjectCode,
      category: postData.category || (postData.isAnnouncement ? 'announcement' : 'discussion'),
      title: postData.title,
      content: postData.content,
      attachmentName: postData.attachmentName,
      attachmentType: postData.attachmentType,
      attachmentSize: postData.attachmentSize,
      isAnnouncement: !!postData.isAnnouncement,
      isPinned: !!postData.isAnnouncement,
      isLocked: false,
      likesCount: 0,
      isLikedByMe: false,
      comments: [],
      createdAt: new Date().toISOString()
    };
    const updated = StorageService.saveCommunityPost(newPost);
    setCommunityPosts(updated);
  };

  const addCommunityComment = (postId: string, content: string) => {
    const targetPost = communityPosts.find(p => p.id === postId);
    if (!targetPost) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      postId,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatarUrl,
      content,
      likesCount: 0,
      createdAt: new Date().toISOString()
    };

    const updatedPost = {
      ...targetPost,
      comments: [...targetPost.comments, newComment]
    };
    const updated = StorageService.saveCommunityPost(updatedPost);
    setCommunityPosts(updated);
  };

  const togglePostLike = (postId: string) => {
    const targetPost = communityPosts.find(p => p.id === postId);
    if (!targetPost) return;

    const isLiked = !!targetPost.isLikedByMe;
    const updatedPost: CommunityPost = {
      ...targetPost,
      likesCount: isLiked ? targetPost.likesCount - 1 : targetPost.likesCount + 1,
      isLikedByMe: !isLiked
    };
    const updated = StorageService.saveCommunityPost(updatedPost);
    setCommunityPosts(updated);
  };

  const togglePinPost = (postId: string) => {
    const targetPost = communityPosts.find(p => p.id === postId);
    if (!targetPost) return;

    const updatedPost: CommunityPost = {
      ...targetPost,
      isPinned: !targetPost.isPinned
    };
    const updated = StorageService.saveCommunityPost(updatedPost);
    setCommunityPosts(updated);
  };

  const deletePost = (postId: string) => {
    const updated = StorageService.deleteCommunityPost(postId);
    setCommunityPosts(updated);
  };

  // Notes & Reminders
  const addStudentNote = (note: Omit<StudentPrivateNote, 'id' | 'authorId' | 'authorName' | 'createdAt'>) => {
    const newNote: StudentPrivateNote = {
      ...note,
      id: `sn-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      createdAt: new Date().toISOString()
    };
    const updated = StorageService.saveStudentNote(newNote);
    setStudentNotes(updated);
  };

  const toggleReminder = (id: string) => {
    const updated = StorageService.toggleReminder(id);
    setTeacherReminders(updated);
  };

  const addTeacherReminder = (reminder: Omit<TeacherReminder, 'id' | 'teacherId'>) => {
    const newRem: TeacherReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      teacherId: currentUser.id
    };
    const updated = StorageService.saveTeacherReminder(newRem);
    setTeacherReminders(updated);
  };

  // Calendar & Notifications
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvt: CalendarEvent = {
      ...event,
      id: `cal-${Date.now()}`
    };
    const updated = StorageService.saveCalendarEvent(newEvt);
    setCalendarEvents(updated);
  };

  const markNotificationRead = (id: string) => {
    const updated = StorageService.markNotificationRead(id);
    setNotifications(updated);
  };

  const addNotification = (notif: Omit<SystemNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    const updated = StorageService.saveNotification(newNotif);
    setNotifications(updated);
  };

  return (
    <AppContext.Provider
      value={{
        classes,
        selectedClassId,
        setSelectedClassId,
        selectedClass,
        subjects,
        lessons,
        createLesson,
        assignments,
        createAssignment,
        deleteAssignment,
        submissions,
        submitAssignment,
        gradeSubmission,
        attendance,
        saveAttendance,
        practicalExams,
        createPracticalExam,
        practicalResults,
        savePracticalResult,
        excelPracticeTasks,
        createExcelPracticeTask,
        excelPracticeSubmissions,
        submitExcelPracticeWork,
        gradeExcelPracticeSubmission,
        deviceSessions,
        registerDeviceSession,
        clearDeviceSession,
        directSubmissions,
        sendWorkToTeacher,
        reviewDirectSubmission,
        typingTests,
        typingResults,
        saveTypingTestResult,
        communityPosts,
        createCommunityPost,
        addCommunityComment,
        togglePostLike,
        togglePinPost,
        deletePost,
        studentNotes,
        addStudentNote,
        teacherReminders,
        toggleReminder,
        addTeacherReminder,
        calendarEvents,
        addCalendarEvent,
        notifications,
        markNotificationRead,
        addNotification,
        learningActivities,
        studentAnalytics
      }}
    >
      {children}

      {/* Class Change Splash Loading Modal */}
      <SplashLoadingModal
        isOpen={isClassSplashOpen}
        type="class"
        title={splashClassName ? `កំពុងប្តូរទៅថ្នាក់៖ ${splashClassName}...` : undefined}
        subtitle="សូមរង់ចាំមួយភ្លែត ប្រព័ន្ធកំពុងផ្ទុកបញ្ជីសិស្ស និងកាលវិភាគថ្នាក់នេះ (System is working...)"
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
