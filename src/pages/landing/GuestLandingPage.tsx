import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { TEACHERS_DATA, TeacherProfile } from '../../services/teacherData';
import { TeacherDetailModal } from '../../components/teachers/TeacherDetailModal';
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
  Menu,
  Clock,
  Laptop,
  GraduationCap,
  Award,
  Users,
  Building,
  Calendar,
  Sparkles
} from 'lucide-react';

interface GalleryModalItem {
  src: string;
  badgeKh: string;
  badgeEn: string;
  titleKh: string;
  titleEn: string;
  descKh: string;
  descEn: string;
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

  // 4 Academic Levels / Programs
  const academicLevels = [
    {
      id: 'kindergarten',
      index: '01',
      nameKh: 'ថ្នាក់មត្តេយ្យសិក្សា (កុមារតូច)',
      nameEn: 'Early Childhood & Kindergarten',
      tagKh: 'អាយុ ៣ ដល់ ៥ ឆ្នាំ',
      tagEn: 'Ages 3 – 5 Years',
      descriptionKh: 'បណ្តុះបណ្តាលកុមារតូចឱ្យចេះភាសាខ្មែរ-អង់គ្លេស រៀនគូររូប ស្គាល់លេខ ចេះសីលធម៌ និងមានភាពក្លាហានក្នុងការប្រាស្រ័យទាក់ទង។',
      descriptionEn: 'Fostering foundational literacy, numeracy, creative expression, moral habits, and social confidence for young learners.',
      highlightsKh: ['មូលដ្ឋានគ្រឹះអក្សរ & លេខ', 'ភាសាខ្មែរ និងអង់គ្លេសកុមារ', 'សកម្មភាពអប់រំ និងសីលធម៌'],
      highlightsEn: ['Foundational Literacy & Numbers', 'Bilingual Khmer & English', 'Creative Educational Play']
    },
    {
      id: 'grade-1-to-12',
      index: '02',
      nameKh: 'ចំណេះទូទៅ ថ្នាក់ទី១ ដល់ ទី១២',
      nameEn: 'General Education: Grades 1 to 12',
      tagKh: 'កម្មវិធីជាតិ MoEYS',
      tagEn: 'MoEYS National Standard',
      descriptionKh: 'បង្រៀនតាមកម្មវិធីសិក្សាជាតិរបស់ក្រសួងអប់រំ យុវជន និងកីឡា ចាប់ពីកម្រិតបឋមសិក្សា អនុវិទ្យាល័យ រហូតដល់វិទ្យាល័យ និងការត្រៀមប្រឡងសញ្ញាបត្របាក់ឌុប (BacII)។',
      descriptionEn: 'Full national curriculum adhering to Ministry standards across Primary (Grades 1-6), Lower Secondary (Grades 7-9), and Upper Secondary (Grades 10-12 / National BacII Exam).',
      highlightsKh: ['បឋមសិក្សា (ថ្នាក់ទី១-៦)', 'អនុវិទ្យាល័យ (ថ្នាក់ទី៧-៩)', 'វិទ្យាល័យ & ត្រៀមបាក់ឌុប (ថ្នាក់ទី១០-១២)'],
      highlightsEn: ['Primary Level (Grades 1-6)', 'Lower Secondary (Grades 7-9)', 'High School & BacII (Grades 10-12)']
    },
    {
      id: 'secondary-computer',
      index: '03',
      nameKh: 'ជំនាញកុំព្យូទ័រអនុវត្ត CIIS Lab 1',
      nameEn: 'Hands-On Computer & Digital Lab',
      tagKh: 'អនុវត្តលើម៉ាស៊ីនផ្ទាល់',
      tagEn: '100% Practical Lab',
      descriptionKh: 'ការបណ្តុះបណ្តាលកុំព្យូទ័រលើម៉ាស៊ីនផ្ទាល់ក្នុងបន្ទប់ Lab 1 ដូចជា Touch Typing ខ្មែរ-អង់គ្លេស, Microsoft Office (Word, Excel, PowerPoint), ការរៀបចំឯកសារ និងជំនាញឌីជីថល។',
      descriptionEn: 'Direct hands-on workstation training in Computer Lab 1 covering 10-Finger Touch Typing, Microsoft Word, Excel, PowerPoint, and modern digital office skills.',
      highlightsKh: ['បន្ទប់កុំព្យូទ័រ ៤០+ គ្រឿងផ្ទាល់ខ្លួន', 'Touch Typing ខ្មែរ & អង់គ្លេស', 'Microsoft Word, Excel & PowerPoint'],
      highlightsEn: ['40+ Dedicated Workstations', 'Khmer & English Touch Typing', 'Microsoft Word, Excel & PowerPoint']
    },
    {
      id: 'ielts-english',
      index: '04',
      nameKh: 'ថ្នាក់ភាសាអង់គ្លេសទូទៅ & IELTS',
      nameEn: 'International English & IELTS Track',
      tagKh: 'ស្តង់ដារអន្តរជាតិ',
      tagEn: 'Global Standard',
      descriptionKh: 'បង្រៀនភាសាអង់គ្លេសគ្រប់កម្រិត ផ្តោតលើការស្តាប់ និយាយ អាន និងសរសេរ រួមទាំងការបំប៉នវេយ្យាករណ៍ និងការត្រៀមប្រឡងយកវិញ្ញាបនបត្រអន្តរជាតិ IELTS។',
      descriptionEn: 'Comprehensive English training covering Listening, Speaking, Reading, and Writing, including standard IELTS exam preparation.',
      highlightsKh: ['៤ ជំនាញ (ស្តាប់ និយាយ អាន សរសេរ)', 'គ្រូមានគរុកោសល្យ និងបទពិសោធន៍', 'ការត្រៀមប្រឡងវិញ្ញាបនបត្រ IELTS'],
      highlightsEn: ['4 Core Language Competencies', 'Experienced Certified Instructors', 'Academic IELTS Readiness Track']
    }
  ];

