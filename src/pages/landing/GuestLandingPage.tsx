import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { TEACHERS_DATA, TeacherProfile } from '../../services/teacherData';
import { TeacherDetailModal } from '../../components/teachers/TeacherDetailModal';
import { CIIS3DLaptopMascot } from '../../components/common/CIIS3DLaptopMascot';
import { useScrollObserver } from '../../hooks/useScrollObserver';
import {
  Globe,
  LogIn,
  UserPlus,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  ExternalLink,
  X,
  Menu
} from 'lucide-react';

interface GalleryModalItem {
  src: string;
  titleKh: string;
  titleEn: string;
  descKh: string;
  descEn: string;
  badgeKh: string;
  badgeEn: string;
  category: 'ceremony' | 'lab';
  classShiftKh?: string;
  classShiftEn?: string;
}

interface GuestLandingPageProps {
  onReturnToPortal?: () => void;
}

export const GuestLandingPage: React.FC<GuestLandingPageProps> = ({ onReturnToPortal }) => {
  const { currentUser, isAuthenticated, isTeacher, setShowAuthModal, setAuthModalRole } = useAuth();
  const { isKhmer, language, setLanguage } = useLanguage();
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryModalItem | null>(null);
  const [activeLabTab, setActiveLabTab] = useState<'all' | 'class-1' | 'class-2'>('all');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDeveloperExpanded, setIsDeveloperExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    program: 'computer-lab',
    message: ''
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name.trim() || !inquiryForm.phone.trim()) return;
    setIsSubmittingInquiry(true);
    setTimeout(() => {
      setIsSubmittingInquiry(false);
      setInquirySubmitted(true);
    }, 600);
  };

  // Initialize IntersectionObserver scroll reveal system
  useScrollObserver('.scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right', [language, activeLabTab]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max((window.scrollY / totalHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4 Academic Levels / Programs with Clean Symbol Markers
  const academicLevels = [
    {
      id: 'kindergarten',
      index: '01',
      roman: 'I',
      nameKh: 'ថ្នាក់មត្តេយ្យសិក្សា (កុមារតូច)',
      nameEn: 'Early Childhood & Kindergarten',
      tagKh: 'អាយុ ៣ ដល់ ៥ ឆ្នាំ',
      tagEn: 'Ages 3 - 5',
      descriptionKh: 'បណ្តុះបណ្តាលកុមារតូចឱ្យចេះភាសាខ្មែរ-អង់គ្លេស រៀនគូររូប ស្គាល់លេខ ចេះសីលធម៌ និងមានភាពក្លាហានក្នុងការប្រាស្រ័យទាក់ទង។',
      descriptionEn: 'Fostering foundational literacy, numeracy, creative expression, moral habits, and social confidence for young learners.',
      highlightsKh: ['មូលដ្ឋានគ្រឹះអក្សរ & លេខ', 'ភាសាខ្មែរ និងអង់គ្លេសកុមារ', 'សកម្មភាពអប់រំ និងសីលធម៌'],
      highlightsEn: ['Foundational Literacy & Numbers', 'Bilingual Khmer & English', 'Creative Educational Play']
    },
    {
      id: 'grade-1-to-12',
      index: '02',
      roman: 'II',
      nameKh: 'ចំណេះទូទៅ ថ្នាក់ទី១ ដល់ ទី១២',
      nameEn: 'General Education: Grades 1 to 12',
      tagKh: 'កម្មវិធីជាតិ MoEYS',
      tagEn: 'National Standard',
      descriptionKh: 'បង្រៀនតាមកម្មវិធីសិក្សាជាតិរបស់ក្រសួងអប់រំ យុវជន និងកីឡា ចាប់ពីកម្រិតបឋមសិក្សា អនុវិទ្យាល័យ រហូតដល់វិទ្យាល័យ និងការត្រៀមប្រឡងសញ្ញាបត្របាក់ឌុប (BacII)។',
      descriptionEn: 'Full national curriculum adhering to Ministry standards across Primary (Grades 1-6), Lower Secondary (Grades 7-9), and Upper Secondary (Grades 10-12 / National BacII Exam).',
      highlightsKh: ['បឋមសិក្សា (ថ្នាក់ទី១-៦)', 'អនុវិទ្យាល័យ (ថ្នាក់ទី៧-៩)', 'វិទ្យាល័យ & ត្រៀមបាក់ឌុប (ថ្នាក់ទី១០-១២)'],
      highlightsEn: ['Primary Level (Grades 1-6)', 'Lower Secondary (Grades 7-9)', 'High School & BacII (Grades 10-12)']
    },
    {
      id: 'secondary-computer',
      index: '03',
      roman: 'III',
      nameKh: 'ជំនាញកុំព្យូទ័រអនុវត្ត CIIS Lab 1',
      nameEn: 'Hands-On Computer & Digital Lab',
      tagKh: 'អនុវត្តលើម៉ាស៊ីនផ្ទាល់',
      tagEn: '100% Practical',
      descriptionKh: 'ការបណ្តុះបណ្តាលកុំព្យូទ័រលើម៉ាស៊ីនផ្ទាល់ក្នុងបន្ទប់ Lab 1 ដូចជា Touch Typing ខ្មែរ-អង់គ្លេស, Microsoft Office (Word, Excel, PowerPoint), ការរៀបចំឯកសារ និងជំនាញឌីជីថល។',
      descriptionEn: 'Direct hands-on workstation training in Computer Lab 1 covering 10-Finger Touch Typing, Microsoft Word, Excel, PowerPoint, and modern digital office skills.',
      highlightsKh: ['បន្ទប់កុំព្យូទ័រ ៤០+ គ្រឿងផ្ទាល់ខ្លួន', 'Touch Typing ខ្មែរ & អង់គ្លេស', 'Microsoft Word, Excel & PowerPoint'],
      highlightsEn: ['40+ Dedicated Workstations', 'Khmer & English Touch Typing', 'Microsoft Word, Excel & PowerPoint']
    },
    {
      id: 'ielts-english',
      index: '04',
      roman: 'IV',
      nameKh: 'ថ្នាក់ភាសាអង់គ្លេសទូទៅ & IELTS',
      nameEn: 'International English & IELTS Track',
      tagKh: 'ស្តង់ដារអន្តរជាតិ',
      tagEn: 'Global Standard',
      descriptionKh: 'បង្រៀនភាសាអង់គ្លេសគ្រប់កម្រិត ផ្តោតលើការស្តាប់ និយាយ អាន និងសរសេរ រួមទាំងការបំប៉នវេយ្យាករណ៍ និងការត្រៀមប្រឡងយកវិញ្ញាបនបត្រអន្តរជាតិ IELTS។',
      descriptionEn: 'Comprehensive English training covering Listening, Speaking, Reading, and Writing, including standard IELTS exam preparation.',
      highlightsKh: ['៤ ជំនាញ (ស្តាប់ និយាយ អាន សរសេរ)', 'គ្រូមានគរុកោសល្យ និងបទពិសោធន៍', 'ការត្រៀមប្រឡងវិញ្ញាបនបត្រ IELTS'],
      highlightsEn: ['4 Core Language Skills', 'Experienced Instructors', 'IELTS Readiness Track']
    }
  ];

  // 5 Authentic Ceremony / Event Photos
  const ceremonyEvents: GalleryModalItem[] = [
    {
      src: '/images/events/ceremony-graduation-award.jpg',
      badgeKh: 'ពិធីចែកវិញ្ញាបនបត្រ',
      badgeEn: 'GRADUATION CEREMONY',
      titleKh: 'ពិធីប្រគល់វិញ្ញាបនបត្រ និងប័ណ្ណសរសើរជូនសិស្សានុសិស្ស',
      titleEn: 'Certificate & Appreciation Award Distribution Ceremony',
      descKh: 'ទិដ្ឋភាពដ៏មានអត្ថន័យក្នុងពិធីចែកវិញ្ញាបនបត្របញ្ចប់ការសិក្សាថ្នាក់មត្តេយ្យ បឋមសិក្សា (ថ្នាក់ទី៦) និងសិស្សពូកែប្រចាំឆ្នាំ ដោយមានការចូលរួមពីគណៈគ្រប់គ្រងសាលា លោកគ្រូអ្នកគ្រូ និងមាតាបិតាសិស្ស។',
      descEn: 'Commemorating the graduation and outstanding achievement ceremony for kindergarten and primary students, joined by school directors, teachers, and proud parents.',
      category: 'ceremony'
    },
    {
      src: '/images/events/ceremony-speech-1.png',
      badgeKh: 'សុន្ទរកថាគណៈគ្រប់គ្រង',
      badgeEn: 'DIRECTOR KEYNOTE',
      titleKh: 'សុន្ទរកថាបើកកម្មវិធី និងការលើកទឹកចិត្តសិស្សានុសិស្ស',
      titleEn: 'Welcome Speech & Student Encouragement Address',
      descKh: 'លោកនាយកសាលាថ្លែងសុន្ទរកថាសំណេះសំណាល បង្ហាញពីការយកចិត្តទុកដាក់លើគុណភាពអប់រំ និងការបណ្តុះបណ្តាលសីលធម៌ ចំណេះដឹង និងបច្ចេកវិទ្យាដល់សិស្សគ្រប់រូប។',
      descEn: 'The school director delivering an address on educational excellence, moral development, and practical digital technology skills for every student.',
      category: 'ceremony'
    },
    {
      src: '/images/events/ceremony-dance-show.jpg',
      badgeKh: 'ការសម្តែងសិល្បៈសិស្ស',
      badgeEn: 'STUDENT PERFORMANCE',
      titleKh: 'របាំអបអរសាទរ និងការសម្តែងសិល្បៈរបស់ក្មួយៗសិស្សានុសិស្ស',
      titleEn: 'Cultural Dance Performance by Primary Students',
      descKh: 'ក្មួយៗសិស្សានុសិស្សកម្រិតបឋមសិក្សា សម្តែងរបាំស្វាគមន៍យ៉ាងរស់រវើកក្នុងសម្លៀកបំពាក់ពណ៌ក្រហមស បង្ហាញពីភាពក្លាហាន និងទេពកោសល្យសិល្បៈ។',
      descEn: 'Primary school students performing a lively celebration dance on stage, demonstrating their confidence, artistic talent, and cultural pride.',
      category: 'ceremony'
    },
    {
      src: '/images/events/ceremony-traditional-singing.jpg',
      badgeKh: 'និយាយជាសាធារណៈ & ចម្រៀង',
      badgeEn: 'PUBLIC SPEAKING & POETRY',
      titleKh: 'ការប្រកួតនិយាយជាសាធារណៈ សូត្រកំណាព្យ និងការច្រៀង',
      titleEn: 'Public Speaking, Poetry Recitation & Vocal Performance',
      descKh: 'សិស្សជ័យលាភីឡើងសម្តែងក្នុងសម្លៀកបំពាក់ប្រពៃណីខ្មែរ បង្ហាញសមត្ថភាពផ្នែកនិយាយជាសាធារណៈ ការអាន និងការសូត្រកំណាព្យយ៉ាងស្ទាត់ជំនាញ។',
      descEn: 'Outstanding students in traditional Khmer attire showcasing their eloquence in public speaking, poetry recitation, and vocal performances.',
      category: 'ceremony'
    },
    {
      src: '/images/events/ceremony-speech-2.png',
      badgeKh: 'ប្រសាសន៍ណែនាំ',
      badgeEn: 'LEADERSHIP REMARKS',
      titleKh: 'ប្រសាសន៍ណែនាំ និងថ្លែងអំណរគុណដល់មាតាបិតាអាណាព្យាបាល',
      titleEn: 'Parent-School Partnership Address',
      descKh: 'ថ្នាក់ដឹកនាំសាលាថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅដល់មាតាបិតាដែលតែងតែទុកចិត្ត និងសហការជាមួយសាលា ក្នុងការអប់រំកូនៗឱ្យក្លាយជាទំពាំងស្នងឫស្សីដ៏ល្អ។',
      descEn: 'School leadership extending gratitude to parents for their enduring trust and partnership in nurturing the next generation of bright young leaders.',
      category: 'ceremony'
    }
  ];

  // Authentic Class 1 Student Activities in Computer Lab 1 (Evening 1: 5:30 - 6:30 PM)
  const lab1Activities: GalleryModalItem[] = [
    {
      src: '/images/activities/class-1/activity-1.jpg',
      badgeKh: 'កុំព្យូទ័រលេខ ១៩ & ២០',
      badgeEn: 'STATION 19 & 20',
      titleKh: 'ការរៀនវាយឯកសារ Word និងគណនាតារាង Excel ជាក់ស្តែង',
      titleEn: 'Hands-On Microsoft Word & Excel Spreadsheets Practice',
      descKh: 'សិស្សានុសិស្សកំពុងផ្ចិតផ្ចង់អនុវត្តលំហាត់រៀបចំឯកសារ និងតារាងគណនាលើកុំព្យូទ័រយួរដៃ Dell ដែលបំពាក់ស្លាកសញ្ញាសាលា CIIS ផ្លូវការ។',
      descEn: 'Students attentively typing and formatting spreadsheets on dedicated Dell laptop workstations with official CIIS school badges.',
      category: 'lab',
      classShiftKh: 'វេនទី១ (៥:៣០-៦:៣០)',
      classShiftEn: 'Shift 1 (5:30-6:30 PM)'
    },
    {
      src: '/images/activities/class-1/activity-2.jpg',
      badgeKh: 'កុំព្យូទ័រលេខ ០២',
      badgeEn: 'STATION 02',
      titleKh: 'ការហ្វឹកហាត់ដាក់ម្រាមដៃវាយអក្សរ Touch Typing ឱ្យលឿន',
      titleEn: '10-Finger Touch Typing Drills & Speed Benchmark',
      descKh: 'សិស្សានុសិស្សក្នុងឯកសណ្ឋាន CIIS កំពុងហ្វឹកហាត់ដាក់ម្រាមដៃលើក្តារចុច និងអនុវត្តតាមសៀវភៅមេរៀនកុំព្យូទ័រមួយជំហានម្តងៗ។',
      descEn: 'Young learners practicing 10-finger typing placement alongside hands-on computer workbooks for accuracy and speed.',
      category: 'lab',
      classShiftKh: 'វេនទី១ (៥:៣០-៦:៣០)',
      classShiftEn: 'Shift 1 (5:30-6:30 PM)'
    },
    {
      src: '/images/activities/class-1/activity-3.jpg',
      badgeKh: 'កុំព្យូទ័រលេខ ០៨',
      badgeEn: 'STATION 08',
      titleKh: 'ការរៀនជាក្រុម ពិភាក្សាលំហាត់ និងជួយគ្នាទៅវិញទៅមក',
      titleEn: 'Collaborative Practice & Peer Learning in Lab 1',
      descKh: 'សិស្សានុសិស្សអនុវត្តលំហាត់រួមគ្នា រៀនដោះស្រាយបញ្ហាបច្ចេកទេស និងជួយប្រាប់គ្នាពេលជួបកន្លែងពិបាកក្នុងកម្មវិធី Office។',
      descEn: 'Students working collaboratively, sharing solutions, and helping each other navigate complex software exercises.',
      category: 'lab',
      classShiftKh: 'វេនទី១ (៥:៣០-៦:៣០)',
      classShiftEn: 'Shift 1 (5:30-6:30 PM)'
    },
    {
      src: '/images/activities/class-1/activity-4.jpg',
      badgeKh: 'កុំព្យូទ័រលេខ ១៨',
      badgeEn: 'STATION 18',
      titleKh: 'ការផ្តោតអារម្មណ៍អនុវត្តឯករាជ្យ និងត្រៀមប្រឡងកុំព្យូទ័រ',
      titleEn: 'Independent Focus & Practical Exam Readiness',
      descKh: 'សិស្សរៀនអនុវត្តលំហាត់ជាក់ស្តែងដោយខ្លួនឯង បង្កើនទំនុកចិត្ត និងត្រៀមខ្លួនសម្រាប់ការប្រឡងអនុវត្តកុំព្យូទ័រប្រចាំវគ្គ។',
      descEn: 'Focused independent project work, building real confidence and preparing thoroughly for term practical examinations.',
      category: 'lab',
      classShiftKh: 'វេនទី១ (៥:៣០-៦:៣០)',
      classShiftEn: 'Shift 1 (5:30-6:30 PM)'
    }
  ];

  // Authentic Class 2 Student Activities in Computer Lab 1 (Evening 2: 6:40 - 7:40 PM)
  const lab2Activities: GalleryModalItem[] = [
    {
      src: '/images/activities/class-2/activity-1.jpg',
      badgeKh: 'ទិដ្ឋភាពទូទៅ Lab 1',
      badgeEn: 'FULL LAB OVERVIEW',
      titleKh: 'ទិដ្ឋភាពរួមនៃថ្នាក់រៀនកុំព្យូទ័រ Lab 1 វេនល្ងាចទី២ (៦:៤០-៧:៤០)',
      titleEn: 'Evening Shift 2 Classroom Overview in CIIS Lab 1',
      descKh: 'បរិយាកាសសិក្សាជាក់ស្តែងក្នុងបន្ទប់ Lab 1 វេនទី២ (៦:៤០-៧:៤០) សិស្សានុសិស្សពេញបន្ទប់កំពុងផ្ចិតផ្ចង់រៀនលើកុំព្យូទ័រយួរដៃ ដោយមានលោកគ្រូណែនាំផ្ទាល់ពីមុខថ្នាក់។',
      descEn: 'Authentic classroom atmosphere in Lab 1 during Evening Shift 2 (6:40-7:40 PM) with 100% individual workstation engagement and teacher guidance.',
      category: 'lab',
      classShiftKh: 'វេនទី២ (៦:៤០-៧:៤០)',
      classShiftEn: 'Shift 2 (6:40-7:40 PM)'
    },
    {
      src: '/images/activities/class-2/activity-2.jpg',
      badgeKh: 'គ្រូណែនាំផ្ទាល់',
      badgeEn: '1-ON-1 INSTRUCTOR HELP',
      titleKh: 'លោកគ្រូណែនាំការអនុវត្តលំហាត់ផ្ទាល់ និងពន្យល់មួយជំហានម្តងៗ',
      titleEn: 'Attentive Instructor Guidance & Step-by-Step Mentoring',
      descKh: 'លោកគ្រូពន្យល់លំហាត់ និងកែតម្រូវបច្ចេកទេសការងារលើកុំព្យូទ័រជូនសិស្សានុសិស្សយ៉ាងយកចិត្តទុកដាក់ ធានាថាសិស្សគ្រប់រូបយល់ច្បាស់និងអនុវត្តបានត្រឹមត្រូវ។',
      descEn: 'Teacher providing personalized coaching, reviewing exercises, and answering student questions directly at workstations in Lab 1.',
      category: 'lab',
      classShiftKh: 'វេនទី២ (៦:៤០-៧:៤០)',
      classShiftEn: 'Shift 2 (6:40-7:40 PM)'
    },
    {
      src: '/images/activities/class-2/activity-3.jpg',
      badgeKh: 'កុំព្យូទ័រលេខ ១៣ & ២៥',
      badgeEn: 'STATION 13 & 25',
      titleKh: 'ការរៀនកម្មវិធី Microsoft PowerPoint & វាយអក្សរតាមសៀវភៅគោល',
      titleEn: 'Microsoft PowerPoint Presentation & Curriculum Workbook Drills',
      descKh: 'សិស្សានុសិស្សអនុវត្តបង្កើតស្លាយ Presentation ក្នុងកម្មវិធី PowerPoint និងអនុវត្តវាយអក្សរយ៉ាងរហ័សតាមសៀវភៅមេរៀនកុំព្យូទ័ររបស់សាលា CIIS។',
      descEn: 'Students designing presentation slides in PowerPoint alongside typing drills following official CIIS computer curriculum textbooks.',
      category: 'lab',
      classShiftKh: 'វេនទី២ (៦:៤០-៧:៤០)',
      classShiftEn: 'Shift 2 (6:40-7:40 PM)'
    },
    {
      src: '/images/activities/class-2/activity-4.jpg',
      badgeKh: 'កុំព្យូទ័រលេខ ០៧',
      badgeEn: 'STATION 07',
      titleKh: 'ការអានឯកសារមេរៀន ស្រាវជ្រាវ និងអនុវត្តលើម៉ាស៊ីនផ្ទាល់',
      titleEn: 'Textbook Study, Document Formatting & Workstation Practice',
      descKh: 'សិស្សផ្ចិតផ្ចង់អានឯកសារមេរៀន និងអនុវត្តរៀបចំឯកសារលើកុំព្យូទ័រយួរដៃលេខ ០៧ ដោយមានការផ្តោតអារម្មណ៍ខ្ពស់។',
      descEn: 'Focused independent document creation, cross-referencing textbook instructions directly on laptop workstation 07.',
      category: 'lab',
      classShiftKh: 'វេនទី២ (៦:៤០-៧:៤០)',
      classShiftEn: 'Shift 2 (6:40-7:40 PM)'
    },
    {
      src: '/images/activities/class-2/activity-5.jpg',
      badgeKh: 'កុំព្យូទ័រលេខ ០៦, ១២, ១៤',
      badgeEn: 'STATION 06, 12, 14',
      titleKh: 'ការហ្វឹកហាត់វាយអក្សរ Touch Typing និងលំហាត់ការិយាល័យ Office',
      titleEn: 'Multi-Station Touch Typing Benchmark & Office Suite Tasks',
      descKh: 'សិស្សានុសិស្សលើកុំព្យូទ័រលេខ ១២, ១៤ និង ០៦ កំពុងអនុវត្តតេស្តល្បឿនវាយអក្សរ និងរៀបចំកិច្ចការការិយាល័យជាក់ស្តែង។',
      descEn: 'Active speed typing drills and practical office suite tasks across multiple dedicated laptop stations in Lab 1.',
      category: 'lab',
      classShiftKh: 'វេនទី២ (៦:៤០-៧:៤០)',
      classShiftEn: 'Shift 2 (6:40-7:40 PM)'
    }
  ];

  const displayedLabActivities =
    activeLabTab === 'class-1'
      ? lab1Activities
      : activeLabTab === 'class-2'
        ? lab2Activities
        : [
          lab2Activities[0],
          lab1Activities[0],
          lab2Activities[1],
          lab2Activities[2],
          lab1Activities[1],
          lab2Activities[3],
          lab2Activities[4],
          lab1Activities[2],
          lab1Activities[3],
        ];

  // 3 Computer Lab Shifts
  const labShifts = [
    {
      id: 'shift-1',
      code: 'EV-01',
      index: '01',
      nameKh: 'ថ្នាក់កុំព្យូទ័រវេនល្ងាច ទី១',
      nameEn: 'Evening Computer Shift 1',
      teacherKh: 'លោកគ្រូ នុន លាងឌី & ជឿន តេជៈ',
      teacherEn: 'Nun Langdy (Lead) & Choeurn Tekchas (Asst)',
      timeKh: '៥:៣០ - ៦:៣០ ល្ងាច (ចន្ទ - សុក្រ)',
      timeEn: '5:30 PM - 6:30 PM (Mon - Fri)',
      roomKh: 'CIIS Computer Lab 1 (៤០+ គ្រឿង)',
      roomEn: 'CIIS Computer Lab 1 (40+ Stations)',
      subjectsKh: ['Touch Typing ខ្មែរ & អង់គ្លេស', 'Microsoft Word រៀបចំឯកសារ', 'Microsoft Excel មូលដ្ឋាន', 'ការប្រើប្រាស់កុំព្យូទ័រទូទៅ'],
      subjectsEn: ['Touch Typing Drills', 'Microsoft Word Documents', 'Microsoft Excel Basics', 'General Computer Architecture'],
      statusKh: 'កំពុងបើកទទួលសិស្ស',
      statusEn: 'Open for Enrollment'
    },
    {
      id: 'shift-2',
      code: 'EV-02',
      index: '02',
      nameKh: 'ថ្នាក់កុំព្យូទ័រវេនល្ងាច ទី២',
      nameEn: 'Evening Computer Shift 2',
      teacherKh: 'លោកគ្រូ នុន លាងឌី & ជឿន តេជៈ',
      teacherEn: 'Nun Langdy (Lead) & Choeurn Tekchas (Asst)',
      timeKh: '៦:៤០ - ៧:៤០ ល្ងាច (ចន្ទ - សុក្រ)',
      timeEn: '6:40 PM - 7:40 PM (Mon - Fri)',
      roomKh: 'CIIS Computer Lab 1 (៤០+ គ្រឿង)',
      roomEn: 'CIIS Computer Lab 1 (40+ Stations)',
      subjectsKh: ['រូបមន្ត Excel កម្រិតខ្ពស់', 'ការងាររដ្ឋបាលការិយាល័យ', 'តេស្តល្បឿនវាយអក្សរ WPM', 'ការអនុវត្តលំហាត់ជាក់ស្តែង'],
      subjectsEn: ['Advanced Excel Formulas', 'Office Administration', 'Typing Velocity Tests', 'Practical Exam Practice'],
      statusKh: 'វេនពេញនិយម',
      statusEn: 'Popular Shift'
    },
    {
      id: 'shift-3',
      code: 'MO-01',
      index: '03',
      nameKh: 'ថ្នាក់កុំព្យូទ័រថ្ងៃចន្ទ ព្រឹក',
      nameEn: 'Monday Morning Intensive Shift',
      teacherKh: 'លោកគ្រូ តេន ចាន់ដារា & ជឿន តេជៈ',
      teacherEn: 'Ten Chandara (Lead) & Choeurn Tekchas (Asst)',
      timeKh: '៧:៣០ - ១១:០០ ព្រឹក (រៀងរាល់ថ្ងៃចន្ទ)',
      timeEn: '7:30 AM - 11:00 AM (Monday Only)',
      roomKh: 'CIIS Computer Lab 1 (៤០+ គ្រឿង)',
      roomEn: 'CIIS Computer Lab 1 (40+ Stations)',
      subjectsKh: ['ប្រព័ន្ធកុំព្យូទ័រ & Windows', 'កិច្ចការការិយាល័យ Office', 'តារាងគណនា Excel', 'ប្រឡងអនុវត្តចុងវគ្គ'],
      subjectsEn: ['Computer Architecture', 'Office Productivity', 'Spreadsheet Analytics', 'Comprehensive Exam'],
      statusKh: 'ថ្នាក់ពិសេសថ្ងៃចន្ទ',
      statusEn: 'Special Monday Block'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-zinc-900 antialiased font-sans relative selection:bg-rose-900 selection:text-white">

      {/* Top Precision Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[60] bg-zinc-200/60 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-rose-950 via-rose-800 to-pink-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP UTILITY STRIP (High-End Monospaced Academic Bar)                   */}
      {/* ========================================================================= */}
      <div className="bg-zinc-950 text-zinc-300 text-[11px] border-b border-zinc-800 px-4 sm:px-8 py-2 flex items-center justify-between z-50 relative font-mono">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-rose-400 font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>[ CIIS • ACADEMIC PORTAL ]</span>
          </span>
          <span className="text-zinc-700 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline text-[10.5px]">
            {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស • ខេត្តកំពង់ឆ្នាំង' : 'CAMBODIAN-ISLAMIC INTERNATIONAL SCHOOL • KAMPONG CHHNANG'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            className="hover:text-white text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px]"
          >
            <Globe className="w-3 h-3 text-rose-400" />
            <span>{language === 'km' ? 'English [ EN ]' : 'ភាសាខ្មែរ [ KM ]'}</span>
          </button>
          <span className="text-zinc-800">|</span>
          <button
            type="button"
            onClick={() => {
              setAuthModalRole('student');
              setShowAuthModal(true);
            }}
            className="text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
          >
            <LogIn className="w-3 h-3 text-rose-400" />
            <span>{isKhmer ? 'គណនីសិស្ស' : 'Student'}</span>
          </button>
          <span className="text-zinc-800">|</span>
          <button
            type="button"
            onClick={() => {
              setAuthModalRole('teacher');
              setShowAuthModal(true);
            }}
            className="text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
          >
            <span>{isKhmer ? 'គណនីគ្រូ' : 'Faculty'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN HEADER NAVIGATION                                                 */}
      {/* ========================================================================= */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${
          isScrolled ? 'border-zinc-300 shadow-sm py-2.5' : 'border-zinc-200 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-rose-50 p-1.5 flex items-center justify-center border border-rose-200/80 shrink-0 shadow-2xs">
              <img src="/ciis-logo.svg" alt="CIIS Logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-base font-black text-zinc-950 leading-tight truncate tracking-tight font-mono">
                {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស' : 'CIIS INTERNATIONAL SCHOOL'}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-rose-900 font-bold truncate font-mono">
                {isKhmer ? 'បន្ទប់កុំព្យូទ័រ Lab 1 • ៤០+ គ្រឿងផ្ទាល់ខ្លួន' : 'Computer Lab 1 Portal • 40+ Workstations'}
              </p>
            </div>
          </div>

          {/* Quick Anchor Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-bold text-zinc-600">
            <a href="#about" className="hover:text-rose-900 transition-colors">
              [ 01 // {isKhmer ? 'អំពីសាលា' : 'About'} ]
            </a>
            <a href="#programs" className="hover:text-rose-900 transition-colors">
              [ 02 // {isKhmer ? 'កម្មវិធីសិក្សា' : 'Programs'} ]
            </a>
            <a href="#lab" className="hover:text-rose-900 transition-colors">
              [ 03 // {isKhmer ? 'បន្ទប់កុំព្យូទ័រ' : 'Lab 1'} ]
            </a>
            <a href="#events" className="hover:text-rose-900 transition-colors">
              [ 04 // {isKhmer ? 'សកម្មភាពសាលា' : 'Events'} ]
            </a>
            <a href="#faculty" className="hover:text-rose-900 transition-colors">
              [ 05 // {isKhmer ? 'លោកគ្រូអ្នកគ្រូ' : 'Faculty'} ]
            </a>
            <a href="#contact" className="hover:text-rose-900 transition-colors">
              [ 06 // {isKhmer ? 'ទំនាក់ទំនង' : 'Contact'} ]
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated && currentUser.id !== 'guest' && onReturnToPortal ? (
              <button
                type="button"
                onClick={onReturnToPortal}
                className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span>{isTeacher ? (isKhmer ? 'ផ្ទាំងគ្រូ' : 'Faculty Portal') : (isKhmer ? 'ផ្ទាំងសិស្ស' : 'Student Portal')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthModalRole('student');
                  setShowAuthModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-white text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'ចុះឈ្មោះ / ចូល' : 'Enroll / Sign In'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl lg:hidden transition-colors cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-5 font-mono">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 p-1 flex items-center justify-center border border-rose-200">
                    <img src="/ciis-logo.svg" alt="CIIS" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-zinc-950">CIIS SCHOOL</h3>
                    <p className="text-[10px] text-rose-900 font-bold">[ PORTAL ]</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 text-xs font-bold text-zinc-700">
                {[
                  { href: '#about', label: isKhmer ? '[ 01 ] អំពីសាលា' : '[ 01 ] About CIIS' },
                  { href: '#programs', label: isKhmer ? '[ 02 ] កម្មវិធីសិក្សា' : '[ 02 ] Programs' },
                  { href: '#lab', label: isKhmer ? '[ 03 ] បន្ទប់កុំព្យូទ័រ' : '[ 03 ] Computer Lab' },
                  { href: '#events', label: isKhmer ? '[ 04 ] សកម្មភាពសាលា' : '[ 04 ] Events & Awards' },
                  { href: '#faculty', label: isKhmer ? '[ 05 ] លោកគ្រូអ្នកគ្រូ' : '[ 05 ] Faculty' },
                  { href: '#contact', label: isKhmer ? '[ 06 ] ទំនាក់ទំនង' : '[ 06 ] Contact' }
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-zinc-100 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs">
              <button
                type="button"
                onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-100 font-bold text-zinc-800 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-rose-700" />
                  <span>{isKhmer ? 'ភាសា' : 'Language'}</span>
                </div>
                <span className="text-rose-900 font-bold">{language === 'km' ? 'English' : 'ភាសាខ្មែរ'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. HERO & 3D WORKSTATION SHOWCASE                                         */}
      {/* ========================================================================= */}
      <section id="about" className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-22 border-b border-zinc-200 bg-white">
        {/* Subtle Background Gradient Accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-50/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-pink-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 text-left">
          
          {/* Institutional Badge */}
          <div className="scroll-reveal flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-3.5 py-1.5 rounded-full bg-zinc-950 text-white font-bold shadow-2xs">
              [ CIIS INSTITUTIONAL PORTAL ]
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-950 border border-rose-200 font-bold shadow-2xs">
              [ LAB 1 • 40+ STATIONS ]
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Narrative Column */}
            <div className="scroll-reveal-left lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-zinc-950 tracking-tight leading-[1.18] font-khmer-title">
                {isKhmer ? (
                  <>
                    ផ្ដោតលើការរៀន និងអនុវត្តផ្ទាល់ <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-950 via-rose-800 to-pink-700">
                      ជាក់ស្តែងលើជំនាញកុំព្យូទ័រ
                    </span>
                  </>
                ) : (
                  <>
                    Practical Learning & <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-950 via-rose-800 to-pink-700">
                      Dedicated Workstation Mastery
                    </span>
                  </>
                )}
              </h2>

              {/* Informative Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-zinc-50 border border-zinc-200/90 space-y-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 font-mono text-xs">
                  <span className="font-bold text-zinc-900 uppercase">
                    [ :: ] {isKhmer ? 'សេចក្តីបញ្ជាក់សម្រាប់សិស្ស & អាណាព្យាបាល' : 'STUDENT & PARENT NOTICE'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    ● ACTIVE
                  </span>
                </div>

                <p className="text-sm sm:text-[15px] text-zinc-700 leading-relaxed font-normal">
                  {isKhmer
                    ? 'គេហទំព័រនេះបង្កើតឡើងសម្រាប់ថ្នាក់រៀនកុំព្យូទ័រ CIIS Computer Lab 1 ដោយផ្ទាល់។ សិស្សានុសិស្សអាចចូលរៀន វាយអត្ថបទ Touch Typing និងអនុវត្តកម្មវិធី Microsoft Office (Word, Excel, PowerPoint) ជាក់ស្តែងលើកុំព្យូទ័រ ៤០+ គ្រឿងផ្ទាល់ខ្លួន ជាមួយលោកគ្រូអ្នកគ្រូនាំផ្លូវមួយជំហានម្តងៗ។'
                    : 'This portal is dedicated to CIIS Computer Lab 1 workstation classes. Students practice 10-finger Touch Typing, Microsoft Word, Excel, and PowerPoint on 40+ dedicated laptop workstations with direct instructor guidance.'}
                </p>

                {/* 4 Clean Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-800">
                    <span className="text-rose-900 font-bold block">[ 01 ]</span>
                    <span className="font-bold">{isKhmer ? '៤០+ គ្រឿង' : '40+ Stations'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-800">
                    <span className="text-rose-900 font-bold block">[ 02 ]</span>
                    <span className="font-bold">Touch Typing</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-800">
                    <span className="text-rose-900 font-bold block">[ 03 ]</span>
                    <span className="font-bold">Word & Excel</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-800">
                    <span className="text-rose-900 font-bold block">[ 04 ]</span>
                    <span className="font-bold">{isKhmer ? '១:១ គ្រូណែនាំ' : '1:1 Mentoring'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalRole('student');
                    setShowAuthModal(true);
                  }}
                  className="py-3.5 px-6 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-mono font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <UserPlus className="w-4 h-4 text-rose-300" />
                  <span>{isKhmer ? 'ចុះឈ្មោះចូលរៀនថ្នាក់កុំព្យូទ័រ' : 'Register for Computer Classes'}</span>
                  <ArrowRight className="w-4 h-4 text-rose-300" />
                </button>

                <a
                  href="#events"
                  className="py-3.5 px-6 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-900 font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-zinc-200 shadow-2xs transition-all cursor-pointer"
                >
                  <span>{isKhmer ? 'មើលរូបភាពសកម្មភាព & សញ្ញាបត្រ' : 'View Ceremony & Events'}</span>
                  <span className="text-rose-900">→</span>
                </a>
              </div>
            </div>

            {/* Right Column: 3D Interactive Mascot Component */}
            <div className="scroll-reveal-right delay-150 lg:col-span-5 flex items-center justify-center relative">
              <CIIS3DLaptopMascot />
            </div>

          </div>

          {/* 4 Core Facts Ledger */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-zinc-200 font-mono">
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
              <span className="text-[11px] text-rose-900 font-bold uppercase block">[ 01 // STATIONS ]</span>
              <p className="text-2xl sm:text-3xl font-black text-zinc-950">40+ គ្រឿង</p>
              <p className="text-xs text-zinc-600 font-sans">{isKhmer ? 'កុំព្យូទ័រផ្ទាល់ខ្លួន ១ នាក់ ១' : '1:1 Dedicated Workstation'}</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
              <span className="text-[11px] text-rose-900 font-bold uppercase block">[ 02 // SHIFTS ]</span>
              <p className="text-2xl sm:text-3xl font-black text-zinc-950">3 វេន</p>
              <p className="text-xs text-zinc-600 font-sans">{isKhmer ? 'វេនល្ងាច ១ & ២, ចន្ទព្រឹក' : 'Evening 1, 2 & Monday AM'}</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
              <span className="text-[11px] text-rose-900 font-bold uppercase block">[ 03 // PRACTICE ]</span>
              <p className="text-2xl sm:text-3xl font-black text-zinc-950">100%</p>
              <p className="text-xs text-zinc-600 font-sans">{isKhmer ? 'អនុវត្តផ្ទាល់លើម៉ាស៊ីន' : 'Hands-on Software Drills'}</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
              <span className="text-[11px] text-rose-900 font-bold uppercase block">[ 04 // MoEYS ]</span>
              <p className="text-2xl sm:text-3xl font-black text-zinc-950">K — 12</p>
              <p className="text-xs text-zinc-600 font-sans">{isKhmer ? 'កម្មវិធីជាតិ & បាក់ឌុប' : 'National Standard BacII'}</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ACADEMIC PROGRAMS SECTION (4 LEVELS)                                   */}
      {/* ========================================================================= */}
      <section id="programs" className="py-16 sm:py-22 border-b border-zinc-200 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          
          <div className="scroll-reveal space-y-2 max-w-xl">
            <div className="text-xs font-mono text-rose-900 font-bold uppercase tracking-wider">
              [ ACADEMIC TRACKS ]
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
              {isKhmer ? 'កម្មវិធីសិក្សាទាំង ៤ កម្រិត' : 'The Four Core Academic Levels'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              {isKhmer
                ? 'សាលារៀន CIIS ផ្តល់ការអប់រំគ្រប់ជ្រុងជ្រោយ ចាប់ពីកុមារតូច បឋមសិក្សា វិទ្យាល័យ ដល់ជំនាញកុំព្យូទ័រជាក់ស្តែង និងភាសាអង់គ្លេស IELTS។'
                : 'Delivering structured pathways from early childhood foundation to national K-12 standards, digital computer workstations, and international IELTS readiness.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {academicLevels.map((lvl) => (
              <div
                key={lvl.id}
                className="scroll-reveal-scale p-6 rounded-3xl bg-white border border-zinc-200 shadow-2xs hover:shadow-xl hover:border-rose-900/30 transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between font-mono">
                    <span className="w-8 h-8 rounded-xl bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                      {lvl.index}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-950 font-bold border border-rose-200">
                      {isKhmer ? lvl.tagKh : lvl.tagEn}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-zinc-950 leading-snug font-khmer-title">
                    {isKhmer ? lvl.nameKh : lvl.nameEn}
                  </h4>

                  <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                    {isKhmer ? lvl.descriptionKh : lvl.descriptionEn}
                  </p>

                  <div className="pt-3 border-t border-zinc-100 space-y-1.5 font-mono text-xs">
                    {(isKhmer ? lvl.highlightsKh : lvl.highlightsEn).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-zinc-600">
                        <span className="text-rose-900 font-bold">—</span>
                        <span className="font-sans text-zinc-700">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAuthModalRole('student');
                    setShowAuthModal(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-2xl text-xs font-mono font-bold bg-zinc-50 hover:bg-zinc-950 hover:text-white text-zinc-800 border border-zinc-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{isKhmer ? 'ចុះឈ្មោះកម្រិតនេះ' : 'Enroll Track'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. COMPUTER LAB 1 STUDENT ACTIVITIES & WORKSTATIONS                       */}
      {/* ========================================================================= */}
      <section id="lab" className="py-16 sm:py-22 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-rose-900 font-bold uppercase tracking-wider">
                [ COMPUTER LAB 1 // 40+ WORKSTATIONS ]
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
                {isKhmer ? 'សកម្មភាពសិស្ស & ថ្នាក់កុំព្យូទ័រ Lab 1' : 'Computer Lab 1 Workstations & Activities'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed font-normal">
              {isKhmer
                ? 'រូបភាពសកម្មភាពជាក់ស្តែងក្នុងបន្ទប់ Lab 1 វេនទី១ (៥:៣០-៦:៣០) និងវេនទី២ (៦:៤០-៧:៤០) សិស្សានុសិស្សម្នាក់ៗមានកុំព្យូទ័រយួរដៃ Dell & Acer ប្រើប្រាស់ផ្ទាល់ខ្លួន។'
                : 'Real photos from Evening Shift 1 and Shift 2. Every student works on a dedicated workstation with personalized 1-on-1 coaching.'}
            </p>
          </div>

          {/* Shift Filter Switcher Tabs */}
          <div className="scroll-reveal flex items-center gap-2 flex-wrap font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveLabTab('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeLabTab === 'all'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
            >
              [ {isKhmer ? 'ទាំងអស់' : 'ALL PHOTOS'} // {lab1Activities.length + lab2Activities.length} ]
            </button>
            <button
              type="button"
              onClick={() => setActiveLabTab('class-1')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeLabTab === 'class-1'
                  ? 'bg-rose-950 text-white shadow-xs'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-200'
              }`}
            >
              [ {isKhmer ? 'វេនទី១ (៥:៣០-៦:៣០)' : 'SHIFT 1'} // {lab1Activities.length} ]
            </button>
            <button
              type="button"
              onClick={() => setActiveLabTab('class-2')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeLabTab === 'class-2'
                  ? 'bg-rose-950 text-white shadow-xs'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-200'
              }`}
            >
              [ {isKhmer ? 'វេនទី២ (៦:៤០-៧:៤០)' : 'SHIFT 2'} // {lab2Activities.length} ]
            </button>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedLabActivities.map((act, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedGalleryItem(act)}
                className="scroll-reveal-scale group relative rounded-3xl overflow-hidden border border-zinc-200 bg-zinc-950 shadow-2xs hover:shadow-xl hover:border-rose-900/40 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[300px]"
              >
                <img
                  src={act.src}
                  alt={act.titleEn}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent group-hover:via-zinc-950/50 transition-all" />

                <div className="relative z-10 p-4 flex items-center justify-between gap-2 font-mono text-[10.5px]">
                  <span className="px-2.5 py-1 rounded-full bg-rose-950/90 text-white font-bold border border-rose-500/30">
                    [ {isKhmer ? act.badgeKh : act.badgeEn} ]
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/70 text-zinc-300 font-bold border border-white/10">
                    {isKhmer ? (act.classShiftKh || 'វេនល្ងាច') : (act.classShiftEn || 'Shift')}
                  </span>
                </div>

                <div className="relative z-10 p-5 space-y-1.5 text-white">
                  <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-rose-200 transition-colors font-khmer-title">
                    {isKhmer ? act.titleKh : act.titleEn}
                  </h4>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-normal">
                    {isKhmer ? act.descKh : act.descEn}
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-rose-300 font-bold flex items-center gap-1">
                    <span>{isKhmer ? 'ចុចដើម្បីមើលរូបភាពធំ' : 'View Full Image'}</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CEREMONY & GRADUATION AWARDS GALLERY                                   */}
      {/* ========================================================================= */}
      <section id="events" className="py-16 sm:py-22 border-b border-zinc-200 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-rose-900 font-bold uppercase tracking-wider">
                [ CAMPUS LIFE & CEREMONIES ]
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
                {isKhmer ? 'ពិធីប្រគល់វិញ្ញាបនបត្រ & សកម្មភាពសាលា' : 'Ceremonies, Awards & Campus Life'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed font-normal">
              {isKhmer
                ? 'ទិដ្ឋភាពជាក់ស្តែងនៃពិធីចែកវិញ្ញាបនបត្របញ្ចប់ការសិក្សា ការសម្តែងសិល្បៈសិស្ស និងសុន្ទរកថារបស់គណៈគ្រប់គ្រងសាលា។'
                : 'Commemorating graduation ceremonies, academic awards, cultural dance performances, and leadership keynote addresses.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ceremonyEvents.map((evt, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedGalleryItem(evt)}
                className="scroll-reveal-scale group relative rounded-3xl overflow-hidden border border-zinc-200 bg-zinc-950 shadow-2xs hover:shadow-xl hover:border-rose-900/40 transition-all duration-300 cursor-pointer flex flex-col justify-end min-h-[300px]"
              >
                <img
                  src={evt.src}
                  alt={evt.titleEn}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent group-hover:via-zinc-950/50 transition-all" />

                <div className="absolute top-4 left-4 z-10 font-mono text-[10.5px]">
                  <span className="px-2.5 py-1 rounded-full bg-rose-950/90 text-white font-bold border border-rose-500/30">
                    [ {isKhmer ? evt.badgeKh : evt.badgeEn} ]
                  </span>
                </div>

                <div className="relative z-10 p-5 space-y-1.5 text-white">
                  <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-rose-200 transition-colors font-khmer-title">
                    {isKhmer ? evt.titleKh : evt.titleEn}
                  </h4>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-normal">
                    {isKhmer ? evt.descKh : evt.descEn}
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-rose-300 font-bold flex items-center gap-1">
                    <span>{isKhmer ? 'ចុចដើម្បីមើលរូបភាពធំ' : 'View Full Image'}</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. COMPUTER LAB SHIFTS TIMETABLE                                          */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-22 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          
          <div className="scroll-reveal space-y-2 max-w-xl">
            <div className="text-xs font-mono text-rose-900 font-bold uppercase tracking-wider">
              [ LAB SHIFTS // TIMETABLE ]
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
              {isKhmer ? 'កាលវិភាគថ្នាក់កុំព្យូទ័រ (៣ វេន)' : 'Computer Lab Shift Timetable'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              {isKhmer
                ? 'ជ្រើសរើសវេនសិក្សាដែលសមស្របតាមពេលវេលារបស់អ្នក ដើម្បីចូលរៀនកុំព្យូទ័រជាក់ស្តែងក្នុងបន្ទប់ Lab 1។'
                : 'Scheduled morning and evening computer lab shifts designed around your timetable.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {labShifts.map((shift) => (
              <div
                key={shift.id}
                className="scroll-reveal-scale p-6 rounded-3xl bg-zinc-50 border border-zinc-200 hover:border-rose-900/30 transition-colors flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-xl bg-zinc-950 text-white font-bold">
                      [ {shift.code} ]
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-950 border border-rose-200 font-bold">
                      {isKhmer ? shift.statusKh : shift.statusEn}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-zinc-950 font-khmer-title font-sans">
                    {isKhmer ? shift.nameKh : shift.nameEn}
                  </h4>

                  <div className="text-xs text-zinc-700 space-y-1 pt-1 font-sans">
                    <div className="font-bold text-zinc-900 font-mono">— {isKhmer ? shift.timeKh : shift.timeEn}</div>
                    <div className="text-zinc-600 font-mono">— {isKhmer ? shift.teacherKh : shift.teacherEn}</div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 space-y-1 text-xs text-zinc-600">
                    {(isKhmer ? shift.subjectsKh : shift.subjectsEn).map((sub, sIdx) => (
                      <div key={sIdx} className="truncate">
                        • {sub}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAuthModalRole('student');
                    setShowAuthModal(true);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-zinc-950 hover:bg-rose-950 text-white text-xs font-mono font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isKhmer ? 'ចុះឈ្មោះវេននេះ' : 'Enroll in Shift'}</span>
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. DISTINGUISHED FACULTY DIRECTORY                                        */}
      {/* ========================================================================= */}
      <section id="faculty" className="py-16 sm:py-22 border-b border-zinc-200 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          
          <div className="scroll-reveal space-y-2 max-w-xl">
            <div className="text-xs font-mono text-rose-900 font-bold uppercase tracking-wider">
              [ FACULTY & INSTRUCTORS ]
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
              {isKhmer ? 'លោកគ្រូ អ្នកគ្រូ & គរុកោសល្យ' : 'Distinguished Faculty & Instructors'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              {isKhmer
                ? 'លោកគ្រូអ្នកគ្រូមានបទពិសោធន៍បង្រៀនច្រើនឆ្នាំ យកចិត្តទុកដាក់ និងមានជំនាញច្បាស់លាស់លើមុខវិជ្ជា។'
                : 'Dedicated educators providing individualized workstation coaching and practical software workflows.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {TEACHERS_DATA.map((teacher) => (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className="scroll-reveal-scale p-5 rounded-3xl bg-white border border-zinc-200 hover:border-rose-900/40 transition-all duration-200 cursor-pointer space-y-4 group text-left shadow-2xs hover:shadow-lg"
              >
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 relative border border-zinc-200">
                  <img
                    src={teacher.image || '/ciis-logo.svg'}
                    alt={teacher.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-zinc-950/90 text-white text-[10px] font-mono font-bold">
                    [ {isKhmer ? teacher.badgeKh : teacher.badgeEn} ]
                  </div>
                </div>

                <div className="space-y-1">
                  <h5 className="text-sm sm:text-base font-black text-zinc-950 group-hover:text-rose-950 transition-colors truncate font-khmer-title">
                    {isKhmer ? teacher.nameKh : teacher.nameEn}
                  </h5>
                  <p className="text-xs text-rose-900 font-bold font-mono truncate">
                    — {isKhmer ? teacher.subjectKh : teacher.subjectEn}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono truncate pt-0.5">
                    {isKhmer ? teacher.scheduleKh : teacher.scheduleEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-rose-950 font-bold">
                  <span>{isKhmer ? 'មើលប្រវត្តិរូប' : 'View Profile'}</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. ABOUT DEVELOPER SECTION                                                */}
      {/* ========================================================================= */}
      <section className="py-6 bg-white border-b border-zinc-200 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isDeveloperExpanded ? (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsDeveloperExpanded(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>[ DEV // {isKhmer ? 'ស្វែងយល់បន្ថែមអំពី Developer (JJ-DEV)' : 'About System Developer (JJ-DEV)'} ]</span>
                <span>→</span>
              </button>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 text-white space-y-6 animate-in fade-in duration-200 text-left">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-400">
                    [ DEVELOPER PROFILE // JJ-DEV ]
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDeveloperExpanded(false)}
                  className="px-3 py-1 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white text-xs font-bold cursor-pointer border border-zinc-800"
                >
                  [ {isKhmer ? 'បិទ' : 'Close'} ]
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="w-full aspect-square max-w-[220px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                  <img
                    src="/images/choeurn-tekchas.jpg"
                    alt="Choeurn Tekchas"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-xl sm:text-2xl font-black text-white font-mono">
                    CHOEURN TEKCHAS (JAME)
                  </h4>
                  <p className="text-xs text-rose-300 font-mono">
                    AI & Software Developer • CIIS LMS System Architect
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans font-normal">
                    {isKhmer
                      ? 'ខ្ញុំបានចាប់ផ្តើមដំណើរការសរសេរកូដតាំងពីថ្នាក់ទី ៩ ហើយបានអភិវឌ្ឍប្រព័ន្ធអប់រំ Web Applications និងប្រព័ន្ធជំនួយដោយ AI ជាច្រើន។ គោលដៅរបស់ខ្ញុំគឺបង្កើតបច្ចេកវិទ្យាដែលផ្តល់ផលប្រយោជន៍ជាក់ស្តែងដល់សិស្សានុសិស្ស និងសាលារៀន។'
                      : 'Software developer passionate about AI engineering, modern web applications, and intuitive educational technology. Focused on turning complex challenges into streamlined, robust tools.'}
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://portfolio-jame7.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                    >
                      <span>Visit JJ-DEV Portfolio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CAMPUS LOCATION & ADMISSIONS INQUIRY                                  */}
      {/* ========================================================================= */}
      <section id="contact" className="py-16 sm:py-22 border-b border-zinc-200 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left: Contact Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono text-rose-900 font-bold uppercase tracking-wider">
                  [ LOCATION & ADMISSIONS ]
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
                  {isKhmer ? 'ទំនាក់ទំនង & ទីតាំងសាលា' : 'Visit Campus & Contact Admissions'}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                  {isKhmer
                    ? 'សូមអញ្ជើញមកទស្សនាសាលាផ្ទាល់ ឬទាក់ទងមកកាន់ការិយាល័យរដ្ឋបាល ដើម្បីសាកសួរព័ត៌មានលម្អិតអំពីការចុះឈ្មោះចូលរៀន។'
                    : 'We welcome parents and prospective students to visit our campus or contact our administration for admissions.'}
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Campus Address Card */}
                <div
                  onClick={() => setShowMapModal(true)}
                  className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs hover:border-rose-900/40 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between text-zinc-900 font-bold">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-800" />
                      <span>{isKhmer ? 'ទីតាំងសាលា' : 'Campus Location'}</span>
                    </div>
                    <span className="text-[10px] text-rose-900 font-bold">[ VIEW MAP ↗ ]</span>
                  </div>
                  <p className="text-zinc-600 font-sans text-xs">
                    {isKhmer
                      ? 'ក្រុងកំពង់ឆ្នាំង ខេត្តកំពង់ឆ្នាំង ព្រះរាជាណាចក្រកម្ពុជា'
                      : 'Kampong Chhnang Town, Kampong Chhnang Province, Cambodia'}
                  </p>
                </div>

                {/* Telephone Card */}
                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold">
                    <Phone className="w-4 h-4 text-rose-800" />
                    <span>{isKhmer ? 'លេខទូរស័ព្ទទំនាក់ទំនង' : 'Telephone Numbers'}</span>
                  </div>
                  <div className="text-zinc-600 flex flex-wrap gap-3 pt-0.5">
                    <span>081 505 605 (Smart)</span>
                    <span>•</span>
                    <span>067 505 605 (Metfone)</span>
                    <span>•</span>
                    <span>095 505 605 (Cellcard)</span>
                  </div>
                </div>

                {/* Email Card */}
                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold">
                    <Mail className="w-4 h-4 text-rose-800" />
                    <span>{isKhmer ? 'សារអេឡិចត្រូនិច' : 'Email Coordinates'}</span>
                  </div>
                  <p className="text-zinc-600">
                    ciis@ciscambodia.com / admissions@ciis.edu.kh
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Clean Inquiry Form */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-5">
              <div className="space-y-1">
                <div className="text-xs font-mono text-rose-900 font-bold">
                  [ ADMISSIONS // INQUIRY ]
                </div>
                <h4 className="text-base sm:text-lg font-black text-zinc-950 font-khmer-title">
                  {isKhmer ? 'ទម្រង់សាកសួរព័ត៌មាន ឬចុះឈ្មោះ' : 'Admissions & Information Inquiry'}
                </h4>
                <p className="text-xs text-zinc-500 font-normal">
                  {isKhmer
                    ? 'សូមបំពេញព័ត៌មានខាងក្រោម ក្រុមការងារយើងខ្ញុំនឹងទាក់ទងទៅវិញយ៉ាងឆាប់រហ័ស។'
                    : 'Submit your contact details below and our team will get in touch promptly.'}
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-2 font-mono">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                  <div className="text-sm font-bold text-zinc-950 font-sans">
                    {isKhmer ? 'បានផ្ញើព័ត៌មានដោយជោគជ័យ!' : 'Inquiry Submitted Successfully!'}
                  </div>
                  <p className="text-xs text-zinc-600 font-sans">
                    {isKhmer
                      ? 'អរគុណសម្រាប់ការចាប់អារម្មណ៍លើសាលា CIIS។ ក្រុមការងាររដ្ឋបាលនឹងទាក់ទងមកលោកអ្នកក្នុងពេលឆាប់ៗ។'
                      : 'Thank you for contacting CIIS. Our admissions team will reach out to you shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs font-mono">
                  <div>
                    <label className="block text-zinc-700 mb-1 font-bold">
                      [ — ] {isKhmer ? 'ឈ្មោះពេញ / Name *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      placeholder={isKhmer ? 'ឧ. សុខ ដារ៉ា' : 'e.g. Sok Dara'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 outline-none transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 mb-1 font-bold">
                      [ — ] {isKhmer ? 'លេខទូរស័ព្ទ / Phone *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      placeholder="012 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 outline-none transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 mb-1 font-bold">
                      [ — ] {isKhmer ? 'កម្មវិធីសិក្សាដែលចាប់អារម្មណ៍' : 'Program Track of Interest'}
                    </label>
                    <select
                      value={inquiryForm.program}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 outline-none transition-colors font-sans cursor-pointer"
                    >
                      <option value="computer-lab">{isKhmer ? 'ជំនាញកុំព្យូទ័រ Lab 1' : 'Computer Lab 1 Workstations'}</option>
                      <option value="kindergarten">{isKhmer ? 'ថ្នាក់មត្តេយ្យសិក្សា (Kindergarten)' : 'Early Childhood / Kindergarten'}</option>
                      <option value="grade-1-12">{isKhmer ? 'ចំណេះទូទៅ ថ្នាក់ទី១ - ទី១២ (MoEYS)' : 'K-12 General Education'}</option>
                      <option value="ielts">{isKhmer ? 'ភាសាអង់គ្លេសទូទៅ & IELTS' : 'International English & IELTS'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-700 mb-1 font-bold">
                      [ — ] {isKhmer ? 'សារបន្ថែម (បើមាន)' : 'Message (Optional)'}
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder={isKhmer ? 'សរសេរសំណួររបស់អ្នកនៅទីនេះ...' : 'Enter your message or questions...'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 outline-none transition-colors resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="w-full py-3 rounded-xl bg-zinc-950 hover:bg-rose-950 text-white font-mono font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isSubmittingInquiry ? (
                      <span>{isKhmer ? 'កំពុងផ្ញើ...' : 'Sending...'}</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{isKhmer ? 'ផ្ញើសំណួរចុះឈ្មោះ →' : 'Submit Inquiry →'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. INSTITUTIONAL FOOTER                                                  */}
      {/* ========================================================================= */}
      <footer className="bg-zinc-950 text-zinc-400 py-12 text-xs font-mono border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 p-1 flex items-center justify-center border border-zinc-800">
                <img src="/ciis-logo.svg" alt="CIIS Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  {isKhmer ? 'សាលារៀនអន្តរជាតិ ស៊ី អាយ អាយ អេស' : 'CIIS INTERNATIONAL SCHOOL'}
                </div>
                <div className="text-[11px] text-rose-400">
                  Empowering Futures Through Excellence & Applied Technology
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthModalRole('student');
                  setShowAuthModal(true);
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                [ {isKhmer ? 'ចូលគណនីសិស្ស' : 'Student Login'} ]
              </button>
              <span className="text-zinc-800">|</span>
              <button
                type="button"
                onClick={() => {
                  setAuthModalRole('teacher');
                  setShowAuthModal(true);
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                [ {isKhmer ? 'ចូលគណនីគ្រូ' : 'Faculty Login'} ]
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
            <div>
              &copy; {new Date().getFullYear()} CIIS International School. All Rights Reserved.
            </div>
            <div>
              Kampong Chhnang Town, Cambodia
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 12. MODALS                                                                */}
      {/* ========================================================================= */}
      {selectedTeacher && (
        <TeacherDetailModal
          teacher={selectedTeacher}
          isOpen={Boolean(selectedTeacher)}
          onClose={() => setSelectedTeacher(null)}
        />
      )}

      {/* High-Resolution Photo Lightbox Preview Modal */}
      {selectedGalleryItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedGalleryItem(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono">
              <span className="text-xs font-bold text-rose-400">
                [ {isKhmer ? selectedGalleryItem.badgeKh : selectedGalleryItem.badgeEn} ]
              </span>
              <button
                type="button"
                onClick={() => setSelectedGalleryItem(null)}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-zinc-800">
              <img
                src={selectedGalleryItem.src}
                alt={selectedGalleryItem.titleEn}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm sm:text-base font-bold text-white font-khmer-title">
                {isKhmer ? selectedGalleryItem.titleKh : selectedGalleryItem.titleEn}
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                {isKhmer ? selectedGalleryItem.descKh : selectedGalleryItem.descEn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Google Maps Modal */}
      {showMapModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowMapModal(false)}
        >
          <div
            className="relative max-w-3xl w-full rounded-3xl bg-white border border-zinc-200 overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 font-mono">
              <span className="text-xs font-bold text-zinc-900">
                [ CAMPUS LOCATION // GOOGLE MAPS ]
              </span>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-zinc-200">
              <iframe
                title="CIIS Campus Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15632.70997092144!2d104.78!3d11.53!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDMxJzM0LjAiTiAxMDTCsDQ2JzU1LjIiRQ!5e0!3m2!1sen!2skh!4v1600000000000!5m2!1sen!2skh"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-600">Kampong Chhnang, Cambodia</span>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold cursor-pointer"
              >
                [ Close Map ]
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default GuestLandingPage;
