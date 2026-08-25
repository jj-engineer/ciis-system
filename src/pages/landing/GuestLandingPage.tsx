import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { TEACHERS_DATA, TeacherProfile } from '../../services/teacherData';
import { TeacherCard } from '../../components/teachers/TeacherCard';
import { TeacherDetailModal } from '../../components/teachers/TeacherDetailModal';
import { CIIS3DLaptopMascot } from '../../components/common/CIIS3DLaptopMascot';
import { useScrollObserver } from '../../hooks/useScrollObserver';
import {
  School,
  LogIn,
  UserPlus,
  BookOpen,
  Keyboard,
  FileSpreadsheet,
  FileText,
  Monitor,
  CheckCircle2,
  ExternalLink,
  Code2,
  Award,
  Users,
  Clock,
  Laptop,
  ShieldCheck,
  Globe,
  Palette,
  Layers,
  Zap,
  CheckSquare,
  BarChart3,
  Cpu,
  Building2,
  Landmark,
  GraduationCap,
  Languages,
  Compass,
  ArrowRight,
  TrendingUp,
  KeyRound,
  X,
  ChevronRight,
  Search,
  Check,
  Camera,
  HeartHandshake,
  Mic,
  Music,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Share2,
  Sparkles,
  LayoutDashboard,
  Menu,
  Send,
  MessageSquare,
  Navigation,
  Copy
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
  const { currentUser, isAuthenticated, isTeacher, isStudent, setShowAuthModal, setAuthModalRole } = useAuth();
  const { isKhmer, language, setLanguage } = useLanguage();
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryModalItem | null>(null);
  const [activeLabTab, setActiveLabTab] = useState<'all' | 'class-1' | 'class-2'>('all');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDeveloperExpanded, setIsDeveloperExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

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

  // Initialize IntersectionObserver scroll reveal system (triggers on scroll down)
  useScrollObserver('.scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right', [language, activeLabTab]);

  // Reset scroll position to top on initial render / page reload
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track scroll progress and dynamic navbar styling
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

  // 4 Academic Levels / Programs with Natural Human Phrasing (Kindergarten to Grade 12, Computer Lab, IELTS)
  const academicLevels = [
    {
      id: 'kindergarten',
      index: '០១',
      indexEn: '01',
      nameKh: 'ថ្នាក់មត្តេយ្យសិក្សា (កុមារតូច)',
      nameEn: 'Early Childhood & Kindergarten',
      ageKh: 'អាយុ ៣ ដល់ ៥ ឆ្នាំ',
      ageEn: 'Ages 3 - 5 Years',
      descriptionKh: 'បណ្តុះបណ្តាលកុមារតូចឱ្យចេះភាសាខ្មែរ-អង់គ្លេស រៀនគូររូប ស្គាល់លេខ ចេះសីលធម៌ និងមានភាពក្លាហានក្នុងការប្រាស្រ័យទាក់ទង។',
      descriptionEn: 'Fostering foundational literacy, numeracy, creative expression, moral habits, and social confidence for young learners.',
      highlightsKh: ['មូលដ្ឋានគ្រឹះអក្សរ & លេខ', 'ភាសាខ្មែរ និងអង់គ្លេសកុមារ', 'សកម្មភាពអប់រំ និងសីលធម៌'],
      highlightsEn: ['Literacy & Numbers', 'Khmer & English Basics', 'Creative Educational Play']
    },
    {
      id: 'grade-1-to-12',
      index: '០២',
      indexEn: '02',
      nameKh: 'ចំណេះទូទៅ ថ្នាក់ទី១ ដល់ ទី១២',
      nameEn: 'General Education: Grades 1 to 12',
      ageKh: 'ថ្នាក់ទី១ ដល់ ថ្នាក់ទី១២',
      ageEn: 'Grades 1 - 12 Standard',
      descriptionKh: 'បង្រៀនតាមកម្មវិធីសិក្សាជាតិរបស់ក្រសួងអប់រំ យុវជន និងកីឡា ចាប់ពីកម្រិតបឋមសិក្សា អនុវិទ្យាល័យ រហូតដល់វិទ្យាល័យ និងការត្រៀមប្រឡងសញ្ញាបត្របាក់ឌុប (BacII)។',
      descriptionEn: 'Full national curriculum coverage adhering to Ministry of Education standards across Primary (Grades 1-6), Lower Secondary (Grades 7-9), and Upper Secondary (Grades 10-12 / National BacII Exam).',
      highlightsKh: ['បឋមសិក្សា (ថ្នាក់ទី១ ដល់ ទី៦)', 'អនុវិទ្យាល័យ (ថ្នាក់ទី៧ ដល់ ទី៩)', 'វិទ្យាល័យ (ថ្នាក់ទី១០ ដល់ ទី១២ - ត្រៀមបាក់ឌុប)'],
      highlightsEn: ['Primary School (Grades 1 to 6)', 'Lower Secondary (Grades 7 to 9)', 'High School & BacII (Grades 10 to 12)']
    },
    {
      id: 'secondary-computer',
      index: '០៣',
      indexEn: '03',
      nameKh: 'ជំនាញកុំព្យូទ័រអនុវត្ត CIIS Lab 1',
      nameEn: 'Hands-On Computer & Digital Lab',
      ageKh: 'អនុវត្តជាក់ស្តែង ១០០%',
      ageEn: '100% Hands-On Lab',
      descriptionKh: 'ការបណ្តុះបណ្តាលកុំព្យូទ័រលើម៉ាស៊ីនផ្ទាល់ក្នុងបន្ទប់ Lab 1 ដូចជា Touch Typing ខ្មែរ-អង់គ្លេស, Microsoft Office (Word, Excel, PowerPoint), ការរៀបចំឯកសារ និងជំនាញឌីជីថល។',
      descriptionEn: 'Direct hands-on workstation training in Computer Lab 1 covering 10-Finger Touch Typing, Microsoft Word, Excel, PowerPoint, and modern digital office skills.',
      highlightsKh: ['បន្ទប់កុំព្យូទ័រ ៤០+ គ្រឿងផ្ទាល់ខ្លួន', 'Touch Typing ខ្មែរ & អង់គ្លេស', 'Microsoft Word, Excel & PowerPoint'],
      highlightsEn: ['40+ Dedicated Workstations', 'Khmer & English Touch Typing', 'Microsoft Word, Excel & PowerPoint']
    },
    {
      id: 'ielts-english',
      index: '០៤',
      indexEn: '04',
      nameKh: 'ថ្នាក់ភាសាអង់គ្លេសទូទៅ & IELTS',
      nameEn: 'International English & IELTS Track',
      ageKh: 'ស្តង់ដារអន្តរជាតិ',
      ageEn: 'Global Standard Program',
      descriptionKh: 'បង្រៀនភាសាអង់គ្លេសគ្រប់កម្រិត ផ្តោតលើការស្តាប់ និយាយ អាន និងសរសេរ រួមទាំងការបំប៉នវេយ្យាករណ៍ និងការត្រៀមប្រឡងយកវិញ្ញាបនបត្រអន្តរជាតិ IELTS។',
      descriptionEn: 'Comprehensive English training covering Listening, Speaking, Reading, and Writing, including standard IELTS exam preparation.',
      highlightsKh: ['៤ ជំនាញ (ស្តាប់ និយាយ អាន សរសេរ)', 'គ្រូមានគរុកោសល្យ និងបទពិសោធន៍', 'ការត្រៀមប្រឡងវិញ្ញាបនបត្រ IELTS'],
      highlightsEn: ['4 Core Language Skills', 'Experienced Instructors', 'IELTS Readiness']
    }
  ];

  // 5 Authentic Ceremony / Event Photos from the School
  const ceremonyEvents: GalleryModalItem[] = [
    {
      src: '/images/events/ceremony-graduation-award.jpg',
      badgeKh: 'ពិធីចែកវិញ្ញាបនបត្រ',
      badgeEn: 'GRADUATION CEREMONY',
      titleKh: 'ពិធីប្រគល់វិញ្ញាបនបត្រ និងប័ណ្ណសរសើរជូនសិស្សានុសិស្ស',
      titleEn: 'Certificate & Appreciation Letter Distribution Ceremony',
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
      badgeEn: 'STUDENT DANCE PERFORMANCE',
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

  // 4 Authentic Class 1 Student Activities in Computer Lab 1 (Evening 1: 5:30 - 6:30 PM)
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

  // 5 Authentic Class 2 Student Activities in Computer Lab 1 (Evening 2: 6:40 - 7:40 PM)
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
          lab2Activities[0], // Full Lab 1 Classroom Overview (Featured Hero Big)
          lab1Activities[0], // Station 19 & 20 Dual Station (Wide)
          lab2Activities[1], // 1-on-1 Instructor Guidance (Standard)
          lab2Activities[2], // PowerPoint & Textbook Drills (Standard)
          lab1Activities[1], // 10-Finger Typing Drills (Standard)
          lab2Activities[3], // Station 07 Textbook Reference (Standard)
          lab2Activities[4], // Multi-Station Typing Benchmark (Wide)
          lab1Activities[2], // Collaborative Peer Learning (Wide)
          lab1Activities[3], // Independent Focus Station 18 (Wide)
        ];

  // 3 Computer Lab Shifts
  const labShifts = [
    {
      id: 'shift-1',
      code: 'វេនល្ងាច ១',
      codeEn: 'EV-01',
      nameKh: 'ថ្នាក់កុំព្យូទ័រវេនល្ងាច ទី១',
      nameEn: 'Evening Computer Shift 1',
      teacherKh: 'លោកគ្រូ នុន លាងឌី & ជឿន តេជៈ',
      teacherEn: 'Nun Langdy (Lead) & Choeurn Tekchas (Asst)',
      timeKh: '៥:៣០ - ៦:៣០ ល្ងាច (ចន្ទ ដល់ សុក្រ)',
      timeEn: '5:30 PM - 6:30 PM (Mon - Fri)',
      roomKh: 'បន្ទប់កុំព្យូទ័រ CIIS Lab 1 (៤០+ គ្រឿង)',
      roomEn: 'CIIS Computer Lab 1 (40+ Stations)',
      subjectsKh: ['រៀនវាយអក្សរ Touch Typing', 'Microsoft Word រៀបចំឯកសារ', 'Microsoft Excel មូលដ្ឋាន', 'ការប្រើប្រាស់កុំព្យូទ័រទូទៅ'],
      subjectsEn: ['Touch Typing Drills', 'Microsoft Word Documents', 'Microsoft Excel Basics', 'General Computer Skills'],
      statusKh: 'កំពុងបើកទទួលសិស្ស',
      statusEn: 'Open for Enrollment'
    },
    {
      id: 'shift-2',
      code: 'វេនល្ងាច ២',
      codeEn: 'EV-02',
      nameKh: 'ថ្នាក់កុំព្យូទ័រវេនល្ងាច ទី២',
      nameEn: 'Evening Computer Shift 2',
      teacherKh: 'លោកគ្រូ នុន លាងឌី & ជឿន តេជៈ',
      teacherEn: 'Nun Langdy (Lead) & Choeurn Tekchas (Asst)',
      timeKh: '៦:៤០ - ៧:៤០ ល្ងាច (ចន្ទ ដល់ សុក្រ)',
      timeEn: '6:40 PM - 7:40 PM (Mon - Fri)',
      roomKh: 'បន្ទប់កុំព្យូទ័រ CIIS Lab 1 (៤០+ គ្រឿង)',
      roomEn: 'CIIS Computer Lab 1 (40+ Stations)',
      subjectsKh: ['រូបមន្ត Excel កម្រិតខ្ពស់', 'ការងាររដ្ឋបាលការិយាល័យ', 'តេស្តល្បឿនវាយអក្សរ', 'ការអនុវត្តលំហាត់ជាក់ស្តែង'],
      subjectsEn: ['Advanced Excel Formulas', 'Office Administration', 'Typing Velocity Tests', 'Practical Exam Practice'],
      statusKh: 'វេនពេញនិយម',
      statusEn: 'Popular Shift'
    },
    {
      id: 'shift-3',
      code: 'ចន្ទ ព្រឹក',
      codeEn: 'MO-01',
      nameKh: 'ថ្នាក់កុំព្យូទ័រថ្ងៃចន្ទ ព្រឹក',
      nameEn: 'Monday Morning Intensive Shift',
      teacherKh: 'លោកគ្រូ តេន ចាន់ដារា & ជឿន តេជៈ',
      teacherEn: 'Ten Chandara (Lead) & Choeurn Tekchas (Asst)',
      timeKh: '៧:៣០ - ១១:០០ ព្រឹក (រៀងរាល់ថ្ងៃចន្ទ)',
      timeEn: '7:30 AM - 11:00 AM (Monday Only)',
      roomKh: 'បន្ទប់កុំព្យូទ័រ CIIS Lab 1 (៤០+ គ្រឿង)',
      roomEn: 'CIIS Computer Lab 1 (40+ Stations)',
      subjectsKh: ['ប្រព័ន្ធកុំព្យូទ័រ & Windows', 'កិច្ចការការិយាល័យ Office', 'តារាងគណនា Excel', 'ប្រឡងអនុវត្តចុងវគ្គ'],
      subjectsEn: ['Computer Architecture', 'Office Productivity', 'Spreadsheet Analytics', 'Comprehensive Exam'],
      statusKh: 'ថ្នាក់ពិសេសថ្ងៃចន្ទ',
      statusEn: 'Special Monday Block'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-[#1e1e1e] antialiased font-sans relative selection:bg-pink-900 selection:text-white">

      {/* Top Precision Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-zinc-200/50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-pink-900 via-pink-700 to-rose-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BAR (Harvard Style Token Cleanliness)                      */}
      {/* ========================================================================= */}
      <div className="bg-zinc-950 text-white text-[11px] border-b border-zinc-800/80 px-4 sm:px-8 py-2 flex items-center justify-between z-50 relative">
        <div className="flex items-center gap-3 sm:gap-4 truncate">
          <span className="inline-flex items-center gap-1.5 text-pink-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className={isKhmer ? "font-kantumruy font-semibold" : "font-mono tracking-wider"}>
              {isKhmer ? 'ប្រព័ន្ធគ្រប់គ្រងសាលា CIIS LMS' : 'CIIS LMS v2.5'}
            </span>
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className={`text-zinc-300 truncate hidden sm:inline ${isKhmer ? 'font-kantumruy' : 'font-mono tracking-wider'}`}>
            {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស • រាជធានីភ្នំពេញ' : 'CIIS INTERNATIONAL SCHOOL • PHNOM PENH'}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            className="hover:text-pink-400 transition-colors flex items-center gap-1.5 cursor-pointer font-bold px-2.5 py-0.5 rounded bg-white/10"
          >
            <Globe className="w-3.5 h-3.5 text-pink-400" />
            <span className={language !== 'km' ? 'font-kantumruy' : 'font-mono'}>{language === 'km' ? 'English' : 'ភាសាខ្មែរ'}</span>
          </button>
          <span className="text-zinc-700">|</span>
          <button
            type="button"
            onClick={() => {
              setAuthModalRole('student');
              setShowAuthModal(true);
            }}
            className={`text-pink-300 hover:text-white transition-colors cursor-pointer font-bold flex items-center gap-1 ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}
          >
            <LogIn className="w-3 h-3" />
            <span>{isKhmer ? 'ចូលគណនីសិស្ស' : 'Student Login'}</span>
          </button>
          <span className="text-zinc-700">|</span>
          <button
            type="button"
            onClick={() => {
              setAuthModalRole('teacher');
              setShowAuthModal(true);
            }}
            className={`text-zinc-300 hover:text-pink-300 transition-colors cursor-pointer font-bold flex items-center gap-1 ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}
          >
            <ShieldCheck className="w-3 h-3 text-pink-400" />
            <span>{isKhmer ? 'គណនីគ្រូ' : 'Faculty'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN HEADER & EDITORIAL NAVIGATION                                     */}
      {/* ========================================================================= */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${isScrolled ? 'border-zinc-300 shadow-sm py-2 sm:py-2.5' : 'border-zinc-200 py-2.5 sm:py-3.5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">

          {/* Official Brand Crest & Natural Title */}
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-pink-50 p-1 flex items-center justify-center border border-pink-200 shadow-xs shrink-0">
              <img src="/ciis-logo.svg" alt="CIIS Logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className={`text-xs sm:text-base lg:text-lg font-black text-zinc-950 leading-tight truncate ${isKhmer ? 'font-khmer-title' : 'uppercase tracking-tight font-mono'}`}>
                {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស' : 'CIIS INTERNATIONAL SCHOOL'}
              </h1>
              <p className={`text-[9.5px] sm:text-[11.5px] text-pink-900 font-bold truncate ${isKhmer ? 'font-kantumruy tracking-normal' : 'uppercase tracking-wide font-mono'}`}>
                {isKhmer ? 'ថ្នាក់រៀនកុំព្យូទ័រអនុវត្តជាក់ស្តែង • CIIS Computer Lab 1' : 'Practical Computer Lab Portal • CIIS Lab 1'}
              </p>
            </div>
          </div>

          {/* Jump Links with Animated Running Gradient Underline on Hover (Desktop) */}
          <nav className={`hidden lg:flex items-center gap-6 text-xs font-bold text-zinc-700 ${isKhmer ? 'font-kantumruy text-sm' : ''}`}>
            <a
              href="#about-overview"
              className="relative py-1.5 px-0.5 text-zinc-700 hover:text-pink-950 transition-colors duration-200 group"
            >
              <span>{isKhmer ? 'អំពីសាលា' : 'About CIIS'}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-gradient-to-r from-pink-900 via-rose-600 to-pink-500 rounded-full transition-all duration-300 ease-out group-hover:w-full shadow-xs" />
            </a>

            <a
              href="#ceremony-section"
              className="relative py-1.5 px-0.5 text-zinc-700 hover:text-pink-950 transition-colors duration-200 group"
            >
              <span>{isKhmer ? 'ពិធីចែកសញ្ញាបត្រ' : 'Ceremony & Awards'}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-gradient-to-r from-pink-900 via-rose-600 to-pink-500 rounded-full transition-all duration-300 ease-out group-hover:w-full shadow-xs" />
            </a>

            <a
              href="#activities-section"
              className="relative py-1.5 px-0.5 text-zinc-700 hover:text-pink-950 transition-colors duration-200 group"
            >
              <span>{isKhmer ? 'ថ្នាក់កុំព្យូទ័រ Lab 1' : 'Computer Lab 1'}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-gradient-to-r from-pink-900 via-rose-600 to-pink-500 rounded-full transition-all duration-300 ease-out group-hover:w-full shadow-xs" />
            </a>

            <a
              href="#levels-section"
              className="relative py-1.5 px-0.5 text-zinc-700 hover:text-pink-950 transition-colors duration-200 group"
            >
              <span>{isKhmer ? 'កម្រិតសិក្សា' : 'Academic Levels'}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-gradient-to-r from-pink-900 via-rose-600 to-pink-500 rounded-full transition-all duration-300 ease-out group-hover:w-full shadow-xs" />
            </a>

            <a
              href="#faculty-section"
              className="relative py-1.5 px-0.5 text-zinc-700 hover:text-pink-950 transition-colors duration-200 group"
            >
              <span>{isKhmer ? 'លោកគ្រូអ្នកគ្រូ' : 'Faculty'}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-gradient-to-r from-pink-900 via-rose-600 to-pink-500 rounded-full transition-all duration-300 ease-out group-hover:w-full shadow-xs" />
            </a>

            <a
              href="#shifts-section"
              className="relative py-1.5 px-0.5 text-zinc-700 hover:text-pink-950 transition-colors duration-200 group"
            >
              <span>{isKhmer ? 'កាលវិភាគវេន' : 'Lab Shifts'}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-gradient-to-r from-pink-900 via-rose-600 to-pink-500 rounded-full transition-all duration-300 ease-out group-hover:w-full shadow-xs" />
            </a>

            <a
              href="#contact-admin-section"
              className="relative py-1.5 px-0.5 text-zinc-700 hover:text-pink-950 transition-colors duration-200 group"
            >
              <span>{isKhmer ? 'ទំនាក់ទំនង' : 'Contact'}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-gradient-to-r from-pink-900 via-rose-600 to-pink-500 rounded-full transition-all duration-300 ease-out group-hover:w-full shadow-xs" />
            </a>
          </nav>

          {/* Primary Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {isAuthenticated && currentUser.id !== 'guest' && onReturnToPortal ? (
              <button
                onClick={onReturnToPortal}
                className={`px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-pink-800 via-pink-700 to-rose-600 hover:from-pink-700 hover:to-rose-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 sm:gap-2 hover:scale-[1.03] active:scale-98 transition-all cursor-pointer border border-pink-400/40 ${isKhmer ? 'font-kantumruy' : ''}`}
                title={isTeacher ? (isKhmer ? 'គ្រប់គ្រងសិស្ស' : 'Manage Students') : (isKhmer ? 'ការសិក្សារបស់អ្នក' : 'Your Studies')}
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-200 shrink-0" />
                <span className="whitespace-nowrap">
                  {isTeacher
                    ? (isKhmer ? 'គ្រប់គ្រងសិស្ស' : 'Manage Students')
                    : (isKhmer ? 'ការសិក្សារបស់អ្នក' : 'Your Studies')
                  }
                </span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-0.5 shrink-0" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalRole('student');
                  setShowAuthModal(true);
                }}
                className={`px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-pink-900 via-pink-950 to-zinc-950 hover:from-pink-800 hover:to-zinc-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-1.5 sm:gap-2 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer border border-pink-800/40 ${isKhmer ? 'font-kantumruy' : ''}`}
              >
                <UserPlus className="w-3.5 h-3.5 text-pink-300 shrink-0" />
                <span className="whitespace-nowrap">{isKhmer ? 'ចុះឈ្មោះ' : 'Enroll Now'}</span>
              </button>
            )}

            {/* Mobile Navigation Drawer Trigger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-zinc-700 hover:text-pink-900 hover:bg-pink-50 rounded-xl lg:hidden transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Menu Drawer for Public Website */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-5 animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-pink-50 p-1 flex items-center justify-center border border-pink-200">
                    <img src="/ciis-logo.svg" alt="CIIS" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-black text-xs text-zinc-950">{isKhmer ? 'សាលារៀន CIIS' : 'CIIS SCHOOL'}</h3>
                    <p className="text-[9px] text-pink-800 font-bold uppercase">{isKhmer ? 'គេហទំព័រផ្លូវការ' : 'Official Portal'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 text-xs font-bold text-zinc-700">
                {[
                  { href: '#about-overview', label: isKhmer ? 'អំពីសាលា' : 'About CIIS' },
                  { href: '#ceremony-section', label: isKhmer ? 'ពិធីចែកសញ្ញាបត្រ' : 'Ceremony & Awards' },
                  { href: '#activities-section', label: isKhmer ? 'ថ្នាក់កុំព្យូទ័រ Lab 1' : 'Computer Lab 1' },
                  { href: '#levels-section', label: isKhmer ? 'កម្រិតសិក្សា' : 'Academic Levels' },
                  { href: '#faculty-section', label: isKhmer ? 'លោកគ្រូអ្នកគ្រូ' : 'Faculty' },
                  { href: '#shifts-section', label: isKhmer ? 'កាលវិភាគវេន' : 'Lab Shifts' },
                  { href: '#contact-admin-section', label: isKhmer ? 'ទំនាក់ទំនង' : 'Contact' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-pink-50 hover:text-pink-900 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Drawer Footer Actions: Language Switcher & Login */}
            <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs">
              <button
                type="button"
                onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-100 font-bold text-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-pink-700" />
                  <span>{isKhmer ? 'ភាសា' : 'Language'}</span>
                </div>
                <span className="font-mono text-pink-800 font-black">{language === 'km' ? 'English' : 'ភាសាខ្មែរ'}</span>
              </button>

              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalRole('student');
                      setShowAuthModal(true);
                    }}
                    className="px-3 py-2 bg-pink-50 text-pink-900 font-bold rounded-xl text-center"
                  >
                    {isKhmer ? 'ចូលសិស្ស' : 'Student'}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalRole('teacher');
                      setShowAuthModal(true);
                    }}
                    className="px-3 py-2 bg-zinc-900 text-white font-bold rounded-xl text-center"
                  >
                    {isKhmer ? 'គណនីគ្រូ' : 'Faculty'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ABOUT CIIS: INSTITUTIONAL EDITORIAL HERO (Harvard "About" Standard)    */}
      {/* ========================================================================= */}
      <section id="about-overview" className="relative overflow-hidden pt-4 pb-12 sm:pt-6 sm:pb-16 border-b border-zinc-200 bg-white">
        {/* Background CIIS School Building on Left 60% (+15% more visible, 78% opacity & light 40% white overlay) */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[60%] overflow-hidden pointer-events-none z-0">
          <img
            src="/ciis-building.jpg"
            alt="CIIS School Building"
            className="w-full h-full object-cover object-top opacity-78 scale-105"
          />
          {/* White Translucent Overlay (40%) + Soft Gradient Fade to pure white on the right */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/55 to-white" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8 text-left">

          {/* Institutional Mission Badge */}
          <div className="scroll-reveal flex flex-wrap items-center gap-2.5">
            <span className={`px-3.5 py-1.5 rounded-full bg-pink-950 text-white text-xs sm:text-[12px] font-bold shadow-2xs ${isKhmer ? 'font-kantumruy tracking-normal' : 'font-mono uppercase tracking-wider text-[11px]'}`}>
              {isKhmer ? 'អំពីប្រព័ន្ធថ្នាក់កុំព្យូទ័រ CIIS' : 'ABOUT CIIS COMPUTER LAB PORTAL'}
            </span>
            <span className={`px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-pink-950 border border-pink-200 text-xs sm:text-[12px] font-bold shadow-xs ${isKhmer ? 'font-kantumruy tracking-normal' : 'font-mono text-[11px]'}`}>
              {isKhmer ? 'សម្រាប់ថ្នាក់កុំព្យូទ័រ Lab 1 (៤០+ គ្រឿង)' : 'Dedicated to Lab 1 (40+ Workstations)'}
            </span>
          </div>

          {/* Master Headline in Natural Human Language + 3D Robot Mascot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column: Mission Narrative & Direct Actions */}
            <div className="scroll-reveal-left lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-zinc-950 tracking-tight leading-[1.2] font-khmer-title drop-shadow-xs">
                {isKhmer ? (
                  <>
                    ផ្ដោតលើការរៀន និងអនុវត្តផ្ទាល់ <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-900 via-pink-700 to-rose-600 font-khmer-title">
                      ជាក់ស្តែងទៅលើជំនាញកុំព្យូទ័រ
                    </span>
                  </>
                ) : (
                  <>
                    Focused on Practical Learning & <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-900 via-pink-700 to-rose-600">
                      CIIS Computer Lab Classes
                    </span>
                  </>
                )}
              </h2>

              {/* Highlight Informative Card for Students & Parents */}
              <div className="bg-white/70 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/80 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-pink-200/90 transition-all duration-300 space-y-3.5">
                {/* Glowing Left Color Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-pink-600 via-rose-500 to-pink-900 rounded-l-3xl" />

                {/* Card Sub-Header with Live Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 pl-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-pink-100/80 text-pink-900 flex items-center justify-center border border-pink-200/60 shadow-2xs">
                      <Monitor className="w-4 h-4 text-pink-800" />
                    </div>
                    <span className={`text-xs font-black text-zinc-900 uppercase tracking-wide ${isKhmer ? 'font-khmer-title' : 'font-mono'}`}>
                      {isKhmer ? 'សេចក្តីបញ្ជាក់សម្រាប់សិស្ស & អាណាព្យាបាល' : 'IMPORTANT NOTICE FOR STUDENTS & PARENTS'}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-mono font-bold shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{isKhmer ? 'Lab 1 ដំណើរការ • ៤០+ គ្រឿង' : 'Lab 1 Active • 40+ Workstations'}</span>
                  </span>
                </div>

                {/* Natural Human Body Paragraph */}
                <p className="text-sm sm:text-[15px] text-zinc-800 leading-[1.8] font-medium font-kantumruy pl-1.5">
                  {isKhmer
                    ? <>សូមជម្រាបជូនប្អូនៗសិស្សានុសិស្ស និងអាណាព្យាបាលទាំងអស់គ្នា៖ គេហទំព័រមួយនេះបង្កើតឡើងសម្រាប់តែ <strong className="text-pink-950 font-bold">ថ្នាក់រៀនកុំព្យូទ័រ (CIIS Computer Lab)</strong> ប៉ុណ្ណោះ ដោយមិនមែនជាវេបសាយធំផ្លូវការរបស់សាលាទាំងមូលនោះទេ។ នៅទីនេះ ប្អូនៗអាចចូលមើលមេរៀន ធ្វើកិច្ចការ វាយអត្ថបទ Touch Typing និងរៀនកម្មវិធី Microsoft Office (Word, Excel, PowerPoint) ជាក់ស្តែងលើ <strong className="text-pink-950 font-bold">កុំព្យូទ័រ ៤០+ គ្រឿង</strong> តាមវេននីមួយៗជាមួយលោកគ្រូអ្នកគ្រូផ្ទាល់។</>
                    : <>A quick note for students and parents: This website is specially made for <strong className="text-pink-950 font-bold">CIIS Computer Lab Classes only</strong> (it is not the main official website of the whole school). Here, students can check lessons, submit assignments, practice Touch Typing, and learn real Microsoft Office skills (Word, Excel, PowerPoint) on our <strong className="text-pink-950 font-bold">40+ computer stations</strong> directly with their lab teachers.</>}
                </p>

                {/* 4 Quick Key Value Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 pl-1.5">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/85 border border-zinc-100 shadow-2xs text-[11px] font-bold text-zinc-800 hover:border-pink-200 transition-colors">
                    <Laptop className="w-3.5 h-3.5 text-pink-700 shrink-0" />
                    <span className="truncate">{isKhmer ? '៤០+ គ្រឿងផ្ទាល់ខ្លួន' : '40+ Stations'}</span>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/85 border border-zinc-100 shadow-2xs text-[11px] font-bold text-zinc-800 hover:border-pink-200 transition-colors">
                    <Keyboard className="w-3.5 h-3.5 text-pink-700 shrink-0" />
                    <span className="truncate">{isKhmer ? 'Touch Typing' : 'Touch Typing'}</span>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/85 border border-zinc-100 shadow-2xs text-[11px] font-bold text-zinc-800 hover:border-pink-200 transition-colors">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-pink-700 shrink-0" />
                    <span className="truncate">{isKhmer ? 'Word & Excel' : 'Word & Excel'}</span>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/85 border border-zinc-100 shadow-2xs text-[11px] font-bold text-zinc-800 hover:border-pink-200 transition-colors">
                    <Users className="w-3.5 h-3.5 text-pink-700 shrink-0" />
                    <span className="truncate">{isKhmer ? 'គ្រូបង្រៀនផ្ទាល់' : 'Faculty Coaching'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalRole('student');
                    setShowAuthModal(true);
                  }}
                  className={`py-3.5 px-6 rounded-2xl bg-pink-900 hover:bg-pink-950 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2.5 group transition-all cursor-pointer hover:scale-[1.02] ${isKhmer ? 'font-kantumruy' : ''}`}
                >
                  <UserPlus className="w-4 h-4 text-pink-300" />
                  <span>{isKhmer ? 'ចុះឈ្មោះចូលរៀនថ្នាក់កុំព្យូទ័រ' : 'Register for Computer Classes'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-pink-300" />
                </button>

                <a
                  href="#ceremony-section"
                  className={`py-3.5 px-6 rounded-2xl bg-white/90 hover:bg-white text-zinc-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-zinc-200/90 shadow-xs hover:shadow-md transition-all ${isKhmer ? 'font-kantumruy' : ''}`}
                >
                  <span>{isKhmer ? 'មើលរូបភាពពិធីចែកសញ្ញាបត្រ' : 'View Ceremony Photos'}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </a>
              </div>
            </div>

            {/* Right Column: Real WebGL 3D Interactive Futuristic Laptop Workstation */}
            <div className="scroll-reveal-right delay-150 lg:col-span-5 flex items-center justify-center relative">
              <CIIS3DLaptopMascot />
            </div>

          </div>

          {/* Institutional Ledger: 4 Core Facts (Harvard Token Scale) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-zinc-200">
            <div className="scroll-reveal-scale delay-75 p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-xs hover:border-pink-300 hover:shadow-sm transition-all space-y-1">
              <span className="text-[10.5px] font-mono font-bold text-pink-900 uppercase tracking-wider block">01 / WORKSTATIONS</span>
              <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-khmer-title">40+ គ្រឿង</p>
              <p className="text-xs text-zinc-600 font-kantumruy">{isKhmer ? 'សិស្ស ១នាក់ ប្រើម៉ាស៊ីន ១' : '1:1 Student Workstation Ratio'}</p>
            </div>

            <div className="scroll-reveal-scale delay-150 p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-xs hover:border-pink-300 hover:shadow-sm transition-all space-y-1">
              <span className="text-[10.5px] font-mono font-bold text-pink-900 uppercase tracking-wider block">02 / LAB SHIFTS</span>
              <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-khmer-title">៣ វេន</p>
              <p className="text-xs text-zinc-600 font-kantumruy">{isKhmer ? 'ល្ងាច វេន១ & ២, ចន្ទព្រឹក' : 'Evening 1, 2 & Monday AM'}</p>
            </div>

            <div className="scroll-reveal-scale delay-200 p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-xs hover:border-pink-300 hover:shadow-sm transition-all space-y-1">
              <span className="text-[10.5px] font-mono font-bold text-pink-900 uppercase tracking-wider block">03 / METHODOLOGY</span>
              <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-khmer-title">១០០% អនុវត្ត</p>
              <p className="text-xs text-zinc-600 font-kantumruy">{isKhmer ? 'រៀនអនុវត្តផ្ទាល់លើម៉ាស៊ីន' : 'Hands-on Daily Software'}</p>
            </div>

            <div className="scroll-reveal-scale delay-250 p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-xs hover:border-pink-300 hover:shadow-sm transition-all space-y-1">
              <span className="text-[10.5px] font-mono font-bold text-pink-900 uppercase tracking-wider block">04 / LMS PLATFORM</span>
              <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-khmer-title">CIIS LMS</p>
              <p className="text-xs text-zinc-600 font-kantumruy">{isKhmer ? 'កត់ត្រាវត្តមាន និងពិន្ទុ' : 'Real-time Speed & Scores'}</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. REAL SCHOOL CEREMONY & GRADUATION AWARDS SHOWCASE (5 Authentic Photos) */}
      {/* ========================================================================= */}
      <section id="ceremony-section" className="py-16 sm:py-24 bg-gradient-to-b from-zinc-50/80 via-white to-pink-50/20 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">

          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950 text-white text-xs">
                <Award className="w-3.5 h-3.5 text-pink-400" />
                <span className={isKhmer ? "font-kantumruy font-bold" : "font-mono font-bold"}>
                  {isKhmer ? 'ពិធីចែកវិញ្ញាបនបត្រ & សិស្សពូកែ' : 'ANNUAL GRADUATION & AWARDS CEREMONY'}
                </span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
                {isKhmer ? 'ទិដ្ឋភាពកម្មវិធីប្រគល់វិញ្ញាបនបត្រ និងប័ណ្ណសរសើរ' : 'Certificate & Appreciation Award Distribution Ceremony'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-md leading-relaxed font-kantumruy">
              {isKhmer
                ? 'រូបភាពក្នុងពិធីប្រគល់វិញ្ញាបនបត្របញ្ចប់ការសិក្សាថ្នាក់មត្តេយ្យ បឋមសិក្សា (ថ្នាក់ទី៦) និងការផ្តល់រង្វាន់លើកទឹកចិត្តដល់សិស្សពូកែ និយាយជាសាធារណៈ សូត្រកំណាព្យ និងអំណាន។'
                : 'Real photos from the official graduation and appreciation ceremony for kindergarten and primary graduates, celebrating student excellence in public speaking, poetry, and academic honors.'}
            </p>
          </div>

          {/* Featured Bento Grid for Ceremony Photos */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

            {/* Big Main Card (7 cols): Certificate Graduation with Parents & Faculty */}
            <div
              onClick={() => setSelectedGalleryItem(ceremonyEvents[0])}
              className="scroll-reveal-scale delay-75 md:col-span-7 group relative rounded-3xl overflow-hidden border-2 border-zinc-200/90 bg-zinc-950 shadow-md hover:shadow-2xl hover:border-pink-400 transition-all duration-500 cursor-pointer flex flex-col justify-end min-h-[380px] sm:min-h-[440px]"
            >
              <img
                src={ceremonyEvents[0].src}
                alt={ceremonyEvents[0].titleEn}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent group-hover:via-zinc-950/50 transition-all" />

              <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full bg-pink-900/95 backdrop-blur-md text-white text-[11.5px] font-bold border border-pink-400/40 ${isKhmer ? 'font-kantumruy' : 'font-mono uppercase tracking-wider'}`}>
                  {isKhmer ? ceremonyEvents[0].badgeKh : ceremonyEvents[0].badgeEn}
                </span>
                <span className={`px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}>
                  {isKhmer ? 'ឆ្នាំសិក្សា ២០២៣-២០២៤' : 'Academic Year 2023-2024'}
                </span>
              </div>

              <div className="relative z-20 p-6 sm:p-8 space-y-2 text-white">
                <h4 className="text-lg sm:text-2xl font-black text-white leading-tight group-hover:text-pink-200 transition-colors font-khmer-title">
                  {isKhmer ? ceremonyEvents[0].titleKh : ceremonyEvents[0].titleEn}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed font-kantumruy">
                  {isKhmer ? ceremonyEvents[0].descKh : ceremonyEvents[0].descEn}
                </p>
                <div className={`pt-2 flex items-center gap-2 text-xs text-pink-300 font-bold ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}>
                  <span>{isKhmer ? 'ចុចដើម្បីមើលរូបភាពធំ & ព័ត៌មានលម្អិត' : 'Click to view full photo & details'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Right Card (5 cols): Leadership Keynote Speech */}
            <div
              onClick={() => setSelectedGalleryItem(ceremonyEvents[1])}
              className="scroll-reveal-scale delay-150 md:col-span-5 group relative rounded-3xl overflow-hidden border-2 border-zinc-200/90 bg-zinc-950 shadow-md hover:shadow-2xl hover:border-pink-400 transition-all duration-500 cursor-pointer flex flex-col justify-end min-h-[380px] sm:min-h-[440px]"
            >
              <img
                src={ceremonyEvents[1].src}
                alt={ceremonyEvents[1].titleEn}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent group-hover:via-zinc-950/50 transition-all" />

              <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full bg-pink-900/95 backdrop-blur-md text-white text-[11.5px] font-bold border border-pink-400/40 ${isKhmer ? 'font-kantumruy' : 'font-mono uppercase tracking-wider'}`}>
                  {isKhmer ? ceremonyEvents[1].badgeKh : ceremonyEvents[1].badgeEn}
                </span>
              </div>

              <div className="relative z-20 p-6 sm:p-8 space-y-2 text-white">
                <h4 className="text-lg sm:text-xl font-black text-white leading-tight group-hover:text-pink-200 transition-colors font-khmer-title">
                  {isKhmer ? ceremonyEvents[1].titleKh : ceremonyEvents[1].titleEn}
                </h4>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-kantumruy">
                  {isKhmer ? ceremonyEvents[1].descKh : ceremonyEvents[1].descEn}
                </p>
                <div className={`pt-2 flex items-center gap-2 text-xs text-pink-300 font-bold ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}>
                  <span>{isKhmer ? 'ចុចមើលរូបភាព' : 'Click to view photo'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Bottom Row: 3 Equal Event Cards */}
            {ceremonyEvents.slice(2).map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedGalleryItem(item)}
                className={`scroll-reveal-scale md:col-span-4 group relative rounded-3xl overflow-hidden border border-zinc-200/90 bg-zinc-950 shadow-sm hover:shadow-xl hover:border-pink-400 transition-all duration-300 cursor-pointer flex flex-col justify-end min-h-[320px] ${idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : 'delay-300'
                  }`}
              >
                <img
                  src={item.src}
                  alt={item.titleEn}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent group-hover:via-zinc-950/50 transition-all" />

                <div className="absolute top-4 left-4 z-20">
                  <span className={`px-2.5 py-0.5 rounded-full bg-pink-900/90 text-white text-[11px] font-bold border border-pink-400/40 ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}>
                    {isKhmer ? item.badgeKh : item.badgeEn}
                  </span>
                </div>

                <div className="relative z-20 p-5 space-y-1.5 text-white">
                  <h4 className="text-sm sm:text-base font-black text-white line-clamp-2 leading-snug group-hover:text-pink-200 transition-colors font-khmer-title">
                    {isKhmer ? item.titleKh : item.titleEn}
                  </h4>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-kantumruy">
                    {isKhmer ? item.descKh : item.descEn}
                  </p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CLASS 1 & CLASS 2 STUDENT ACTIVITIES IN COMPUTER LAB 1 (Authentic)    */}
      {/* ========================================================================= */}
      <section id="activities-section" className="py-16 sm:py-24 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">

          {/* Section Header & Subtitle */}
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-950 text-white text-xs shadow-xs">
                <Laptop className="w-3.5 h-3.5 text-pink-400" />
                <span className={isKhmer ? "font-kantumruy font-bold" : "font-mono font-bold"}>
                  {isKhmer
                    ? (activeLabTab === 'class-1'
                      ? 'សកម្មភាពសិស្សថ្នាក់ទី១ • វេនល្ងាច ១ (៥:៣០-៦:៣០)'
                      : activeLabTab === 'class-2'
                        ? 'សកម្មភាពសិស្សថ្នាក់ទី២ • វេនល្ងាច ២ (៦:៤០-៧:៤០)'
                        : 'សកម្មភាពជាក់ស្តែងក្នុងបន្ទប់ Lab 1 (វេនទី១ & វេនទី២)')
                    : (activeLabTab === 'class-1'
                      ? 'CLASS 1 STUDENT ACTIVITIES • EVENING 1 (5:30-6:30 PM)'
                      : activeLabTab === 'class-2'
                        ? 'CLASS 2 STUDENT ACTIVITIES • EVENING 2 (6:40-7:40 PM)'
                        : 'HANDS-ON LAB 1 WORKSTATIONS (SHIFT 1 & 2)')}
                </span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
                {isKhmer ? 'ការអនុវត្តកុំព្យូទ័រផ្ទាល់របស់សិស្សក្នុងបន្ទប់ Lab' : 'Student Hands-On Computer Practice in Lab'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed font-kantumruy">
              {isKhmer
                ? 'រូបភាពក្នុងម៉ោងរៀនកុំព្យូទ័រវេនទី១ (៥:៣០-៦:៣០) និងវេនទី២ (៦:៤០-៧:៤០) សិស្សានុសិស្សម្នាក់ៗមានកុំព្យូទ័រយួរដៃ Dell & Acer ប្រើប្រាស់ផ្ទាល់ខ្លួន ដើម្បីរៀនវាយអក្សរ Touch Typing រៀបចំឯកសារ Word, Excel និងស្លាយ PowerPoint។'
                : 'Authentic photos from Evening Shift 1 (5:30-6:30 PM) and Shift 2 (6:40-7:40 PM). Every student has an individual laptop workstation to master Touch Typing, MS Word, Excel, and PowerPoint.'}
            </p>
          </div>

          {/* Shift Filter Switcher Tabs */}
          <div className="scroll-reveal delay-75 flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveLabTab('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeLabTab === 'all'
                ? 'bg-zinc-950 text-white shadow-md'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                } ${isKhmer ? 'font-kantumruy' : ''}`}
            >
              <span>{isKhmer ? 'ទាំងអស់ (All Photos)' : 'All Activities'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${activeLabTab === 'all' ? 'bg-pink-900 text-white' : 'bg-zinc-200 text-zinc-600'
                }`}>
                {lab1Activities.length + lab2Activities.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLabTab('class-1')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeLabTab === 'class-1'
                ? 'bg-gradient-to-r from-pink-900 to-pink-950 text-white shadow-md'
                : 'bg-pink-50/70 hover:bg-pink-100/80 text-pink-950 border border-pink-200/60'
                } ${isKhmer ? 'font-kantumruy' : ''}`}
            >
              <span>{isKhmer ? 'ថ្នាក់ទី១ • វេនល្ងាច ១ (៥:៣០ - ៦:៣០)' : 'Class 1 • Evening 1 (5:30 - 6:30 PM)'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${activeLabTab === 'class-1' ? 'bg-white text-pink-950' : 'bg-pink-200/80 text-pink-950'
                }`}>
                {lab1Activities.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLabTab('class-2')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeLabTab === 'class-2'
                ? 'bg-gradient-to-r from-pink-900 to-pink-950 text-white shadow-md'
                : 'bg-pink-50/70 hover:bg-pink-100/80 text-pink-950 border border-pink-200/60'
                } ${isKhmer ? 'font-kantumruy' : ''}`}
            >
              <span>{isKhmer ? 'ថ្នាក់ទី២ • វេនល្ងាច ២ (៦:៤០ - ៧:៤០)' : 'Class 2 • Evening 2 (6:40 - 7:40 PM)'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${activeLabTab === 'class-2' ? 'bg-white text-pink-950' : 'bg-pink-200/80 text-pink-950'
                }`}>
                {lab2Activities.length}
              </span>
            </button>
          </div>

          {/* Asymmetric Bento Grid Layout for Activities (Big, Wide & Standard Sizes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 auto-rows-[auto]">
            {displayedLabActivities.map((act, idx) => {
              // Calculate dynamic Bento card sizing based on active filter tab
              const isHero =
                (activeLabTab === 'all' && idx === 0) ||
                (activeLabTab === 'class-1' && idx === 0) ||
                (activeLabTab === 'class-2' && idx === 0);

              const isWide =
                (activeLabTab === 'all' && (idx === 1 || idx === 6 || idx === 7 || idx === 8)) ||
                (activeLabTab === 'class-1' && idx === 1) ||
                (activeLabTab === 'class-2' && (idx === 1 || idx === 4));

              const spanClasses = isHero
                ? 'col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[460px] lg:min-h-[520px]'
                : isWide
                  ? 'col-span-1 md:col-span-2 lg:col-span-2 min-h-[260px] sm:min-h-[280px]'
                  : 'col-span-1 min-h-[260px] sm:min-h-[280px]';

              const delayClass =
                idx === 0
                  ? 'delay-75'
                  : idx === 1
                    ? 'delay-100'
                    : idx === 2
                      ? 'delay-150'
                      : idx === 3
                        ? 'delay-200'
                        : idx === 4
                          ? 'delay-250'
                          : 'delay-300';

              return (
                <div
                  key={`${act.src}-${idx}`}
                  onClick={() => setSelectedGalleryItem(act)}
                  className={`scroll-reveal-scale ${delayClass} group relative rounded-3xl overflow-hidden border border-zinc-200/90 bg-zinc-950 shadow-2xs hover:shadow-2xl hover:border-pink-400/80 transition-all duration-500 cursor-pointer flex flex-col justify-between ${spanClasses}`}
                >
                  <img
                    src={act.src}
                    alt={act.titleEn}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${isHero
                      ? 'from-zinc-950 via-zinc-950/60 to-zinc-950/20 group-hover:via-zinc-950/70'
                      : 'from-zinc-950 via-zinc-950/50 to-transparent group-hover:via-zinc-950/60'
                      } transition-all duration-500`}
                  />

                  {/* Top Badges & Live Status */}
                  <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full bg-pink-900/95 text-white text-[11px] font-bold border border-pink-400/50 shadow-xs backdrop-blur-xs ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}>
                        {isKhmer ? act.badgeKh : act.badgeEn}
                      </span>
                      {isHero && (
                        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/85 text-emerald-300 border border-emerald-500/40 text-[10.5px] font-bold backdrop-blur-xs animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className={isKhmer ? 'font-kantumruy' : 'font-mono'}>
                            {isKhmer ? 'រូបភាពទិដ្ឋភាពធំ' : 'FEATURED SHOWCASE'}
                          </span>
                        </span>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full bg-black/75 text-white text-[10.5px] font-bold border border-white/20 shadow-xs backdrop-blur-xs ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}>
                      {isKhmer ? (act.classShiftKh || 'វេនល្ងាច') : (act.classShiftEn || 'Evening Shift')}
                    </span>
                  </div>

                  {/* Bottom Card Content */}
                  <div className={`relative z-10 p-5 sm:p-6 space-y-2 text-white ${isHero ? 'sm:space-y-3' : ''}`}>
                    <h4
                      className={`font-black text-white leading-snug group-hover:text-pink-200 transition-colors font-khmer-title ${isHero
                        ? 'text-lg sm:text-2xl line-clamp-3'
                        : isWide
                          ? 'text-base sm:text-lg line-clamp-2'
                          : 'text-sm sm:text-base line-clamp-2'
                        }`}
                    >
                      {isKhmer ? act.titleKh : act.titleEn}
                    </h4>
                    <p
                      className={`text-zinc-300 leading-relaxed font-kantumruy ${isHero
                        ? 'text-xs sm:text-sm line-clamp-3'
                        : isWide
                          ? 'text-xs line-clamp-2'
                          : 'text-[11.5px] line-clamp-2'
                        }`}
                    >
                      {isKhmer ? act.descKh : act.descEn}
                    </p>
                    <div
                      className={`pt-1.5 flex items-center gap-1.5 font-bold ${isHero
                        ? 'text-xs text-pink-300'
                        : 'text-[11.5px] text-pink-300'
                        } ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}
                    >
                      <span>{isKhmer ? 'ចុចដើម្បីមើលរូបភាពធំ & ព័ត៌មានលម្អិត' : 'View High-Res Photo & Details'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ACADEMIC LEVELS (Natural Khmer Curriculum Framework)                   */}
      {/* ========================================================================= */}
      <section id="levels-section" className="py-16 sm:py-24 bg-gradient-to-b from-zinc-50/80 via-white to-zinc-50/50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">

          {/* Section Header & Subtitle */}
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-950 text-white text-xs shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 text-pink-400" />
                <span className={isKhmer ? "font-kantumruy font-bold" : "font-mono font-bold"}>
                  {isKhmer ? 'កម្មវិធីសិក្សាផ្លូវការ • ៤ កម្រិត' : 'OFFICIAL ACADEMIC DISCIPLINES'}
                </span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
                {isKhmer ? 'កម្មវិធីសិក្សាទាំង ៤ កម្រិត' : 'The Four Core Academic Levels'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed font-kantumruy">
              {isKhmer
                ? 'សាលារៀន CIIS ផ្តល់ការអប់រំគ្រប់ជ្រុងជ្រោយ ចាប់ពីកុមារតូច បឋមសិក្សា វិទ្យាល័យ ដល់ជំនាញកុំព្យូទ័រជាក់ស្តែង និងភាសាអង់គ្លេស IELTS ដែលជាមូលដ្ឋានគ្រឹះរឹងមាំសម្រាប់អនាគតសិស្ស។'
                : 'CIIS delivers structured educational pathways from early childhood foundation to national primary, digital computer lab training, and international IELTS preparation.'}
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {academicLevels.map((item, idx) => {
              const delayClass = idx === 0 ? 'delay-75' : idx === 1 ? 'delay-150' : idx === 2 ? 'delay-200' : 'delay-250';

              return (
                <div
                  key={item.id}
                  className={`scroll-reveal-scale ${delayClass} group relative rounded-3xl transition-all duration-500 flex flex-col justify-between p-6 sm:p-7 overflow-hidden cursor-default bg-white border border-zinc-200/90 shadow-2xs hover:shadow-2xl hover:border-pink-900/40 -translate-y-0 hover:-translate-y-2`}
                >
                  {/* Subtle top indicator hover line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-pink-800 group-hover:via-rose-600 group-hover:to-pink-950 transition-all duration-500" />

                  <div className="space-y-4 relative z-10">
                    {/* Top Level Index Pill & Age Tag */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-300 ${isKhmer ? 'font-kantumruy' : 'font-mono'
                          } bg-pink-950/5 group-hover:bg-gradient-to-br group-hover:from-pink-800 group-hover:to-pink-950 text-pink-950 group-hover:text-white border border-pink-200/80 group-hover:border-pink-700 shadow-2xs`}
                      >
                        {isKhmer ? item.index : item.indexEn}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${isKhmer ? 'font-kantumruy' : 'font-mono'
                          } bg-zinc-50 border border-zinc-200 text-zinc-600 group-hover:border-pink-200 group-hover:bg-pink-50/50 group-hover:text-pink-950`}
                      >
                        {isKhmer ? item.ageKh : item.ageEn}
                      </span>
                    </div>

                    {/* Level Name */}
                    <h4
                      className="text-lg sm:text-xl font-black leading-snug font-khmer-title tracking-tight text-zinc-950 group-hover:text-pink-950 transition-colors"
                    >
                      {isKhmer ? item.nameKh : item.nameEn}
                    </h4>

                    {/* Level Description */}
                    <p
                      className="text-xs leading-relaxed font-normal font-kantumruy text-zinc-600"
                    >
                      {isKhmer ? item.descriptionKh : item.descriptionEn}
                    </p>

                    {/* Key Subjects List with Clean Minimalist Dots */}
                    <div
                      className="space-y-2.5 pt-4 border-t border-zinc-100 group-hover:border-pink-100 transition-colors"
                    >
                      <p
                        className={`text-[10.5px] font-bold text-zinc-400 group-hover:text-pink-900 ${isKhmer ? 'font-kantumruy tracking-normal' : 'font-mono uppercase tracking-wider'}`}
                      >
                        {isKhmer ? 'មុខវិជ្ជា & សកម្មភាពសំខាន់ៗ' : 'KEY MODULES & HIGHLIGHTS'}
                      </p>
                      <div className="space-y-2 text-xs font-kantumruy">
                        {(isKhmer ? item.highlightsKh : item.highlightsEn).map((h, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0 bg-pink-800 group-hover:bg-rose-600 group-hover:scale-125 transition-all"
                            />
                            <span
                              className="truncate font-medium text-zinc-700"
                            >
                              {h}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Direct Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalRole('student');
                      setShowAuthModal(true);
                    }}
                    className={`w-full mt-6 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer relative z-10 bg-zinc-50 group-hover:bg-gradient-to-r group-hover:from-pink-800 group-hover:to-pink-950 text-zinc-700 group-hover:text-white border border-zinc-200 group-hover:border-pink-700/40 shadow-2xs ${isKhmer ? 'font-kantumruy' : ''}`}
                  >
                    <span>
                      {isKhmer ? 'ចុះឈ្មោះចូលរៀនកម្រិតនេះ' : 'Enroll in this Level'}
                    </span>
                    <ArrowRight
                      className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all text-zinc-400 group-hover:text-pink-200"
                    />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. COMPUTER SCIENCE TEACHERS (Natural Khmer Titles & Profiles)            */}
      {/* ========================================================================= */}
      <section id="faculty-section" className="py-16 sm:py-24 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">

          {/* Section Header */}
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-950 text-white text-xs shadow-xs">
                <Users className="w-3.5 h-3.5 text-pink-400" />
                <span className={isKhmer ? "font-kantumruy font-bold" : "font-mono font-bold"}>
                  {isKhmer ? 'ក្រុមគ្រូបង្រៀនកុំព្យូទ័រ • CIIS COMPUTER FACULTY' : 'CIIS COMPUTER SCIENCE FACULTY'}
                </span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
                {isKhmer ? 'លោកគ្រូអ្នកគ្រូផ្នែកកុំព្យូទ័រ CIIS' : 'CIIS Computer Science Faculty'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed font-kantumruy">
              {isKhmer
                ? 'លោកគ្រូបង្រៀនជំនាញកុំព្យូទ័រផ្ទាល់ក្នុងបន្ទប់ Lab 1 ប្រកបដោយគរុកោសល្យខ្ពស់ ចិត្តល្អ យកចិត្តទុកដាក់ និងណែនាំសិស្សអនុវត្តផ្ទាល់លើម៉ាស៊ីនមួយទល់មួយ។'
                : 'Qualified computer instructors providing individualized workstation guidance, practical software workflows, and structured touch-typing pedagogy.'}
            </p>
          </div>

          {/* 3 Teacher Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {TEACHERS_DATA.map((teacher, idx) => (
              <div key={teacher.id} className={`scroll-reveal-scale ${idx === 0 ? 'delay-75' : idx === 1 ? 'delay-150' : 'delay-225'}`}>
                <TeacherCard
                  teacher={teacher}
                  onViewDetails={(t) => setSelectedTeacher(t)}
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. COMPUTER LAB SHIFTS & ENROLLMENT (3 Scheduled Working Shifts)          */}
      {/* ========================================================================= */}
      <section id="shifts-section" className="py-16 sm:py-24 bg-gradient-to-b from-zinc-50/80 via-white to-zinc-50/50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">

          {/* Section Header */}
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-950 text-white text-xs shadow-xs">
                <Clock className="w-3.5 h-3.5 text-pink-400" />
                <span className={isKhmer ? "font-kantumruy font-bold" : "font-mono font-bold"}>
                  {isKhmer ? 'កាលវិភាគ & វេនសិក្សាជាក់ស្តែង • OFFICIAL SHIFT TIMETABLE' : 'OFFICIAL LAB SHIFT TIMETABLE'}
                </span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
                {isKhmer ? 'កាលវិភាគថ្នាក់កុំព្យូទ័រ (៣ វេន)' : 'Computer Lab Shift Timetable'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed font-kantumruy">
              {isKhmer
                ? 'ជ្រើសរើសវេនសិក្សាដែលសមស្របតាមពេលវេលារបស់អ្នក ឬកូនៗរបស់អ្នក ដើម្បីចូលរៀនកុំព្យូទ័រជាក់ស្តែងក្នុងបន្ទប់ Lab 1 ជាមួយកុំព្យូទ័រផ្ទាល់ខ្លួន ១ គ្រឿងក្នុងម្នាក់។'
                : 'Flexible morning and evening computer lab shifts designed around your schedule, ensuring 1 dedicated workstation per student.'}
            </p>
          </div>

          {/* 3 Shift Cards with High-Impact Executive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {labShifts.map((shift, idx) => (
              <div
                key={shift.id}
                className={`scroll-reveal-scale ${idx === 0 ? 'delay-75' : idx === 1 ? 'delay-150' : 'delay-225'} group relative rounded-3xl bg-white border border-zinc-200/90 shadow-2xs hover:shadow-2xl hover:border-pink-900/40 transition-all duration-500 flex flex-col justify-between p-6 sm:p-7 -translate-y-0 hover:-translate-y-2 overflow-hidden cursor-default`}
              >
                {/* Top Accent Gradient Line on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-pink-800 group-hover:via-rose-600 group-hover:to-pink-950 transition-all duration-500" />

                <div className="space-y-4">
                  {/* Top Row: Shift Code & Status Pill */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-xl bg-pink-950 text-white text-xs font-black shadow-2xs ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}>
                      {isKhmer ? shift.code : shift.codeEn}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-pink-50 border border-pink-200 text-pink-950 ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span>{isKhmer ? shift.statusKh : shift.statusEn}</span>
                    </span>
                  </div>

                  {/* Shift Title & Assigned Instructor */}
                  <div className="space-y-1 pt-1">
                    <h4 className="text-xl font-black text-zinc-950 group-hover:text-pink-950 transition-colors leading-snug font-khmer-title tracking-tight">
                      {isKhmer ? shift.nameKh : shift.nameEn}
                    </h4>
                    <p className={`text-xs font-bold text-pink-900 ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}>
                      {isKhmer ? shift.teacherKh : shift.teacherEn}
                    </p>
                  </div>

                  {/* High-Contrast Time & Workstation Card */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs font-kantumruy">
                    <div className="flex items-center gap-2.5 text-zinc-900 font-bold">
                      <Clock className="w-4 h-4 text-pink-800 shrink-0" />
                      <span>{isKhmer ? shift.timeKh : shift.timeEn}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-zinc-600 font-medium pt-1 border-t border-zinc-200/60">
                      <Laptop className="w-4 h-4 text-pink-800 shrink-0" />
                      <span>{isKhmer ? shift.roomKh : shift.roomEn}</span>
                    </div>
                  </div>

                  {/* Curriculum Modules Checklist with Clean Minimalist Dots */}
                  <div className="space-y-2.5 pt-3 border-t border-zinc-100 group-hover:border-pink-100 transition-colors">
                    <p className={`text-[10.5px] font-bold text-zinc-400 group-hover:text-pink-900 transition-colors ${isKhmer ? 'font-kantumruy tracking-normal' : 'font-mono uppercase tracking-wider'}`}>
                      {isKhmer ? 'មេរៀនដែលត្រូវរៀនជាក់ស្តែង' : 'CORE CURRICULUM MODULES'}
                    </p>
                    <div className="space-y-2 text-xs text-zinc-700 font-kantumruy">
                      {(isKhmer ? shift.subjectsKh : shift.subjectsEn).map((m, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-800 group-hover:bg-rose-600 group-hover:scale-125 transition-all shrink-0" />
                          <span className="truncate font-medium">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalRole('student');
                    setShowAuthModal(true);
                  }}
                  className={`w-full mt-6 py-2.5 px-4 rounded-2xl bg-zinc-900 group-hover:bg-gradient-to-r group-hover:from-pink-800 group-hover:to-pink-950 text-white font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-2xs group-hover:shadow-md ${isKhmer ? 'font-kantumruy' : ''}`}
                >
                  <UserPlus className="w-3.5 h-3.5 text-pink-300" />
                  <span>{isKhmer ? 'ចុះឈ្មោះចូលរៀនវេននេះ' : 'Enroll in this Shift'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-pink-300 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. ABOUT THE DEVELOPER — Minimalist Text Link (Expands on Click)          */}
      {/* ========================================================================= */}
      <section id="developer-section" className="py-4 bg-[#fcfcfd] border-t border-zinc-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isDeveloperExpanded ? (
            <div className="flex items-center justify-center py-1">
              <button
                type="button"
                onClick={() => setIsDeveloperExpanded(true)}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600 hover:text-zinc-950 text-xs font-mono transition-all duration-200 cursor-pointer shadow-2xs"
              >
                <Code2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-950 transition-colors" />
                <span className={isKhmer ? 'font-kantumruy font-semibold' : 'font-mono'}>
                  {isKhmer
                    ? 'ស្វែងយល់បន្ថែមអំពី Developer (JJ-DEV)'
                    : 'About the System Developer (JJ-DEV)'}
                </span>
                <span className="text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-transform text-xs">→</span>
              </button>
            </div>
          ) : (
            <div className="py-6 space-y-6 animate-in fade-in zoom-in-98 duration-300">
              {/* Header with Close/Minimize button */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4 text-left">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-zinc-100 text-zinc-800 border border-zinc-200 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-zinc-800" />
                    {isKhmer ? 'អំពីអ្នកបង្កើតប្រព័ន្ធ' : 'ABOUT THE DEVELOPER'}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">CIIS LMS SYSTEM ARCHITECT</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDeveloperExpanded(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{isKhmer ? 'បង្រួម / បិទ' : 'Minimize View'}</span>
                </button>
              </div>

              {/* Masterpiece 2-Column Developer Showcase */}
              <div className="p-6 sm:p-10 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-xl space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start text-left">

                  {/* LEFT COLUMN: Developer Portrait & Personal Stat Cards */}
                  <div className="lg:col-span-5 space-y-6">

                    {/* Portrait Container */}
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl group max-w-sm mx-auto lg:max-w-none">
                      <img
                        src="/images/choeurn-tekchas.jpg"
                        alt="Choeurn Tekchas"
                        className="w-full h-80 sm:h-96 object-cover object-top group-hover:scale-103 transition-transform duration-700 ease-out"
                      />

                      {/* Live Building Badge Overlay */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold shadow-md">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Currently Building
                        </span>
                      </div>

                      {/* Gradient Overlay at Bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-pink-900/90 text-white text-[10px] font-mono font-bold">
                            JJ-DEV
                          </span>
                          <span className="text-[11px] font-mono text-zinc-300">
                            AI & SOFTWARE DEVELOPER
                          </span>
                        </div>
                        <h4 className="text-2xl font-black text-white tracking-tight">
                          CHOEURN TEKCHAS
                        </h4>
                        <p className="text-xs text-pink-300 font-medium font-kantumruy">
                          ជឿន តេជៈ (Preferred Name: JAME)
                        </p>
                      </div>
                    </div>

                    {/* 4 Personal Metric / Stat Cards */}
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 hover:border-zinc-500 transition-colors">
                        <span className="text-[10.5px] text-zinc-500 block uppercase">Started Coding</span>
                        <span className="text-white font-bold text-sm">Grade 9</span>
                        <span className="text-[10px] text-zinc-400 block">HTML, CSS & Beyond</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 hover:border-zinc-500 transition-colors">
                        <span className="text-[10.5px] text-zinc-500 block uppercase">Core Focus</span>
                        <span className="text-pink-400 font-bold text-sm">AI + Software</span>
                        <span className="text-[10px] text-zinc-400 block">Practical Architecture</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 hover:border-zinc-500 transition-colors">
                        <span className="text-[10.5px] text-zinc-500 block uppercase">Learning Style</span>
                        <span className="text-white font-bold text-sm">Build & Test</span>
                        <span className="text-[10px] text-zinc-400 block">Hands-on Experience</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 hover:border-zinc-500 transition-colors">
                        <span className="text-[10.5px] text-zinc-500 block uppercase">Current Direction</span>
                        <span className="text-pink-400 font-bold text-sm">AI Engineering</span>
                        <span className="text-[10px] text-zinc-400 block">Applied Intelligence</span>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: Journey Narrative, Approach Visual, Focus Tags & Actions */}
                  <div className="lg:col-span-7 space-y-7">

                    {/* Headline */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-pink-300 border border-white/20 text-[10.5px] font-mono font-bold uppercase tracking-wider">
                          DEVELOPER STORY
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">YOUNG BUILDER • AI ENTHUSIAST</span>
                      </div>

                      <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug font-khmer-title">
                        {isKhmer ? (
                          <>
                            “ខ្ញុំបង្កើតបច្ចេកវិទ្យាដោយបង្វែរគំនិត <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200">
                              ឱ្យក្លាយជាប្រព័ន្ធជាក់ស្តែង។”
                            </span>
                          </>
                        ) : (
                          <>
                            “I build technology by turning ideas <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200">
                              into real systems.”
                            </span>
                          </>
                        )}
                      </h3>
                    </div>

                    {/* 3 Concise Narrative Paragraphs */}
                    <div className="space-y-4 text-zinc-300 text-sm sm:text-[15px] leading-relaxed font-kantumruy">
                      <p>
                        {isKhmer
                          ? 'ខ្ញុំបានចាប់ផ្តើមដំណើរការសរសេរកូដតាំងពីថ្នាក់ទី ៩ ដោយផ្តើមចេញពី HTML និង CSS ហើយបានចាប់ចិត្តយ៉ាងខ្លាំងក្នុងការបង្កើតផលិតផលឌីជីថលពិតៗ។ ចំណង់ចំណូលចិត្តរបស់ខ្ញុំលើ AI បានរីកចម្រើនយ៉ាងខ្លាំងបន្ទាប់ពីការលេចឡើងនៃ ChatGPT ក្នុងឆ្នាំ ២០២២ ដែលជំរុញឱ្យខ្ញុំស្វែងយល់យ៉ាងស៊ីជម្រៅអំពី Artificial Intelligence, Software Engineering និងឧបករណ៍បច្ចេកវិទ្យាទំនើបៗ។'
                          : 'I started my coding journey in Grade 9, beginning with HTML and CSS and gradually becoming interested in building real digital products. My interest in AI grew strongly after discovering ChatGPT in 2022, which motivated me to explore artificial intelligence, software engineering, and modern development tools.'}
                      </p>

                      <p>
                        {isKhmer
                          ? 'ជាជាងការរៀនត្រឹមតែទ្រឹស្តី ខ្ញុំរៀនតាមរយៈការអនុវត្តជាក់ស្តែង (Learn by Building)។ ខ្ញុំបានអភិវឌ្ឍប្រព័ន្ធអប់រំ, ប្រព័ន្ធសិក្សាជំនួយដោយ AI, ឧបករណ៍គ្រប់គ្រងសាលា, ប្រព័ន្ធស្រង់វត្តមាន, កម្មវិធីបង្កើត CV, ប្រព័ន្ធ QR Video, ប្រព័ន្ធកុម្ម៉ង់ម្ហូប និង Web Application ជាក់ស្តែងជាច្រើនទៀត។'
                          : 'Rather than learning only through theory, I learn by building. I have worked on educational platforms, AI-powered learning systems, school management tools, attendance engines, CV generators, QR video platforms, restaurant ordering systems, and other practical web applications.'}
                      </p>

                      <p>
                        {isKhmer
                          ? 'ចំណុចសំខាន់ក្នុងដំណើរអភិវឌ្ឍន៍របស់ខ្ញុំ គឺការប្រើប្រាស់ AI ជាដៃគូសហការ (Development Partner)។ ខ្ញុំមិនគ្រាន់តែឱ្យ AI បង្កើតកូដនោះឡើយ ប៉ុន្តែប្រើវាដើម្បីពិភាក្សាគំនិត ស្វែងយល់ពីបច្ចេកវិទ្យា ដោះស្រាយបញ្ហាស្មុគស្មាញ បង្កើនប្រសិទ្ធភាព Architecture និងពិសោធន៍ UI/UX ដើម្បីប្រែក្លាយគំនិតឱ្យទៅជាប្រព័ន្ធរឹងមាំ និងដំណើរការបានល្អ។'
                          : 'A major part of my development journey has been using AI as a development partner. I don’t simply ask AI to generate code and accept the result. I use it to explore ideas, understand technologies, debug problems, improve architecture, experiment with UI/UX, and turn ideas into working systems.'}
                      </p>
                    </div>

                    {/* My Approach Visual Sequence */}
                    <div className="space-y-2 pt-1">
                      <p className="text-xs font-mono text-pink-400 font-bold uppercase tracking-wider">
                        DEVELOPMENT APPROACH
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] font-mono font-bold text-white">
                        <span className="px-3 py-1.5 rounded-xl bg-pink-950/80 border border-pink-500/30 text-pink-300">THINK</span>
                        <span className="text-zinc-600">→</span>
                        <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200">BUILD</span>
                        <span className="text-zinc-600">→</span>
                        <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200">TEST</span>
                        <span className="text-zinc-600">→</span>
                        <span className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300">BREAK</span>
                        <span className="text-zinc-600">→</span>
                        <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200">DEBUG</span>
                        <span className="text-zinc-600">→</span>
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">IMPROVE</span>
                        <span className="text-zinc-600">→</span>
                        <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-pink-400">REPEAT</span>
                      </div>
                    </div>

                    {/* Core Technical Focus Tags */}
                    <div className="space-y-2 pt-1">
                      <p className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">
                        INTERESTS & TECHNICAL SCOPE
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Artificial Intelligence',
                          'Software Engineering',
                          'Full-Stack Development',
                          'Web Applications',
                          'Machine Learning',
                          'Cloud Technologies',
                          'Cybersecurity',
                          'Educational Technology',
                          'React 18 & TypeScript'
                        ].map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 hover:border-zinc-500 text-xs font-mono text-zinc-300 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Philosophy Statement Box */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-950/40 via-rose-950/30 to-zinc-900 border border-pink-500/30 shadow-inner">
                      <p className="text-sm sm:text-base font-bold text-white italic font-khmer-title">
                        “I don’t just want to learn technology. I want to build something useful with it.”
                      </p>
                      <p className="text-xs text-pink-400 font-mono mt-1">
                        — CHOEURN TEKCHAS (JAME), AI & Software Developer
                      </p>
                    </div>

                    {/* Actions Bar: Visit Portfolio & Collapse Button */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href="https://portfolio-jame7.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-700 via-pink-600 to-rose-600 hover:from-pink-600 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-102 ${isKhmer ? 'font-kantumruy' : ''}`}
                      >
                        <span>{isKhmer ? 'ចូលមើល Portfolio របស់ JJ-DEV' : 'Visit JJ-DEV Portfolio'}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        type="button"
                        onClick={() => setIsDeveloperExpanded(false)}
                        className="px-4 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer"
                      >
                        {isKhmer ? 'បង្រួមការបង្ហាញ (Collapse)' : 'Minimize View'}
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9.5. CONTACT ADMIN & INSTITUTIONAL INQUIRY (Clean Monochromatic Design)    */}
      {/* ========================================================================= */}
      <section id="contact-admin-section" className="py-16 sm:py-24 bg-[#fcfcfd] text-zinc-900 relative overflow-hidden border-t border-zinc-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-14">

          {/* SECTION HEADER: Clean Minimalist Typography */}
          <div className="scroll-reveal text-center max-w-3xl mx-auto space-y-3.5">
            <div className="flex items-center justify-center">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 text-xs font-bold ${isKhmer ? 'font-kantumruy' : 'font-mono uppercase tracking-wider'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                {isKhmer ? 'ទំនាក់ទំនង & ការិយាល័យរដ្ឋបាល' : 'ADMINISTRATION & DIRECT CONTACT'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-[1.2] font-khmer-title">
              {isKhmer ? 'ទំនាក់ទំនងមកកាន់សាលារៀន CIIS' : 'Contact CIIS International School'}
            </h2>

            <p className="text-zinc-600 text-xs sm:text-sm lg:text-base font-normal max-w-2xl mx-auto font-kantumruy leading-relaxed">
              {isKhmer
                ? 'សម្រាប់ព័ត៌មានបន្ថែមអំពីការចុះឈ្មោះចូលរៀន ថ្នាក់កុំព្យូទ័រ Lab 1 ឬកាលវិភាគសិក្សា សូមទាក់ទងមកកាន់រដ្ឋបាលសាលា ឬផ្ញើសារសាកសួរតាមទម្រង់ខាងក្រោម។'
                : 'For enrollment inquiries, Computer Lab 1 shifts, academic programs, or campus visits, please contact our administration team directly or submit a message below.'}
            </p>
          </div>

          {/* TWO-COLUMN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* LEFT COLUMN: School Directory & Direct Contact Cards (6 cols on lg) */}
            <div className="scroll-reveal-left lg:col-span-6 space-y-4 text-left">

              {/* 1. CAMPUS ADDRESS WITH LIVE GOOGLE MAP TRIGGER */}
              <div
                onClick={() => setShowMapModal(true)}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs hover:border-pink-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden text-left"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowMapModal(true);
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 group-hover:bg-pink-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm sm:text-base font-black text-zinc-950 group-hover:text-pink-900 transition-colors ${isKhmer ? 'font-khmer-title' : ''}`}>
                        {isKhmer ? 'អាសយដ្ឋានទីតាំងសាលា' : 'Campus Location'}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE MAP
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed font-kantumruy">
                      #01, St. Betong, Sangkat Kambol, Khan Kambol, Phnom Penh, Cambodia
                    </p>
                  </div>
                </div>

                {/* Interactive Click Prompt Bar */}
                <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-pink-700 group-hover:text-pink-800 transition-colors">
                  <span className="flex items-center gap-1.5 font-kantumruy">
                    <Navigation className="w-3.5 h-3.5 text-pink-600 group-hover:translate-x-0.5 transition-transform" />
                    {isKhmer ? 'ចុចដើម្បីបើកមើលទីតាំងផ្ទាល់លើ Google Maps' : 'Click to view live interactive Google Map'}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400 group-hover:text-pink-600 flex items-center gap-0.5 transition-colors">
                    11.5261, 104.7820
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* 2. DIRECT PHONE HOTLINES WITH CARRIERS */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all space-y-3.5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className={`text-sm sm:text-base font-black text-zinc-950 ${isKhmer ? 'font-khmer-title' : ''}`}>
                      {isKhmer ? 'លេខទូរស័ព្ទទំនាក់ទំនងផ្ទាល់' : 'Direct Telephone Lines'}
                    </h3>
                    <p className="text-xs text-zinc-500 font-kantumruy">
                      {isKhmer ? 'អាចទាក់ទងបានរៀងរាល់ថ្ងៃធ្វើការ (ចុចដើម្បីតេ)' : 'Tap any number below for direct one-click calling'}
                    </p>
                  </div>
                </div>

                {/* Carrier Contact Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-0.5">
                  {/* Smart */}
                  <a
                    href="tel:081505605"
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 text-zinc-900 text-xs font-mono font-bold transition-all shadow-2xs group"
                  >
                    <img
                      src="/carriers/smart-logo.png"
                      alt="Smart"
                      className="w-6 h-6 rounded-lg object-contain bg-[#00a651] p-0.5 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="block text-[9px] text-zinc-500 uppercase">Smart</span>
                      <span className="truncate">081 505 605</span>
                    </div>
                  </a>

                  {/* Metfone */}
                  <a
                    href="tel:067505605"
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 text-zinc-900 text-xs font-mono font-bold transition-all shadow-2xs group"
                  >
                    <img
                      src="/carriers/metfone-logo.png"
                      alt="Metfone"
                      className="w-6 h-6 rounded-lg object-contain bg-[#e60000] p-0.5 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="block text-[9px] text-zinc-500 uppercase">Metfone</span>
                      <span className="truncate">067 505 605</span>
                    </div>
                  </a>

                  {/* Cellcard */}
                  <a
                    href="tel:095505605"
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 text-zinc-900 text-xs font-mono font-bold transition-all shadow-2xs group"
                  >
                    <img
                      src="/carriers/cellcard-logo.png"
                      alt="Cellcard"
                      className="w-6 h-6 rounded-lg object-cover bg-[#f39200] shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="block text-[9px] text-zinc-500 uppercase">Cellcard</span>
                      <span className="truncate">095 505 605</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* 3. EMAIL & OFFICE HOURS (2 Grid Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Card */}
                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-black text-zinc-950 ${isKhmer ? 'font-khmer-title' : ''}`}>
                        {isKhmer ? 'សារអេឡិចត្រូនិច' : 'Official Email'}
                      </h4>
                      <span className="text-[10px] text-zinc-400 font-mono">Response &lt;24h</span>
                    </div>
                  </div>
                  <a
                    href="mailto:ciis@ciscambodia.com"
                    className="block text-xs sm:text-sm font-mono font-bold text-zinc-900 hover:text-zinc-600 hover:underline truncate"
                  >
                    ciis@ciscambodia.com
                  </a>
                </div>

                {/* Office Hours Card */}
                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-black text-zinc-950 ${isKhmer ? 'font-khmer-title' : ''}`}>
                        {isKhmer ? 'ម៉ោងធ្វើការរដ្ឋបាល' : 'Office Hours'}
                      </h4>
                      <span className="text-[10px] text-zinc-400 font-mono">Mon - Fri</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-700 font-mono font-bold truncate">
                    7:00 AM – 7:40 PM
                  </p>
                </div>
              </div>

              {/* 4. SOCIAL MEDIA / FACEBOOK PAGES */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center justify-center shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-xs font-black text-zinc-950 ${isKhmer ? 'font-khmer-title' : ''}`}>
                      {isKhmer ? 'ទំព័រហ្វេសប៊ុកផ្លូវការរបស់សាលា' : 'Official Facebook Pages'}
                    </p>
                    <p className="text-[10.5px] text-zinc-500 font-kantumruy">
                      {isKhmer ? 'តាមដានព័ត៌មាន & សកម្មភាពសិស្ស' : 'Follow news & student events'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href="https://www.facebook.com/share/19Efi4Q7LV/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border border-zinc-200 hover:border-zinc-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[9px] font-black">f</span>
                    <span className={isKhmer ? 'font-kantumruy' : 'font-mono'}>{isKhmer ? 'ទំព័រទី ១' : 'Page 1'}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>

                  <a
                    href="https://www.facebook.com/share/1BpGnEa6aa/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border border-zinc-200 hover:border-zinc-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[9px] font-black">f</span>
                    <span className={isKhmer ? 'font-kantumruy' : 'font-mono'}>{isKhmer ? 'ទំព័រទី ២' : 'Page 2'}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Quick Inquiry Form Card (6 cols on lg) */}
            <div className="scroll-reveal-right delay-150 lg:col-span-6 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-left relative">

              {/* Form Header */}
              <div className="space-y-1.5 border-b border-zinc-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-bold border border-zinc-200 ${isKhmer ? 'font-kantumruy' : 'font-mono uppercase'}`}>
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-700" />
                    {isKhmer ? 'ទម្រង់សាកសួរព័ត៌មាន' : 'Direct Inquiry Form'}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">Response &lt;24h</span>
                </div>
                <h3 className={`text-lg sm:text-xl font-black text-zinc-950 tracking-tight ${isKhmer ? 'font-khmer-title' : ''}`}>
                  {isKhmer ? 'ផ្ញើសារមកកាន់រដ្ឋបាលសាលា' : 'Send an Admission Inquiry'}
                </h3>
                <p className="text-xs text-zinc-500 font-kantumruy leading-relaxed">
                  {isKhmer
                    ? 'សូមបំពេញព័ត៌មានខាងក្រោម ក្រុមការងាររដ្ឋបាលនឹងទាក់ទងមកលោកអ្នកវិញយ៉ាងឆាប់រហ័ស។'
                    : 'Fill in your details below and our school administration will get back to you promptly.'}
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center mx-auto shadow-2xs">
                    <CheckCircle2 className="w-7 h-7 text-zinc-900" />
                  </div>
                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <h4 className={`text-base font-black text-zinc-950 ${isKhmer ? 'font-khmer-title' : ''}`}>
                      {isKhmer ? 'សាររបស់អ្នកត្រូវបានផ្ញើរួចរាល់!' : 'Inquiry Submitted Successfully!'}
                    </h4>
                    <p className="text-xs text-zinc-600 font-kantumruy leading-relaxed">
                      {isKhmer
                        ? 'សូមអរគុណសម្រាប់ការទាក់ទងមកកាន់ CIIS។ ក្រុមការងាររដ្ឋបាលសាលានឹងពិនិត្យ និងទាក់ទងមកកាន់លេខទូរស័ព្ទរបស់អ្នកក្នុងពេលឆាប់ៗ។'
                        : 'Thank you for contacting CIIS. Our administration team has received your message and will reach out to you shortly.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInquirySubmitted(false);
                      setInquiryForm({ name: '', phone: '', program: 'computer-lab', message: '' });
                    }}
                    className={`px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors cursor-pointer ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}
                  >
                    {isKhmer ? 'ផ្ញើសារថ្មីមួយទៀត' : 'Send Another Inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  {/* Full Name & Phone/Telegram in 2 Cols on sm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={`block text-xs font-bold text-zinc-700 ${isKhmer ? 'font-kantumruy' : ''}`}>
                        {isKhmer ? 'ឈ្មោះសិស្ស / អាណាព្យាបាល *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        placeholder={isKhmer ? 'ឧ. សុខ ចាន់ដារា' : 'e.g. John Doe'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={`block text-xs font-bold text-zinc-700 ${isKhmer ? 'font-kantumruy' : ''}`}>
                        {isKhmer ? 'លេខទូរស័ព្ទ / Telegram *' : 'Phone / Telegram *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        placeholder={isKhmer ? 'ឧ. 081 505 605' : 'e.g. 081 505 605'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all font-mono font-medium"
                      />
                    </div>
                  </div>

                  {/* Program Selection */}
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-bold text-zinc-700 ${isKhmer ? 'font-kantumruy' : ''}`}>
                      {isKhmer ? 'ផ្នែក / កម្មវិធីសិក្សាដែលចាប់អារម្មណ៍' : 'Program of Interest'}
                    </label>
                    <select
                      value={inquiryForm.program}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all font-medium cursor-pointer"
                    >
                      <option value="computer-lab">
                        {isKhmer ? 'ថ្នាក់រៀនកុំព្យូទ័រអនុវត្ត Lab 1 (Touch Typing, Word, Excel)' : 'Practical Computer Lab 1 (Typing, Word, Excel)'}
                      </option>
                      <option value="grade-1-12">
                        {isKhmer ? 'ចំណេះទូទៅ ថ្នាក់ទី១ ដល់ ទី១២ (បឋម, អនុ, វិទ្យាល័យ)' : 'General Education: Grades 1 to 12'}
                      </option>
                      <option value="kindergarten">
                        {isKhmer ? 'ថ្នាក់មត្តេយ្យសិក្សា (កុមារតូច ៣-៥ ឆ្នាំ)' : 'Early Childhood & Kindergarten'}
                      </option>
                      <option value="ielts-english">
                        {isKhmer ? 'ថ្នាក់ភាសាអង់គ្លេសទូទៅ & IELTS' : 'International English & IELTS Track'}
                      </option>
                      <option value="other">
                        {isKhmer ? 'ព័ត៌មានទូទៅផ្សេងៗ (Other Inquiries)' : 'General Inquiries & Campus Visit'}
                      </option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-bold text-zinc-700 ${isKhmer ? 'font-kantumruy' : ''}`}>
                      {isKhmer ? 'សារសាកសួរ / ចម្ងល់ផ្សេងៗ' : 'Your Message / Questions'}
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder={isKhmer ? 'សរសេរសារ ឬចម្ងល់របស់អ្នកនៅទីនេះ...' : 'Write your questions or notes here...'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all font-medium resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className={`w-full py-3 px-5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-70 ${isKhmer ? 'font-kantumruy' : ''}`}
                  >
                    {isSubmittingInquiry ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isKhmer ? 'កំពុងផ្ញើសារ...' : 'Sending Message...'}</span>
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-zinc-300" />
                        <span>{isKhmer ? 'ផ្ញើសារសាកសួរទៅកាន់រដ្ឋបាល' : 'Submit Admission Inquiry'}</span>
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
      {/* 10. HARVARD-GRADE INSTITUTIONAL MULTI-COLUMN FOOTER                       */}
      {/* ========================================================================= */}
      <footer className="py-14 bg-black text-zinc-400 text-xs border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-zinc-800">
            {/* Brand Information */}
            <div className="scroll-reveal space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 p-1 flex items-center justify-center border border-white/20">
                  <img src="/ciis-logo.svg" alt="CIIS Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider font-khmer-title">
                    {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស' : 'CIIS INTERNATIONAL SCHOOL'}
                  </h4>
                  <p className="text-[10px] text-pink-400 font-mono">CIIS LMS ACADEMIC NETWORK</p>
                </div>
              </div>
              <p className="text-xs text-zinc-400 max-w-md leading-relaxed font-kantumruy">
                {isKhmer
                  ? 'ស្ថាប័នអប់រំចំណេះទូទៅ និងការបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រជាក់ស្តែងនៅកម្ពុជា។'
                  : 'Delivering holistic academic excellence, language mastery, and hands-on computer literacy in Phnom Penh, Cambodia.'}
              </p>
            </div>

            {/* Academic Navigation */}
            <div className="scroll-reveal delay-100 space-y-2">
              <p className={`text-xs font-bold text-white ${isKhmer ? 'font-kantumruy' : 'font-mono uppercase tracking-wider'}`}>
                {isKhmer ? 'ផ្នែកសិក្សា' : 'ACADEMIC SECTIONS'}
              </p>
              <ul className={`space-y-1.5 text-zinc-400 ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}>
                <li><a href="#about-overview" className="hover:text-pink-400 transition-colors">{isKhmer ? 'អំពីសាលា CIIS' : 'About CIIS'}</a></li>
                <li><a href="#ceremony-section" className="hover:text-pink-400 transition-colors">{isKhmer ? 'ពិធីចែកសញ្ញាបត្រ' : 'Graduation Ceremony'}</a></li>
                <li><a href="#activities-section" className="hover:text-pink-400 transition-colors">{isKhmer ? 'ថ្នាក់កុំព្យូទ័រ Lab 1' : 'Computer Lab 1'}</a></li>
                <li><a href="#levels-section" className="hover:text-pink-400 transition-colors">{isKhmer ? 'កម្រិតសិក្សាទាំង ៤' : 'Academic Levels'}</a></li>
                <li><a href="#faculty-section" className="hover:text-pink-400 transition-colors">{isKhmer ? 'លោកគ្រូអ្នកគ្រូ' : 'Faculty'}</a></li>
                <li><a href="#contact-admin-section" className="hover:text-pink-400 transition-colors">{isKhmer ? 'ទំនាក់ទំនងរដ្ឋបាល' : 'Contact Admin'}</a></li>
              </ul>
            </div>

            {/* Quick System Access */}
            <div className="scroll-reveal delay-200 space-y-2">
              <p className={`text-xs font-bold text-white ${isKhmer ? 'font-kantumruy' : 'font-mono uppercase tracking-wider'}`}>
                {isKhmer ? 'ច្រកចូលប្រព័ន្ធ' : 'PORTAL ACCESS'}
              </p>
              <ul className={`space-y-1.5 text-zinc-400 ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}>
                <li>
                  <button
                    onClick={() => {
                      setAuthModalRole('student');
                      setShowAuthModal(true);
                    }}
                    className="hover:text-pink-400 transition-colors cursor-pointer text-left"
                  >
                    {isKhmer ? 'ចូលគណនីសិស្ស (Student)' : 'Student Portal Login'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setAuthModalRole('teacher');
                      setShowAuthModal(true);
                    }}
                    className="hover:text-pink-400 transition-colors cursor-pointer text-left"
                  >
                    {isKhmer ? 'ចូលគណនីគ្រូ (Faculty)' : 'Faculty Portal Login'}
                  </button>
                </li>
                <li>
                  <a
                    href="https://portfolio-jame7.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-400 transition-colors"
                  >
                    JJ-DEV Portfolio
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
            <p>© 2026-2027 CIIS INTERNATIONAL SCHOOL (សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស). All rights reserved.</p>
            <p>
              Engineered with pride by{' '}
              <a
                href="https://portfolio-jame7.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:underline font-bold"
              >
                JJ-DEV
              </a>
            </p>
          </div>

        </div>
      </footer>

      {/* Teacher Profile Detail Motion Modal */}
      <TeacherDetailModal
        teacher={selectedTeacher}
        isOpen={Boolean(selectedTeacher)}
        onClose={() => setSelectedTeacher(null)}
      />

      {/* Interactive High-Resolution Lightbox Modal for School Photos */}
      {selectedGalleryItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">

            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
              <div className="flex items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full bg-pink-900 text-white text-[11.5px] font-bold border border-pink-500/40 ${isKhmer ? 'font-kantumruy' : 'font-mono uppercase tracking-wider'}`}>
                  {isKhmer ? selectedGalleryItem.badgeKh : selectedGalleryItem.badgeEn}
                </span>
                <span className={`text-xs text-zinc-400 ${isKhmer ? 'font-kantumruy' : 'font-mono'}`}>
                  {selectedGalleryItem.category === 'ceremony'
                    ? (isKhmer ? 'ពិធីចែកវិញ្ញាបនបត្រ & សិស្សពូកែ' : 'CIIS Graduation & Award Ceremony')
                    : (isKhmer
                      ? `បន្ទប់កុំព្យូទ័រ CIIS Lab 1 • ${selectedGalleryItem.classShiftKh || 'ម៉ោងអនុវត្តជាក់ស្តែង'}`
                      : `CIIS Computer Lab 1 • ${selectedGalleryItem.classShiftEn || 'Hands-On Workstation'}`)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedGalleryItem(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: High-Res Image + Context */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5 text-left">
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-black max-h-[58vh] flex items-center justify-center">
                <img
                  src={selectedGalleryItem.src}
                  alt={selectedGalleryItem.titleEn}
                  className="w-full h-auto max-h-[58vh] object-contain"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black text-white font-khmer-title">
                  {isKhmer ? selectedGalleryItem.titleKh : selectedGalleryItem.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium font-kantumruy">
                  {isKhmer ? selectedGalleryItem.descKh : selectedGalleryItem.descEn}
                </p>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-zinc-400 font-mono">
                CIIS INTERNATIONAL SCHOOL • CIIS LMS
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedGalleryItem(null);
                  setAuthModalRole('student');
                  setShowAuthModal(true);
                }}
                className={`w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${isKhmer ? 'font-kantumruy' : ''}`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'ចុះឈ្មោះចូលរៀនថ្នាក់នេះ' : 'Enroll in this Class'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10.3. LIVE GOOGLE MAP INTERACTIVE MODAL                                   */}
      {/* ========================================================================= */}
      {showMapModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setShowMapModal(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-zinc-950 text-white rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/90 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-950 border border-pink-600/40 text-pink-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-white font-khmer-title">
                      {isKhmer ? 'ទីតាំងសាលារៀន CIIS លើ Google Maps' : 'CIIS Campus Live Google Map'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE GPS
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    GPS: 11.526108, 104.782097 • Khan Kambol, Phnom Penh
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Live Map Iframe */}
            <div className="relative w-full h-[360px] sm:h-[430px] bg-zinc-900">
              <iframe
                title="CIIS International School Google Map"
                src="https://maps.google.com/maps?q=11.526108,104.782097&hl=en&z=17&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Address & Quick Actions Footer */}
            <div className="p-5 sm:p-6 bg-zinc-900/95 border-t border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                    {isKhmer ? 'អាសយដ្ឋានផ្លូវការ' : 'OFFICIAL CAMPUS ADDRESS'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 font-medium font-kantumruy">
                  #01, St. Betong, Sangkat Kambol, Khan Kambol, Phnom Penh, Cambodia
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                {/* Copy GPS */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('11.526108, 104.782097');
                    setCopiedCoords(true);
                    setTimeout(() => setCopiedCoords(false), 2000);
                  }}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  {copiedCoords ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{isKhmer ? 'បានចម្លង!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{isKhmer ? 'ចម្លង GPS' : 'Copy GPS'}</span>
                    </>
                  )}
                </button>

                {/* Get Directions */}
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=11.526108,104.782097"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-xs font-bold transition-all cursor-pointer font-kantumruy"
                >
                  <Navigation className="w-3.5 h-3.5 text-pink-400" />
                  <span>{isKhmer ? 'នាំផ្លូវ' : 'Directions'}</span>
                </a>

                {/* Open in Google Maps */}
                <a
                  href="https://maps.app.goo.gl/PXiXw1mdgYGkMono6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-pink-900/30 transition-all cursor-pointer font-kantumruy"
                >
                  <span>{isKhmer ? 'បើកលើកម្មវិធី Google Maps' : 'Open in Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
