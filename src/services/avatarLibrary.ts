// CIIS LMS 50-Avatar Curated Collection for Student & Teacher Profile Customization

export interface AvatarItem {
  id: string;
  nameKh: string;
  nameEn: string;
  category: 'student' | 'tech' | 'mascot' | 'gradient' | 'champion';
  categoryKh: string;
  categoryEn: string;
  bgGradient: string;
  borderColor: string;
  svgUri: string;
}

export interface BannerTheme {
  id: string;
  nameKh: string;
  nameEn: string;
  gradient: string;
  textColor: string;
  accentBadge: string;
}

// 50 Handcrafted Scalable Vector Avatars encoded as clean data URIs
export const AVATAR_COLLECTION: AvatarItem[] = [
  // ==================== 1. STUDENTS & ACADEMICS (1-10) ====================
  {
    id: 'avatar-std-1',
    nameKh: 'សិស្សឆ្នើម ពាក់វ៉ែនតា',
    nameEn: 'Honor Student with Glasses',
    category: 'student',
    categoryKh: 'សិស្ស & ការសិក្សា',
    categoryEn: 'Students & Academics',
    bgGradient: 'from-pink-600 to-rose-600',
    borderColor: 'border-pink-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23db2777"/><circle cx="50" cy="42" r="18" fill="%23fce7f3"/><path d="M26 86c0-13 11-24 24-24s24 11 24 24z" fill="%23be185d"/><circle cx="43" cy="40" r="5" fill="none" stroke="%23831843" stroke-width="2.5"/><circle cx="57" cy="40" r="5" fill="none" stroke="%23831843" stroke-width="2.5"/><path d="M48 40h4" stroke="%23831843" stroke-width="2.5"/><path d="M44 50q6 4 12 0" fill="none" stroke="%23831843" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  {
    id: 'avatar-std-2',
    nameKh: 'សិស្សឧស្សាហ៍ កាតាបស្ពាយ',
    nameEn: 'Diligent Student with Backpack',
    category: 'student',
    categoryKh: 'សិស្ស & ការសិក្សា',
    categoryEn: 'Students & Academics',
    bgGradient: 'from-emerald-600 to-teal-700',
    borderColor: 'border-emerald-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23059669"/><circle cx="50" cy="40" r="18" fill="%23d1fae5"/><path d="M25 88c0-14 11-25 25-25s25 11 25 25z" fill="%23065f46"/><circle cx="44" cy="38" r="2.5" fill="%23064e3b"/><circle cx="56" cy="38" r="2.5" fill="%23064e3b"/><path d="M45 47q5 4 10 0" fill="none" stroke="%23064e3b" stroke-width="2" stroke-linecap="round"/><rect x="42" y="65" width="16" height="20" rx="3" fill="%2310b981"/></svg>`
  },
  {
    id: 'avatar-std-3',
    nameKh: 'សិស្សស្រី កាសស្តាប់កម្សាន្ត',
    nameEn: 'Music & Study Student',
    category: 'student',
    categoryKh: 'សិស្ស & ការសិក្សា',
    categoryEn: 'Students & Academics',
    bgGradient: 'from-purple-600 to-indigo-700',
    borderColor: 'border-purple-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%237c3aed"/><circle cx="50" cy="42" r="18" fill="%23f3e8ff"/><path d="M26 86c0-13 11-24 24-24s24 11 24 24z" fill="%235b21b6"/><path d="M30 42a20 20 0 0 1 40 0" fill="none" stroke="%23c084fc" stroke-width="4"/><rect x="28" y="38" width="6" height="10" rx="2" fill="%23c084fc"/><rect x="66" y="38" width="6" height="10" rx="2" fill="%23c084fc"/><circle cx="44" cy="42" r="2.5" fill="%234c1d95"/><circle cx="56" cy="42" r="2.5" fill="%234c1d95"/><path d="M46 49q4 3 8 0" fill="none" stroke="%234c1d95" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  {
    id: 'avatar-std-4',
    nameKh: 'និស្សិតបញ្ចប់ការសិក្សា',
    nameEn: 'Graduate with Cap',
    category: 'student',
    categoryKh: 'សិស្ស & ការសិក្សា',
    categoryEn: 'Students & Academics',
    bgGradient: 'from-blue-600 to-cyan-700',
    borderColor: 'border-blue-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%232563eb"/><circle cx="50" cy="48" r="17" fill="%23dbeafe"/><path d="M26 90c0-13 11-24 24-24s24 11 24 24z" fill="%231e40af"/><polygon points="50,16 78,28 50,40 22,28" fill="%231e3a8a"/><rect x="42" y="34" width="16" height="7" rx="1" fill="%231e3a8a"/><line x1="72" y1="29" x2="76" y2="46" stroke="%23fbbf24" stroke-width="2.5"/><circle cx="76" cy="48" r="2.5" fill="%23fbbf24"/><circle cx="44" cy="48" r="2.5" fill="%231e3a8a"/><circle cx="56" cy="48" r="2.5" fill="%231e3a8a"/></svg>`
  },
  {
    id: 'avatar-std-5',
    nameKh: 'សិស្សស្រី ចងសក់ក្រវិល',
    nameEn: 'Student with Ponytail',
    category: 'student',
    categoryKh: 'សិស្ស & ការសិក្សា',
    categoryEn: 'Students & Academics',
    bgGradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23d97706"/><circle cx="50" cy="42" r="18" fill="%23fef3c7"/><path d="M26 86c0-13 11-24 24-24s24 11 24 24z" fill="%2392400e"/><circle cx="44" cy="40" r="2.5" fill="%2378350f"/><circle cx="56" cy="40" r="2.5" fill="%2378350f"/><path d="M45 48q5 4 10 0" fill="none" stroke="%2378350f" stroke-width="2" stroke-linecap="round"/><circle cx="28" cy="30" r="7" fill="%23b45309"/></svg>`
  },
  {
    id: 'avatar-std-6',
    nameKh: 'អ្នកស្រាវជ្រាវ បណ្ណាល័យ',
    nameEn: 'Library Reader & Scholar',
    category: 'student',
    categoryKh: 'សិស្ស & ការសិក្សា',
    categoryEn: 'Students & Academics',
    bgGradient: 'from-cyan-600 to-blue-700',
    borderColor: 'border-cyan-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230891b2"/><circle cx="50" cy="38" r="16" fill="%23cffafe"/><path d="M25 86c0-13 11-24 25-24s25 11 25 24z" fill="%23155e75"/><path d="M34 68h32v16H34z" fill="%23e0f2fe"/><path d="M50 68v16" stroke="%230284c7" stroke-width="2"/></svg>`
  },
  {
    id: 'avatar-std-7',
    nameKh: 'សិស្សវិទ្យាសាស្ត្រ Lab',
    nameEn: 'Science Lab Scholar',
    category: 'student',
    categoryKh: 'សិស្ស & ការសិក្សា',
    categoryEn: 'Students & Academics',
    bgGradient: 'from-teal-600 to-emerald-700',
    borderColor: 'border-teal-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230d9488"/><circle cx="50" cy="40" r="17" fill="%23ccfbf1"/><path d="M26 86c0-13 11-24 24-24s24 11 24 24z" fill="%23115e59"/><rect x="36" y="36" width="28" height="8" rx="4" fill="none" stroke="%230f766e" stroke-width="2.5"/></svg>`
  },
  {
    id: 'avatar-std-8',
    nameKh: 'សិស្សឆ្នើម គណិតវិទ្យា',
    nameEn: 'Math Olympiad Genius',
    category: 'student',
    categoryKh: 'សិស្ស & ការសិក្សា',
    categoryEn: 'Students & Academics',
    bgGradient: 'from-rose-600 to-pink-700',
    borderColor: 'border-rose-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23e11d48"/><circle cx="50" cy="40" r="17" fill="%23ffe4e6"/><path d="M26 86c0-13 11-24 24-24s24 11 24 24z" fill="%239f1239"/><text x="50" y="78" font-size="14" font-weight="900" fill="%23ffffff" text-anchor="middle" font-family="sans-serif">π</text></svg>`
  },
  {
    id: 'avatar-std-9',
    nameKh: 'អ្នកដឹកនាំក្រុមសិស្ស',
    nameEn: 'Student Council Leader',
    category: 'student',
    categoryKh: 'សិស្ស & ការសិក្សា',
    categoryEn: 'Students & Academics',
    bgGradient: 'from-indigo-600 to-blue-700',
    borderColor: 'border-indigo-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%234f46e5"/><circle cx="50" cy="40" r="17" fill="%23e0e7ff"/><path d="M26 86c0-13 11-24 24-24s24 11 24 24z" fill="%233730a3"/><polygon points="50,66 53,74 61,74 55,79 57,87 50,82 43,87 45,79 39,74 47,74" fill="%23fbbf24"/></svg>`
  },
  {
    id: 'avatar-std-10',
    nameKh: 'សិស្សឆ្លាតវៃ ហ្វឹកហាត់ភាសា',
    nameEn: 'Language & IELTS Enthusiast',
    category: 'student',
    categoryKh: 'សិស្ស & ការសិក្សា',
    categoryEn: 'Students & Academics',
    bgGradient: 'from-sky-600 to-indigo-800',
    borderColor: 'border-sky-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230284c7"/><circle cx="50" cy="40" r="17" fill="%23e0f2fe"/><path d="M26 86c0-13 11-24 24-24s24 11 24 24z" fill="%23075985"/><circle cx="50" cy="74" r="8" fill="%2338bdf8"/></svg>`
  },

  // ==================== 2. CODERS & TECH (11-20) ====================
  {
    id: 'avatar-tech-1',
    nameKh: 'អ្នកសរសេរកូដ Cyber Coder',
    nameEn: 'Cyber Terminal Coder',
    category: 'tech',
    categoryKh: 'បច្ចេកវិទ្យា & កូដ',
    categoryEn: 'Tech & Coders',
    bgGradient: 'from-pink-700 to-indigo-900',
    borderColor: 'border-pink-400',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23831843"/><rect x="22" y="24" width="56" height="42" rx="6" fill="%23be185d" stroke="%23f472b6" stroke-width="2.5"/><text x="30" y="48" font-family="monospace" font-weight="900" font-size="16" fill="%23ffffff">&lt;/&gt;</text><path d="M28 84c0-10 10-18 22-18s22 8 22 18z" fill="%23db2777"/></svg>`
  },
  {
    id: 'avatar-tech-2',
    nameKh: 'ម្ចាស់រូបមន្ត Excel Master',
    nameEn: 'Excel Formula Guru',
    category: 'tech',
    categoryKh: 'បច្ចេកវិទ្យា & កូដ',
    categoryEn: 'Tech & Coders',
    bgGradient: 'from-emerald-700 to-green-900',
    borderColor: 'border-emerald-400',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23065f46"/><rect x="25" y="25" width="50" height="50" rx="8" fill="%23047857" stroke="%2334d399" stroke-width="2"/><path d="M36 36l28 28M64 36L36 64" stroke="%23ffffff" stroke-width="7" stroke-linecap="round"/></svg>`
  },
  {
    id: 'avatar-tech-3',
    nameKh: 'ជើងឯកវាយអក្សរ Typing Master',
    nameEn: 'Touch Typing Legend (120 WPM)',
    category: 'tech',
    categoryKh: 'បច្ចេកវិទ្យា & កូដ',
    categoryEn: 'Tech & Coders',
    bgGradient: 'from-pink-700 to-purple-900',
    borderColor: 'border-pink-400',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23831843"/><rect x="22" y="32" width="56" height="36" rx="6" fill="%23500724" stroke="%23f472b6" stroke-width="2"/><circle cx="32" cy="42" r="3" fill="%23fbcfe8"/><circle cx="44" cy="42" r="3" fill="%23fbcfe8"/><circle cx="56" cy="42" r="3" fill="%23fbcfe8"/><circle cx="68" cy="42" r="3" fill="%23fbcfe8"/><rect x="36" y="54" width="28" height="6" rx="3" fill="%23f472b6"/></svg>`
  },
  {
    id: 'avatar-tech-4',
    nameKh: 'វិស្វករបញ្ញាសិប្បនិម្មិត AI',
    nameEn: 'AI & Neural Engineer',
    category: 'tech',
    categoryKh: 'បច្ចេកវិទ្យា & កូដ',
    categoryEn: 'Tech & Coders',
    bgGradient: 'from-violet-700 to-indigo-950',
    borderColor: 'border-violet-400',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%234c1d95"/><circle cx="50" cy="50" r="22" fill="none" stroke="%23a78bfa" stroke-width="3"/><circle cx="50" cy="50" r="10" fill="%23c4b5fd"/><circle cx="50" cy="22" r="4" fill="%23ddd6fe"/><circle cx="50" cy="78" r="4" fill="%23ddd6fe"/><circle cx="22" cy="50" r="4" fill="%23ddd6fe"/><circle cx="78" cy="50" r="4" fill="%23ddd6fe"/></svg>`
  },
  {
    id: 'avatar-tech-5',
    nameKh: 'អ្នករចនាគេហទំព័រ UI/UX',
    nameEn: 'Web & UI/UX Designer',
    category: 'tech',
    categoryKh: 'បច្ចេកវិទ្យា & កូដ',
    categoryEn: 'Tech & Coders',
    bgGradient: 'from-rose-600 to-amber-600',
    borderColor: 'border-rose-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23e11d48"/><path d="M30 40a20 20 0 0 1 40 0c0 15-20 35-20 35s-20-20-20-35z" fill="%23ffffff"/><circle cx="50" cy="40" r="8" fill="%23be123c"/></svg>`
  },
  {
    id: 'avatar-tech-6',
    nameKh: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ Cloud',
    nameEn: 'Cloud DevOps Specialist',
    category: 'tech',
    categoryKh: 'បច្ចេកវិទ្យា & កូដ',
    categoryEn: 'Tech & Coders',
    bgGradient: 'from-cyan-600 to-blue-800',
    borderColor: 'border-cyan-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230284c7"/><path d="M35 60h30a14 14 0 0 0 0-28 18 18 0 0 0-33-6 12 12 0 0 0 3 34z" fill="%23ffffff"/></svg>`
  },
  {
    id: 'avatar-tech-7',
    nameKh: 'អ្នកបង្កើតហ្គេម Game Dev',
    nameEn: 'Game Dev Pixel Master',
    category: 'tech',
    categoryKh: 'បច្ចេកវិទ្យា & កូដ',
    categoryEn: 'Tech & Coders',
    bgGradient: 'from-indigo-700 to-slate-950',
    borderColor: 'border-indigo-400',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23312e81"/><rect x="25" y="36" width="50" height="28" rx="8" fill="%234338ca" stroke="%23818cf8" stroke-width="2"/><circle cx="40" cy="50" r="4" fill="%23ffffff"/><circle cx="60" cy="46" r="3" fill="%23f43f5e"/><circle cx="66" cy="52" r="3" fill="%2338bdf8"/></svg>`
  },
  {
    id: 'avatar-tech-8',
    nameKh: 'អ្នកឯកទេសទិន្នន័យ Database',
    nameEn: 'Database & SQL Architect',
    category: 'tech',
    categoryKh: 'បច្ចេកវិទ្យា & កូដ',
    categoryEn: 'Tech & Coders',
    bgGradient: 'from-amber-600 to-orange-800',
    borderColor: 'border-amber-400',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23d97706"/><ellipse cx="50" cy="34" rx="22" ry="7" fill="%23fef3c7"/><path d="M28 34v16c0 4 10 7 22 7s22-3 22-7V34" fill="none" stroke="%23fef3c7" stroke-width="4"/><path d="M28 50v16c0 4 10 7 22 7s22-3 22-7V50" fill="none" stroke="%23fef3c7" stroke-width="4"/></svg>`
  },
  {
    id: 'avatar-tech-9',
    nameKh: 'វិស្វករផ្នែករឹង Hardware',
    nameEn: 'Hardware & Microchip Tech',
    category: 'tech',
    categoryKh: 'បច្ចេកវិទ្យា & កូដ',
    categoryEn: 'Tech & Coders',
    bgGradient: 'from-teal-700 to-slate-900',
    borderColor: 'border-teal-400',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230f766e"/><rect x="32" y="32" width="36" height="36" rx="4" fill="%23115e59" stroke="%232dd4bf" stroke-width="3"/><rect x="42" y="42" width="16" height="16" fill="%232dd4bf"/></svg>`
  },
  {
    id: 'avatar-tech-10',
    nameKh: 'អ្នកការពារប្រព័ន្ធ Cyber Shield',
    nameEn: 'Cyber Security Defender',
    category: 'tech',
    categoryKh: 'បច្ចេកវិទ្យា & កូដ',
    categoryEn: 'Tech & Coders',
    bgGradient: 'from-blue-700 to-pink-900',
    borderColor: 'border-blue-400',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%231e40af"/><path d="M50 22l22 8v16c0 15-10 26-22 30-12-4-22-15-22-30V30z" fill="%233b82f6" stroke="%2393c5fd" stroke-width="2"/><path d="M42 48l6 6 12-12" fill="none" stroke="%23ffffff" stroke-width="3.5" stroke-linecap="round"/></svg>`
  },

  // ==================== 3. SMART MASCOTS & ANIMALS (21-30) ====================
  {
    id: 'avatar-mascot-1',
    nameKh: 'សត្វទីទុយឆ្លាតវៃ Cyber Owl',
    nameEn: 'Wise Cyber Owl (Wisdom)',
    category: 'mascot',
    categoryKh: 'ម៉ាស្កត & សត្វ',
    categoryEn: 'Mascots & Animals',
    bgGradient: 'from-indigo-600 to-violet-800',
    borderColor: 'border-indigo-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%234338ca"/><circle cx="50" cy="52" r="26" fill="%236366f1"/><circle cx="39" cy="46" r="9" fill="%23ffffff"/><circle cx="61" cy="46" r="9" fill="%23ffffff"/><circle cx="39" cy="46" r="4.5" fill="%231e1b4b"/><circle cx="61" cy="46" r="4.5" fill="%231e1b4b"/><polygon points="50,54 46,60 54,60" fill="%23fbbf24"/></svg>`
  },
  {
    id: 'avatar-mascot-2',
    nameKh: 'ខ្លារខិនល្បឿនលឿន Fast Cheetah',
    nameEn: 'Fast Cheetah (Speed Typing)',
    category: 'mascot',
    categoryKh: 'ម៉ាស្កត & សត្វ',
    categoryEn: 'Mascots & Animals',
    bgGradient: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23d97706"/><circle cx="50" cy="50" r="25" fill="%23f59e0b"/><circle cx="38" cy="46" r="4" fill="%2378350f"/><circle cx="62" cy="46" r="4" fill="%2378350f"/><ellipse cx="50" cy="58" rx="7" ry="4" fill="%2378350f"/></svg>`
  },
  {
    id: 'avatar-mascot-3',
    nameKh: 'កញ្ជ្រោងឆ្លាតវៃ Smart Fox',
    nameEn: 'Clever Fox (Problem Solver)',
    category: 'mascot',
    categoryKh: 'ម៉ាស្កត & សត្វ',
    categoryEn: 'Mascots & Animals',
    bgGradient: 'from-orange-600 to-red-700',
    borderColor: 'border-orange-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23ea580c"/><polygon points="28,26 36,46 22,46" fill="%23c2410c"/><polygon points="72,26 64,46 78,46" fill="%23c2410c"/><polygon points="50,72 26,44 74,44" fill="%23f97316"/><polygon points="50,72 40,56 60,56" fill="%23ffffff"/><circle cx="50" cy="68" r="3" fill="%23431407"/></svg>`
  },
  {
    id: 'avatar-mascot-4',
    nameKh: 'ខ្លាឃ្មុំផេនដា Zen Panda',
    nameEn: 'Zen Panda (Calm Coder)',
    category: 'mascot',
    categoryKh: 'ម៉ាស្កត & សត្វ',
    categoryEn: 'Mascots & Animals',
    bgGradient: 'from-emerald-700 to-teal-900',
    borderColor: 'border-emerald-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23047857"/><circle cx="28" cy="28" r="8" fill="%23064e3b"/><circle cx="72" cy="28" r="8" fill="%23064e3b"/><circle cx="50" cy="52" r="26" fill="%23ffffff"/><ellipse cx="38" cy="48" rx="6" ry="8" fill="%23064e3b"/><ellipse cx="62" cy="48" rx="6" ry="8" fill="%23064e3b"/><circle cx="38" cy="47" r="2.5" fill="%23ffffff"/><circle cx="62" cy="47" r="2.5" fill="%23ffffff"/><ellipse cx="50" cy="58" rx="4" ry="3" fill="%23064e3b"/></svg>`
  },
  {
    id: 'avatar-mascot-5',
    nameKh: 'ឆ្មាអវកាស Astro Cat',
    nameEn: 'Cosmic Astro Cat',
    category: 'mascot',
    categoryKh: 'ម៉ាស្កត & សត្វ',
    categoryEn: 'Mascots & Animals',
    bgGradient: 'from-pink-600 to-purple-800',
    borderColor: 'border-pink-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23db2777"/><polygon points="28,26 40,40 24,42" fill="%239d174d"/><polygon points="72,26 60,40 76,42" fill="%239d174d"/><circle cx="50" cy="54" r="24" fill="%23fbcfe8"/><ellipse cx="40" cy="50" rx="4" ry="6" fill="%23831843"/><ellipse cx="60" cy="50" rx="4" ry="6" fill="%23831843"/><polygon points="50,58 46,62 54,62" fill="%23be185d"/></svg>`
  },
  {
    id: 'avatar-mascot-6',
    nameKh: 'សត្វតោរាជ្យ Lion Champion',
    nameEn: 'Lion Champion (Courage)',
    category: 'mascot',
    categoryKh: 'ម៉ាស្កត & សត្វ',
    categoryEn: 'Mascots & Animals',
    bgGradient: 'from-amber-600 to-red-800',
    borderColor: 'border-amber-400',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23b45309"/><circle cx="50" cy="50" r="30" fill="%2378350f"/><circle cx="50" cy="50" r="20" fill="%23f59e0b"/><circle cx="42" cy="46" r="3" fill="%23451a03"/><circle cx="58" cy="46" r="3" fill="%23451a03"/><polygon points="50,52 46,57 54,57" fill="%23451a03"/></svg>`
  },
  {
    id: 'avatar-mascot-7',
    nameKh: 'ឥន្ទ្រីយោធា Cyber Eagle',
    nameEn: 'Cyber Eagle (Vision)',
    category: 'mascot',
    categoryKh: 'ម៉ាស្កត & សត្វ',
    categoryEn: 'Mascots & Animals',
    bgGradient: 'from-sky-700 to-indigo-900',
    borderColor: 'border-sky-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230369a1"/><polygon points="50,26 30,52 70,52" fill="%23ffffff"/><polygon points="50,52 40,68 60,68" fill="%23f59e0b"/><circle cx="44" cy="42" r="3" fill="%230c4a6e"/><circle cx="56" cy="42" r="3" fill="%230c4a6e"/></svg>`
  },
  {
    id: 'avatar-mascot-8',
    nameKh: 'សត្វភេនឃ្វីន Penguin Hacker',
    nameEn: 'Penguin Hacker (Linux)',
    category: 'mascot',
    categoryKh: 'ម៉ាស្កត & សត្វ',
    categoryEn: 'Mascots & Animals',
    bgGradient: 'from-cyan-700 to-blue-900',
    borderColor: 'border-cyan-400',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230284c7"/><ellipse cx="50" cy="50" rx="24" ry="28" fill="%230369a1"/><ellipse cx="50" cy="54" rx="16" ry="20" fill="%23ffffff"/><ellipse cx="43" cy="40" rx="3" ry="5" fill="%230c4a6e"/><ellipse cx="57" cy="40" rx="3" ry="5" fill="%230c4a6e"/><polygon points="50,46 44,52 56,52" fill="%23f59e0b"/></svg>`
  },
  {
    id: 'avatar-mascot-9',
    nameKh: 'នាគមាស Golden Dragon',
    nameEn: 'Golden Dragon (Power)',
    category: 'mascot',
    categoryKh: 'ម៉ាស្កត & សត្វ',
    categoryEn: 'Mascots & Animals',
    bgGradient: 'from-yellow-600 to-red-900',
    borderColor: 'border-yellow-400',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23ca8a04"/><path d="M30 65q20-30 40 0" stroke="%23ffffff" stroke-width="6" fill="none"/><circle cx="40" cy="42" r="4" fill="%237f1d1d"/><circle cx="60" cy="42" r="4" fill="%237f1d1d"/></svg>`
  },
  {
    id: 'avatar-mascot-10',
    nameKh: 'ឆ្កែអវកាស Astro Shiba',
    nameEn: 'Astro Shiba (Loyalty)',
    category: 'mascot',
    categoryKh: 'ម៉ាស្កត & សត្វ',
    categoryEn: 'Mascots & Animals',
    bgGradient: 'from-amber-600 to-orange-700',
    borderColor: 'border-amber-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23d97706"/><circle cx="50" cy="52" r="26" fill="%23f59e0b"/><polygon points="26,28 38,44 24,44" fill="%23b45309"/><polygon points="74,28 62,44 76,44" fill="%23b45309"/><circle cx="40" cy="48" r="3.5" fill="%23451a03"/><circle cx="60" cy="48" r="3.5" fill="%23451a03"/><ellipse cx="50" cy="58" rx="4" ry="3" fill="%23451a03"/></svg>`
  },

  // ==================== 4. 3D GRADIENTS & MINIMAL SHAPES (31-40) ====================
  {
    id: 'avatar-grad-1',
    nameKh: 'ពន្លឺ Aurora Nebula',
    nameEn: 'Aurora Nebula Glow',
    category: 'gradient',
    categoryKh: 'ពណ៌ 3D Minimal',
    categoryEn: '3D & Gradients',
    bgGradient: 'from-pink-500 via-purple-600 to-indigo-700',
    borderColor: 'border-pink-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%25" stop-color="%23ec4899"/><stop offset="50%25" stop-color="%238b5cf6"/><stop offset="100%25" stop-color="%233b82f6"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g1)"/><circle cx="50" cy="50" r="20" fill="%23ffffff" opacity="0.3"/></svg>`
  },
  {
    id: 'avatar-grad-2',
    nameKh: 'ត្បូងមរកត Emerald Crystal',
    nameEn: 'Emerald Crystal Geo',
    category: 'gradient',
    categoryKh: 'ពណ៌ 3D Minimal',
    categoryEn: '3D & Gradients',
    bgGradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    borderColor: 'border-emerald-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23059669"/><polygon points="50,22 76,50 50,78 24,50" fill="%23a7f3d0"/><polygon points="50,30 68,50 50,70 32,50" fill="%2334d399"/></svg>`
  },
  {
    id: 'avatar-grad-3',
    nameKh: 'ព្រះអាទិត្យលិច Sunset Coral',
    nameEn: 'Sunset Coral Prism',
    category: 'gradient',
    categoryKh: 'ពណ៌ 3D Minimal',
    categoryEn: '3D & Gradients',
    bgGradient: 'from-rose-500 via-amber-500 to-orange-600',
    borderColor: 'border-rose-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23f43f5e"/><circle cx="50" cy="50" r="30" fill="%23fbbf24" opacity="0.8"/><circle cx="50" cy="50" r="16" fill="%23ffffff"/></svg>`
  },
  {
    id: 'avatar-grad-4',
    nameKh: 'រលកអគ្គិសនី Electric Cyan',
    nameEn: 'Electric Cyan Orbit',
    category: 'gradient',
    categoryKh: 'ពណ៌ 3D Minimal',
    categoryEn: '3D & Gradients',
    bgGradient: 'from-cyan-500 via-blue-600 to-indigo-800',
    borderColor: 'border-cyan-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%2306b6d4"/><circle cx="50" cy="50" r="26" fill="none" stroke="%23ffffff" stroke-width="4"/><ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke="%23ffffff" stroke-width="3" transform="rotate(30 50 50)"/></svg>`
  },
  {
    id: 'avatar-grad-5',
    nameKh: 'ផ្កាយរណប Royal Lavender',
    nameEn: 'Royal Lavender Orb',
    category: 'gradient',
    categoryKh: 'ពណ៌ 3D Minimal',
    categoryEn: '3D & Gradients',
    bgGradient: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%239333ea"/><circle cx="40" cy="40" r="18" fill="%23f3e8ff" opacity="0.5"/><circle cx="60" cy="60" r="12" fill="%23f472b6" opacity="0.6"/></svg>`
  },
  {
    id: 'avatar-grad-6',
    nameKh: 'ថាមពលព្រះអាទិត្យ Solar Flare',
    nameEn: 'Solar Gold Flare',
    category: 'gradient',
    categoryKh: 'ពណ៌ 3D Minimal',
    categoryEn: '3D & Gradients',
    bgGradient: 'from-amber-400 via-orange-500 to-yellow-600',
    borderColor: 'border-amber-200',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23f59e0b"/><polygon points="50,16 58,38 80,38 62,52 68,74 50,60 32,74 38,52 20,38 42,38" fill="%23ffffff"/></svg>`
  },
  {
    id: 'avatar-grad-7',
    nameKh: 'បណ្ដាញ Matrix Green Helix',
    nameEn: 'Matrix Cyber Grid',
    category: 'gradient',
    categoryKh: 'ពណ៌ 3D Minimal',
    categoryEn: '3D & Gradients',
    bgGradient: 'from-emerald-600 via-green-700 to-teal-900',
    borderColor: 'border-emerald-400',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23047857"/><line x1="20" y1="50" x2="80" y2="50" stroke="%236ee7b7" stroke-width="3"/><line x1="50" y1="20" x2="50" y2="80" stroke="%236ee7b7" stroke-width="3"/><circle cx="50" cy="50" r="16" fill="none" stroke="%236ee7b7" stroke-width="3"/></svg>`
  },
  {
    id: 'avatar-grad-8',
    nameKh: 'រន្ធខ្មៅ Cosmic Void',
    nameEn: 'Cosmic Portal Sphere',
    category: 'gradient',
    categoryKh: 'ពណ៌ 3D Minimal',
    categoryEn: '3D & Gradients',
    bgGradient: 'from-slate-950 via-purple-950 to-pink-950',
    borderColor: 'border-purple-500',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23020617"/><circle cx="50" cy="50" r="28" fill="none" stroke="%23ec4899" stroke-width="4"/><circle cx="50" cy="50" r="14" fill="%23a855f7"/></svg>`
  },
  {
    id: 'avatar-grad-9',
    nameKh: 'ល្បឿន Crimson Velocity',
    nameEn: 'Crimson Velocity Wave',
    category: 'gradient',
    categoryKh: 'ពណ៌ 3D Minimal',
    categoryEn: '3D & Gradients',
    bgGradient: 'from-red-600 via-rose-700 to-pink-900',
    borderColor: 'border-red-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23dc2626"/><path d="M22 65q28-30 56 0" stroke="%23ffffff" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M30 45q20-20 40 0" stroke="%23fecdd3" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'avatar-grad-10',
    nameKh: 'គ្រីស្តាល់ Crystal Hexagon',
    nameEn: 'Diamond Crystal Hexagon',
    category: 'gradient',
    categoryKh: 'ពណ៌ 3D Minimal',
    categoryEn: '3D & Gradients',
    bgGradient: 'from-blue-500 via-indigo-600 to-cyan-500',
    borderColor: 'border-cyan-200',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%233b82f6"/><polygon points="50,22 75,36 75,64 50,78 25,64 25,36" fill="none" stroke="%23ffffff" stroke-width="4"/><polygon points="50,32 66,41 66,59 50,68 34,59 34,41" fill="%2367e8f9" opacity="0.6"/></svg>`
  },

  // ==================== 5. CHAMPIONS & INSPIRATION ICONS (41-50) ====================
  {
    id: 'avatar-champ-1',
    nameKh: 'ពានរង្វាន់មាស Champion Cup',
    nameEn: 'Gold Trophy Champion',
    category: 'champion',
    categoryKh: 'ជើងឯក & និមិត្តសញ្ញា',
    categoryEn: 'Champions & Icons',
    bgGradient: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23f59e0b"/><path d="M34 30h32v18a16 16 0 0 1-32 0z" fill="%23ffffff"/><path d="M50 48v16M40 64h20" stroke="%23ffffff" stroke-width="4" stroke-linecap="round"/><path d="M34 36H26a6 6 0 0 0 6 6h2M66 36h8a6 6 0 0 1-6 6h-2" fill="none" stroke="%23ffffff" stroke-width="3"/></svg>`
  },
  {
    id: 'avatar-champ-2',
    nameKh: 'រន្ទះបាញ់ Lightning Bolt',
    nameEn: 'Lightning Bolt Energy',
    category: 'champion',
    categoryKh: 'ជើងឯក & និមិត្តសញ្ញា',
    categoryEn: 'Champions & Icons',
    bgGradient: 'from-yellow-500 to-amber-700',
    borderColor: 'border-yellow-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23eab308"/><polygon points="54,18 30,50 48,50 44,82 70,44 52,44" fill="%23ffffff" stroke="%23ca8a04" stroke-width="2"/></svg>`
  },
  {
    id: 'avatar-champ-3',
    nameKh: 'ពេជ្រមហាសាល Diamond Star',
    nameEn: 'Diamond Tier Star',
    category: 'champion',
    categoryKh: 'ជើងឯក & និមិត្តសញ្ញា',
    categoryEn: 'Champions & Icons',
    bgGradient: 'from-cyan-600 to-blue-700',
    borderColor: 'border-cyan-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230891b2"/><polygon points="50,20 74,38 64,74 36,74 26,38" fill="%23ffffff"/><polygon points="50,20 60,38 50,74 40,38" fill="%23a5f3fc"/></svg>`
  },
  {
    id: 'avatar-champ-4',
    nameKh: 'ផ្កាយសំណាង Star Voyager',
    nameEn: 'Star Voyager Explorer',
    category: 'champion',
    categoryKh: 'ជើងឯក & និមិត្តសញ្ញា',
    categoryEn: 'Champions & Icons',
    bgGradient: 'from-pink-600 to-rose-700',
    borderColor: 'border-pink-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23db2777"/><polygon points="50,18 59,38 81,38 63,52 70,72 50,60 30,72 37,52 19,38 41,38" fill="%23ffffff"/></svg>`
  },
  {
    id: 'avatar-champ-5',
    nameKh: 'ខែលកិត្តិយស Shield of Honor',
    nameEn: 'Shield of Honor',
    category: 'champion',
    categoryKh: 'ជើងឯក & និមិត្តសញ្ញា',
    categoryEn: 'Champions & Icons',
    bgGradient: 'from-indigo-600 to-purple-800',
    borderColor: 'border-indigo-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%234f46e5"/><path d="M50 20l24 9v18c0 16-11 27-24 31-13-4-24-15-24-31V29z" fill="%23ffffff"/><path d="M50 32l12 12-12 12-12-12z" fill="%236366f1"/></svg>`
  },
  {
    id: 'avatar-champ-6',
    nameKh: 'គប់ភ្លើងចំណេះដឹង Torch of Wisdom',
    nameEn: 'Torch of Knowledge',
    category: 'champion',
    categoryKh: 'ជើងឯក & និមិត្តសញ្ញា',
    categoryEn: 'Champions & Icons',
    bgGradient: 'from-orange-600 to-amber-700',
    borderColor: 'border-orange-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23ea580c"/><path d="M42 46h16l-4 36h-8z" fill="%2378350f"/><path d="M50 18q14 14 0 26-14-12 0-26z" fill="%23fbbf24"/></svg>`
  },
  {
    id: 'avatar-champ-7',
    nameKh: 'ត្រីវិស័យទិសដៅ Compass Guide',
    nameEn: 'Compass Guide for Future',
    category: 'champion',
    categoryKh: 'ជើងឯក & និមិត្តសញ្ញា',
    categoryEn: 'Champions & Icons',
    bgGradient: 'from-teal-600 to-emerald-800',
    borderColor: 'border-teal-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230d9488"/><circle cx="50" cy="50" r="28" fill="none" stroke="%23ffffff" stroke-width="3"/><polygon points="50,28 56,50 50,72 44,50" fill="%23f43f5e"/><polygon points="50,50 56,50 50,72 44,50" fill="%23ffffff"/></svg>`
  },
  {
    id: 'avatar-champ-8',
    nameKh: 'ម្កុដកិត្តិយស Crown of Excellence',
    nameEn: 'Crown of Excellence',
    category: 'champion',
    categoryKh: 'ជើងឯក & និមិត្តសញ្ញា',
    categoryEn: 'Champions & Icons',
    bgGradient: 'from-amber-600 to-yellow-700',
    borderColor: 'border-amber-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23d97706"/><polygon points="26,62 30,34 42,46 50,28 58,46 70,34 74,62" fill="%23ffffff"/><circle cx="30" cy="34" r="3" fill="%23f59e0b"/><circle cx="50" cy="28" r="3" fill="%23f59e0b"/><circle cx="70" cy="34" r="3" fill="%23f59e0b"/></svg>`
  },
  {
    id: 'avatar-champ-9',
    nameKh: 'និមិត្តសញ្ញាគ្មានដែនកំណត់ Infinite Growth',
    nameEn: 'Infinite Potential Loop',
    category: 'champion',
    categoryKh: 'ជើងឯក & និមិត្តសញ្ញា',
    categoryEn: 'Champions & Icons',
    bgGradient: 'from-purple-700 to-pink-800',
    borderColor: 'border-purple-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%236b21a8"/><path d="M36 50a12 12 0 1 1 0-1 12 12 0 0 1 28 2 12 12 0 1 1 0-1 12 12 0 0 1-28 0z" fill="none" stroke="%23ffffff" stroke-width="5"/></svg>`
  },
  {
    id: 'avatar-champ-10',
    nameKh: 'កូនសោរជោគជ័យ Key to Success',
    nameEn: 'Master Key to Success',
    category: 'champion',
    categoryKh: 'ជើងឯក & និមិត្តសញ្ញា',
    categoryEn: 'Champions & Icons',
    bgGradient: 'from-pink-700 to-rose-900',
    borderColor: 'border-pink-300',
    svgUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23be123c"/><circle cx="42" cy="42" r="14" fill="none" stroke="%23ffffff" stroke-width="5"/><path d="M52 52l22 22M64 64l6-6M70 70l6-6" stroke="%23ffffff" stroke-width="5" stroke-linecap="round"/></svg>`
  }
];

