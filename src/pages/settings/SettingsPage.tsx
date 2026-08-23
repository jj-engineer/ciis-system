import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  Settings,
  School,
  Database,
  RefreshCw,
  Download,
  Save,
  CheckCircle2,
  Sliders,
  Shield,
  Layers,
  Award,
  Keyboard,
  Clock,
  Laptop,
  Check,
  AlertTriangle,
  FileSpreadsheet,
  Globe,
  Upload
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { isKhmer, t } = useLanguage();
  const { classes } = useApp();

  // General System State
  const [schoolNameKh, setSchoolNameKh] = useState('សាលារៀនស៊ី អាយ អាយ អេស');
  const [schoolNameEn, setSchoolNameEn] = useState('COMMUNITY INTERNAL INSPIRATION SCHOOL (CIIS)');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [labName, setLabName] = useState('បន្ទប់កុំព្យូទ័រ CIIS Lab 1 (Room 204)');
  const [contactPhone, setContactPhone] = useState('012 345 678');
  const [contactEmail, setContactEmail] = useState('info@ciis-school.edu.kh');

  // Academic Policy State
  const [passingScore, setPassingScore] = useState<number>(60);
  const [minAttendancePercent, setMinAttendancePercent] = useState<number>(80);
  const [standardTypingWpm, setStandardTypingWpm] = useState<number>(45);
  const [autoAttendanceEnrollment, setAutoAttendanceEnrollment] = useState<boolean>(true);
  const [autoGradingEnabled, setAutoGradingEnabled] = useState<boolean>(true);

  // Status and feedback
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to local storage
    const systemConfig = {
      schoolNameKh,
      schoolNameEn,
      academicYear,
      labName,
      contactPhone,
      contactEmail,
      passingScore,
      minAttendancePercent,
      standardTypingWpm,
      autoAttendanceEnrollment,
      autoGradingEnabled,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('ciis_system_config_v1', JSON.stringify(systemConfig));

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleExportBackup = () => {
    const backupData = {
      system: 'COMMUNITY INTERNAL INSPIRATION SCHOOL (CIIS)',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      schoolSettings: {
        schoolNameKh,
        schoolNameEn,
        academicYear,
        labName,
        contactPhone,
        contactEmail
      },
      academicStandards: {
        passingScore,
        minAttendancePercent,
        standardTypingWpm
      },
      classes: classes,
      profiles: StorageService.getProfiles(),
      attendance: StorageService.getAttendance()
    };

    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', jsonStr);
    dl.setAttribute('download', `CIIS_LMS_Full_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
  };

  const handleResetData = () => {
    StorageService.resetAll();
    localStorage.removeItem('ciis_system_config_v1');
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-900 text-xs font-bold border border-pink-200 mb-2">
            <Settings className="w-3.5 h-3.5 text-pink-700" />
            <span>{isKhmer ? 'ការកំណត់ទូទៅរបស់ប្រព័ន្ធ' : 'General System Configuration'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            {isKhmer ? 'ការកំណត់ទូទៅ & ការគ្រប់គ្រងប្រព័ន្ធ' : 'System Settings & School Management'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'កែសម្រួលព័ត៌មានសាលា រចនាសម្ព័ន្ធថ្នាក់រៀន លក្ខខណ្ឌពិន្ទុ និងទិន្នន័យបម្រុងទុក (Backup/Restore)។'
              : 'Configure school details, active class shifts, grading standards, and data backup controls.'}
          </p>
        </div>

        <button
          onClick={handleSaveGeneralSettings}
          className="px-5 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-pink-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isKhmer ? 'រក្សាទុកការកំណត់' : 'Save System Settings'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-pink-950/10 text-pink-950 border border-pink-200 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-pink-800 shrink-0" />
            <span>{isKhmer ? 'ការកំណត់ទូទៅនៃប្រព័ន្ធត្រូវបានរក្សាទុកជោគជ័យ!' : 'System settings have been updated and saved successfully!'}</span>
          </div>
          <span className="text-[10px] font-mono bg-pink-950 text-white px-2.5 py-0.5 rounded-full uppercase font-bold">SAVED</span>
        </div>
      )}

      <form onSubmit={handleSaveGeneralSettings} className="space-y-6">
        
        {/* Section 1: School Identity & Campus Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
                <School className="w-4 h-4 text-pink-800" />
                <span>{isKhmer ? 'ព័ត៌មានអត្តសញ្ញាណសាលា (School Identity & Details)' : 'School Identity & Campus Details'}</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {isKhmer ? 'កំណត់ឈ្មោះសាលា ឆ្នាំសិក្សា និងព័ត៌មានទំនាក់ទំនងផ្លូវការ' : 'Manage official school branding and contact details'}
              </p>
            </div>
            <span className="text-[10px] font-bold text-pink-900 bg-pink-950/10 px-2.5 py-1 rounded-lg border border-pink-200 font-mono">
              CIIS LMS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* School Name Khmer */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'ឈ្មោះសាលាជាភាសាខ្មែរ (School Name KH) *' : 'School Name (Khmer) *'}
              </label>
              <input
                type="text"
                required
                value={schoolNameKh}
                onChange={(e) => setSchoolNameKh(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
              />
            </div>

            {/* School Name English */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'ឈ្មោះសាលាជាភាសាអង់គ្លេស (School Name EN) *' : 'School Name (English) *'}
              </label>
              <input
                type="text"
                required
                value={schoolNameEn}
                onChange={(e) => setSchoolNameEn(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
              />
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'ឆ្នាំសិក្សាផ្លូវការ (Academic Year)' : 'Academic Year'}
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
              />
            </div>

            {/* Lab Name */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'ឈ្មោះបន្ទប់កុំព្យូទ័រ (Computer Lab Name)' : 'Default Lab Name'}
              </label>
              <input
                type="text"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'លេខទូរស័ព្ទទាក់ទង (Contact Phone)' : 'Contact Phone'}
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                {isKhmer ? 'អ៊ីមែលផ្លូវការ (Official Email)' : 'Official Email'}
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Active Classroom Shifts (2 Classes) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-800" />
                <span>{isKhmer ? 'ថ្នាក់រៀនសកម្មទាំង ២ វេន (2 Active Class Shifts)' : '2 Active Class Shifts'}</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {isKhmer ? 'ថ្នាក់កុំព្យូទ័រវេនល្ងាច ទី១ និង ទី២ របស់សាលា CIIS' : 'Configured Evening Shift 1 and Shift 2'}
              </p>
            </div>
            <Badge variant="pink" size="sm">2 Shifts</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shift 1 Card */}
            <div className="p-4 rounded-2xl border border-pink-200 bg-pink-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-950">{isKhmer ? 'ថ្នាក់កុំព្យូទ័រវេនល្ងាច ទី១' : 'Evening Shift 1'}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-bold">សកម្ម / Active</span>
              </div>
              <p className="text-xs font-bold text-pink-900 font-mono">5:30 PM - 6:30 PM</p>
              <p className="text-[11px] text-zinc-500">បន្ទប់កុំព្យូទ័រ CIIS Lab 1 • 40+ គ្រឿង</p>
            </div>

            {/* Shift 2 Card */}
            <div className="p-4 rounded-2xl border border-pink-200 bg-pink-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-950">{isKhmer ? 'ថ្នាក់កុំព្យូទ័រវេនល្ងាច ទី២' : 'Evening Shift 2'}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-bold">សកម្ម / Active</span>
              </div>
              <p className="text-xs font-bold text-pink-900 font-mono">6:40 PM - 7:40 PM</p>
              <p className="text-[11px] text-zinc-500">បន្ទប់កុំព្យូទ័រ CIIS Lab 1 • 40+ គ្រឿង</p>
            </div>
          </div>
        </div>

        {/* Section 3: Academic Standards & Grading Policies */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-pink-700" />
                <span>{isKhmer ? 'ស្តង់ដារពិន្ទុ & លក្ខខណ្ឌសិក្សា (Academic Standards)' : 'Academic Standards & Policies'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isKhmer ? 'កំណត់ពិន្ទុជាប់ ភាគរយវត្តមាន និងល្បឿនវាយអក្សរស្តង់ដារ' : 'Pass thresholds, minimum attendance percentage, and typing benchmarks'}
              </p>
            </div>
            <Award className="w-4 h-4 text-pink-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Passing Score */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ពិន្ទុជាប់អប្បបរមា (%)' : 'Minimum Passing Grade (%)'}
              </label>
              <input
                type="number"
                min="40"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 font-bold text-slate-900"
              />
            </div>

            {/* Min Attendance */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'វត្តមានអប្បបរមា (%)' : 'Min Attendance Rate (%)'}
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={minAttendancePercent}
                onChange={(e) => setMinAttendancePercent(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 font-bold text-slate-900"
              />
            </div>

            {/* Standard Typing Goal */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isKhmer ? 'ល្បឿនវាយអក្សរស្តង់ដារ (WPM)' : 'Benchmark Speed (WPM)'}
              </label>
              <input
                type="number"
                min="20"
                max="120"
                value={standardTypingWpm}
                onChange={(e) => setStandardTypingWpm(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 font-bold text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 4: System Data Backup & Reset */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-pink-700" />
                <span>{isKhmer ? 'ការគ្រប់គ្រងទិន្នន័យប្រព័ន្ធ (Data Backup & Reset)' : 'System Data Backup & Storage'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isKhmer ? 'ទាញយកទិន្នន័យបម្រុងទុក (Export JSON) ឬកំណត់ទិន្នន័យឡើងវិញ' : 'Export complete system backup or reset databases to defaults'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleExportBackup}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isKhmer ? 'ទាញយក Backup ប្រព័ន្ធ (Export JSON)' : 'Export Full JSON Backup'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-red-600" />
              <span>{isKhmer ? 'កំណត់ទិន្នន័យឡើងវិញ (Reset Defaults)' : 'Reset Databases'}</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-pink-700 hover:bg-pink-800 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-pink-700/20 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isKhmer ? 'រក្សាទុកការកំណត់ទូទៅ (Save Settings)' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

      {/* Confirmation Reset Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title={isKhmer ? 'តើអ្នកប្រាកដជាចង់កំណត់ទិន្នន័យឡើងវិញ?' : 'Reset All System Databases?'}
        maxWidth="md"
      >
        <div className="space-y-5 text-center py-2">
          <div className="w-14 h-14 rounded-3xl bg-pink-950/10 text-pink-900 border border-pink-200 flex items-center justify-center mx-auto shadow-xs">
            <AlertTriangle className="w-7 h-7 text-pink-800" />
          </div>
          
          <div className="space-y-2">
            <p className="text-xs text-zinc-600 leading-relaxed font-medium">
              {isKhmer
                ? 'ទិន្នន័យវត្តមាន សិស្ស កិច្ចការ និងលទ្ធផលប្រឡងទាំងអស់ នឹងត្រូវត្រឡប់ទៅស្ថានភាពដើមរបស់សាលា។'
                : 'All attendance records, registered student accounts, exercises, and exam results will be reset to fresh default states.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setShowResetModal(false)}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 cursor-pointer transition-all hover:scale-105"
            >
              {t('action.cancel', undefined, 'Cancel')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowResetModal(false);
                handleResetData();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-800 to-pink-950 hover:from-pink-700 hover:to-pink-900 text-white font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-pink-950/20 hover:scale-105 border border-pink-700/30"
            >
              {isKhmer ? 'កំណត់ឡើងវិញ (Confirm Reset)' : 'Confirm Reset'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
