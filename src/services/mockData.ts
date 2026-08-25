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

export const INITIAL_PROFILES: UserProfile[] = [
  // Teachers
  {
    id: 'user-teacher-nun-langdy',
    fullName: 'Nun Langdy (នុន លាងឌី)',
    username: 'nun.langdy',
    email: 'nunlangdy.ciis@gmail.com',
    password: 'teacher123',
    phone: '012 345 678',
    role: 'teacher',
    avatarUrl: '/images/teachers/nun-langdy.png',
    bio: 'Head Teacher (Lead Computer Science Educator) - CIIS',
    isActive: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-teacher-ten-chandara',
    fullName: 'Ten Chandara (តេន ចាន់ដារា)',
    username: 'ten.chandara',
    email: 'tenchandara.ciis@gmail.com',
    password: 'teacher123',
    phone: '098 765 432',
    role: 'teacher',
    avatarUrl: '/images/teachers/ten-chandara.png',
    bio: 'Senior Teacher (Monday Morning Class) - CIIS',
    isActive: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-asst-tekchas',
    fullName: 'Choeurn Tekchas (ជឿន តេជៈ)',
    username: 'tekchas',
    email: 'tekchas.ciis@gmail.com',
    password: 'asst123',
    phone: '087 654 321',
    role: 'teacher',
    avatarUrl: '/images/teachers/choeurn-tekchas.jpg',
    bio: "Head Teacher's Assistant & Lab Coach - CIIS",
    isActive: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-teacher-jame',
    fullName: 'Teacher Jame (JJ-DEV)',
    username: 'jame.teacher',
    email: 'jame@school.edu',
    password: 'ciis',
    phone: '012 345 678',
    role: 'teacher',
    avatarUrl: '/images/teachers/nun-langdy.png',
    bio: 'Lead Developer & Teacher - សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស (CIIS)',
    isActive: true,
    createdAt: '2026-01-10T08:00:00Z',
  },

  // Class 1 (5:30-6:30 PM) Students
  {
    id: 'std-ciis-001',
    studentId: 'STD-001',
    fullName: 'ផៃ ចិន្តា',
    username: 'phey.chinda',
    email: 'phey.chinda@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'female',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-002',
    studentId: 'STD-002',
    fullName: 'ហ៊ាន ចិន្តា',
    username: 'hean.chinda',
    email: 'hean.chinda@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'female',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-003',
    studentId: 'STD-003',
    fullName: 'ថេង សុខគីមហួរ',
    username: 'theng.sokkimhour',
    email: 'theng.sokkimhour@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'male',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-004',
    studentId: 'STD-004',
    fullName: 'យល់ សុនីតា',
    username: 'yol.sonita',
    email: 'yol.sonita@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'female',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-005',
    studentId: 'STD-005',
    fullName: 'ជា ដាឡែន',
    username: 'chea.dalen',
    email: 'chea.dalen@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'female',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-006',
    studentId: 'STD-006',
    fullName: 'សេងវ៉ាក់ វិច្ឆ័យ',
    username: 'sengvak.vichey',
    email: 'sengvak.vichey@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'male',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-007',
    studentId: 'STD-007',
    fullName: 'ថន ប៊ុនថាំ',
    username: 'thorn.buntham',
    email: 'thorn.buntham@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'male',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-008',
    studentId: 'STD-008',
    fullName: 'សុំ លីដា',
    username: 'som.lyda',
    email: 'som.lyda@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'female',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-009',
    studentId: 'STD-009',
    fullName: 'ហែម ផលលាប',
    username: 'hem.pholleap',
    email: 'hem.pholleap@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'female',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-010',
    studentId: 'STD-010',
    fullName: 'ប៊ូច ហ៊ុយឡាង',
    username: 'bouch.huyloang',
    email: 'bouch.huyloang@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'female',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-011',
    studentId: 'STD-011',
    fullName: 'ថាច ប៊ុណ្ណារ៉ាក់',
    username: 'thach.bonnarak',
    email: 'thach.bonnarak@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'male',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-012',
    studentId: 'STD-012',
    fullName: 'ឈី រចនា',
    username: 'chhy.rachana',
    email: 'chhy.rachana@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'female',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-013',
    studentId: 'STD-013',
    fullName: 'ផាត់ ស៊ីផៃ',
    username: 'phat.siphey',
    email: 'phat.siphey@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'male',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-014',
    studentId: 'STD-014',
    fullName: 'សួង វឌ្ឍនៈ',
    username: 'soung.vathana',
    email: 'soung.vathana@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'male',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-015',
    studentId: 'STD-015',
    fullName: 'ឈី សុម៉ាធារិទ្ធ',
    username: 'chhy.somatherith',
    email: 'chhy.somatherith@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'male',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-016',
    studentId: 'STD-016',
    fullName: 'ថុន យូលី',
    username: 'thun.youly',
    email: 'thun.youly@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'female',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-017',
    studentId: 'STD-017',
    fullName: 'ធឿន សុជាសានីត',
    username: 'thoeun.socheasanit',
    email: 'thoeun.socheasanit@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'male',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-018',
    studentId: 'STD-018',
    fullName: 'សុខ បញ្ញា',
    username: 'sok.panha',
    email: 'sok.panha@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'male',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'std-ciis-019',
    studentId: 'STD-019',
    fullName: 'វ៉ា ធីតា',
    username: 'va.thida',
    email: 'va.thida@ciis.edu',
    password: 'student123',
    role: 'student',
    gender: 'female',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    avatarUrl: '/images/students/student-profile.png',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  }
];

