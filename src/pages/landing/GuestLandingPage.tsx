import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { TEACHERS_DATA, TeacherProfile } from '../../services/teacherData';
import { TeacherDetailModal } from '../../components/teachers/TeacherDetailModal';
import {
  LogIn,
  ShieldCheck,
  Globe,
  ArrowRight,
  X,
  MapPin,
  Phone,
  Mail,
  Send,
  Check
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
  const { isAuthenticated, setShowAuthModal, setAuthModalRole } = useAuth();
  const { isKhmer, language, setLanguage } = useLanguage();
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryModalItem | null>(null);
  const [activeLabTab, setActiveLabTab] = useState<'all' | 'class-1' | 'class-2'>('all');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

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
      roman: 'I',
      nameKh: 'ថ្នាក់មត្តេយ្យសិក្សា (កុមារតូច)',
      nameEn: 'Early Childhood & Kindergarten',
      tagKh: 'អាយុ ៣ - ៥ ឆ្នាំ',
      tagEn: 'Ages 3 - 5',
      descriptionKh: 'បណ្តុះបណ្តាលកុមារតូចឱ្យចេះភាសាខ្មែរ-អង់គ្លេស រៀនគូររូប ស្គាល់លេខ ចេះសីលធម៌ និងមានភាពក្លាហានក្នុងការប្រាស្រ័យទាក់ទង។',
      descriptionEn: 'Fostering foundational literacy, numeracy, creative expression, moral habits, and social confidence for young learners.',
      highlightsKh: ['មូលដ្ឋានគ្រឹះអក្សរ & លេខ', 'ភាសាខ្មែរ និងអង់គ្លេសកុមារ', 'សកម្មភាពអប់រំ និងសីលធម៌'],
      highlightsEn: ['Foundational Literacy & Numbers', 'Bilingual Khmer & English', 'Creative Educational Development']
    },
    {
      id: 'grade-1-to-12',
      index: '02',
      roman: 'II',
      nameKh: 'ចំណេះទូទៅ ថ្នាក់ទី១ ដល់ ទី១២',
      nameEn: 'General Education: Grades 1 - 12',
      tagKh: 'កម្មវិធីជាតិ MoEYS',
      tagEn: 'National Standard',
      descriptionKh: 'បង្រៀនតាមកម្មវិធីសិក្សាជាតិរបស់ក្រសួងអប់រំ យុវជន និងកីឡា ចាប់ពីកម្រិតបឋមសិក្សា អនុវិទ្យាល័យ រហូតដល់វិទ្យាល័យ និងការត្រៀមប្រឡងបាក់ឌុប BacII។',
      descriptionEn: 'Full national curriculum adhering to Ministry standards across Primary (Grades 1-6), Lower Secondary (Grades 7-9), and High School (Grades 10-12 / National BacII Exam).',
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
      descriptionKh: 'ការបណ្តុះបណ្តាលកុំព្យូទ័រលើម៉ាស៊ីនផ្ទាល់ក្នុងបន្ទប់ Lab 1 ដូចជា Touch Typing ខ្មែរ-អង់គ្លេស, Microsoft Office (Word, Excel, PowerPoint), និងជំនាញឌីជីថល។',
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
      highlightsEn: ['Four Core Language Competencies', 'Experienced Certified Instructors', 'Academic IELTS Readiness Track']
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
      subjectsEn: ['Computer Systems & Windows', 'Office Productivity', 'Spreadsheet Analytics', 'Comprehensive Practical Exam'],
      statusKh: 'ថ្នាក់ពិសេសថ្ងៃចន្ទ',
      statusEn: 'Special Monday Block'
    }
  ];

  return (
    <div className="min-h-screen bg-[#040B15] text-[#E2E8F0] antialiased font-sans relative selection:bg-[#640000] selection:text-white">

      {/* Top Precision Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-[#420001]/40 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#B67E7D] via-[#640000] to-[#B67E7D] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP UTILITY STRIP                                                      */}
      {/* ========================================================================= */}
      <div className="bg-[#040B15] border-b border-[#420001]/60 text-slate-300 text-[11px] px-4 sm:px-8 py-2 flex items-center justify-between z-50 relative font-mono">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[#B67E7D] tracking-wide">
            <span className="text-[#B67E7D] font-bold">[ :: ]</span>
            <span>CIIS ACADEMIC INSTITUTION — KAMPONG CHHNANG</span>
          </span>
          <span className="text-[#420001] hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline text-[10.5px]">
            {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស' : 'CAMBODIAN-ISLAMIC INTERNATIONAL SCHOOL'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            className="hover:text-white text-[#B67E7D] transition-colors flex items-center gap-1.5 cursor-pointer font-mono px-2.5 py-0.5 rounded border border-[#420001] bg-[#420001]/30 hover:border-[#640000] text-[11px]"
          >
            <Globe className="w-3 h-3 text-[#B67E7D]" />
            <span>{language === 'km' ? 'English [ EN ]' : 'ភាសាខ្មែរ [ KM ]'}</span>
          </button>
          <span className="text-[#420001]">|</span>
          <button
            type="button"
            onClick={() => {
              setAuthModalRole('student');
              setShowAuthModal(true);
            }}
            className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-mono"
          >
            <LogIn className="w-3 h-3 text-[#B67E7D]" />
            <span>{isKhmer ? 'គណនីសិស្ស' : 'Student Portal'}</span>
          </button>
          <span className="text-[#420001]">|</span>
          <button
            type="button"
            onClick={() => {
              setAuthModalRole('teacher');
              setShowAuthModal(true);
            }}
            className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-mono"
          >
            <ShieldCheck className="w-3 h-3 text-[#B67E7D]" />
            <span>{isKhmer ? 'គណនីគ្រូ' : 'Faculty Access'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN HEADER NAVIGATION                                                 */}
      {/* ========================================================================= */}
      <header
        className={`sticky top-0 z-40 bg-[#040B15]/95 backdrop-blur-md border-b transition-all duration-300 ${
          isScrolled ? 'border-[#640000]/70 shadow-2xl py-3' : 'border-[#420001]/70 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#420001]/80 p-1.5 flex items-center justify-center border border-[#640000] shrink-0">
              <img src="/ciis-logo.svg" alt="CIIS Logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-[#B67E7D] tracking-wider uppercase leading-none mb-1">
                [ CIIS // EST. 2018 ]
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white leading-tight truncate tracking-tight">
                {isKhmer ? 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស' : 'CIIS INTERNATIONAL SCHOOL'}
              </h1>
            </div>
          </div>

          {/* Quick Anchor Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-300">
            <a href="#about" className="hover:text-[#B67E7D] transition-colors">
              [ 01 // {isKhmer ? 'ទស្សនវិស័យ' : 'About'} ]
            </a>
            <a href="#programs" className="hover:text-[#B67E7D] transition-colors">
              [ 02 // {isKhmer ? 'កម្មវិធីសិក្សា' : 'Programs'} ]
            </a>
            <a href="#lab" className="hover:text-[#B67E7D] transition-colors">
              [ 03 // {isKhmer ? 'បន្ទប់កុំព្យូទ័រ' : 'Computer Lab'} ]
            </a>
            <a href="#events" className="hover:text-[#B67E7D] transition-colors">
              [ 04 // {isKhmer ? 'សកម្មភាពសាលា' : 'Events'} ]
            </a>
            <a href="#faculty" className="hover:text-[#B67E7D] transition-colors">
              [ 05 // {isKhmer ? 'សាស្ត្រាចារ្យ' : 'Faculty'} ]
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isAuthenticated && onReturnToPortal ? (
              <button
                type="button"
                onClick={onReturnToPortal}
                className="px-4 py-2 rounded-xl bg-[#640000] hover:bg-[#B67E7D] hover:text-[#040B15] text-white text-xs font-mono font-semibold transition-all duration-200 cursor-pointer border border-[#B67E7D]/40 shadow-sm"
              >
                {isKhmer ? 'ចូលផ្ទាំងគ្រប់គ្រង →' : 'Open Portal →'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthModalRole('student');
                  setShowAuthModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#640000] hover:bg-[#B67E7D] hover:text-[#040B15] text-white text-xs font-mono font-semibold transition-all duration-200 cursor-pointer border border-[#B67E7D]/40 shadow-sm"
              >
                {isKhmer ? 'ចូលប្រព័ន្ធ →' : 'Sign In →'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION (EDITORIAL ACADEMIC PRESTIGE)                             */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-14 pb-18 sm:pt-22 sm:pb-26 border-b border-[#420001]/60">
        {/* Subtle architectural background gradients */}
        <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-[#420001]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[28rem] h-[28rem] bg-[#640000]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-7">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#420001]/50 border border-[#640000]/80 text-[11px] font-mono text-[#B67E7D]">
              <span className="font-bold">[ CIIS INSTITUTIONAL PROFILE ]</span>
              <span className="text-[#420001]">—</span>
              <span className="text-slate-300">
                {isKhmer ? 'ខេត្តកំពង់ឆ្នាំង • ព្រះរាជាណាចក្រកម្ពុជា' : 'Kampong Chhnang, Cambodia'}
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.18]">
              {isKhmer ? (
                <>
                  ការអប់រំកម្រិតស្តង់ដារជាតិ <br />
                  <span className="text-[#B67E7D]">ចំណេះដឹងទូទៅ & បច្ចេកវិទ្យាកុំព្យូទ័រអនុវត្ត</span>
                </>
              ) : (
                <>
                  Excellence in Academic Rigor & <br />
                  <span className="text-[#B67E7D]">Hands-On Computer Workstation Mastery</span>
                </>
              )}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              {isKhmer
                ? 'សាលារៀនអន្តរជាតិ ស៊ី អាយ អាយ អេស ផ្តល់ជូនកម្មវិធីអប់រំពេញលេញចាប់ពីថ្នាក់មត្តេយ្យ ដល់ថ្នាក់ទី១២ (ត្រៀមបាក់ឌុប) ភាសាអង់គ្លេសអន្តរជាតិ IELTS និងបន្ទប់កុំព្យូទ័រអនុវត្តជាក់ស្តែង ៤០+ គ្រឿងផ្ទាល់ខ្លួន សម្រាប់អនាគតដ៏ភ្លឺស្វាងរបស់កូនលោកអ្នក។'
                : 'CIIS International School delivers integrated education spanning Kindergarten to Grade 12 (BacII preparation), International English & IELTS, alongside hands-on digital training in Computer Lab 1.'}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3.5 pt-1 flex-wrap">
              <a
                href="#programs"
                className="px-5 py-3 rounded-xl bg-[#640000] hover:bg-[#B67E7D] hover:text-[#040B15] text-white text-xs sm:text-sm font-mono font-semibold transition-all duration-200 inline-flex items-center gap-2 border border-[#B67E7D]/40 shadow-lg cursor-pointer"
              >
                <span>{isKhmer ? 'ស្វែងយល់កម្មវិធីសិក្សា' : 'Explore Academic Pathways'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="px-5 py-3 rounded-xl bg-[#420001]/40 hover:bg-[#420001] text-slate-200 text-xs sm:text-sm font-mono font-semibold transition-colors inline-flex items-center gap-2 border border-[#640000]/70 cursor-pointer"
              >
                <span>{isKhmer ? 'ទំនាក់ទំនង & ចុះឈ្មោះ' : 'Campus Admissions & Inquiry'}</span>
                <span className="text-[#B67E7D]">→</span>
              </a>
            </div>

            {/* 4 Minimalist Academic Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-8 border-t border-[#420001]/70 font-mono">
              <div className="p-4 rounded-2xl bg-[#040B15] border border-[#420001] space-y-1">
                <div className="text-xs text-[#B67E7D]">[ 01 // LAB 1 ]</div>
                <div className="text-xl sm:text-2xl font-bold text-white">40+</div>
                <div className="text-[11px] text-slate-400">
                  {isKhmer ? 'កុំព្យូទ័រអនុវត្តផ្ទាល់' : 'Dedicated Workstations'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#040B15] border border-[#420001] space-y-1">
                <div className="text-xs text-[#B67E7D]">[ 02 // MoEYS ]</div>
                <div className="text-xl sm:text-2xl font-bold text-white">K — 12</div>
                <div className="text-[11px] text-slate-400">
                  {isKhmer ? 'កម្មវិធីចំណេះទូទៅជាតិ' : 'National Standard'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#040B15] border border-[#420001] space-y-1">
                <div className="text-xs text-[#B67E7D]">[ 03 // PRACTICE ]</div>
                <div className="text-xl sm:text-2xl font-bold text-white">100%</div>
                <div className="text-[11px] text-slate-400">
                  {isKhmer ? 'អនុវត្តលើម៉ាស៊ីនពិត' : 'Hands-on Training'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#040B15] border border-[#420001] space-y-1">
                <div className="text-xs text-[#B67E7D]">[ 04 // GLOBAL ]</div>
                <div className="text-xl sm:text-2xl font-bold text-white">IELTS</div>
                <div className="text-[11px] text-slate-400">
                  {isKhmer ? 'ភាសាអន្តរជាតិ' : 'English Proficiency'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INSTITUTIONAL PILLARS / PHILOSOPHY                                     */}
      {/* ========================================================================= */}
      <section id="about" className="py-16 sm:py-20 border-b border-[#420001]/60 bg-[#040B15]/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-mono text-[#B67E7D] uppercase tracking-wider">
              [ INSTITUTIONAL PILLARS ]
            </div>
            <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
              {isKhmer ? 'សសរស្តម្ភអប់រំទាំង ៣ នៃ CIIS' : 'Three Core Educational Pillars'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              {isKhmer
                ? 'ទស្សនវិស័យអប់រំដែលផ្តោតលើគុណភាពសិក្សា បច្ចេកវិទ្យាជាក់ស្តែង និងការបណ្តុះបណ្តាលសីលធម៌ល្អ។'
                : 'A structured academic vision combining intellectual rigor, technical literacy, and strong ethical character.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-6 rounded-2xl bg-[#040B15] border border-[#420001] hover:border-[#640000] transition-colors space-y-3">
              <div className="text-xs font-mono text-[#B67E7D]">[ PILLAR I // RIGOR ]</div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {isKhmer ? 'ចំណេះដឹងទូទៅរឹងមាំ' : 'Academic Excellence'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {isKhmer
                  ? 'អនុវត្តតាមកម្មវិធីសិក្សាជាតិរបស់ក្រសួងអប់រំ ចាប់ពីបឋមសិក្សា រហូតដល់វិទ្យាល័យ ត្រៀមប្រឡងបាក់ឌុបប្រកបដោយទំនុកចិត្ត។'
                  : 'Full alignment with national Ministry curriculum standards from Primary through High School, ensuring confident BacII exam preparation.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#040B15] border border-[#420001] hover:border-[#640000] transition-colors space-y-3">
              <div className="text-xs font-mono text-[#B67E7D]">[ PILLAR II // DIGITAL ]</div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {isKhmer ? 'បច្ចេកវិទ្យា & កុំព្យូទ័រពិត' : 'Digital Workstation Mastery'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {isKhmer
                  ? 'សិស្សគ្រប់រូបមានកុំព្យូទ័រយួរដៃផ្ទាល់ខ្លួនក្នុងបន្ទប់ Lab 1 ហ្វឹកហាត់ Touch Typing រៀបចំឯកសារ Word, Excel និង PowerPoint ជាក់ស្តែង។'
                  : 'Individual workstations for every student in Lab 1, emphasizing 10-finger typing velocity and professional Microsoft Office workflows.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#040B15] border border-[#420001] hover:border-[#640000] transition-colors space-y-3">
              <div className="text-xs font-mono text-[#B67E7D]">[ PILLAR III // CHARACTER ]</div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {isKhmer ? 'សីលធម៌ & ភាសាអន្តរជាតិ' : 'Moral Integrity & Global Languages'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {isKhmer
                  ? 'បណ្តុះបណ្តាលសីលធម៌ វិន័យ សាមគ្គីភាព និងការប្រាស្រ័យទាក់ទងជាភាសាខ្មែរ អង់គ្លេស និងអារ៉ាប់។'
                  : 'Nurturing ethical leadership, discipline, community service, and multilingual fluency across Khmer, English, and Arabic.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ACADEMIC PROGRAMS SECTION (4 LEVELS)                                   */}
      {/* ========================================================================= */}
      <section id="programs" className="py-16 sm:py-20 border-b border-[#420001]/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-mono text-[#B67E7D] uppercase tracking-wider">
              [ ACADEMIC PATHWAYS ]
            </div>
            <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
              {isKhmer ? 'កម្មវិធីសិក្សាទាំង ៤ កម្រិត' : 'Four Core Academic Tracks'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              {isKhmer
                ? 'កម្មវិធីអប់រំដែលរួមបញ្ចូលគ្នារវាងចំណេះដឹងទូទៅជាតិ ជំនាញកុំព្យូទ័រអនុវត្តជាក់ស្តែង និងភាសាអង់គ្លេសស្តង់ដារអន្តរជាតិ។'
                : 'Integrated educational pathways combining national curriculum standards, practical computer lab training, and international English proficiency.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {academicLevels.map((lvl) => (
              <div
                key={lvl.id}
                className="p-6 sm:p-7 rounded-2xl bg-[#040B15] border border-[#420001] hover:border-[#640000] transition-colors space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-xs font-bold text-[#B67E7D]">[ {lvl.index} // LEVEL {lvl.roman} ]</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded bg-[#420001]/60 text-slate-300 border border-[#640000]/60">
                      {isKhmer ? lvl.tagKh : lvl.tagEn}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {isKhmer ? lvl.nameKh : lvl.nameEn}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {isKhmer ? lvl.descriptionKh : lvl.descriptionEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#420001]/70 space-y-2 font-mono text-xs">
                  {(isKhmer ? lvl.highlightsKh : lvl.highlightsEn).map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-slate-400">
                      <span className="text-[#B67E7D] font-bold">—</span>
                      <span className="font-sans text-slate-300">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COMPUTER LAB 1 WORKSTATIONS & SHIFTS                                   */}
      {/* ========================================================================= */}
      <section id="lab" className="py-16 sm:py-20 border-b border-[#420001]/60 bg-[#040B15]/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="text-xs font-mono text-[#B67E7D] uppercase tracking-wider">
                [ COMPUTER LAB 1 // 40+ STATIONS ]
              </div>
              <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                {isKhmer ? 'កាលវិភាគ & ថ្នាក់រៀនកុំព្យូទ័រ Lab 1' : 'Computer Lab 1 Workstation Shifts'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                {isKhmer
                  ? 'បំពាក់ដោយកុំព្យូទ័រយួរដៃ Dell ៤០+ គ្រឿងផ្ទាល់ខ្លួន បង្រៀនដោយលោកគ្រូជំនាញ មានការណែនាំមួយជំហានម្តងៗ។'
                  : 'Equipped with 40+ dedicated Dell laptop workstations, guided by experienced instructors with 1-on-1 practical support.'}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 font-mono">
              <button
                type="button"
                onClick={() => setActiveLabTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  activeLabTab === 'all'
                    ? 'bg-[#640000] text-white border border-[#B67E7D]/50'
                    : 'bg-[#420001]/30 text-slate-400 hover:text-white border border-[#420001]'
                }`}
              >
                [ {isKhmer ? 'ទាំងអស់' : 'ALL'} ]
              </button>
              <button
                type="button"
                onClick={() => setActiveLabTab('class-1')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  activeLabTab === 'class-1'
                    ? 'bg-[#640000] text-white border border-[#B67E7D]/50'
                    : 'bg-[#420001]/30 text-slate-400 hover:text-white border border-[#420001]'
                }`}
              >
                [ {isKhmer ? 'វេនទី១' : 'SHIFT 1'} ]
              </button>
              <button
                type="button"
                onClick={() => setActiveLabTab('class-2')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  activeLabTab === 'class-2'
                    ? 'bg-[#640000] text-white border border-[#B67E7D]/50'
                    : 'bg-[#420001]/30 text-slate-400 hover:text-white border border-[#420001]'
                }`}
              >
                [ {isKhmer ? 'វេនទី២' : 'SHIFT 2'} ]
              </button>
            </div>
          </div>

          {/* 3 Shifts Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {labShifts.map((shift) => (
              <div
                key={shift.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#040B15] border border-[#420001] hover:border-[#640000] transition-colors space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#B67E7D] font-bold">[ {shift.code} // {shift.index} ]</span>
                    <span className="text-slate-400 px-2 py-0.5 rounded bg-[#420001]/50 border border-[#420001]">
                      {isKhmer ? shift.statusKh : shift.statusEn}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {isKhmer ? shift.nameKh : shift.nameEn}
                  </h4>

                  <div className="text-xs text-slate-300 font-mono space-y-1 pt-1">
                    <div>— {isKhmer ? shift.timeKh : shift.timeEn}</div>
                    <div className="text-slate-400">— {isKhmer ? shift.teacherKh : shift.teacherEn}</div>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-[#420001]/70 space-y-1.5 text-xs text-slate-400 font-mono">
                  {(isKhmer ? shift.subjectsKh : shift.subjectsEn).map((sub, sIdx) => (
                    <div key={sIdx} className="truncate">
                      • {sub}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Real Lab Activity Photos Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {displayedLabActivities.map((act, aIdx) => (
              <div
                key={aIdx}
                onClick={() => setSelectedGalleryItem(act)}
                className="group relative rounded-2xl bg-[#040B15] border border-[#420001] hover:border-[#640000] overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#420001]/30 relative">
                  <img
                    src={act.src}
                    alt={isKhmer ? act.titleKh : act.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#040B15]/90 border border-[#420001] text-[10px] font-mono text-[#B67E7D]">
                    [ {isKhmer ? act.badgeKh : act.badgeEn} ]
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h5 className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#B67E7D] transition-colors line-clamp-1">
                    {isKhmer ? act.titleKh : act.titleEn}
                  </h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-normal">
                    {isKhmer ? act.descKh : act.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CEREMONY & CAMPUS EVENTS GALLERY                                       */}
      {/* ========================================================================= */}
      <section id="events" className="py-16 sm:py-20 border-b border-[#420001]/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-mono text-[#B67E7D] uppercase tracking-wider">
              [ CAMPUS LIFE & CEREMONIES ]
            </div>
            <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
              {isKhmer ? 'ពិធីប្រគល់វិញ្ញាបនបត្រ & សកម្មភាពសាលា' : 'Ceremonies, Awards & Campus Life'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              {isKhmer
                ? 'ទិដ្ឋភាពជាក់ស្តែងនៃពិធីចែកវិញ្ញាបនបត្របញ្ចប់ការសិក្សា ការសម្តែងសិល្បៈសិស្ស និងសុន្ទរកថារបស់គណៈគ្រប់គ្រងសាលា។'
                : 'Commemorating graduation ceremonies, academic awards, cultural performances, and leadership addresses at CIIS.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ceremonyEvents.map((evt, eIdx) => (
              <div
                key={eIdx}
                onClick={() => setSelectedGalleryItem(evt)}
                className="group relative rounded-2xl bg-[#040B15] border border-[#420001] hover:border-[#640000] overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#420001]/30 relative">
                  <img
                    src={evt.src}
                    alt={isKhmer ? evt.titleKh : evt.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#040B15]/90 border border-[#420001] text-[10px] font-mono text-[#B67E7D]">
                    [ {isKhmer ? evt.badgeKh : evt.badgeEn} ]
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h5 className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#B67E7D] transition-colors line-clamp-1">
                    {isKhmer ? evt.titleKh : evt.titleEn}
                  </h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-normal">
                    {isKhmer ? evt.descKh : evt.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. DISTINGUISHED FACULTY / TEACHERS                                       */}
      {/* ========================================================================= */}
      <section id="faculty" className="py-16 sm:py-20 border-b border-[#420001]/60 bg-[#040B15]/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-mono text-[#B67E7D] uppercase tracking-wider">
              [ FACULTY & INSTRUCTORS ]
            </div>
            <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
              {isKhmer ? 'លោកគ្រូ អ្នកគ្រូ & គរុកោសល្យ' : 'Distinguished Faculty & Instructors'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              {isKhmer
                ? 'លោកគ្រូអ្នកគ្រូមានបទពិសោធន៍បង្រៀនច្រើនឆ្នាំ យកចិត្តទុកដាក់ និងមានជំនាញច្បាស់លាស់លើមុខវិជ្ជា។'
                : 'Dedicated educators bringing years of pedagogical excellence and practical technical mastery across disciplines.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TEACHERS_DATA.slice(0, 8).map((teacher) => (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className="p-4 rounded-2xl bg-[#040B15] border border-[#420001] hover:border-[#640000] transition-colors cursor-pointer space-y-3 group text-left"
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#420001]/30 relative border border-[#420001]">
                  <img
                    src={teacher.image || '/ciis-logo.svg'}
                    alt={teacher.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#040B15]/90 border border-[#420001] text-[10px] font-mono text-[#B67E7D]">
                    [ {isKhmer ? teacher.badgeKh : teacher.badgeEn} ]
                  </div>
                </div>

                <div className="space-y-1">
                  <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#B67E7D] transition-colors truncate">
                    {isKhmer ? teacher.nameKh : teacher.nameEn}
                  </h5>
                  <p className="text-[11px] text-slate-400 truncate font-mono">
                    — {isKhmer ? teacher.roleTitleKh : teacher.roleTitleEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. CONTACT & ADMISSIONS INQUIRY                                           */}
      {/* ========================================================================= */}
      <section id="contact" className="py-16 sm:py-20 border-b border-[#420001]/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Contact Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono text-[#B67E7D] uppercase tracking-wider">
                  [ LOCATION & ADMISSIONS ]
                </div>
                <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                  {isKhmer ? 'ទំនាក់ទំនង & ទីតាំងសាលា' : 'Visit Campus & Contact Admissions'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  {isKhmer
                    ? 'សូមអញ្ជើញមកទស្សនាសាលាផ្ទាល់ ឬទាក់ទងមកកាន់ការិយាល័យរដ្ឋបាល ដើម្បីសាកសួរព័ត៌មានលម្អិតអំពីការចុះឈ្មោះចូលរៀន។'
                    : 'We invite parents and prospective students to visit our campus or reach out to our administrative office for enrollment inquiries.'}
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-[#040B15] border border-[#420001] flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#B67E7D] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-bold mb-0.5">
                      [ :: ] {isKhmer ? 'ទីតាំងសាលា' : 'Campus Location'}
                    </div>
                    <div className="text-slate-400 font-sans">
                      {isKhmer
                        ? 'ក្រុងកំពង់ឆ្នាំង ខេត្តកំពង់ឆ្នាំង ព្រះរាជាណាចក្រកម្ពុជា'
                        : 'Kampong Chhnang Town, Kampong Chhnang Province, Kingdom of Cambodia'}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#040B15] border border-[#420001] flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#B67E7D] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-bold mb-0.5">
                      [ :: ] {isKhmer ? 'លេខទូរស័ព្ទទំនាក់ទំនង' : 'Contact Telephone'}
                    </div>
                    <div className="text-slate-400">
                      +855 (0) 96 828 8848 / +855 (0) 12 345 678
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#040B15] border border-[#420001] flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#B67E7D] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-bold mb-0.5">
                      [ :: ] {isKhmer ? 'សារអេឡិចត្រូនិច' : 'Electronic Mail'}
                    </div>
                    <div className="text-slate-400">
                      info@ciis.edu.kh / admissions@ciis.edu.kh
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Inquiry Form */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#040B15] border border-[#420001] space-y-5">
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#B67E7D]">
                  [ ADMISSIONS // INQUIRY ]
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {isKhmer ? 'ទម្រង់សាកសួរព័ត៌មាន ឬចុះឈ្មោះ' : 'Admissions & Information Inquiry'}
                </h4>
                <p className="text-xs text-slate-400 font-normal">
                  {isKhmer
                    ? 'សូមបំពេញព័ត៌មានខាងក្រោម ក្រុមការងារយើងខ្ញុំនឹងទាក់ទងទៅវិញយ៉ាងឆាប់រហ័ស។'
                    : 'Submit your contact information and our administrative team will reach out promptly.'}
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="p-5 rounded-xl bg-[#420001]/40 border border-[#640000] text-center space-y-2 font-mono">
                  <div className="text-sm font-bold text-[#B67E7D] flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 text-[#B67E7D]" />
                    <span>{isKhmer ? 'បានផ្ញើព័ត៌មានដោយជោគជ័យ!' : 'Inquiry Submitted Successfully!'}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans">
                    {isKhmer
                      ? 'អរគុណសម្រាប់ការចាប់អារម្មណ៍លើសាលា CIIS។ ក្រុមការងាររដ្ឋបាលនឹងទាក់ទងមកលោកអ្នកក្នុងពេលឆាប់ៗ។'
                      : 'Thank you for your interest in CIIS. Our admissions staff will contact you shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1 font-mono">
                      [ — ] {isKhmer ? 'ឈ្មោះពេញ / Name' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      placeholder={isKhmer ? 'ឧ. សុខ ដារ៉ា' : 'e.g. Sok Dara'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040B15] border border-[#420001] focus:border-[#B67E7D] text-slate-100 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-mono">
                      [ — ] {isKhmer ? 'លេខទូរស័ព្ទ / Phone Number' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      placeholder="012 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040B15] border border-[#420001] focus:border-[#B67E7D] text-slate-100 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-mono">
                      [ — ] {isKhmer ? 'កម្មវិធីសិក្សាដែលចាប់អារម្មណ៍ / Program' : 'Program Track of Interest'}
                    </label>
                    <select
                      value={inquiryForm.program}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040B15] border border-[#420001] focus:border-[#B67E7D] text-slate-100 outline-none transition-colors"
                    >
                      <option value="computer-lab">{isKhmer ? 'ជំនាញកុំព្យូទ័រ Lab 1' : 'Computer Lab 1 Workstations'}</option>
                      <option value="kindergarten">{isKhmer ? 'ថ្នាក់មត្តេយ្យសិក្សា (Kindergarten)' : 'Early Childhood / Kindergarten'}</option>
                      <option value="grade-1-12">{isKhmer ? 'ចំណេះទូទៅ ថ្នាក់ទី១ - ទី១២ (MoEYS)' : 'K-12 General Education'}</option>
                      <option value="ielts">{isKhmer ? 'ភាសាអង់គ្លេសទូទៅ & IELTS' : 'International English & IELTS'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-mono">
                      [ — ] {isKhmer ? 'សារបន្ថែម (បើមាន) / Message' : 'Message / Specific Questions (Optional)'}
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder={isKhmer ? 'សរសេរសំណួររបស់អ្នកនៅទីនេះ...' : 'Enter any inquiries or notes...'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040B15] border border-[#420001] focus:border-[#B67E7D] text-slate-100 outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="w-full py-3 rounded-xl bg-[#640000] hover:bg-[#B67E7D] hover:text-[#040B15] text-white font-mono font-semibold transition-all duration-200 cursor-pointer border border-[#B67E7D]/40 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSubmittingInquiry ? (
                      <span>{isKhmer ? 'កំពុងផ្ញើ...' : 'Submitting...'}</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{isKhmer ? 'ផ្ញើសំណួរចុះឈ្មោះ →' : 'Submit Admission Inquiry →'}</span>
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
      {/* 10. LUXURY ACADEMIC FOOTER                                                */}
      {/* ========================================================================= */}
      <footer className="bg-[#040B15] border-t border-[#420001] py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#420001] p-1 flex items-center justify-center border border-[#640000]">
                <img src="/ciis-logo.svg" alt="CIIS Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  {isKhmer ? 'សាលារៀនអន្តរជាតិ ស៊ី អាយ អាយ អេស' : 'CIIS INTERNATIONAL SCHOOL'}
                </div>
                <div className="text-[11px] font-mono text-[#B67E7D]">
                  Empowering Futures Through Academic Excellence & Applied Technology
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setAuthModalRole('student');
                  setShowAuthModal(true);
                }}
                className="hover:text-[#B67E7D] transition-colors cursor-pointer"
              >
                [ {isKhmer ? 'ចូលគណនីសិស្ស' : 'Student Login'} ]
              </button>
              <span className="text-[#420001]">|</span>
              <button
                type="button"
                onClick={() => {
                  setAuthModalRole('teacher');
                  setShowAuthModal(true);
                }}
                className="hover:text-[#B67E7D] transition-colors cursor-pointer"
              >
                [ {isKhmer ? 'ចូលគណនីគ្រូ' : 'Faculty Login'} ]
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[#420001]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
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
      {/* 11. MODALS (Teacher Detail & Gallery Photo Preview)                       */}
      {/* ========================================================================= */}
      {selectedTeacher && (
        <TeacherDetailModal
          teacher={selectedTeacher}
          isOpen={!!selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
        />
      )}

      {selectedGalleryItem && (
        <div
          className="fixed inset-0 z-[100] bg-[#040B15]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedGalleryItem(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl bg-[#040B15] border border-[#640000] overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6 text-left animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#420001] pb-3">
              <span className="text-xs font-mono text-[#B67E7D]">
                [ {isKhmer ? selectedGalleryItem.badgeKh : selectedGalleryItem.badgeEn} ]
              </span>
              <button
                type="button"
                onClick={() => setSelectedGalleryItem(null)}
                className="p-1.5 rounded-lg bg-[#420001]/50 hover:bg-[#640000] text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-black/60 border border-[#420001]">
              <img
                src={selectedGalleryItem.src}
                alt={isKhmer ? selectedGalleryItem.titleKh : selectedGalleryItem.titleEn}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm sm:text-base font-bold text-white">
                {isKhmer ? selectedGalleryItem.titleKh : selectedGalleryItem.titleEn}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {isKhmer ? selectedGalleryItem.descKh : selectedGalleryItem.descEn}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default GuestLandingPage;