export const BANNER_THEMES: BannerTheme[] = [
  {
    id: 'theme-pink',
    nameKh: 'ពណ៌ផ្កាឈូក CIIS Pink',
    nameEn: 'Signature CIIS Pink',
    gradient: 'from-pink-700 via-pink-800 to-pink-950',
    textColor: 'text-pink-100',
    accentBadge: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
  },
  {
    id: 'theme-emerald',
    nameKh: 'ពណ៌បៃតង Emerald Campus',
    nameEn: 'Emerald Campus Green',
    gradient: 'from-emerald-700 via-teal-800 to-slate-950',
    textColor: 'text-emerald-100',
    accentBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'theme-cyan',
    nameKh: 'ពណ៌ខៀវ Cyan Tech Lab',
    nameEn: 'Cyan Digital Lab',
    gradient: 'from-cyan-700 via-blue-800 to-slate-950',
    textColor: 'text-cyan-100',
    accentBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  },
  {
    id: 'theme-purple',
    nameKh: 'ពណ៌ស្វាយ Midnight Violet',
    nameEn: 'Midnight Violet',
    gradient: 'from-purple-800 via-indigo-900 to-slate-950',
    textColor: 'text-purple-100',
    accentBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  {
    id: 'theme-gold',
    nameKh: 'ពណ៌មាស Golden Honor',
    nameEn: 'Golden Honor',
    gradient: 'from-amber-600 via-orange-800 to-slate-950',
    textColor: 'text-amber-100',
    accentBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  }
];

export const getAvatarById = (id: string): AvatarItem | undefined => {
  return AVATAR_COLLECTION.find(a => a.id === id);
};

export const getDefaultAvatar = (role?: string, seed?: string | number): string => {
  if (role === 'teacher' || role === 'assistant_teacher') {
    return AVATAR_COLLECTION[10].svgUri; // Cyber Terminal Coder
  }
  if (role === 'admin') {
    return AVATAR_COLLECTION[19].svgUri; // Cyber Security Defender
  }

  if (typeof seed === 'number') {
    const idx = Math.abs(seed) % AVATAR_COLLECTION.length;
    return AVATAR_COLLECTION[idx].svgUri;
  }

  if (typeof seed === 'string' && seed.trim()) {
    // Extract numerical student ID like "STD-005" -> 5
    const numMatch = seed.match(/\d+/);
    if (numMatch) {
      const idx = (parseInt(numMatch[0], 10) - 1) % AVATAR_COLLECTION.length;
      return AVATAR_COLLECTION[Math.max(0, idx)].svgUri;
    }
    // Calculate simple string hash
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % AVATAR_COLLECTION.length;
    return AVATAR_COLLECTION[idx].svgUri;
  }

  return AVATAR_COLLECTION[0].svgUri;
};

export const getStudentAvatar = (studentIdOrName?: string, role?: string): string => {
  return getDefaultAvatar(role || 'student', studentIdOrName);
};