export const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: 'ciis-evening-1',
    name: 'CIIS Computer {5:30-6:30}',
    grade: 'Evening 1',
    room: 'CIIS Computer Lab 1',
    teacherId: 'user-teacher-nun-langdy',
    teacherName: 'Nun Langdy (នុន លាងឌី)',
    assistantId: 'user-asst-tekchas',
    assistantName: 'Choeurn Tekchas (ជឿន តេជៈ)',
    studentCount: 20,
    scheduleDescription: 'Mon - Fri • 5:30 PM - 6:30 PM',
    subjectSummary: ['Microsoft Word', 'Microsoft Excel', 'Typing Speed', 'Computer Basics'],
    academicYear: '2026-2027',
  },
  {
    id: 'ciis-evening-2',
    name: 'CIIS Computer {6:40-7:40}',
    grade: 'Evening 2',
    room: 'CIIS Computer Lab 1',
    teacherId: 'user-teacher-nun-langdy',
    teacherName: 'Nun Langdy (នុន លាងឌី)',
    assistantId: 'user-asst-tekchas',
    assistantName: 'Choeurn Tekchas (ជឿន តេជៈ)',
    studentCount: 20,
    scheduleDescription: 'Mon - Fri • 6:40 PM - 7:40 PM',
    subjectSummary: ['Microsoft Word', 'Microsoft Excel', 'Typing Speed', 'Computer Basics'],
    academicYear: '2026-2027',
  },
  {
    id: 'ciis-morning-mon',
    name: 'CIIS Computer {Mon 7:30-11:00}',
    grade: 'Monday Morning',
    room: 'CIIS Computer Lab 1',
    teacherId: 'user-teacher-ten-chandara',
    teacherName: 'Ten Chandara (តេន ចាន់ដារា)',
    assistantId: 'user-asst-tekchas',
    assistantName: 'Choeurn Tekchas (ជឿន តេជៈ)',
    studentCount: 20,
    scheduleDescription: 'Monday Only • 7:30 AM - 11:00 AM',
    subjectSummary: ['Microsoft Word', 'Microsoft Excel', 'Typing Speed', 'Office Systems'],
    academicYear: '2026-2027',
  }
];

export const INITIAL_SUBJECTS: SubjectInfo[] = [
  {
    code: 'excel',
    title: 'Microsoft Excel',
    description: 'Spreadsheet mastery, data formatting, formulas, and practical tasks.',
    iconName: 'FileSpreadsheet',
    totalLessons: 0,
  },
  {
    code: 'word',
    title: 'Microsoft Word',
    description: 'Document design, typography, multi-column tables, and professional formatting.',
    iconName: 'FileText',
    totalLessons: 0,
  },
  {
    code: 'typing',
    title: 'Touch Typing & Accuracy',
    description: '10-finger typing techniques, speed development, and error reduction.',
    iconName: 'Keyboard',
    totalLessons: 0,
  },
  {
    code: 'basics',
    title: 'Computer Basics & Windows',
    description: 'Hardware architecture, Windows file management, system settings, and shortcuts.',
    iconName: 'Laptop',
    totalLessons: 0,
  }
];

// Requirement 2: Lessons must start empty by default for clean teacher uploads
export const INITIAL_LESSONS: Lesson[] = [];

