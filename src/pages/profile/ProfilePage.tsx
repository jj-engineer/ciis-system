import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import {
  AVATAR_COLLECTION,
  BANNER_THEMES,
  AvatarItem,
  BannerTheme,
  getAvatarById,
  getDefaultAvatar
} from '../../services/avatarLibrary';
import confetti from 'canvas-confetti';
import {
  User,
  Mail,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  School,
  Phone,
  Edit3,
  Eye,
  EyeOff,
  Palette,
  Keyboard,
  Award,
  Check,
  RefreshCw,
  Search,
  Filter,
  GraduationCap
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { classes } = useApp();
  const { isKhmer, t } = useLanguage();

  // Form State
  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [username, setUsername] = useState(currentUser.username || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [password, setPassword] = useState(currentUser.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [classId, setClassId] = useState(currentUser.classId || classes[0]?.id || 'ciis-evening-1');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || AVATAR_COLLECTION[0].svgUri);
  const [selectedThemeId, setSelectedThemeId] = useState('theme-pink');
  const [typingGoal, setTypingGoal] = useState<number>(60);

  // Avatar Category Filter & Search
  const [avatarCategory, setAvatarCategory] = useState<string>('all');
  const [avatarSearch, setAvatarSearch] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load initial settings
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setUsername(currentUser.username || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setBio(currentUser.bio || '');
      setPassword(currentUser.password || '');
      setClassId(currentUser.classId || classes[0]?.id || 'ciis-evening-1');
      if (currentUser.avatarUrl) {
        setAvatarUrl(currentUser.avatarUrl);
      } else {
        setAvatarUrl(getDefaultAvatar(currentUser.role, currentUser.studentId || currentUser.fullName));
      }
    }
  }, [currentUser, classes]);

  const selectedTheme = BANNER_THEMES.find(t => t.id === selectedThemeId) || BANNER_THEMES[0];
  const targetClass = classes.find(c => c.id === classId) || classes[0];

  // Filter avatars by category and search
  const filteredAvatars = AVATAR_COLLECTION.filter(a => {
    const matchesCategory = avatarCategory === 'all' || a.category === avatarCategory;
    const matchesSearch =
      !avatarSearch ||
      a.nameKh.toLowerCase().includes(avatarSearch.toLowerCase()) ||
      a.nameEn.toLowerCase().includes(avatarSearch.toLowerCase()) ||
      a.categoryKh.toLowerCase().includes(avatarSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedAvatarInfo = AVATAR_COLLECTION.find(a => a.svgUri === avatarUrl);

  const handleSelectAvatar = (svgUri: string) => {
    setAvatarUrl(svgUri);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      fullName,
      username,
      email,
      phone,
      bio,
      password,
      classId: targetClass?.id || classId,
      className: targetClass?.name || currentUser.className,
      avatarUrl
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Ignored if confetti fails
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-900 text-xs font-bold border border-pink-200 mb-2">
            <User className="w-3.5 h-3.5 text-pink-700" />
            <span>{isKhmer ? 'ការកំណត់គណនី និងរូបតំណាង' : 'Student & Account Customization'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            {isKhmer ? 'កែប្រែព័ត៌មានផ្ទាល់ខ្លួន & ជ្រើសរើស Avatar' : 'Customize Profile & Choose Avatar'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'ជ្រើសរើសរូបតំណាងផ្ទាល់ខ្លួន (Avatar ៥០ ប្រភេទ) កែសម្រួលឈ្មោះ ថ្នាក់រៀន ពាក្យសម្ងាត់ និងគោលដៅសិក្សា។'
              : 'Select your personal avatar from our 50 handcrafted collection, edit your credentials, and customize your study goals.'}
          </p>
        </div>

        {/* Quick Save Button in Header */}
        <button
          onClick={handleSaveProfile}
          className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-pink-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isKhmer ? 'រក្សាទុកការកែប្រែ' : 'Save Changes'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-pink-950/10 text-pink-950 border border-pink-200 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-pink-800 shrink-0" />
            <span>{isKhmer ? 'ព័ត៌មានគណនី និងរូប Avatar ត្រូវបានរក្សាទុកជោគជ័យ!' : 'Your profile and avatar have been saved successfully!'}</span>
          </div>
          <span className="text-[10px] font-mono bg-pink-950 text-white px-2.5 py-0.5 rounded-full uppercase font-bold">SAVED</span>
        </div>
      )}

      {/* Main Profile Customizer Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Dynamic Banner Header */}
        <div className={`p-6 sm:p-8 bg-gradient-to-r ${selectedTheme.gradient} text-white relative transition-all duration-500`}>
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
            
            {/* Left: Avatar Circle + Real-time Preview */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-md p-1.5 ring-4 ring-white/20 shadow-xl overflow-hidden transition-transform group-hover:scale-105">
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full rounded-[20px] object-cover bg-transparent"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-pink-600 text-white font-extrabold text-[9.5px] uppercase shadow-md border-2 border-white flex items-center gap-1">
                  <Palette className="w-2.5 h-2.5" />
                  <span>AVATAR</span>
                </div>
              </div>

              {/* User Title & Details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{fullName || 'Student Name'}</h2>
                  {currentUser.studentId && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/20 text-white font-mono font-black text-xs border border-white/30">
                      {currentUser.studentId}
                    </span>
                  )}
                </div>
                <p className="text-xs text-pink-200 font-medium">
                  {currentUser.role === 'student'
                    ? (isKhmer ? `សិស្ស • ${targetClass?.name || 'CIIS Computer Lab'}` : `Student • ${targetClass?.name || 'CIIS Computer Lab'}`)
                    : (isKhmer ? 'គ្រូបង្រៀនសាលា CIIS' : 'CIIS Instructor')}
                </p>
                {selectedAvatarInfo && (
                  <p className="text-[11px] text-white/80 font-bold flex items-center justify-center sm:justify-start gap-1 pt-0.5">
                    <span>{isKhmer ? selectedAvatarInfo.nameKh : selectedAvatarInfo.nameEn}</span>
                    <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-white/15 text-pink-200 uppercase font-mono">
                      {isKhmer ? selectedAvatarInfo.categoryKh : selectedAvatarInfo.categoryEn}
                    </span>
                  </p>
                )}
                {bio && (
                  <p className="text-[11.5px] text-slate-200/90 italic max-w-md pt-0.5">
                    "{bio}"
                  </p>
                )}
              </div>
            </div>

            {/* Right: Theme Selector */}
            <div className="space-y-1.5 text-center sm:text-right">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-pink-200">
                {isKhmer ? 'រចនាបថពណ៌ Banner' : 'Profile Banner Color'}
              </p>
              <div className="flex items-center justify-center sm:justify-end gap-1.5">
                {BANNER_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`w-6 h-6 rounded-full bg-gradient-to-tr ${theme.gradient} transition-transform border-2 cursor-pointer ${
                      selectedThemeId === theme.id ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    title={theme.nameEn}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 50-AVATAR SELECTION GALLERY (DIRECTLY EMBEDDED)                           */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 bg-slate-50/50 border-b border-slate-200/80 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-700" />
                <span>{isKhmer ? 'ជ្រើសរើសរូប Avatar របស់អ្នក (៥០ ប្រភេទ)' : 'Choose Your Personal Avatar (50 Collection)'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isKhmer ? 'ចុចលើរូប Avatar ណាមួយខាងក្រោមដើម្បីផ្លាស់ប្តូររូបតំណាងរបស់អ្នកភ្លាមៗ' : 'Click any avatar below to instantly apply it to your account'}
              </p>
            </div>

            {/* Avatar Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={avatarSearch}
                onChange={(e) => setAvatarSearch(e.target.value)}
                placeholder={isKhmer ? 'ស្វែងរក Avatar...' : 'Search avatars...'}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-pink-500 font-medium"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', nameKh: 'ទាំងអស់ (៥០)', nameEn: 'All (50)' },
              { id: 'student', nameKh: 'សិស្ស & ការសិក្សា (១០)', nameEn: 'Students (10)' },
              { id: 'tech', nameKh: 'បច្ចេកវិទ្យា & Coders (១០)', nameEn: 'Tech & Coders (10)' },
              { id: 'mascot', nameKh: 'ម៉ាស្កត & សត្វ (១០)', nameEn: 'Mascots & Animals (10)' },
              { id: 'gradient', nameKh: 'ពណ៌ 3D Minimal (១០)', nameEn: '3D Gradients (10)' },
              { id: 'champion', nameKh: 'ជើងឯក & Icons (១០)', nameEn: 'Champions & Icons (10)' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setAvatarCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  avatarCategory === cat.id
                    ? 'bg-pink-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-pink-300'
                }`}
              >
                {isKhmer ? cat.nameKh : cat.nameEn}
              </button>
            ))}
          </div>

          {/* 50 Avatars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-[360px] overflow-y-auto p-1">
            {filteredAvatars.map(av => {
              const isSelected = avatarUrl === av.svgUri;
              return (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => handleSelectAvatar(av.svgUri)}
                  className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center group cursor-pointer relative ${
                    isSelected
                      ? 'border-pink-600 bg-pink-50/90 shadow-md scale-102 ring-2 ring-pink-500/20'
                      : 'border-slate-200/80 bg-white hover:border-pink-300 hover:shadow-xs hover:scale-101'
                  }`}
                >
                  {/* Avatar SVG Preview */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1 bg-slate-100 group-hover:scale-105 transition-transform overflow-hidden shadow-2xs">
                    <img
                      src={av.svgUri}
                      alt={av.nameEn}
                      className="w-full h-full rounded-[12px] object-cover"
                    />
                  </div>

                  {/* Name Labels */}
                  <div className="space-y-0.5 w-full">
                    <p className="text-[10.5px] font-black text-slate-900 truncate">
                      {isKhmer ? av.nameKh : av.nameEn}
                    </p>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isKhmer ? av.categoryKh : av.categoryEn}
                    </span>
                  </div>

                  {/* Active Selected Check Badge */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 space-y-6">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-pink-700" />
              <span>{isKhmer ? 'ព័ត៌មានមូលដ្ឋាន (Basic Information)' : 'Basic Information'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'ឈ្មោះពេញរបស់សិស្ស (Full Name) *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. SOK Vicheka"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'ឈ្មោះអ្នកប្រើប្រាស់ (Username / Login)' : 'Username'}
                </label>
                <div className="relative">
                  <span className="text-xs font-mono font-bold text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. vicheka.sok"
                    className="w-full pl-8 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'អ៊ីមែល / ជីម៉ែល (Email Address)' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@school.edu"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'លេខទូរស័ព្ទ (Phone Number)' : 'Phone Number'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 012 345 678"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Classroom & Study Goals */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <School className="w-4 h-4 text-pink-700" />
              <span>{isKhmer ? 'ថ្នាក់រៀន & គោលដៅសិក្សា (Class & Study Goals)' : 'Classroom & Study Goals'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Class Shift */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'ថ្នាក់រៀន / វេនសិក្សា (Class / Shift)' : 'Class / Shift'}
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-bold text-slate-800 cursor-pointer"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.room})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Typing Speed Target */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'គោលដៅល្បឿនវាយអក្សរ (Typing Speed Goal)' : 'Target Typing Goal'}
                </label>
                <div className="relative">
                  <Keyboard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={typingGoal}
                    onChange={(e) => setTypingGoal(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-bold text-slate-800 cursor-pointer"
                  >
                    <option value={30}>30 WPM (Beginner)</option>
                    <option value={45}>45 WPM (Intermediate)</option>
                    <option value={60}>60 WPM (Fluent / Standard)</option>
                    <option value={80}>80 WPM (Speed Master)</option>
                    <option value={100}>100+ WPM (Pro Champion)</option>
                  </select>
                </div>
              </div>

              {/* Study Motto / Bio */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'ពាក្យស្លោកផ្ទាល់ខ្លួន / បំណងប្រាថ្នាសិក្សា (Personal Bio / Study Motto)' : 'Personal Bio / Study Motto'}
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={isKhmer ? 'ឧ. ខិតខំហ្វឹកហាត់កុំព្យូទ័រ និងវាយអក្សរឱ្យបានលឿនជាង ៦០ WPM' : 'e.g. Dedicated to mastering Excel formulas and touch typing!'}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Security & Password */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Lock className="w-4 h-4 text-pink-700" />
              <span>{isKhmer ? 'សុវត្ថិភាព & ពាក្យសម្ងាត់ (Security & Password)' : 'Security & Password'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isKhmer ? 'ពាក្យសម្ងាត់ផ្ទាល់ខ្លួន (Password)' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Change password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Student ID Badge */}
              {currentUser.studentId && (
                <div className="p-3 bg-pink-50/70 border border-pink-200 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-extrabold uppercase text-slate-500">{isKhmer ? 'អត្តលេខសិស្សផ្លូវការ' : 'Official Student ID'}</p>
                    <p className="text-sm font-black font-mono text-pink-900">{currentUser.studentId}</p>
                  </div>
                  <span className="text-[10px] font-bold text-pink-800 bg-pink-100 px-2 py-0.5 rounded">CIIS ID</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-pink-700 hover:bg-pink-800 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-pink-700/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-100 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isKhmer ? 'រក្សាទុកព័ត៌មាន (Save Profile)' : 'Save Changes'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
