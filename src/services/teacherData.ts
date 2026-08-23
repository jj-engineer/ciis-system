export interface TeacherProfile {
  id: string;
  nameEn: string;
  nameKh: string;
  role: 'head' | 'senior' | 'assistant';
  roleTitleEn: string;
  roleTitleKh: string;
  badgeEn: string;
  badgeKh: string;
  image: string;
  subjectEn: string;
  subjectKh: string;
  scheduleEn: string;
  scheduleKh: string;
  classesCountEn: string;
  classesCountKh: string;
  email: string;
  phone: string;
  experienceEn: string;
  experienceKh: string;
  educationEn: string;
  educationKh: string;
  skillsEn: string[];
  skillsKh: string[];
  bioEn: string;
  bioKh: string;
  quoteEn: string;
  quoteKh: string;
}

export const TEACHERS_DATA: TeacherProfile[] = [
  {
    id: 'teacher-nun-langdy',
    nameEn: 'Nun Langdy',
    nameKh: 'នុន លាងឌី',
    role: 'head',
    roleTitleEn: 'Head Teacher (Lead Computer Science Educator)',
    roleTitleKh: 'ប្រធានគ្រូបង្រៀន (Head Teacher)',
    badgeEn: 'Head Teacher',
    badgeKh: 'ប្រធានគ្រូ',
    image: '/images/teachers/nun-langdy.png',
    subjectEn: 'Computer Science, Office Suites & Digital Media',
    subjectKh: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ & កម្មវិធីការិយាល័យ',
    scheduleEn: 'Mon - Fri • 5:30 PM - 6:30 PM & 6:40 PM - 7:40 PM',
    scheduleKh: 'ចន្ទ - សុក្រ (៥:៣០-៦:៣០ ល្ងាច & ៦:៤០-៧:៤០ យប់)',
    classesCountEn: '2 Active Shifts (Evening 1 & Evening 2)',
    classesCountKh: '២ ថ្នាក់សកម្ម (វេនល្ងាច ទី១ & ទី២)',
    email: 'nunlangdy.ciis@gmail.com',
    phone: '+855 12 345 678',
    experienceEn: '7+ Years of Computer Education & Digital Media',
    experienceKh: 'បទពិសោធន៍ ៧ ឆ្នាំ+ ក្នុងការបង្រៀន & បច្ចេកវិទ្យា',
    educationEn: 'Bachelor of Computer Science & Information Technology',
    educationKh: 'បរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ & បច្ចេកវិទ្យាព័ត៌មាន',
    skillsEn: [
      'Video Editing',
      'Poster & Graphic Design',
      'Microsoft Word',
      'Microsoft Excel',
      'Microsoft PowerPoint',
      'Content Creation',
      'Touch Typing',
      'Technology Education'
    ],
    skillsKh: [
      'កាត់តវីដេអូ (Video Editing)',
      'រចនា Poster & បដា',
      'Microsoft Word',
      'Microsoft Excel',
      'Microsoft PowerPoint',
      'Content Creator',
      'វាយអក្សរ Touch Typing',
      'បច្ចេកវិទ្យាឌីជីថល'
    ],
    bioEn: 'Nun Langdy is the Head Teacher at CIIS School. He is a passionate digital creator and technology educator with extensive expertise in video editing, poster and graphic design, advanced Microsoft Office (Word, Excel, PowerPoint), content creation, and computer lab administration. Dedicated to practical student growth and modern technological mastery.',
    bioKh: 'លោកគ្រូ នុន លាងឌី (Nun Langdy) ជាប្រធានគ្រូបង្រៀននៅសាលារៀន CIIS។ លោកគ្រូមានចំណេះដឹង និងជំនាញច្បាស់លាស់ក្នុងការកាត់តវីដេអូ, ការរចនា Poster និងបដាផ្សព្វផ្សាយ, ការប្រើប្រាស់កម្មវិធីការិយាល័យកម្រិតខ្ពស់ (Word, Excel, PowerPoint), ជា Content Creator និងអ្នកជំនាញបច្ចេកវិទ្យា។ លោកគ្រូជាមនុស្សចិត្តល្អ រួសរាយរាក់ទាក់ និងយកចិត្តទុកដាក់ខ្ពស់លើការបណ្តុះបណ្តាលសិស្សឱ្យចេះអនុវត្តផ្ទាល់។',
    quoteEn: 'Empowering students with practical digital skills to excel in modern technology and creative careers.',
    quoteKh: 'បណ្តុះបណ្តាលសិស្សឱ្យទទួលបានជំនាញកុំព្យូទ័រច្បាស់លាស់ ដើម្បីភាពជោគជ័យក្នុងយុគសម័យឌីជីថល។'
  },
  {
    id: 'teacher-ten-chandara',
    nameEn: 'Ten Chandara',
    nameKh: 'តេន ចាន់ដារា',
    role: 'senior',
    roleTitleEn: 'Senior Teacher (Computer Systems & Practice)',
    roleTitleKh: 'គ្រូបង្រៀនជាន់ខ្ពស់ (Senior Teacher)',
    badgeEn: 'Senior Teacher',
    badgeKh: 'គ្រូជាន់ខ្ពស់',
    image: '/images/teachers/ten-chandara.png',
    subjectEn: 'Advanced Computer Systems & Applications',
    subjectKh: 'ប្រព័ន្ធកុំព្យូទ័រ & កម្មវិធីការិយាល័យជាន់ខ្ពស់',
    scheduleEn: 'Monday Only • 7:30 AM - 11:00 AM',
    scheduleKh: 'ចន្ទ តែមួយថ្ងៃគត់ (៧:៣០ ព្រឹក - ១១:០០ ព្រឹក)',
    classesCountEn: '1 Active Shift (Monday Morning Class)',
    classesCountKh: '១ ថ្នាក់សកម្ម (ថ្នាក់ថ្ងៃចន្ទ ព្រឹក)',
    email: 'tenchandara.ciis@gmail.com',
    phone: '+855 98 765 432',
    experienceEn: '5+ Years in Digital Training & Office Systems',
    experienceKh: 'បទពិសោធន៍ ៥ ឆ្នាំ+ ក្នុងការបណ្តុះបណ្តាលកុំព្យូទ័រ',
    educationEn: 'Bachelor of Information Technology',
    educationKh: 'បរិញ្ញាបត្របច្ចេកវិទ្យាព័ត៌មាន',
    skillsEn: [
      'Computer Systems',
      'Microsoft Office Advanced',
      'Database Essentials',
      'Spreadsheet Analytics',
      'IT Fundamentals',
      'Academic Evaluation'
    ],
    skillsKh: [
      'ប្រព័ន្ធកុំព្យូទ័រ',
      'Microsoft Office កម្រិតខ្ពស់',
      'មូលដ្ឋានទិន្នន័យ Database',
      'ការវិភាគតារាង Excel',
      'ការវាយតម្លៃលទ្ធផលសិស្ស'
    ],
    bioEn: 'Ten Chandara is a Senior Teacher at CIIS School, leading the specialized Monday morning computer session (7:30 AM - 11:00 AM). He focuses on comprehensive digital literacy, practical office software workflows, spreadsheet calculations, and structured student evaluations.',
    bioKh: 'លោកគ្រូ តេន ចាន់ដារា (Ten Chandara) ជាគ្រូបង្រៀនជាន់ខ្ពស់នៅសាលារៀន CIIS។ លោកគ្រូទទួលបន្ទុកបង្រៀនថ្នាក់កុំព្យូទ័រពិសេសរៀងរាល់ព្រឹកថ្ងៃចន្ទ (៧:៣០ ព្រឹក - ១១:០០ ព្រឹក) ដោយផ្តោតលើការយល់ដឹងស៊ីជម្រៅអំពីប្រព័ន្ធកុំព្យូទ័រ រូបមន្តគណនាលេខ និងការអនុវត្តជាក់ស្តែងសម្រាប់ការងារ។',
    quoteEn: 'Building strong foundations in computer applications with discipline, accuracy, and practical excellence.',
    quoteKh: 'កសាងមូលដ្ឋានគ្រឹះកុំព្យូទ័រដ៏រឹងមាំ ប្រកបដោយភាពច្បាស់លាស់ និងភាពត្រឹមត្រូវ។'
  },
  {
    id: 'teacher-choeurn-tekchas',
    nameEn: 'Choeurn Tekchas',
    nameKh: 'ជឿន តេជៈ',
    role: 'assistant',
    roleTitleEn: "Head Teacher's Assistant & Lab Coach",
    roleTitleKh: 'ជំនួយការគ្រូបង្រៀន (Head Teacher’s Assistant)',
    badgeEn: 'Assistant Teacher',
    badgeKh: 'ជំនួយការគ្រូ',
    image: '/images/teachers/choeurn-tekchas.jpg',
    subjectEn: 'Lab Technical Support & Touch Typing Coaching',
    subjectKh: 'ជំនួយការបន្ទប់កុំព្យូទ័រ & ហ្វឹកហាត់វាយអក្សរ',
    scheduleEn: 'Mon - Fri • Lab Technical Support & Exercise Guidance',
    scheduleKh: 'ចន្ទ - សុក្រ (ជំនួយការថ្នាក់រៀន និងបន្ទប់កុំព្យូទ័រ)',
    classesCountEn: 'Laboratory Support Across All Shifts',
    classesCountKh: 'ជំនួយការគ្រប់វេនថ្នាក់រៀន Lab',
    email: 'tekchas.ciis@gmail.com',
    phone: '+855 87 654 321',
    experienceEn: '3+ Years in Lab Operations & Student Tutoring',
    experienceKh: 'បទពិសោធន៍ ៣ ឆ្នាំ+ ក្នុងការគ្រប់គ្រងឧបករណ៍ & ជួយសិស្ស',
    educationEn: 'Associate Degree in Applied Computer Technology',
    educationKh: 'សញ្ញាបត្របច្ចេកវិទ្យាកុំព្យូទ័រអនុវត្ត',
    skillsEn: [
      'Head Teacher Assistance',
      'Touch Typing Coaching',
      'Lab Equipment Setup',
      'Student Exercise Support',
      'Technical Troubleshooting',
      'Attendance Tracking'
    ],
    skillsKh: [
      'ជំនួយការលោកគ្រូប្រធាន',
      'គ្រូបង្វឹក Touch Typing',
      'រៀបចំឧបករណ៍កុំព្យូទ័រ Lab',
      'ជួយណែនាំលំហាត់សិស្ស',
      'ស្រង់វត្តមាន និងដោះស្រាយបញ្ហាបច្ចេកទេស'
    ],
    bioEn: "Choeurn Tekchas is the Head Teacher's Assistant at CIIS School. With hands-on technical experience, he ensures smooth laboratory operations, coaches students on touch typing accuracy and speed, guides practical exercises, and supports technical classroom workflows.",
    bioKh: 'លោកគ្រូ ជឿន តេជៈ (Choeurn Tekchas) ជាជំនួយការលោកគ្រូប្រធាន (Head Teacher’s Assistant) នៅសាលារៀន CIIS។ គាត់មានបទពិសោធន៍យ៉ាងសកម្មក្នុងការជួយសម្រួលដល់ដំណើរការបង្រៀន ណែនាំសិស្សក្នុងការហ្វឹកហាត់វាយអក្សរ Touch Typing ត្រួតពិនិត្យឧបករណ៍ក្នុងបន្ទប់កុំព្យូទ័រ និងជួយសិស្សដែលជួបការលំបាកក្នុងម៉ោងអនុវត្ត។',
    quoteEn: 'Guiding every student patiently step-by-step through practical exercises and fast touch typing mastery.',
    quoteKh: 'ជួយណែនាំសិស្សមួយជំហានម្តងៗដោយការយកចិត្តទុកដាក់ ដើម្បីឱ្យសិស្សគ្រប់រូបចេះអនុវត្តជាក់ស្តែង។'
  }
];