// Requirement 3: Assignments start empty by default until created
export const INITIAL_ASSIGNMENTS: Assignment[] = [];

export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

// Requirement 12 & 13: Typing Test passages with exact space preservation testing
export const INITIAL_TYPING_TESTS: TypingTestItem[] = [
  {
    id: 'tt-beginner',
    title: 'Beginner: Fundamental Words & Spacing',
    difficulty: 'beginner',
    durationSeconds: 60,
    textContent: 'banana and apple. Microsoft Word is easy to learn. The quick brown fox jumps over the lazy dog.'
  },
  {
    id: 'tt-intermediate',
    title: 'Intermediate: Office Applications & Spreadsheets',
    difficulty: 'intermediate',
    durationSeconds: 120,
    textContent: 'In computer applications, spreadsheets organize numerical data into structured columns and rows. Each cell is identified by a unique column letter and row number, such as A1 or C15. Mastering keyboard shortcuts like Control S to save and Control Z to undo will greatly increase your productivity in modern workplace environments.'
  },
  {
    id: 'tt-advanced',
    title: 'Advanced: Database Structures & Formula Logic',
    difficulty: 'advanced',
    durationSeconds: 180,
    textContent: 'Relational database management systems utilize structured query language to organize, index, and retrieve large datasets with high consistency. When constructing nested conditional formulas such as COUNTIFS or SUMIFS, exact syntax validation and cell reference scoping ($A$1 versus A1) are critical for preventing algorithmic calculation discrepancies across enterprise financial models.'
  }
];

export const INITIAL_TYPING_RESULTS: TypingResult[] = [
  {
    id: 'tr-01',
    studentId: 'teacher-01',
    studentName: 'Nun Langdy (Teacher)',
    studentCode: 'FAC-001',
    className: 'Computer Faculty',
    wpm: 94,
    accuracyPercentage: 99,
    correctKeystrokes: 470,
    errorKeystrokes: 2,
    timeSpentSeconds: 60,
    durationSeconds: 60,
    difficulty: 'advanced',
    createdAt: '2026-08-22T08:30:00Z'
  },
  {
    id: 'tr-02',
    studentId: 'teacher-02',
    studentName: 'Choeurn Tekchas (Lead TA)',
    studentCode: 'FAC-002',
    className: 'Computer Faculty',
    wpm: 88,
    accuracyPercentage: 98,
    correctKeystrokes: 440,
    errorKeystrokes: 3,
    timeSpentSeconds: 60,
    durationSeconds: 60,
    difficulty: 'advanced',
    createdAt: '2026-08-22T09:15:00Z'
  },
  {
    id: 'tr-03',
    studentId: 'std-01',
    studentName: 'Sokha Chan',
    studentCode: 'STD-001',
    className: 'CIIS Computer {5:30-6:30}',
    wpm: 76,
    accuracyPercentage: 98,
    correctKeystrokes: 380,
    errorKeystrokes: 3,
    timeSpentSeconds: 60,
    durationSeconds: 60,
    difficulty: 'advanced',
    createdAt: '2026-08-22T10:00:00Z'
  },
  {
    id: 'tr-04',
    studentId: 'std-02',
    studentName: 'Bopha Vanna',
    studentCode: 'STD-002',
    className: 'CIIS Computer {5:30-6:30}',
    wpm: 68,
    accuracyPercentage: 97,
    correctKeystrokes: 340,
    errorKeystrokes: 4,
    timeSpentSeconds: 60,
    durationSeconds: 60,
    difficulty: 'intermediate',
    createdAt: '2026-08-22T11:20:00Z'
  },
  {
    id: 'tr-05',
    studentId: 'std-03',
    studentName: 'Dara Meng',
    studentCode: 'STD-003',
    className: 'CIIS Computer {5:30-6:30}',
    wpm: 62,
    accuracyPercentage: 96,
    correctKeystrokes: 310,
    errorKeystrokes: 5,
    timeSpentSeconds: 60,
    durationSeconds: 60,
    difficulty: 'intermediate',
    createdAt: '2026-08-22T14:10:00Z'
  },
  {
    id: 'tr-06',
    studentId: 'std-04',
    studentName: 'Channary Roth',
    studentCode: 'STD-004',
    className: 'Grade 10A',
    wpm: 55,
    accuracyPercentage: 95,
    correctKeystrokes: 275,
    errorKeystrokes: 6,
    timeSpentSeconds: 60,
    durationSeconds: 60,
    difficulty: 'intermediate',
    createdAt: '2026-08-22T15:45:00Z'
  },
  {
    id: 'tr-07',
    studentId: 'std-05',
    studentName: 'Visal Kim',
    studentCode: 'STD-005',
    className: 'Grade 10B',
    wpm: 48,
    accuracyPercentage: 94,
    correctKeystrokes: 240,
    errorKeystrokes: 8,
    timeSpentSeconds: 60,
    durationSeconds: 60,
    difficulty: 'intermediate',
    createdAt: '2026-08-23T08:00:00Z'
  },
  {
    id: 'tr-08',
    studentId: 'std-06',
    studentName: 'Sreypov Heng',
    studentCode: 'STD-006',
    className: 'CIIS Computer {5:30-6:30}',
    wpm: 44,
    accuracyPercentage: 92,
    correctKeystrokes: 220,
    errorKeystrokes: 9,
    timeSpentSeconds: 60,
    durationSeconds: 60,
    difficulty: 'intermediate',
    createdAt: '2026-08-23T09:30:00Z'
  }
];

