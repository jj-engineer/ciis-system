// Natural, human-sounding educational Khmer & English translation dictionary

export type Language = 'en' | 'km';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Brand & General
    'app.name': 'COMMUNITY INTERNAL INSPIRATION SCHOOL',
    'app.short_name': 'CIIS',
    'app.school_full_km': 'សាលារៀនស៊ី អាយ អាយ អេស',
    'app.school_full_en': 'COMMUNITY INTERNAL INSPIRATION SCHOOL',
    'app.tagline': 'Community Internal Inspiration School - Learning Management System',
    'app.academic_year': 'Academic Year 2026-2027',
    'app.lab_name': 'CIIS Computer Lab & Study Center',

    // Roles
    'role.teacher': 'Lead Teacher',
    'role.student': 'Student',

    // Navigation Tabs
    'nav.dashboard': 'Home Dashboard',
    'nav.teacher_dashboard': 'Teacher Dashboard',
    'nav.workspace': 'Teacher Workspace',
    'nav.attendance': 'Take Attendance',
    'nav.students': 'Students',
    'nav.classes': 'Classes',
    'nav.lessons': 'Lessons',
    'nav.assignments': 'Assignments',
    'nav.assessment': 'Quick Drills Dispatcher',
    'nav.typing': 'Typing Test',
    'nav.resources': 'Formula & Resource Hub',
    'nav.submissions': 'Upload Work / Lessons',
    'nav.lab': 'Computer Lab',
    'nav.calendar': 'School Calendar',
    'nav.reports': 'Reports & President Export',
    'nav.ai_assistant': 'AI Assistant',
    'nav.progress': 'My Progress',
    'nav.profile': 'My Profile',
    'nav.settings': 'Settings',

    // Titles
    'title.student_portal': 'Student Learning Portal',
    'title.teacher_dashboard': 'Teacher Classroom Dashboard',
    'title.workspace': 'Teacher Quick Workspace',
    'title.attendance': 'Fast Attendance (< 1 min)',
    'title.students': 'Student Management & Profiles',
    'title.classes': 'Class Management & Rosters',
    'title.lessons': 'Lessons & Study Guides',
    'title.assignments': 'Assignments & File Submissions',
    'title.assessment': 'Fast Exercise & Assessment Dispatcher',
    'title.typing': 'Touch Typing Speed Lab',
    'title.resources': 'Computer Skills Resource & Formula Hub',
    'title.submissions': 'Upload Your Work & Study Lessons',
    'title.lab': 'Computer Lab (Live Devices)',
    'title.calendar': 'School Calendar & Deadlines',
    'title.reports': 'Official Attendance & Academic Reports',
    'title.ai_assistant': 'Teacher AI Assistant',
    'title.progress': 'My Visual Learning Progress',
    'title.profile': 'My Profile',
    'title.settings': 'System Settings & Access Control',

    // Common Actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    'action.close': 'Close',
    'action.submit': 'Submit',
    'action.upload': 'Upload',
    'action.download': 'Download',
    'action.review': 'Review',
    'action.grade': 'Grade',
    'action.search': 'Search...',
    'action.filter': 'Filter',
    'action.view_all': 'View All',
    'action.try_again': 'Try Again',
    'action.open': 'Open',
    'action.save_attendance': 'Save Attendance',
    'action.export_csv': 'Export CSV',

    // Attendance Statuses
    'status.present': 'Present',
    'status.absent': 'Absent',
    'status.late': 'Late',
    'status.permission': 'Permission',
    'status.sick': 'Sick Leave',

    // Common States & Badges
    'status.active': 'Active',
    'status.completed': 'Completed',
    'status.pending': 'Pending',
    'status.passed': 'Passed',
    'status.failed': 'Failed',
    'status.submitted': 'Submitted',
    'status.checked': 'Checked',
    'status.needs_correction': 'Needs Correction',

    // Empty States
    'empty.lessons_title': 'No lessons available yet',
    'empty.lessons_desc': 'Your lessons will appear here after they are uploaded by the teacher.',
    'empty.assignments_teacher_title': 'No assignments yet',
    'empty.assignments_teacher_desc': 'Create an assignment to give work to your students.',
    'empty.assignments_student_title': 'No assignments available right now',
    'empty.assignments_student_desc': 'Your teacher hasn\'t posted any assignments yet.',
    'empty.devices_title': 'No active devices',
    'empty.devices_desc': 'Students will appear here when they open the school system on a computer, laptop, tablet, or mobile device.',

    // Student Dashboard
    'student.welcome': 'Welcome back, {name}!',
    'student.subtitle': 'Practice touch typing drills, explore Excel formulas, and submit your homework documents directly to the teacher.',
    'student.practice_typing': 'Practice Typing',
    'student.my_tasks': 'My Learning Tasks & Deadlines',

    // Teacher Workspace
    'teacher.quick_actions': 'Quick Classroom Actions',
    'teacher.todays_work': 'Today\'s Work & Priorities',
    'teacher.quick_search': 'Quick Student Directory Search',
    'teacher.reminders': 'Teacher Reminders & To-Do',

    // Typing Lab
    'typing.title': 'Touch Typing Speed Lab',
    'typing.speed': 'Typing Speed',
    'typing.accuracy': 'Accuracy',
    'typing.time': 'Time',
    'typing.errors': 'Errors',
    'typing.start_prompt': 'Click here and start typing to begin the test...',
    'typing.test_complete': 'Typing Test Complete!',
    'typing.history': 'My Typing History & Speed Growth',

    // Language Toggle
    'lang.english': 'English',
    'lang.khmer': 'ភាសាខ្មែរ',
    'lang.switch': 'Language / ភាសា'
  },
  km: {
    // Brand & General (Natural Khmer)
    'app.name': 'សាលារៀនស៊ី អាយ អាយ អេស (CIIS)',
    'app.short_name': 'CIIS',
    'app.school_full_km': 'សាលារៀនស៊ី អាយ អាយ អេស',
    'app.school_full_en': 'COMMUNITY INTERNAL INSPIRATION SCHOOL',
    'app.tagline': 'ប្រព័ន្ធគ្រប់គ្រងការសិក្សា សាលារៀនស៊ី អាយ អាយ អេស (CIIS)',
    'app.academic_year': 'ឆ្នាំសិក្សា ២០២៦-២០២៧',
    'app.lab_name': 'បន្ទប់កុំព្យូទ័រ សាលារៀនស៊ី អាយ អាយ អេស (CIIS)',

    // Roles (Natural Khmer)
    'role.teacher': 'លោកគ្រូ/អ្នកគ្រូបង្រៀន',
    'role.student': 'សិស្សានុសិស្ស',

    // Navigation Tabs (Natural Khmer)
    'nav.dashboard': 'ផ្ទាំងគ្រប់គ្រងដើម',
    'nav.teacher_dashboard': 'ផ្ទាំងការងារគ្រូបង្រៀន',
    'nav.workspace': 'កន្លែងការងាររហ័ស',
    'nav.attendance': 'ស្រង់វត្តមានសិស្ស',
    'nav.students': 'បញ្ជីឈ្មោះសិស្ស',
    'nav.classes': 'គ្រប់គ្រងថ្នាក់រៀន',
    'nav.lessons': 'មេរៀនសិក្សា',
    'nav.assignments': 'កិច្ចការផ្ទះ & លំហាត់',
    'nav.assessment': 'កន្លែងចែកចាយលំហាត់រហ័ស',
    'nav.typing': 'ហ្វឹកហាត់វាយអក្សរ',
    'nav.resources': 'រូបមន្ត & ធនធានកុំព្យូទ័រ',
    'nav.submissions': 'កន្លែងផ្ញើកិច្ចការ & មេរៀន',
    'nav.lab': 'បន្ទប់កុំព្យូទ័រ (ឧបករណ៍)',
    'nav.calendar': 'កាលវិភាគសិក្សា',
    'nav.reports': 'របាយការណ៍ & ជូននាយក',
    'nav.ai_assistant': 'ជំនួយការ AI',
    'nav.progress': 'វឌ្ឍនភាពការរៀន',
    'nav.profile': 'គណនីផ្ទាល់ខ្លួន',
    'nav.settings': 'ការកំណត់ប្រព័ន្ធ',

    // Titles (Natural Khmer)
    'title.student_portal': 'ទំព័រសិក្សារបស់សិស្ស',
    'title.teacher_dashboard': 'ផ្ទាំងគ្រប់គ្រងថ្នាក់រៀនរបស់គ្រូ',
    'title.workspace': 'កន្លែងការងាររហ័សរបស់គ្រូ',
    'title.attendance': 'ស្រង់វត្តមានល្បឿនលឿន',
    'title.students': 'គ្រប់គ្រងព័ត៌មាន និងប្រវត្តិរូបសិស្ស',
    'title.classes': 'គ្រប់គ្រងថ្នាក់រៀន និងកាលវិភាគ',
    'title.lessons': 'មេរៀន និងឯកសារជំនួយស្មារតី',
    'title.assignments': 'កិច្ចការផ្ទះ និងការបញ្ជូនឯកសារ',
    'title.assessment': 'កន្លែងចែកចាយលំហាត់ & វាយតម្លៃរហ័ស',
    'title.typing': 'កន្លែងហ្វឹកហាត់វាយអក្សរកុំព្យូទ័រ',
    'title.resources': 'មជ្ឈមណ្ឌលរូបមន្ត & ធនធានកុំព្យូទ័រ',
    'title.submissions': 'កន្លែងផ្ញើកិច្ចការ & មេរៀន (Upload Work / Lessons)',
    'title.lab': 'បន្ទប់កុំព្យូទ័រ និងឧបករណ៍កំពុងភ្ជាប់',
    'title.calendar': 'កាលវិភាគថ្នាក់រៀន និងថ្ងៃប្រឡង',
    'title.reports': 'របាយការណ៍វត្តមានផ្លូវការ & លទ្ធផលសិក្សា',
    'title.ai_assistant': 'ជំនួយការ AI របស់គ្រូបង្រៀន',
    'title.progress': 'វឌ្ឍនភាពនៃការរៀនសូត្រផ្ទាល់ខ្លួន',
    'title.profile': 'ព័ត៌មានគណនីផ្ទាល់ខ្លួន',
    'title.settings': 'ការកំណត់ និងការគ្រប់គ្រងតួនាទី',

    // Common Actions (Natural Khmer)
    'action.save': 'រក្សាទុក',
    'action.cancel': 'បោះបង់',
    'action.delete': 'លុបចេញ',
    'action.edit': 'កែប្រែ',
    'action.close': 'បិទ',
    'action.submit': 'បញ្ជូនកិច្ចការ',
    'action.upload': 'បញ្ចូលឯកសារ',
    'action.download': 'ទាញយក',
    'action.review': 'ពិនិត្យមើល',
    'action.grade': 'ដាក់ពិន្ទុ',
    'action.search': 'ស្វែងរក...',
    'action.filter': 'តម្រៀប',
    'action.view_all': 'មើលទាំងអស់',
    'action.try_again': 'សាកល្បងម្តងទៀត',
    'action.open': 'បើកមើល',
    'action.save_attendance': 'រក្សាទុកវត្តមាន',
    'action.export_csv': 'ទាញយក CSV',

    // Attendance Statuses (Natural Khmer)
    'status.present': 'វត្តមាន (មក)',
    'status.absent': 'អវត្តមាន (ឈប់)',
    'status.late': 'មកយឺត',
    'status.permission': 'សុំច្បាប់',
    'status.sick': 'ឈឺ (សុំច្បាប់)',

    // Common States & Badges (Natural Khmer)
    'status.active': 'កំពុងដំណើរការ',
    'status.completed': 'បានបញ្ចប់',
    'status.pending': 'រង់ចាំពិនិត្យ',
    'status.passed': 'ជាប់ (Pass)',
    'status.failed': 'ធ្លាក់',
    'status.submitted': 'បានបញ្ជូន',
    'status.checked': 'បានកែរួច',
    'status.needs_correction': 'ត្រូវការកែតម្រូវឡើងវិញ',

    // Empty States (Natural Khmer)
    'empty.lessons_title': 'មិនទាន់មានមេរៀននៅឡើយទេ',
    'empty.lessons_desc': 'មេរៀននឹងបង្ហាញនៅទីនេះ នៅពេលលោកគ្រូអ្នកគ្រូបានបង្ហោះចូលក្នុងប្រព័ន្ធ។',
    'empty.assignments_teacher_title': 'មិនទាន់មានកិច្ចការនៅឡើយទេ',
    'empty.assignments_teacher_desc': 'បង្កើតកិច្ចការផ្ទះ ឬលំហាត់ដើម្បីដាក់ជូនសិស្សរបស់អ្នក។',
    'empty.assignments_student_title': 'មិនទាន់មានកិច្ចការដែលត្រូវធ្វើនៅឡើយទេ',
    'empty.assignments_student_desc': 'លោកគ្រូអ្នកគ្រូមិនទាន់បានដាក់កិច្ចការថ្មីនៅឡើយទេ។',
    'empty.devices_title': 'មិនទាន់មានឧបករណ៍កំពុងភ្ជាប់ទេ',
    'empty.devices_desc': 'ព័ត៌មានកុំព្យូទ័រ និងទូរស័ព្ទរបស់សិស្ស នឹងបង្ហាញនៅទីនេះពេលសិស្សបើកប្រើប្រាស់ប្រព័ន្ធ។',

    // Student Dashboard (Natural Khmer)
    'student.welcome': 'សូមស្វាគមន៍ការវិលត្រឡប់មកវិញ {name}!',
    'student.subtitle': 'ហ្វឹកហាត់វាយអក្សរឲ្យកាន់តែលឿន រៀនរូបមន្ត Excel និងផ្ញើឯកសារកិច្ចការផ្ទាល់ទៅកាន់លោកគ្រូ។',
    'student.practice_typing': 'ហ្វឹកហាត់វាយអក្សរ',
    'student.my_tasks': 'កិច្ចការ និងកាលបរិច្ឆេទសំខាន់ៗរបស់ខ្ញុំ',

    // Teacher Workspace (Natural Khmer)
    'teacher.quick_actions': 'សកម្មភាពបន្ទាន់ក្នុងថ្នាក់រៀន',
    'teacher.todays_work': 'ការងារ និងភារកិច្ចចម្បងថ្ងៃនេះ',
    'teacher.quick_search': 'ស្វែងរកឈ្មោះ ឬអត្តលេខសិស្សរហ័ស',
    'teacher.reminders': 'កំណត់ត្រា និងកិច្ចការរំលឹករបស់គ្រូ',

    // Typing Lab (Natural Khmer)
    'typing.title': 'កន្លែងហ្វឹកហាត់វាយអក្សរកុំព្យូទ័រ (Touch Typing)',
    'typing.speed': 'ល្បឿនវាយអក្សរ',
    'typing.accuracy': 'ភាពត្រឹមត្រូវ',
    'typing.time': 'ពេលវេលា',
    'typing.errors': 'តួអក្សរខុស',
    'typing.start_prompt': 'ចុចត្រង់នេះ ហើយចាប់ផ្តើមវាយអក្សរដើម្បីចាប់ផ្តើមការវាស់ស្ទង់...',
    'typing.test_complete': 'ការធ្វើតេស្តវាយអក្សរបានបញ្ចប់ដោយជោគជ័យ!',
    'typing.history': 'ប្រវត្តិ និងការរីកចម្រើននៃល្បឿនវាយអក្សររបស់ខ្ញុំ',

    // Language Toggle
    'lang.english': 'English',
    'lang.khmer': 'ភាសាខ្មែរ',
    'lang.switch': 'ប្តូរភាសា / Language'
  }
};
