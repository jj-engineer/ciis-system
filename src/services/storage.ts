import {
  UserProfile,
  SchoolClass,
  SubjectInfo,
  Lesson,
  Assignment,
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
  StudentAnalytics
} from '../types';

import {
  INITIAL_PROFILES,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_LESSONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_ATTENDANCE,
  INITIAL_TYPING_TESTS,
  INITIAL_TYPING_RESULTS,
  INITIAL_PRACTICAL_EXAMS,
  INITIAL_PRACTICAL_RESULTS,
  INITIAL_EXCEL_PRACTICE_TASKS,
  INITIAL_EXCEL_PRACTICE_SUBMISSIONS,
  INITIAL_DEVICE_SESSIONS,
  INITIAL_DIRECT_WORK_SUBMISSIONS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_STUDENT_ANALYTICS,
  INITIAL_STUDENT_NOTES,
  INITIAL_TEACHER_REMINDERS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_LEARNING_ACTIVITIES
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'ciis_current_user_live_v1',
  PROFILES: 'ciis_profiles_real_v3',
  CLASSES: 'ciis_classes_real_v3',
  SUBJECTS: 'ciis_subjects_live_v1',
  LESSONS: 'ciis_lessons_live_v1',
  ASSIGNMENTS: 'ciis_assignments_live_v1',
  SUBMISSIONS: 'ciis_submissions_live_v1',
  ATTENDANCE: 'ciis_attendance_real_v3',
  TYPING_TESTS: 'ciis_typing_tests_live_v1',
  TYPING_RESULTS: 'ciis_typing_results_live_v1',
  PRACTICAL_EXAMS: 'ciis_practical_exams_live_v1',
  PRACTICAL_RESULTS: 'ciis_practical_results_live_v1',
  EXCEL_PRACTICE_TASKS: 'ciis_excel_practice_tasks_live_v1',
  EXCEL_PRACTICE_SUBMISSIONS: 'ciis_excel_practice_submissions_live_v1',
  DEVICE_SESSIONS: 'ciis_device_sessions_live_v1',
  DIRECT_SUBMISSIONS: 'ciis_direct_submissions_live_v1',
  COMMUNITY_POSTS: 'ciis_community_posts_live_v1',
  STUDENT_ANALYTICS: 'ciis_student_analytics_live_v1',
  STUDENT_NOTES: 'ciis_student_notes_live_v1',
  TEACHER_REMINDERS: 'ciis_teacher_reminders_live_v1',
  CALENDAR_EVENTS: 'ciis_calendar_events_live_v1',
  NOTIFICATIONS: 'ciis_notifications_live_v1',
  LEARNING_ACTIVITIES: 'ciis_learning_activities_live_v1',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export const StorageService = {
  resetAll: () => {
    localStorage.clear();
    window.location.reload();
  },

  // Auth & Profiles
  getCurrentUser: (): UserProfile | null => {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null; // Guest state
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  },
  setCurrentUser: (user: UserProfile | null) => {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      setItem(STORAGE_KEYS.CURRENT_USER, user);
    }
  },
  getProfiles: (): UserProfile[] => {
    const stored = getItem<UserProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    let updated = false;
    const initialTeachers = INITIAL_PROFILES.filter(p => p.role === 'teacher' || p.role === 'admin');
    
    for (const initT of initialTeachers) {
      const idx = stored.findIndex(p => p.id === initT.id || p.username === initT.username || p.email === initT.email);
      if (idx === -1) {
        stored.unshift(initT);
        updated = true;
      } else {
        if (stored[idx].avatarUrl !== initT.avatarUrl || stored[idx].fullName !== initT.fullName) {
          stored[idx] = { ...stored[idx], ...initT };
          updated = true;
        }
      }
    }
    if (updated) {
      setItem(STORAGE_KEYS.PROFILES, stored);
    }
    return stored;
  },
  getNextStudentId: (): string => {
    const profiles = StorageService.getProfiles();
    const students = profiles.filter(p => p.role === 'student');
    let maxNum = 0;
    for (const s of students) {
      if (s.studentId) {
        const match = s.studentId.match(/(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    }
    const nextNum = maxNum + 1;
    return `STD-${String(nextNum).padStart(3, '0')}`;
  },
  saveProfile: (profile: UserProfile) => {
    const profiles = StorageService.getProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    setItem(STORAGE_KEYS.PROFILES, profiles);
    return profiles;
  },
  deleteProfile: (profileId: string) => {
    const profiles = StorageService.getProfiles().filter(p => p.id !== profileId);
    setItem(STORAGE_KEYS.PROFILES, profiles);
    return profiles;
  },

  // Classes
  getClasses: (): SchoolClass[] => {
    return getItem<SchoolClass[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  },
  saveClass: (schoolClass: SchoolClass) => {
    const classes = StorageService.getClasses();
    const index = classes.findIndex(c => c.id === schoolClass.id);
    if (index >= 0) {
      classes[index] = schoolClass;
    } else {
      classes.push(schoolClass);
    }
    setItem(STORAGE_KEYS.CLASSES, classes);
  },

  // Subjects & Lessons
  getSubjects: (): SubjectInfo[] => {
    return getItem<SubjectInfo[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  },
  getLessons: (): Lesson[] => {
    return getItem<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
  },
  saveLesson: (lesson: Lesson) => {
    const lessons = StorageService.getLessons();
    const index = lessons.findIndex(l => l.id === lesson.id);
    if (index >= 0) {
      lessons[index] = lesson;
    } else {
      lessons.unshift(lesson);
    }
    setItem(STORAGE_KEYS.LESSONS, lessons);
    return lessons;
  },

  // Assignments & Submissions
  getAssignments: (): Assignment[] => {
    return getItem<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  },
  saveAssignment: (assignment: Assignment) => {
    const assignments = StorageService.getAssignments();
    const index = assignments.findIndex(a => a.id === assignment.id);
    if (index >= 0) {
      assignments[index] = assignment;
    } else {
      assignments.unshift(assignment);
    }
    setItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
    return assignments;
  },
  deleteAssignment: (assignmentId: string) => {
    const assignments = StorageService.getAssignments().filter(a => a.id !== assignmentId);
    setItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
    return assignments;
  },
  getSubmissions: (): AssignmentSubmission[] => {
    return getItem<AssignmentSubmission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  },
  saveSubmission: (submission: AssignmentSubmission) => {
    const subs = StorageService.getSubmissions();
    const index = subs.findIndex(s => s.assignmentId === submission.assignmentId && s.studentId === submission.studentId);
    if (index >= 0) {
      subs[index] = submission;
    } else {
      subs.unshift(submission);
    }
    setItem(STORAGE_KEYS.SUBMISSIONS, subs);
    return subs;
  },

  // Attendance
  getAttendance: (): AttendanceRecord[] => {
    return getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  },
  saveAttendanceBatch: (records: AttendanceRecord[]) => {
    const current = StorageService.getAttendance();
    const updated = [...current];
    records.forEach(rec => {
      const idx = updated.findIndex(r => r.classId === rec.classId && r.studentId === rec.studentId && r.date === rec.date);
      if (idx >= 0) {
        updated[idx] = rec;
      } else {
        updated.push(rec);
      }
    });
    setItem(STORAGE_KEYS.ATTENDANCE, updated);
    return updated;
  },

  // Practical Exams
  getPracticalExams: (): PracticalExam[] => {
    return getItem<PracticalExam[]>(STORAGE_KEYS.PRACTICAL_EXAMS, INITIAL_PRACTICAL_EXAMS);
  },
  savePracticalExam: (exam: PracticalExam) => {
    const exams = StorageService.getPracticalExams();
    const index = exams.findIndex(e => e.id === exam.id);
    if (index >= 0) {
      exams[index] = exam;
    } else {
      exams.unshift(exam);
    }
    setItem(STORAGE_KEYS.PRACTICAL_EXAMS, exams);
    return exams;
  },
  getPracticalResults: (): PracticalExamResult[] => {
    return getItem<PracticalExamResult[]>(STORAGE_KEYS.PRACTICAL_RESULTS, INITIAL_PRACTICAL_RESULTS);
  },
  savePracticalResult: (result: PracticalExamResult) => {
    const results = StorageService.getPracticalResults();
    const index = results.findIndex(r => r.examId === result.examId && r.studentId === result.studentId);
    if (index >= 0) {
      results[index] = result;
    } else {
      results.push(result);
    }
    setItem(STORAGE_KEYS.PRACTICAL_RESULTS, results);
    return results;
  },

  // Typing Tests & Results
  getTypingTests: (): TypingTestItem[] => {
    return getItem<TypingTestItem[]>(STORAGE_KEYS.TYPING_TESTS, INITIAL_TYPING_TESTS);
  },
  getTypingResults: (): TypingResult[] => {
    const res = getItem<TypingResult[]>(STORAGE_KEYS.TYPING_RESULTS, INITIAL_TYPING_RESULTS);
    if (!res || res.length === 0) {
      setItem(STORAGE_KEYS.TYPING_RESULTS, INITIAL_TYPING_RESULTS);
      return INITIAL_TYPING_RESULTS;
    }
    return res;
  },
  saveTypingResult: (result: TypingResult) => {
    const results = StorageService.getTypingResults();
    results.unshift(result);
    setItem(STORAGE_KEYS.TYPING_RESULTS, results);
    return results;
  },

  // Excel Practice Lab Tasks & Submissions
  getExcelPracticeTasks: (): ExcelPracticeTask[] => {
    return getItem<ExcelPracticeTask[]>(STORAGE_KEYS.EXCEL_PRACTICE_TASKS, INITIAL_EXCEL_PRACTICE_TASKS);
  },
  saveExcelPracticeTask: (task: ExcelPracticeTask) => {
    const tasks = StorageService.getExcelPracticeTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.unshift(task);
    }
    setItem(STORAGE_KEYS.EXCEL_PRACTICE_TASKS, tasks);
    return tasks;
  },
  getExcelPracticeSubmissions: (): ExcelPracticeSubmission[] => {
    return getItem<ExcelPracticeSubmission[]>(STORAGE_KEYS.EXCEL_PRACTICE_SUBMISSIONS, INITIAL_EXCEL_PRACTICE_SUBMISSIONS);
  },
  saveExcelPracticeSubmission: (sub: ExcelPracticeSubmission) => {
    const subs = StorageService.getExcelPracticeSubmissions();
    const index = subs.findIndex(s => s.taskId === sub.taskId && s.studentId === sub.studentId);
    if (index >= 0) {
      subs[index] = sub;
    } else {
      subs.unshift(sub);
    }
    setItem(STORAGE_KEYS.EXCEL_PRACTICE_SUBMISSIONS, subs);
    return subs;
  },

  // Live Computer Lab Device Sessions
  getDeviceSessions: (): StudentDeviceSession[] => {
    return getItem<StudentDeviceSession[]>(STORAGE_KEYS.DEVICE_SESSIONS, INITIAL_DEVICE_SESSIONS);
  },
  registerOrUpdateDeviceSession: (session: StudentDeviceSession) => {
    const sessions = StorageService.getDeviceSessions();
    const index = sessions.findIndex(s => s.studentId === session.studentId || s.deviceId === session.deviceId);
    if (index >= 0) {
      sessions[index] = { ...sessions[index], ...session, lastActiveTime: new Date().toISOString() };
    } else {
      sessions.unshift(session);
    }
    setItem(STORAGE_KEYS.DEVICE_SESSIONS, sessions);
    return sessions;
  },
  removeDeviceSession: (sessionId: string) => {
    const sessions = StorageService.getDeviceSessions().filter(s => s.id !== sessionId);
    setItem(STORAGE_KEYS.DEVICE_SESSIONS, sessions);
    return sessions;
  },

  // Direct Student-to-Teacher Notes & Work Submissions
  getDirectSubmissions: (): DirectWorkSubmission[] => {
    return getItem<DirectWorkSubmission[]>(STORAGE_KEYS.DIRECT_SUBMISSIONS, INITIAL_DIRECT_WORK_SUBMISSIONS);
  },
  saveDirectSubmission: (submission: DirectWorkSubmission) => {
    const subs = StorageService.getDirectSubmissions();
    const index = subs.findIndex(s => s.id === submission.id);
    if (index >= 0) {
      subs[index] = submission;
    } else {
      subs.unshift(submission);
    }
    setItem(STORAGE_KEYS.DIRECT_SUBMISSIONS, subs);
    return subs;
  },

  // Community Posts
  getCommunityPosts: (): CommunityPost[] => {
    return getItem<CommunityPost[]>(STORAGE_KEYS.COMMUNITY_POSTS, INITIAL_COMMUNITY_POSTS);
  },
  saveCommunityPost: (post: CommunityPost) => {
    const posts = StorageService.getCommunityPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.unshift(post);
    }
    setItem(STORAGE_KEYS.COMMUNITY_POSTS, posts);
    return posts;
  },
  deleteCommunityPost: (postId: string) => {
    const posts = StorageService.getCommunityPosts().filter(p => p.id !== postId);
    setItem(STORAGE_KEYS.COMMUNITY_POSTS, posts);
    return posts;
  },

  // Notes & Reminders
  getStudentNotes: (): StudentPrivateNote[] => {
    return getItem<StudentPrivateNote[]>(STORAGE_KEYS.STUDENT_NOTES, INITIAL_STUDENT_NOTES);
  },
  saveStudentNote: (note: StudentPrivateNote) => {
    const notes = StorageService.getStudentNotes();
    notes.unshift(note);
    setItem(STORAGE_KEYS.STUDENT_NOTES, notes);
    return notes;
  },
  getTeacherReminders: (): TeacherReminder[] => {
    return getItem<TeacherReminder[]>(STORAGE_KEYS.TEACHER_REMINDERS, INITIAL_TEACHER_REMINDERS);
  },
  saveTeacherReminder: (reminder: TeacherReminder) => {
    const reminders = StorageService.getTeacherReminders();
    const index = reminders.findIndex(r => r.id === reminder.id);
    if (index >= 0) {
      reminders[index] = reminder;
    } else {
      reminders.unshift(reminder);
    }
    setItem(STORAGE_KEYS.TEACHER_REMINDERS, reminders);
    return reminders;
  },
  toggleReminder: (reminderId: string) => {
    const reminders = StorageService.getTeacherReminders().map(r => 
      r.id === reminderId ? { ...r, isCompleted: !r.isCompleted } : r
    );
    setItem(STORAGE_KEYS.TEACHER_REMINDERS, reminders);
    return reminders;
  },

  // Calendar & Notifications
  getCalendarEvents: (): CalendarEvent[] => {
    return getItem<CalendarEvent[]>(STORAGE_KEYS.CALENDAR_EVENTS, INITIAL_CALENDAR_EVENTS);
  },
  saveCalendarEvent: (event: CalendarEvent) => {
    const events = StorageService.getCalendarEvents();
    events.push(event);
    setItem(STORAGE_KEYS.CALENDAR_EVENTS, events);
    return events;
  },
  getNotifications: (): SystemNotification[] => {
    return getItem<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
  saveNotification: (notif: SystemNotification) => {
    const notifs = StorageService.getNotifications();
    notifs.unshift(notif);
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return notifs;
  },
  markNotificationRead: (id: string) => {
    const notifs = StorageService.getNotifications().map(n => n.id === id ? { ...n, isRead: true } : n);
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return notifs;
  },

  // Learning Activity
  getLearningActivities: (): LearningActivity[] => {
    return getItem<LearningActivity[]>(STORAGE_KEYS.LEARNING_ACTIVITIES, INITIAL_LEARNING_ACTIVITIES);
  },
  addLearningActivity: (act: LearningActivity) => {
    const acts = StorageService.getLearningActivities();
    acts.unshift(act);
    setItem(STORAGE_KEYS.LEARNING_ACTIVITIES, acts);
    return acts;
  },

  // Analytics
  getStudentAnalytics: (): StudentAnalytics[] => {
    return getItem<StudentAnalytics[]>(STORAGE_KEYS.STUDENT_ANALYTICS, INITIAL_STUDENT_ANALYTICS);
  }
};