// Requirement 8, 9, 10: Practical Exams with Tasks and Results
export const INITIAL_PRACTICAL_EXAMS: PracticalExam[] = [
  {
    id: 'exam-word-01',
    title: 'Microsoft Word Practical Exam',
    subjectCode: 'word',
    classId: 'class-10a',
    className: 'Grade 10A',
    examDate: '2026-08-27',
    startTime: '08:00',
    durationMinutes: 60,
    maxScore: 100,
    instructions: 'Complete all 6 tasks in Microsoft Word. Save your completed document as StudentName_WordExam.docx.',
    createdByName: 'Nun Langdy',
    createdAt: '2026-08-18T08:00:00Z',
    tasks: [
      {
        id: 'wt-1',
        orderIndex: 1,
        title: 'Task 1: Text Formatting & Typography',
        description: 'Set Title to 18pt Bold, Headings to 14pt Semi-bold, Body to 11pt Regular with 1.15 line spacing.',
        maxMarks: 20
      },
      {
        id: 'wt-2',
        orderIndex: 2,
        title: 'Task 2: Create & Style Table',
        description: 'Insert a 4x5 table with colored header row, subtle borders, and center-aligned numeric data.',
        maxMarks: 20
      },
      {
        id: 'wt-3',
        orderIndex: 3,
        title: 'Task 3: Insert Image & Text Wrapping',
        description: 'Insert the provided school logo, set text wrapping to Square, and apply a 1pt subtle border.',
        maxMarks: 15
      },
      {
        id: 'wt-4',
        orderIndex: 4,
        title: 'Task 4: Page Layout & Margins',
        description: 'Set page size to A4, Normal margins (1 inch), and Portrait orientation.',
        maxMarks: 15
      },
      {
        id: 'wt-5',
        orderIndex: 5,
        title: 'Task 5: Header & Footer',
        description: 'Add document title in Header and automated Page Number (Page X of Y) in Footer.',
        maxMarks: 10
      },
      {
        id: 'wt-6',
        orderIndex: 6,
        title: 'Task 6: Final Document Polish',
        description: 'Spelling check, clean paragraph alignment, and export preview.',
        maxMarks: 20
      }
    ]
  },
  {
    id: 'exam-excel-01',
    title: 'Microsoft Excel Practical Exam',
    subjectCode: 'excel',
    classId: 'class-10a',
    className: 'Grade 10A',
    examDate: '2026-08-30',
    startTime: '08:00',
    durationMinutes: 60,
    maxScore: 100,
    instructions: 'Download the starter workbook. Complete the student score calculations, formulas, and chart.',
    createdByName: 'Nun Langdy',
    createdAt: '2026-08-19T08:00:00Z',
    tasks: [
      {
        id: 'et-1',
        orderIndex: 1,
        title: 'Task 1: Data Entry & Cell Formatting',
        description: 'Format header with dark pink fill, bold white text, currency format for fees, and grid borders.',
        maxMarks: 20
      },
      {
        id: 'et-2',
        orderIndex: 2,
        title: 'Task 2: Basic Formulas (SUM & AVERAGE)',
        description: 'Calculate Total Score for 10 students using =SUM() and Class Average using =AVERAGE().',
        maxMarks: 25
      },
      {
        id: 'et-3',
        orderIndex: 3,
        title: 'Task 3: Conditional Counting (COUNTIF)',
        description: 'Use =COUNTIF() to count passing scores (>=50) and absent records ("A").',
        maxMarks: 30
      },
      {
        id: 'et-4',
        orderIndex: 4,
        title: 'Task 4: Chart Creation & Formatting',
        description: 'Create a 2D Clustered Column chart comparing student scores with proper title and legend.',
        maxMarks: 25
      }
    ]
  }
];