  // 5 Authentic Ceremony / Event Photos
  const ceremonyEvents: GalleryModalItem[] = [
    {
      src: '/images/school/ciis-director-speech.jpg',
      badgeKh: 'សុន្ទរកថានាយកសាលា',
      badgeEn: 'DIRECTOR KEYNOTE',
      titleKh: 'សុន្ទរកថាបើកកម្មវិធីចែកវិញ្ញាបនបត្រ និងការលើកទឹកចិត្តសិស្សានុសិស្ស',
      titleEn: 'School Director Welcome Address & Graduation Keynote',
      descKh: 'លោកនាយកសាលាថ្លែងសុន្ទរកថាសំណេះសំណាល បង្ហាញពីការយកចិត្តទុកដាក់លើគុណភាពអប់រំ និងការបណ្តុះបណ្តាលសីលធម៌ ចំណេះដឹង និងបច្ចេកវិទ្យាដល់សិស្សគ្រប់រូប។',
      descEn: 'The school director delivering an inspiring address on academic excellence, moral foundation, and digital mastery at the official CIIS podium.',
      category: 'ceremony'
    },
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
      src: '/images/events/ceremony-dance-show.jpg',
      badgeKh: 'ការសម្តែងសិល្បៈសិស្ស',
      badgeEn: 'STUDENT DANCE',
      titleKh: 'របាំអបអរសាទរ និងការសម្តែងសិល្បៈរបស់ក្មួយៗសិស្សានុសិស្ស',
      titleEn: 'Cultural Dance Performance by Primary Students',
      descKh: 'ក្មួយៗសិស្សានុសិស្សកម្រិតបឋមសិក្សា សម្តែងរបាំស្វាគមន៍យ៉ាងរស់រវើកក្នុងសម្លៀកបំពាក់ពណ៌ក្រហមស បង្ហាញពីភាពក្លាហាន និងទេពកោសល្យសិល្បៈ។',
      descEn: 'Primary school students performing a lively celebration dance on stage, demonstrating their confidence, artistic talent, and cultural pride.',
      category: 'ceremony'
    },
    {
      src: '/images/events/ceremony-traditional-singing.jpg',
      badgeKh: 'និយាយជាសាធារណៈ & ចម្រៀង',
      badgeEn: 'PUBLIC SPEAKING',
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
      nameKh: 'ថ្នាក់កុំព្យូទ័រវេនល្ងាច ទី១',
      nameEn: 'Evening Computer Shift 1',
      teacherKh: 'លោកគ្រូ នុន លាងឌី & ជឿន តេជៈ',
      teacherEn: 'Nun Langdy (Lead) & Choeurn Tekchas (Asst)',
      timeKh: '៥:៣០ - ៦:៣០ ល្ងាច (ចន្ទ - សុក្រ)',
      timeEn: '5:30 PM - 6:30 PM (Mon - Fri)',
      roomKh: 'បន្ទប់កុំព្យូទ័រ CIIS Lab 1 (៤០+ គ្រឿង)',
      roomEn: 'CIIS Computer Lab 1 (40+ Stations)',
      subjectsKh: ['Touch Typing ខ្មែរ & អង់គ្លេស', 'Microsoft Word រៀបចំឯកសារ', 'Microsoft Excel មូលដ្ឋាន', 'ការប្រើប្រាស់កុំព្យូទ័រទូទៅ'],
      subjectsEn: ['Touch Typing Drills', 'Microsoft Word Documents', 'Microsoft Excel Basics', 'General Computer Architecture'],
      statusKh: 'កំពុងបើកទទួលសិស្ស',
      statusEn: 'Open for Enrollment'
    },
    {
      id: 'shift-2',
      code: 'EV-02',
      nameKh: 'ថ្នាក់កុំព្យូទ័រវេនល្ងាច ទី២',
      nameEn: 'Evening Computer Shift 2',
      teacherKh: 'លោកគ្រូ នុន លាងឌី & ជឿន តេជៈ',
      teacherEn: 'Nun Langdy (Lead) & Choeurn Tekchas (Asst)',
      timeKh: '៦:៤០ - ៧:៤០ ល្ងាច (ចន្ទ - សុក្រ)',
      timeEn: '6:40 PM - 7:40 PM (Mon - Fri)',
      roomKh: 'បន្ទប់កុំព្យូទ័រ CIIS Lab 1 (៤០+ គ្រឿង)',
      roomEn: 'CIIS Computer Lab 1 (40+ Stations)',
      subjectsKh: ['រូបមន្ត Excel កម្រិតខ្ពស់', 'ការងាររដ្ឋបាលការិយាល័យ', 'តេស្តល្បឿនវាយអក្សរ WPM', 'ការអនុវត្តលំហាត់ជាក់ស្តែង'],
      subjectsEn: ['Advanced Excel Formulas', 'Office Administration', 'Typing Velocity Tests', 'Practical Exam Practice'],
      statusKh: 'វេនពេញនិយម',
      statusEn: 'Popular Shift'
    },
    {
      id: 'shift-3',
      code: 'MO-01',
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
    <div className="min-h-screen bg-[#fcfcfd] text-zinc-900 antialiased font-sans relative selection:bg-rose-900 selection:text-white">

      {/* Top Precision Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-zinc-200/60 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-rose-950 via-rose-800 to-pink-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP UTILITY STRIP (Official School Contact & Language)                 */}
      {/* ========================================================================= */}
      <div className="bg-zinc-950 text-zinc-300 text-[11.5px] border-b border-zinc-800 px-4 sm:px-8 py-2 flex items-center justify-between z-50 relative">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-rose-400 font-bold tracking-wide">
            <Building className="w-3.5 h-3.5" />
            <span>{isKhmer ? 'សាលារៀនអន្តរជាតិ ស៊ី អាយ អាយ អេស' : 'CIIS International School'}</span>
          </span>
          <span className="text-zinc-700 hidden md:inline">•</span>
          <span className="text-zinc-400 hidden md:inline text-[11px]">
            {isKhmer ? 'ក្រុងកំពង់ឆ្នាំង ខេត្តកំពង់ឆ្នាំង ព្រះរាជាណាចក្រកម្ពុជា' : 'Kampong Chhnang Town, Cambodia'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            className="hover:text-white text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer font-bold px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px]"
          >
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            <span>{language === 'km' ? 'English' : 'ភាសាខ្មែរ'}</span>
          </button>
          <span className="text-zinc-800">|</span>
          <button
            type="button"
            onClick={() => {
              setAuthModalRole('student');
              setShowAuthModal(true);
            }}
            className="text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
          >
            <LogIn className="w-3.5 h-3.5 text-rose-400" />
            <span>{isKhmer ? 'ចូលគណនីសិស្ស' : 'Student Portal'}</span>
          </button>
          <span className="text-zinc-800">|</span>
          <button
            type="button"
            onClick={() => {
              setAuthModalRole('teacher');
              setShowAuthModal(true);
            }}
            className="text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
          >
            <span>{isKhmer ? 'គណនីគ្រូ' : 'Faculty Access'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN HEADER & INSTITUTIONAL NAVIGATION                                 */}
      {/* ========================================================================= */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${
          isScrolled ? 'border-zinc-300 shadow-sm py-2.5' : 'border-zinc-200 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo & School Name */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 p-1.5 flex items-center justify-center border border-rose-200/90 shrink-0 shadow-xs">
              <img src="/ciis-logo.svg" alt="CIIS Logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base lg:text-lg font-black text-zinc-950 leading-tight truncate tracking-tight font-khmer-title">
                {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស' : 'CIIS INTERNATIONAL SCHOOL'}
              </h1>
              <p className="text-[10.5px] sm:text-[11.5px] text-rose-900 font-bold truncate">
                {isKhmer ? 'កម្មវិធីចំណេះទូទៅជាតិ & ថ្នាក់កុំព្យូទ័រអនុវត្ត Lab 1' : 'National Standard K-12 & Practical Computer Lab 1'}
              </p>
            </div>
          </div>

          {/* Clean Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-zinc-700">
            <a href="#about" className="hover:text-rose-950 transition-colors">
              {isKhmer ? 'អំពីសាលា' : 'About CIIS'}
            </a>
            <a href="#programs" className="hover:text-rose-950 transition-colors">
              {isKhmer ? 'កម្មវិធីសិក្សា' : 'Academic Tracks'}
            </a>
            <a href="#lab" className="hover:text-rose-950 transition-colors">
              {isKhmer ? 'បន្ទប់កុំព្យូទ័រ Lab 1' : 'Computer Lab 1'}
            </a>
            <a href="#events" className="hover:text-rose-950 transition-colors">
              {isKhmer ? 'សកម្មភាពសាលា' : 'Events & Awards'}
            </a>
            <a href="#faculty" className="hover:text-rose-950 transition-colors">
              {isKhmer ? 'លោកគ្រូអ្នកគ្រូ' : 'Faculty'}
            </a>
            <a href="#contact" className="hover:text-rose-950 transition-colors">
              {isKhmer ? 'ទំនាក់ទំនង' : 'Contact Us'}
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isAuthenticated && currentUser.id !== 'guest' && onReturnToPortal ? (
              <button
                type="button"
                onClick={onReturnToPortal}
                className="px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span>{isTeacher ? (isKhmer ? 'ផ្ទាំងគ្រប់គ្រងគ្រូ' : 'Faculty Dashboard') : (isKhmer ? 'ផ្ទាំងគ្រប់គ្រងសិស្ស' : 'Student Portal')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthModalRole('student');
                  setShowAuthModal(true);
                }}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-950 via-rose-900 to-pink-900 hover:from-rose-900 hover:to-pink-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm hover:scale-[1.02]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'ចុះឈ្មោះចូលរៀន' : 'Enroll Now'}</span>
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
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-5 text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 p-1 flex items-center justify-center border border-rose-200">
                    <img src="/ciis-logo.svg" alt="CIIS" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-black text-xs text-zinc-950 font-khmer-title">CIIS SCHOOL</h3>
                    <p className="text-[10px] text-rose-900 font-bold">Official School Portal</p>
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
                  { href: '#about', label: isKhmer ? 'អំពីសាលា CIIS' : 'About CIIS' },
                  { href: '#programs', label: isKhmer ? 'កម្មវិធីសិក្សាទាំង ៤ កម្រិត' : 'Academic Programs' },
                  { href: '#lab', label: isKhmer ? 'បន្ទប់កុំព្យូទ័រ Lab 1 (៤០+ គ្រឿង)' : 'Computer Lab 1' },
                  { href: '#events', label: isKhmer ? 'ពិធីចែកវិញ្ញាបនបត្រ & សកម្មភាព' : 'Events & Awards' },
                  { href: '#faculty', label: isKhmer ? 'លោកគ្រូអ្នកគ្រូ & គរុកោសល្យ' : 'Distinguished Faculty' },
                  { href: '#contact', label: isKhmer ? 'ទំនាក់ទំនង & ទីតាំងសាលា' : 'Contact & Campus Visit' }
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl hover:bg-zinc-100 hover:text-rose-950 transition-colors"
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
      {/* 3. HERO SECTION — WORLD-CLASS SCHOOL SHOWCASE                             */}
      {/* ========================================================================= */}
      <section id="about" className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24 border-b border-zinc-200 bg-white">
        
        {/* Subtle Background Glow Elements */}
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-rose-50/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-pink-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 text-left">
          
          {/* Top Institutional Badge */}
          <div className="scroll-reveal flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span>{isKhmer ? 'សាលារៀនអន្តរជាតិ ស៊ី អាយ អាយ អេស' : 'CIIS International School'}</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-950 border border-rose-200 text-xs font-bold shadow-2xs">
              {isKhmer ? 'ក្រុងកំពង់ឆ្នាំង • កម្មវិធីជាតិ MoEYS & បន្ទប់កុំព្យូទ័រ Lab 1' : 'Kampong Chhnang Campus • MoEYS & Lab 1'}
            </span>
          </div>

          {/* Master Hero Grid: Left Narrative + Right Real School Photography Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Vision & Admissions CTAs */}
            <div className="scroll-reveal-left lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-zinc-950 tracking-tight leading-[1.16] font-khmer-title">
                {isKhmer ? (
                  <>
                    ស្ថាប័នអប់រំស្តង់ដារគុណភាព <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-950 via-rose-800 to-pink-700">
                      ចំណេះដឹងទូទៅ & បច្ចេកវិទ្យាអនុវត្ត
                    </span>
                  </>
                ) : (
                  <>
                    Inspiring Academic Rigor, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-950 via-rose-800 to-pink-700">
                      Digital Mastery & Leadership
                    </span>
                  </>
                )}
              </h2>

              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed font-normal">
                {isKhmer
                  ? 'សាលារៀនអន្តរជាតិ ស៊ី អាយ អាយ អេស ផ្តល់ការអប់រំពេញលេញចាប់ពីថ្នាក់មត្តេយ្យសិក្សា ដល់ថ្នាក់ទី១២ (ត្រៀមបាក់ឌុប BacII) ភាសាអង់គ្លេសអន្តរជាតិ IELTS និងបន្ទប់កុំព្យូទ័រអនុវត្តជាក់ស្តែង Lab 1 បំពាក់កុំព្យូទ័រយួរដៃ ៤០+ គ្រឿងផ្ទាល់ខ្លួន ដើម្បីបណ្តុះបណ្តាលសិស្សានុសិស្សឱ្យមានអនាគតភ្លឺស្វាង និងមានជំនាញពិតប្រាកដ។'
                  : 'CIIS delivers comprehensive educational pathways spanning Kindergarten to Grade 12 (National BacII Exam), International English & IELTS, alongside hands-on digital training on 40+ dedicated Dell workstations in Computer Lab 1.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalRole('student');
                    setShowAuthModal(true);
                  }}
                  className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-950 via-rose-900 to-pink-900 hover:from-rose-900 hover:to-pink-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <UserPlus className="w-4 h-4 text-rose-300" />
                  <span>{isKhmer ? 'ចុះឈ្មោះចូលរៀនឥឡូវនេះ' : 'Apply for Enrollment'}</span>
                  <ArrowRight className="w-4 h-4 text-rose-300" />
                </button>

                <a
                  href="#programs"
                  className="py-3.5 px-6 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-zinc-200 shadow-2xs transition-all cursor-pointer"
                >
                  <span>{isKhmer ? 'ស្វែងយល់កម្មវិធីសិក្សា' : 'Explore Programs'}</span>
                  <span className="text-rose-900">→</span>
                </a>
              </div>

              {/* 4 Highlights Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-zinc-200">
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-lg sm:text-xl font-black text-zinc-950">40+</div>
                  <div className="text-[11px] text-rose-900 font-bold">{isKhmer ? 'កុំព្យូទ័រ Lab 1' : 'Workstations'}</div>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-lg sm:text-xl font-black text-zinc-950">K – 12</div>
                  <div className="text-[11px] text-rose-900 font-bold">{isKhmer ? 'កម្មវិធីជាតិ MoEYS' : 'National Standard'}</div>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-lg sm:text-xl font-black text-zinc-950">100%</div>
                  <div className="text-[11px] text-rose-900 font-bold">{isKhmer ? 'អនុវត្តលើម៉ាស៊ីន' : 'Hands-on Lab'}</div>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-lg sm:text-xl font-black text-zinc-950">IELTS</div>
                  <div className="text-[11px] text-rose-900 font-bold">{isKhmer ? 'ភាសាអន្តរជាតិ' : 'English Track'}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Authentic School Photo Grid */}
            <div className="scroll-reveal-right delay-100 lg:col-span-6 space-y-4">
              
              {/* Primary Featured Card: Real CIIS Multi-Story Campus Building */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-zinc-200 shadow-xl group bg-zinc-950">
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <img
                    src="/images/school/ciis-main-building.jpg"
                    alt="CIIS International School Campus Building"
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                </div>
                
                {/* Gradient Fade & Badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-950/90 text-white text-xs font-bold border border-rose-500/40 shadow-sm">
                    {isKhmer ? 'អគារសិក្សាផ្លូវការ CIIS' : 'Official CIIS Campus Building'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/70 text-white text-xs font-bold border border-white/20">
                    {isKhmer ? 'ខេត្តកំពង់ឆ្នាំង' : 'Kampong Chhnang'}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h3 className="text-sm sm:text-base font-black font-khmer-title">
                    {isKhmer ? 'បរិវេណសាលារៀន និងអគារសិក្សា ៤ ជាន់' : 'CIIS 4-Story Academic Campus'}
                  </h3>
                  <p className="text-[11.5px] text-zinc-300 line-clamp-1">
                    {isKhmer ? 'មត្តេយ្យសិក្សា • បឋមសិក្សា • មធ្យមសិក្សា • ថ្នាក់កុំព្យូទ័រ & IELTS' : 'Kindergarten • Primary • Secondary • Computer Lab 1 & IELTS'}
                  </p>
                </div>
              </div>

              {/* Secondary Duo Cards: Director Keynote Speech & Computer Lab 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Director Speech Card */}
                <div
                  onClick={() => setSelectedGalleryItem(ceremonyEvents[0])}
                  className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-md group bg-zinc-950 cursor-pointer"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src="/images/school/ciis-director-speech.jpg"
                      alt="CIIS School Director Speech"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-950/90 text-white text-[10px] font-bold border border-rose-500/30">
                      {isKhmer ? 'សុន្ទរកថានាយកសាលា' : 'Director Keynote'}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <h4 className="text-xs font-bold truncate font-khmer-title">
                      {isKhmer ? 'ពិធីចែកវិញ្ញាបនបត្រ & ប័ណ្ណសរសើរ' : 'Ceremony & Awards'}
                    </h4>
                  </div>
                </div>

                {/* Real Lab 1 Station Card */}
                <div
                  onClick={() => setSelectedGalleryItem(lab1Activities[0])}
                  className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-md group bg-zinc-950 cursor-pointer"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src="/images/activities/class-1/activity-1.jpg"
                      alt="CIIS Computer Lab 1 Student Workstations"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-950/90 text-white text-[10px] font-bold border border-rose-500/30">
                      {isKhmer ? 'ថ្នាក់កុំព្យូទ័រ Lab 1' : 'Computer Lab 1'}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <h4 className="text-xs font-bold truncate font-khmer-title">
                      {isKhmer ? '៤០+ គ្រឿង • Touch Typing & Office' : '40+ Stations • Touch Typing'}
                    </h4>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ACADEMIC PROGRAMS SECTION (4 CORE TRACKS)                              */}
      {/* ========================================================================= */}
      <section id="programs" className="py-16 sm:py-24 border-b border-zinc-200 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          
          <div className="scroll-reveal space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-950 text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5 text-rose-800" />
              <span>{isKhmer ? 'កម្មវិធីសិក្សាផ្លូវការ' : 'ACADEMIC PATHWAYS'}</span>
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
                className="scroll-reveal-scale p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs hover:shadow-xl hover:border-rose-900/40 transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-zinc-950 text-white font-bold text-xs flex items-center justify-center">
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

                  <div className="pt-3 border-t border-zinc-100 space-y-1.5 text-xs">
                    {(isKhmer ? lvl.highlightsKh : lvl.highlightsEn).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-zinc-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-800 shrink-0" />
                        <span className="text-zinc-700">{h}</span>
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
                  className="w-full py-2.5 px-3 rounded-2xl text-xs font-bold bg-zinc-50 hover:bg-zinc-950 hover:text-white text-zinc-800 border border-zinc-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{isKhmer ? 'ចុះឈ្មោះចូលរៀនកម្រិតនេះ' : 'Enroll in Track'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. COMPUTER LAB 1 WORKSTATIONS & SHIFT SCHEDULES                          */}
      {/* ========================================================================= */}
      <section id="lab" className="py-16 sm:py-24 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-950 text-xs font-bold">
                <Laptop className="w-3.5 h-3.5 text-rose-800" />
                <span>{isKhmer ? 'បន្ទប់កុំព្យូទ័រ CIIS LAB 1' : 'COMPUTER LAB 1 WORKSTATIONS'}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
                {isKhmer ? 'សកម្មភាពសិស្ស & ថ្នាក់កុំព្យូទ័រ Lab 1' : 'Computer Lab 1 Shifts & Student Activities'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed font-normal">
              {isKhmer
                ? 'រូបភាពសកម្មភាពជាក់ស្តែងក្នុងបន្ទប់ Lab 1 វេនទី១ (៥:៣០-៦:៣០) និងវេនទី២ (៦:៤០-៧:៤០) សិស្សានុសិស្សម្នាក់ៗមានកុំព្យូទ័រយួរដៃ Dell ប្រើប្រាស់ផ្ទាល់ខ្លួន។'
                : 'Authentic photos from Evening Shift 1 and Shift 2. Every student works on an individual workstation guided step-by-step by lab instructors.'}
            </p>
          </div>

          {/* 3 Shifts Timetable Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {labShifts.map((shift) => (
              <div
                key={shift.id}
                className="scroll-reveal-scale p-6 rounded-3xl bg-[#f8fafc] border border-zinc-200 hover:border-rose-900/40 transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-xl bg-zinc-950 text-white font-bold">
                      {shift.code}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-950 border border-rose-200 font-bold">
                      {isKhmer ? shift.statusKh : shift.statusEn}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-zinc-950 font-khmer-title">
                    {isKhmer ? shift.nameKh : shift.nameEn}
                  </h4>

                  <div className="text-xs text-zinc-700 space-y-1 pt-1">
                    <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-800 shrink-0" />
                      <span>{isKhmer ? shift.timeKh : shift.timeEn}</span>
                    </div>
                    <div className="text-zinc-600 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-rose-800 shrink-0" />
                      <span>{isKhmer ? shift.teacherKh : shift.teacherEn}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200/80 space-y-1.5 text-xs text-zinc-600">
                    {(isKhmer ? shift.subjectsKh : shift.subjectsEn).map((sub, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-800 shrink-0" />
                        <span className="truncate">{sub}</span>
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
                  className="w-full py-2.5 rounded-2xl bg-zinc-950 hover:bg-rose-950 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-rose-300" />
                  <span>{isKhmer ? 'ចុះឈ្មោះវេននេះ' : 'Enroll in Shift'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Photo Gallery Filter Tabs & Real Activities */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h4 className="text-lg font-black text-zinc-950 font-khmer-title">
                {isKhmer ? 'រូបភាពសកម្មភាពជាក់ស្តែងក្នុងបន្ទប់ Lab 1' : 'Authentic Lab 1 Classroom Photos'}
              </h4>

              <div className="flex items-center gap-2 flex-wrap text-xs">
                <button
                  type="button"
                  onClick={() => setActiveLabTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeLabTab === 'all'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {isKhmer ? 'រូបភាពទាំងអស់' : 'All Photos'} ({lab1Activities.length + lab2Activities.length})
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
                  {isKhmer ? 'វេនទី១ (៥:៣០-៦:៣០)' : 'Shift 1'} ({lab1Activities.length})
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
                  {isKhmer ? 'វេនទី២ (៦:៤០-៧:៤០)' : 'Shift 2'} ({lab2Activities.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedLabActivities.map((act, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGalleryItem(act)}
                  className="scroll-reveal-scale group relative rounded-3xl overflow-hidden border border-zinc-200 bg-zinc-950 shadow-xs hover:shadow-xl hover:border-rose-900/40 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[300px]"
                >
                  <img
                    src={act.src}
                    alt={act.titleEn}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent group-hover:via-zinc-950/50 transition-all" />

                  <div className="relative z-10 p-4 flex items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-rose-950/90 text-white font-bold border border-rose-500/30">
                      {isKhmer ? act.badgeKh : act.badgeEn}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-zinc-300 font-bold border border-white/10 text-[11px]">
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
                    <div className="pt-1 text-[11px] text-rose-300 font-bold flex items-center gap-1">
                      <span>{isKhmer ? 'ចុចដើម្បីមើលរូបភាពធំ' : 'View High-Res Photo'}</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CEREMONY & GRADUATION AWARDS GALLERY                                   */}
      {/* ========================================================================= */}
      <section id="events" className="py-16 sm:py-24 border-b border-zinc-200 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-950 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-rose-800" />
                <span>{isKhmer ? 'ពិធីប្រគល់វិញ្ញាបនបត្រ & សកម្មភាពសាលា' : 'CEREMONIES & STUDENT AWARDS'}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
                {isKhmer ? 'ពិធីចែកវិញ្ញាបនបត្រ & សកម្មភាពសិស្ស' : 'Ceremonies, Awards & Campus Life'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed font-normal">
              {isKhmer
                ? 'ទិដ្ឋភាពជាក់ស្តែងនៃពិធីចែកវិញ្ញាបនបត្របញ្ចប់ការសិក្សា ការសម្តែងសិល្បៈសិស្ស និងសុន្ទរកថារបស់គណៈគ្រប់គ្រងសាលា CIIS។'
                : 'Commemorating graduation ceremonies, academic awards, cultural dance performances, and leadership keynote addresses.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ceremonyEvents.map((evt, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedGalleryItem(evt)}
                className="scroll-reveal-scale group relative rounded-3xl overflow-hidden border border-zinc-200 bg-zinc-950 shadow-xs hover:shadow-xl hover:border-rose-900/40 transition-all duration-300 cursor-pointer flex flex-col justify-end min-h-[300px]"
              >
                <img
                  src={evt.src}
                  alt={evt.titleEn}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent group-hover:via-zinc-950/50 transition-all" />

                <div className="absolute top-4 left-4 z-10 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-rose-950/90 text-white font-bold border border-rose-500/30">
                    {isKhmer ? evt.badgeKh : evt.badgeEn}
                  </span>
                </div>

                <div className="relative z-10 p-5 space-y-1.5 text-white">
                  <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-rose-200 transition-colors font-khmer-title">
                    {isKhmer ? evt.titleKh : evt.titleEn}
                  </h4>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-normal">
                    {isKhmer ? evt.descKh : evt.descEn}
                  </p>
                  <div className="pt-1 text-[11px] text-rose-300 font-bold flex items-center gap-1">
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
      {/* 7. DISTINGUISHED FACULTY DIRECTORY                                        */}
      {/* ========================================================================= */}
      <section id="faculty" className="py-16 sm:py-24 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          
          <div className="scroll-reveal space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-950 text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-rose-800" />
              <span>{isKhmer ? 'លោកគ្រូ អ្នកគ្រូ & គរុកោសល្យ' : 'DISTINGUISHED FACULTY'}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-khmer-title">
              {isKhmer ? 'លោកគ្រូអ្នកគ្រូផ្នែកកុំព្យូទ័រ & គរុកោសល្យ' : 'Distinguished Faculty & Instructors'}
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
                className="scroll-reveal-scale p-5 rounded-3xl bg-[#f8fafc] border border-zinc-200 hover:border-rose-900/40 transition-all duration-200 cursor-pointer space-y-4 group text-left shadow-2xs hover:shadow-lg"
              >
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 relative border border-zinc-200">
                  <img
                    src={teacher.image || '/ciis-logo.svg'}
                    alt={teacher.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-zinc-950/90 text-white text-[10px] font-bold">
                    {isKhmer ? teacher.badgeKh : teacher.badgeEn}
                  </div>
                </div>

                <div className="space-y-1">
                  <h5 className="text-sm sm:text-base font-black text-zinc-950 group-hover:text-rose-950 transition-colors truncate font-khmer-title">
                    {isKhmer ? teacher.nameKh : teacher.nameEn}
                  </h5>
                  <p className="text-xs text-rose-900 font-bold truncate">
                    {isKhmer ? teacher.subjectKh : teacher.subjectEn}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate pt-0.5">
                    {isKhmer ? teacher.scheduleKh : teacher.scheduleEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-between text-xs text-zinc-600 group-hover:text-rose-950 font-bold">
                  <span>{isKhmer ? 'មើលព័ត៌មានលម្អិត' : 'View Profile'}</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CAMPUS LOCATION & ADMISSIONS INQUIRY                                   */}
      {/* ========================================================================= */}
      <section id="contact" className="py-16 sm:py-24 border-b border-zinc-200 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left: Campus Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-950 text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-rose-800" />
                  <span>{isKhmer ? 'ទីតាំងសាលា & ទំនាក់ទំនង' : 'CAMPUS ADMISSIONS & VISIT'}</span>
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

              <div className="space-y-3.5 text-xs">
                {/* Campus Address Card */}
                <div
                  onClick={() => setShowMapModal(true)}
                  className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs hover:border-rose-900/40 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between text-zinc-900 font-bold">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-800" />
                      <span>{isKhmer ? 'អាសយដ្ឋានទីតាំងសាលា' : 'Campus Address'}</span>
                    </div>
                    <span className="text-[11px] text-rose-900 font-bold">View Google Maps ↗</span>
                  </div>
                  <p className="text-zinc-600 text-xs leading-relaxed">
                    {isKhmer
                      ? 'ក្រុងកំពង់ឆ្នាំង ខេត្តកំពង់ឆ្នាំង ព្រះរាជាណាចក្រកម្ពុជា'
                      : 'Kampong Chhnang Town, Kampong Chhnang Province, Kingdom of Cambodia'}
                  </p>
                </div>

                {/* Telephone Numbers */}
                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold">
                    <Phone className="w-4 h-4 text-rose-800" />
                    <span>{isKhmer ? 'លេខទូរស័ព្ទទំនាក់ទំនងផ្ទាល់' : 'Direct Telephone Lines'}</span>
                  </div>
                  <div className="text-zinc-600 flex flex-wrap gap-3 pt-0.5 font-bold">
                    <span>081 505 605 (Smart)</span>
                    <span>•</span>
                    <span>067 505 605 (Metfone)</span>
                    <span>•</span>
                    <span>095 505 605 (Cellcard)</span>
                  </div>
                </div>

                {/* Email Coordinates */}
                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold">
                    <Mail className="w-4 h-4 text-rose-800" />
                    <span>{isKhmer ? 'សារអេឡិចត្រូនិចផ្លូវការ' : 'Official Email Coordinates'}</span>
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
                <h4 className="text-base sm:text-lg font-black text-zinc-950 font-khmer-title">
                  {isKhmer ? 'ទម្រង់សាកសួរព័ត៌មាន ឬចុះឈ្មោះ' : 'Admissions & Information Inquiry'}
                </h4>
                <p className="text-xs text-zinc-500 font-normal">
                  {isKhmer
                    ? 'សូមបំពេញព័ត៌មានខាងក្រោម ក្រុមការងារយើងខ្ញុំនឹងទាក់ទងទៅវិញយ៉ាងឆាប់រហ័ស។'
                    : 'Submit your contact details below and our administration team will get in touch promptly.'}
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="text-sm font-bold text-zinc-950 font-khmer-title">
                    {isKhmer ? 'បានផ្ញើព័ត៌មានដោយជោគជ័យ!' : 'Inquiry Submitted Successfully!'}
                  </div>
                  <p className="text-xs text-zinc-600">
                    {isKhmer
                      ? 'អរគុណសម្រាប់ការចាប់អារម្មណ៍លើសាលា CIIS។ ក្រុមការងាររដ្ឋបាលនឹងទាក់ទងមកលោកអ្នកក្នុងពេលឆាប់ៗ។'
                      : 'Thank you for contacting CIIS. Our admissions team will reach out to you shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-zinc-700 mb-1 font-bold">
                      {isKhmer ? 'ឈ្មោះពេញ / Full Name *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      placeholder={isKhmer ? 'ឧ. សុខ ដារ៉ា' : 'e.g. Sok Dara'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 mb-1 font-bold">
                      {isKhmer ? 'លេខទូរស័ព្ទ / Phone Number *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      placeholder="012 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 outline-none transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 mb-1 font-bold">
                      {isKhmer ? 'កម្មវិធីសិក្សាដែលចាប់អារម្មណ៍' : 'Program Track of Interest'}
                    </label>
                    <select
                      value={inquiryForm.program}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 outline-none transition-colors cursor-pointer"
                    >
                      <option value="computer-lab">{isKhmer ? 'ជំនាញកុំព្យូទ័រ Lab 1 (Touch Typing, Word, Excel)' : 'Practical Computer Lab 1'}</option>
                      <option value="kindergarten">{isKhmer ? 'ថ្នាក់មត្តេយ្យសិក្សា (Kindergarten)' : 'Early Childhood & Kindergarten'}</option>
                      <option value="grade-1-12">{isKhmer ? 'ចំណេះទូទៅ ថ្នាក់ទី១ - ទី១២ (MoEYS)' : 'General Education: Grades 1 to 12'}</option>
                      <option value="ielts">{isKhmer ? 'ភាសាអង់គ្លេសទូទៅ & IELTS' : 'International English & IELTS'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-700 mb-1 font-bold">
                      {isKhmer ? 'សារបន្ថែម (បើមាន)' : 'Message (Optional)'}
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder={isKhmer ? 'សរសេរសំណួររបស់អ្នកនៅទីនេះ...' : 'Enter your message or questions...'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-950 via-rose-900 to-pink-900 hover:from-rose-900 hover:to-pink-800 text-white font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isSubmittingInquiry ? (
                      <span>{isKhmer ? 'កំពុងផ្ញើ...' : 'Sending...'}</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{isKhmer ? 'ផ្ញើសំណួរចុះឈ្មោះ' : 'Submit Admission Inquiry'}</span>
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
      {/* 9. INSTITUTIONAL FOOTER                                                   */}
      {/* ========================================================================= */}
      <footer className="bg-zinc-950 text-zinc-400 py-12 text-xs border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 p-1 flex items-center justify-center border border-zinc-800">
                <img src="/ciis-logo.svg" alt="CIIS Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-white font-bold text-sm font-khmer-title">
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
                {isKhmer ? 'ចូលគណនីសិស្ស' : 'Student Login'}
              </button>
              <span className="text-zinc-800">•</span>
              <button
                type="button"
                onClick={() => {
                  setAuthModalRole('teacher');
                  setShowAuthModal(true);
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {isKhmer ? 'ចូលគណនីគ្រូ' : 'Faculty Access'}
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
            <div>
              &copy; {new Date().getFullYear()} CIIS International School. All Rights Reserved.
            </div>
            <div>
              Kampong Chhnang Town, Kingdom of Cambodia
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 10. MODALS (Faculty Details, Lightbox Photo Preview & Google Maps)         */}
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
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold text-rose-400">
                {isKhmer ? selectedGalleryItem.badgeKh : selectedGalleryItem.badgeEn}
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
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="text-xs font-bold text-zinc-950 font-khmer-title">
                {isKhmer ? 'ទីតាំងសាលា CIIS លើ Google Maps' : 'CIIS Campus Location on Google Maps'}
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

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600">Kampong Chhnang, Cambodia</span>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold cursor-pointer"
              >
                {isKhmer ? 'បិទផែនទី' : 'Close Map'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default GuestLandingPage;