export const INITIAL_PRACTICAL_RESULTS: PracticalExamResult[] = [
  {
    id: 'res-word-vichea',
    examId: 'exam-word-01',
    examTitle: 'Microsoft Word Practical Exam',
    classId: 'class-10a',
    className: 'Grade 10A',
    studentId: 'user-student-vichea',
    studentName: 'CHAN Vichea',
    studentCode: 'STD-2026-001',
    taskScores: {
      'wt-1': 19,
      'wt-2': 18,
      'wt-3': 14,
      'wt-4': 14,
      'wt-5': 9,
      'wt-6': 18
    },
    totalScore: 92,
    maxScore: 100,
    percentage: 92,
    grade: 'A',
    isPass: true,
    teacherFeedback: 'Excellent formatting, clean table styling, and perfect header/footer setup.',
    isCompleted: true,
    gradedByName: 'Nun Langdy',
    gradedAt: '2026-08-20T11:00:00Z'
  },
  {
    id: 'res-word-dara',
    examId: 'exam-word-01',
    examTitle: 'Microsoft Word Practical Exam',
    classId: 'class-10a',
    className: 'Grade 10A',
    studentId: 'user-student-dara',
    studentName: 'SOK Dara',
    studentCode: 'STD-2026-002',
    taskScores: {
      'wt-1': 18,
      'wt-2': 17,
      'wt-3': 13,
      'wt-4': 13,
      'wt-5': 8,
      'wt-6': 16
    },
    totalScore: 85,
    maxScore: 100,
    percentage: 85,
    grade: 'B',
    isPass: true,
    teacherFeedback: 'Good document layout. Make sure to double check table column alignment.',
    isCompleted: true,
    gradedByName: 'Nun Langdy',
    gradedAt: '2026-08-20T11:15:00Z'
  },
  {
    id: 'res-word-sopheak',
    examId: 'exam-word-01',
    examTitle: 'Microsoft Word Practical Exam',
    classId: 'class-10a',
    className: 'Grade 10A',
    studentId: 'user-student-sopheak',
    studentName: 'SOK Sopheak',
    studentCode: 'STD-2026-003',
    taskScores: {
      'wt-1': 14,
      'wt-2': 13,
      'wt-3': 10,
      'wt-4': 10,
      'wt-5': 6,
      'wt-6': 14
    },
    totalScore: 67,
    maxScore: 100,
    percentage: 67,
    grade: 'C',
    isPass: true,
    teacherFeedback: 'Passed. Review image text wrapping and page margin settings.',
    isCompleted: true,
    gradedByName: 'Nun Langdy',
    gradedAt: '2026-08-20T11:30:00Z'
  }
];

// Requirement 16 & 17: Excel Practice Lab Tasks & Submissions
export const INITIAL_EXCEL_PRACTICE_TASKS: ExcelPracticeTask[] = [
  {
    id: 'ept-01',
    title: 'Student Score Table & Statistics',
    category: 'Tables',
    classId: 'class-10a',
    className: 'Grade 10A',
    difficulty: 'beginner',
    description: 'Create a complete student score tracking sheet with formatting and math formulas.',
    requirements: [
      'Enter 10 student names and test marks (Math, Computer, English)',
      'Calculate Total Score using =SUM()',
      'Calculate Average Score using =AVERAGE()',
      'Find the highest score with =MAX() and lowest score with =MIN()',
      'Format table header with dark borders and alternating row shading'
    ],
    starterTemplateName: 'Student_Score_Template.xlsx',
    starterTemplateType: 'xlsx',
    starterTemplateSize: '48 KB',
    maxScore: 100,
    createdByName: 'Nun Langdy',
    createdAt: '2026-08-18T09:00:00Z'
  },
  {
    id: 'ept-02',
    title: 'Conditional Counting with COUNTIF',
    category: 'Formulas',
    classId: 'class-10a',
    className: 'Grade 10A',
    difficulty: 'beginner',
    description: 'Practice conditional counts for passing marks and attendance presence.',
    requirements: [
      'Count how many students scored 50 and above: =COUNTIF(range, ">=50")',
      'Count how many students were absent ("Absent")',
      'Count students with Grade A (>=85)',
      'Wrap all criteria comparison operators in quotation marks'
    ],
    starterTemplateName: 'COUNTIF_Practice_Workbook.xlsx',
    starterTemplateType: 'xlsx',
    starterTemplateSize: '54 KB',
    maxScore: 100,
    createdByName: 'Nun Langdy',
    createdAt: '2026-08-19T10:00:00Z'
  },
  {
    id: 'ept-03',
    title: 'Product Sales Data Sorting & Filtering',
    category: 'Sorting & Filtering',
    classId: 'class-10a',
    className: 'Grade 10A',
    difficulty: 'intermediate',
    description: 'Sort inventory data alphabetically and filter items by price category.',
    requirements: [
      'Apply AutoFilter to table columns A:E',
      'Sort product names from A to Z',
      'Filter products with quantity less than 10',
      'Create a summary row with Total Revenue'
    ],
    starterTemplateName: 'Inventory_Filter_Exercise.xlsx',
    starterTemplateType: 'xlsx',
    starterTemplateSize: '62 KB',
    maxScore: 100,
    createdByName: 'Nun Langdy',
    createdAt: '2026-08-20T08:00:00Z'
  }
];

export const INITIAL_EXCEL_PRACTICE_SUBMISSIONS: ExcelPracticeSubmission[] = [
  {
    id: 'eps-01',
    taskId: 'ept-01',
    taskTitle: 'Student Score Table & Statistics',
    studentId: 'user-student-vichea',
    studentName: 'CHAN Vichea',
    studentClass: 'Grade 10A',
    submittedFileName: 'CHAN_Vichea_ScoreTable.xlsx',
    submittedFileType: 'xlsx',
    submittedAt: '2026-08-21T10:00:00Z',
    status: 'completed',
    score: 95,
    maxScore: 100,
    teacherFeedback: 'Clean table formatting and accurate formula ranges.',
    gradedByName: 'Nun Langdy',
    gradedAt: '2026-08-21T11:00:00Z'
  }
];

// Requirement 18 & 19: Live Device Sessions (Start empty, dynamically populated upon student session)
export const INITIAL_DEVICE_SESSIONS: StudentDeviceSession[] = [];

// Requirement 24: Direct Student-to-Teacher Notes & Work Submissions
export const INITIAL_DIRECT_WORK_SUBMISSIONS: DirectWorkSubmission[] = [
  {
    id: 'dws-01',
    studentId: 'user-student-vichea',
    studentName: 'CHAN Vichea',
    studentCode: 'STD-2026-001',
    studentClass: 'Grade 10A',
    subject: 'Excel Practice Exercise',
    message: 'Nun Langdy, I have completed all the formulas in Exercise 03. Please review my workbook.',
    attachmentName: 'CHAN_Vichea_Exercise_03.xlsx',
    attachmentType: 'xlsx',
    attachmentSize: '64 KB',
    status: 'reviewed',
    teacherFeedback: 'Great job Vichea! Your COUNTIF formulas are very clean.',
    score: 95,
    submittedAt: '2026-08-21T09:45:00Z',
    reviewedAt: '2026-08-21T10:15:00Z'
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-01',
    authorId: 'user-teacher-jame',
    authorName: 'Nun Langdy',
    authorRole: 'teacher',
    subjectCode: 'excel',
    category: 'announcement',
    title: 'Reminder: Practical Exam on Excel next Wednesday',
    content: 'Dear Grade 10 students, please review our practice tasks on SUM, AVERAGE, and COUNTIF in the Excel Practice Lab. Feel free to send your questions directly through this community or the Send Work to Teacher feature.',
    isAnnouncement: true,
    isPinned: true,
    isLocked: false,
    likesCount: 12,
    comments: [
      {
        id: 'c-01',
        postId: 'post-01',
        authorId: 'user-student-vichea',
        authorName: 'CHAN Vichea',
        authorRole: 'student',
        content: 'Thank you Teacher! Will the practical exam include chart creation as well?',
        likesCount: 3,
        createdAt: '2026-08-21T09:15:00Z'
      },
      {
        id: 'c-02',
        postId: 'post-01',
        authorId: 'user-teacher-jame',
        authorName: 'Nun Langdy',
        authorRole: 'teacher',
        content: 'Yes Vichea! There will be 1 column chart task at the end.',
        likesCount: 5,
        createdAt: '2026-08-21T09:20:00Z'
      }
    ],
    createdAt: '2026-08-21T08:30:00Z'
  },
  {
    id: 'post-02',
    authorId: 'user-student-vichea',
    authorName: 'CHAN Vichea',
    authorRole: 'student',
    authorClass: 'Grade 10A',
    subjectCode: 'excel',
    category: 'question',
    title: 'Question about COUNTIF comparison operator quotation',
    content: 'When writing =COUNTIF(B2:B20, ">=50"), why must the comparison operator be inside quotes?',
    isAnnouncement: false,
    isPinned: false,
    isLocked: false,
    likesCount: 4,
    comments: [
      {
        id: 'c-03',
        postId: 'post-02',
        authorId: 'user-teacher-jame',
        authorName: 'Nun Langdy',
        authorRole: 'teacher',
        content: 'Because in Excel, logical operators like >= or < are treated as text criteria expressions when passed into COUNT functions!',
        likesCount: 6,
        createdAt: '2026-08-21T10:00:00Z'
      }
    ],
    createdAt: '2026-08-21T09:40:00Z'
  }
];

export const INITIAL_STUDENT_ANALYTICS: StudentAnalytics[] = [];

export const INITIAL_STUDENT_NOTES: StudentPrivateNote[] = [];

export const INITIAL_TEACHER_REMINDERS: TeacherReminder[] = [
  {
    id: 'rem-01',
    teacherId: 'user-teacher-jame',
    title: 'CIIS Evening 1 Attendance Check',
    description: 'Attendance recorded: 18 Present, 1 Absent, 1 Late.',
    isCompleted: false,
    priority: 'normal',
    autoGenerated: true
  },
  {
    id: 'rem-02',
    teacherId: 'user-teacher-jame',
    title: 'Excel Practical Exam Next Wednesday',
    description: 'Prepare in-lab template files in CIIS Computer Lab 1.',
    dueDate: '2026-08-27',
    isCompleted: false,
    priority: 'urgent',
    autoGenerated: false
  },
  {
    id: 'rem-03',
    teacherId: 'user-teacher-jame',
    title: 'Attendance Warning Review',
    description: '2 students currently have attendance below 80%.',
    isCompleted: false,
    priority: 'high',
    autoGenerated: true
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-01',
    title: 'CIIS Computer {5:30-6:30}',
    description: 'Microsoft Excel: Practical Tasks & Formulas',
    eventType: 'class',
    classId: 'ciis-evening-1',
    className: 'CIIS Computer {5:30-6:30}',
    date: '2026-08-21',
    startTime: '17:30',
    endTime: '18:30',
    location: 'CIIS Computer Lab 1'
  },
  {
    id: 'cal-02',
    title: 'CIIS Computer {6:40-7:40}',
    description: 'Microsoft Word & Fast Touch Typing',
    eventType: 'class',
    classId: 'ciis-evening-2',
    className: 'CIIS Computer {6:40-7:40}',
    date: '2026-08-21',
    startTime: '18:40',
    endTime: '19:40',
    location: 'CIIS Computer Lab 1'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-01',
    title: 'Welcome to សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស (CIIS)',
    message: 'សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងការសិក្សា សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស (CIIS LMS)។',
    iconType: 'announcement',
    linkUrl: '/dashboard',
    isRead: false,
    createdAt: '2026-08-21T08:00:00Z'
  }
];

export const INITIAL_LEARNING_ACTIVITIES: LearningActivity[] = [
  {
    id: 'act-01',
    studentId: 'user-student-vichea',
    activityType: 'exam_completed',
    title: 'Completed Microsoft Word Practical Exam',
    description: 'Score: 92/100 (Grade A - Distinction)',
    timestamp: 'Yesterday at 11:00 AM'
  },
  {
    id: 'act-02',
    studentId: 'user-student-vichea',
    activityType: 'excel_practice',
    title: 'Submitted Excel Practice Task',
    description: 'Completed Student Score Table & Statistics',
    timestamp: 'Today at 10:00 AM'
  },
  {
    id: 'act-03',
    studentId: 'user-student-vichea',
    activityType: 'typing_practice',
    title: 'Completed Typing Test (Intermediate)',
    description: 'Score: 42 WPM with 94% accuracy',
    timestamp: 'Today at 09:30 AM'
  }
];
