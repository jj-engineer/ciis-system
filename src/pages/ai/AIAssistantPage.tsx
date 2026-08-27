import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  SolveMode,
  ExcelAnalysisResult,
  CalculationItem,
  analyzeExcelImageFile,
  checkAIExcelStatus
} from '../../services/aiExcelApi';
import {
  FileSpreadsheet,
  Upload,
  Sparkles,
  Check,
  Copy,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  ZoomIn,
  X,
  Lightbulb,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Table,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Info,
  ExternalLink,
  Code2,
  FileCheck
} from 'lucide-react';

interface AIAssistantPageProps {
  setActiveTab?: (tab: string) => void;
}

const ANALYSIS_STAGES_EN = [
  'Reading image and scanning content...',
  'Detecting spreadsheet structure and coordinates...',
  'Reading worksheet instructions and labels...',
  'Detecting task areas and yellow highlights...',
  'Analyzing formulas and relationships...',
  'Calculating expected mathematical results...',
  'Checking for student calculation discrepancies...',
  'Preparing student steps and teacher notes...'
];

const ANALYSIS_STAGES_KM = [
  'កំពុងអានរូបភាព និងវិភាគទិន្នន័យ...',
  'កំពុងស្វែងរកទម្រង់តារាង និងកូអរដោណេក្រឡា Excel...',
  'កំពុងអានលក្ខខណ្ឌ និងការណែនាំលំហាត់...',
  'កំពុងកំណត់តំបន់ពណ៌លឿងដែលត្រូវគណនា...',
  'កំពុងវិភាគ និងបង្កើតរូបមន្ត Excel ត្រឹមត្រូវ...',
  'កំពុងគណនាលទ្ធផលចម្លើយពិតប្រាកដ...',
  'កំពុងផ្ទៀងផ្ទាត់ចម្លើយ និងកំហុសក្នុងរូបភាព...',
  'កំពុងរៀបចំការពន្យល់មួយជំហានៗ និងកំណត់សម្គាល់គ្រូ...'
];

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ setActiveTab }) => {
  const { currentUser, isTeacher } = useAuth();
  const { isKhmer, t } = useLanguage();

  // State: Configuration & Solver Mode
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [activeModel, setActiveModel] = useState<string>('gemini-2.5-flash');
  const [solveMode, setSolveMode] = useState<SolveMode>('all');

  // State: Upload & Preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showZoomModal, setShowZoomModal] = useState<boolean>(false);

  // State: Analysis Lifecycle
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStageIdx, setAnalysisStageIdx] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<ExcelAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // State: Auto-retry countdown for rate limits
  const [retryCountdown, setRetryCountdown] = useState<number>(0);
  const [retryAttempt, setRetryAttempt] = useState<number>(0);
  const retryTimerRef = useRef<any>(null);
  const maxAutoRetries = 3;

  // State: UI Interactions
  const [copiedCellId, setCopiedCellId] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState<boolean>(false);
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({});
  const [showTeacherNotes, setShowTeacherNotes] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageTimerRef = useRef<any>(null);

  // Check backend Gemini status on mount
  useEffect(() => {
    checkAIExcelStatus().then((res) => {
      if (res.success) {
        setIsConfigured(res.configured);
        if (res.model) setActiveModel(res.model);
      }
    }).catch(() => {});
  }, []);

  // Cleanup object URLs and timers
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      if (stageTimerRef.current) clearInterval(stageTimerRef.current);
      if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    };
  }, [imagePreviewUrl]);

  // Handle File Selection
  const handleFileSelect = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage(
        isKhmer
          ? 'សូមជ្រើសរើសឯកសាររូបភាព (PNG, JPG, JPEG) ត្រឹមត្រូវ។'
          : 'Please select a valid image file (PNG, JPG, or JPEG).'
      );
      setErrorCode('INVALID_FILE_TYPE');
      return;
    }

    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    const preview = URL.createObjectURL(file);
    setSelectedFile(file);
    setImagePreviewUrl(preview);
    setAnalysisResult(null);
    setErrorMessage(null);
    setErrorCode(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    setErrorCode(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Cancel any active auto-retry countdown
  const cancelAutoRetry = () => {
    if (retryTimerRef.current) {
      clearInterval(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    setRetryCountdown(0);
  };

  // Start auto-retry countdown (for rate limit errors)
  const startAutoRetryCountdown = (seconds: number, attempt: number) => {
    cancelAutoRetry();
    setRetryCountdown(seconds);
    setRetryAttempt(attempt);

    retryTimerRef.current = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(retryTimerRef.current);
          retryTimerRef.current = null;
          // Trigger retry
          handleStartAnalysis(attempt);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Run AI Analysis
  const handleStartAnalysis = async (currentRetryAttempt: number = 0) => {
    if (!selectedFile || isAnalyzing) return;

    cancelAutoRetry();
    setIsAnalyzing(true);
    setErrorMessage(null);
    setErrorCode(null);
    setAnalysisStageIdx(0);

    // Progression timer for smooth visual feedback
    const stages = isKhmer ? ANALYSIS_STAGES_KM : ANALYSIS_STAGES_EN;
    if (stageTimerRef.current) clearInterval(stageTimerRef.current);

    stageTimerRef.current = setInterval(() => {
      setAnalysisStageIdx((prev) => {
        if (prev < stages.length - 1) return prev + 1;
        return prev;
      });
    }, 1800);

    try {
      const response = await analyzeExcelImageFile(selectedFile, solveMode);

      if (stageTimerRef.current) clearInterval(stageTimerRef.current);
      setIsAnalyzing(false);

      if (response.success && response.data) {
        setAnalysisResult(response.data);
        setRetryAttempt(0);
        if (response.modelUsed) setActiveModel(response.modelUsed);

        // Auto-expand first 2 calculations
        const initialExpanded: Record<string, boolean> = {};
        response.data.calculations.slice(0, 3).forEach((c) => {
          initialExpanded[c.id] = true;
        });
        setExpandedRowIds(initialExpanded);
      } else {
        setErrorCode(response.error || 'ANALYSIS_FAILED');

        // If rate limited and we have auto-retries left, start countdown
        if (response.error === 'RATE_LIMITED' && currentRetryAttempt < maxAutoRetries) {
          const waitSeconds = 30;
          setErrorMessage(
            isKhmer
              ? `Gemini API កំពុងមានការប្រើប្រាស់ច្រើន។ កំពុងព្យាយាមម្តងទៀតក្នុងរយៈពេល ${waitSeconds} វិនាទី... (ការព្យាយាមទី ${currentRetryAttempt + 1}/${maxAutoRetries})`
              : `Gemini API rate limited. Auto-retrying in ${waitSeconds}s... (Attempt ${currentRetryAttempt + 1}/${maxAutoRetries})`
          );
          startAutoRetryCountdown(waitSeconds, currentRetryAttempt + 1);
        } else {
          setErrorMessage(
            response.message ||
              (isKhmer
                ? 'មិនអាចវិភាគរូបភាពបានទេ។ សូមព្យាយាមម្តងទៀតជាមួយរូបភាពដែលច្បាស់ជាងនេះ។'
                : 'AI analysis could not be completed. Please try again with a clearer screenshot.')
          );
        }
      }
    } catch (err: any) {
      if (stageTimerRef.current) clearInterval(stageTimerRef.current);
      setIsAnalyzing(false);
      setErrorCode('NETWORK_ERROR');
      setErrorMessage(
        err.message ||
          (isKhmer
            ? 'មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ AI។ សូមពិនិត្យមើលការតភ្ជាប់។'
            : 'Error connecting to the AI backend. Please verify your connection.')
      );
    }
  };

  // Copy Single Formula
  const handleCopyFormula = (calc: CalculationItem) => {
    navigator.clipboard.writeText(calc.formula);
    setCopiedCellId(calc.id);
    setTimeout(() => setCopiedCellId(null), 2000);
  };

  // Copy All Formulas
  const handleCopyAllFormulas = () => {
    if (!analysisResult || !analysisResult.calculations.length) return;

    const summary = analysisResult.calculations
      .map((c) => `${c.cell} (${c.targetColumn || 'Formula'}): ${c.formula} -> Expected: ${c.expectedResult}`)
      .join('\n');

    navigator.clipboard.writeText(summary);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2200);
  };

  // Toggle Row Accordion
  const toggleRowExpand = (id: string) => {
    setExpandedRowIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const solveModesList: { id: SolveMode; labelEn: string; labelKh: string; descEn: string; descKh: string }[] = [
    {
      id: 'all',
      labelEn: 'Solve All',
      labelKh: 'ដោះស្រាយទាំងអស់',
      descEn: 'Analyze and solve all tasks in worksheet',
      descKh: 'វិភាគ និងដោះស្រាយគ្រប់លំហាត់ទាំងអស់'
    },
    {
      id: 'highlighted',
      labelEn: 'Solve Highlighted',
      labelKh: 'ដោះស្រាយកន្លែងពណ៌លឿង',
      descEn: 'Focus on yellow/highlighted task areas',
      descKh: 'ផ្តោតលើតំបន់ពណ៌លឿង ឬកន្លែងត្រូវគណនា'
    },
    {
      id: 'explain',
      labelEn: 'Explain Formula',
      labelKh: 'ពន្យល់រូបមន្ត',
      descEn: 'Deep explanation of formula logic',
      descKh: 'ពន្យល់លម្អិតអំពីរចនាសម្ព័ន្ធរូបមន្ត'
    },
    {
      id: 'check',
      labelEn: 'Check My Answer',
      labelKh: 'ផ្ទៀងផ្ទាត់ចម្លើយ',
      descEn: 'Compare student answer against math',
      descKh: 'ប្រៀបធៀបចម្លើយសិស្សជាមួយគណិតវិទ្យា'
    },
    {
      id: 'step_by_step',
      labelEn: 'Step-by-Step',
      labelKh: 'មួយជំហានៗ',
      descEn: 'Beginner manual execution steps',
      descKh: 'ការណែនាំចុច និងបញ្ចូលរូបមន្តមួយជំហានៗ'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-16">
      {/* 1. HEADER & STATUS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-zinc-200/90 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
                {isKhmer ? 'ជំនួយការ AI ដោះស្រាយរូបមន្ត Excel' : 'AI Excel Assistant'}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">
                {isKhmer
                  ? 'បញ្ចូលរូបភាពលំហាត់ Excel ដើម្បីបង្កើតរូបមន្ត គណនាចម្លើយ ផ្ទៀងផ្ទាត់ និងពន្យល់មួយជំហានៗ។'
                  : 'Upload an Excel exercise screenshot or photo and get formulas, answers, verification, and step-by-step explanations.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Clean Model Identifier */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-[11px] font-mono font-bold border border-zinc-800 shadow-2xs">
            <span className="text-[9.5px] uppercase tracking-wider text-zinc-400 font-extrabold font-mono">
              MODEL
            </span>
            <span className="text-zinc-500 text-[10px]">|</span>
            <span className="text-zinc-100 tracking-tight">{activeModel}</span>
          </div>

          {/* Clean Status Pill with Live Signal Dot */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-2xs transition-all ${
              isConfigured
                ? 'bg-emerald-50 text-emerald-950 border-emerald-200/90'
                : 'bg-amber-50 text-amber-950 border-amber-200/90'
            }`}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              {isConfigured && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span className="tracking-tight leading-none">
              {isConfigured
                ? (isKhmer ? 'ម៉ាស៊ីន AI ដំណើរការ' : 'AI Engine Ready')
                : (isKhmer ? 'រង់ចាំ API Key' : 'API Key Pending')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SOLVE MODE SELECTOR */}
      <div className="bg-white p-4 rounded-3xl border border-zinc-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
            {isKhmer ? 'ជ្រើសរើសទម្រង់ដោះស្រាយ (Solve Mode):' : 'Select Solve Mode:'}
          </span>
          <span className="text-[11px] text-zinc-400 hidden sm:inline font-medium">
            {solveModesList.find((m) => m.id === solveMode)?.[isKhmer ? 'descKh' : 'descEn']}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {solveModesList.map((mode) => {
            const isSelected = solveMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSolveMode(mode.id)}
                className={`px-3 py-2.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer flex flex-col justify-between min-h-[58px] ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                    : 'bg-zinc-50 hover:bg-zinc-100/80 text-zinc-700 border-zinc-200/90'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{isKhmer ? mode.labelKh : mode.labelEn}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                </div>
                <span
                  className={`text-[10px] font-normal truncate mt-1 ${
                    isSelected ? 'text-zinc-300' : 'text-zinc-500'
                  }`}
                >
                  {isKhmer ? mode.descKh : mode.descEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. UPLOAD & PREVIEW CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Upload Column (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-zinc-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-zinc-900 uppercase tracking-wide flex items-center gap-2">
                <Upload className="w-4 h-4 text-pink-700" />
                {isKhmer ? 'រូបភាពលំហាត់ Excel' : 'Upload Excel Image'}
              </h2>
              {selectedFile && (
                <span className="text-[11px] font-mono text-zinc-400 font-bold">
                  {Math.round(selectedFile.size / 1024)} KB
                </span>
              )}
            </div>

            {/* Drag & Drop Upload Zone */}
            {!selectedFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px] group ${
                  isDragging
                    ? 'border-pink-600 bg-pink-50/50 scale-[1.01]'
                    : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50/70 hover:bg-zinc-100/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-12 h-12 rounded-2xl bg-white text-zinc-700 group-hover:text-pink-700 group-hover:scale-110 flex items-center justify-center shadow-xs border border-zinc-200 transition-all mb-3">
                  <Upload className="w-6 h-6" />
                </div>

                <p className="text-xs sm:text-sm font-black text-zinc-900">
                  {isKhmer ? 'ចុចទីនេះ ឬទម្លាក់រូបភាព Excel ចូល' : 'Click to upload or drag & drop image'}
                </p>
                <p className="text-[11px] text-zinc-500 font-medium mt-1 max-w-xs">
                  {isKhmer
                    ? 'PNG, JPG, JPEG • រូបថតអេក្រង់ ឬរូបថតពីកុំព្យូទ័រ'
                    : 'PNG, JPG, JPEG • Clear screenshots or photos work best'}
                </p>
              </div>
            ) : (
              /* Image Preview Box */
              <div className="space-y-3">
                <div className="relative rounded-2xl border border-zinc-200 bg-zinc-950 overflow-hidden group">
                  <img
                    src={imagePreviewUrl || ''}
                    alt="Uploaded Excel Exercise"
                    className="w-full h-56 object-contain bg-zinc-900/60"
                  />

                  {/* Overlay Action Buttons */}
                  <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => setShowZoomModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-zinc-900 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-xs transition-transform hover:scale-105 cursor-pointer"
                      title={isKhmer ? 'ពង្រីករូបភាព' : 'Zoom Image'}
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>{isKhmer ? 'ពង្រីក' : 'Zoom'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-zinc-900 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-xs transition-transform hover:scale-105 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isKhmer ? 'ប្តូរ' : 'Replace'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{isKhmer ? 'លុប' : 'Remove'}</span>
                    </button>
                  </div>
                </div>

                {/* Primary Analyze Button */}
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => handleStartAnalysis()}
                  className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isAnalyzing
                      ? 'bg-zinc-800 text-zinc-300 cursor-not-allowed opacity-90'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white active:scale-[0.99]'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>{isKhmer ? 'AI កំពុងវិភាគ...' : 'Analyzing Worksheet...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>
                        {analysisResult
                          ? isKhmer ? 'វិភាគលំហាត់ឡើងវិញ (Re-Analyze)' : 'Re-Analyze Worksheet'
                          : isKhmer ? 'វិភាគ និងដោះស្រាយរូបមន្ត (Analyze Excel)' : 'Analyze Excel Image'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Helper tips */}
            <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/70 text-[11px] text-zinc-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{isKhmer ? 'គន្លឹះដើម្បីទទួលបានលទ្ធផលត្រឹមត្រូវបំផុត៖' : 'Tips for Best Results:'}</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-zinc-500 font-medium">
                <li>{isKhmer ? 'ថត ឬកាត់រូបភាពឱ្យឃើញក្បាលជួរឈរ (A, B, C...) និងជួរដេក (1, 2, 3...)' : 'Capture column headers (A, B, C...) and row numbers (1, 2, 3...).'}</li>
                <li>{isKhmer ? 'រួមបញ្ចូលលក្ខខណ្ឌ ឬតំបន់ពណ៌លឿងដែលគ្រូបានដាក់' : 'Include instructions or yellow task areas given by teacher.'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right / Results Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* A. Progress / Loading State */}
          {isAnalyzing && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm text-center space-y-5 animate-fade-slide-up">
              <div className="w-16 h-16 rounded-3xl bg-zinc-900 text-white flex items-center justify-center mx-auto shadow-md">
                <FileSpreadsheet className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-black text-zinc-950">
                  {isKhmer ? 'AI កំពុងស្វែងយល់ពីលំហាត់ Excel របស់អ្នក...' : 'AI is Solving Your Excel Exercise...'}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-pink-700 animate-pulse min-h-[22px]">
                  {(isKhmer ? ANALYSIS_STAGES_KM : ANALYSIS_STAGES_EN)[analysisStageIdx]}
                </p>
              </div>

              {/* Multi-step pipeline pill markers */}
              <div className="flex items-center justify-center gap-1.5 max-w-sm mx-auto">
                {(isKhmer ? ANALYSIS_STAGES_KM : ANALYSIS_STAGES_EN).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === analysisStageIdx
                        ? 'w-8 bg-zinc-900'
                        : idx < analysisStageIdx
                        ? 'w-2.5 bg-emerald-500'
                        : 'w-2.5 bg-zinc-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* B. Error Banner */}
          {errorMessage && !isAnalyzing && (
            <div className={`${errorCode === 'RATE_LIMITED' && retryCountdown > 0 ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'} border p-5 rounded-3xl space-y-3 animate-fade-slide-up`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  errorCode === 'RATE_LIMITED' && retryCountdown > 0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {errorCode === 'RATE_LIMITED' && retryCountdown > 0 ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className={`text-xs font-black uppercase tracking-wide ${
                    errorCode === 'RATE_LIMITED' && retryCountdown > 0 ? 'text-amber-900' : 'text-rose-900'
                  }`}>
                    {errorCode === 'RATE_LIMITED' && retryCountdown > 0
                      ? (isKhmer ? 'កំពុងរង់ចាំព្យាយាមម្តងទៀត...' : 'Auto-retrying...')
                      : (isKhmer ? 'មិនអាចវិភាគបានទេ' : 'Analysis Notice')}
                  </h4>
                  <p className={`text-xs leading-relaxed ${
                    errorCode === 'RATE_LIMITED' && retryCountdown > 0 ? 'text-amber-700' : 'text-rose-700'
                  }`}>{errorMessage}</p>

                  {/* Countdown timer for rate limit auto-retry */}
                  {errorCode === 'RATE_LIMITED' && retryCountdown > 0 && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 bg-amber-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-1000 ease-linear"
                          style={{ width: `${(retryCountdown / 30) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-amber-800 tabular-nums min-w-[28px] text-right">
                        {retryCountdown}s
                      </span>
                    </div>
                  )}

                  {errorCode === 'GEMINI_API_KEY_MISSING' && (
                    <div className="mt-2 p-3 bg-white/80 rounded-xl border border-rose-200/80 text-[11px] text-zinc-700 font-mono">
                      <p className="font-bold text-zinc-900 mb-1 font-sans">
                        {isKhmer ? 'របៀបកំណត់ API Key លើ Server៖' : 'How to configure Gemini API Key:'}
                      </p>
                      <code>GEMINI_API_KEY=your_key_in_dotenv</code>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                {/* Cancel auto-retry button */}
                {errorCode === 'RATE_LIMITED' && retryCountdown > 0 && (
                  <button
                    type="button"
                    onClick={() => { cancelAutoRetry(); setRetryAttempt(0); }}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{isKhmer ? 'បោះបង់' : 'Cancel'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { cancelAutoRetry(); setRetryAttempt(0); handleStartAnalysis(0); }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isKhmer ? 'ព្យាយាមភ្លាមៗ' : 'Retry Now'}</span>
                </button>
              </div>
            </div>
          )}

          {/* C. Empty Initial State (No analysis yet) */}
          {!analysisResult && !isAnalyzing && !errorMessage && (
            <div className="bg-white p-8 rounded-3xl border border-zinc-200/90 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-sm font-black text-zinc-900">
                  {isKhmer ? 'ត្រៀមខ្លួនជាស្រេចក្នុងការដោះស្រាយ' : 'Ready to Solve Excel Problems'}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {isKhmer
                    ? 'ជ្រើសរើសរូបភាពលំហាត់ Excel នៅខាងឆ្វេង រួចចុចប៊ូតុង "វិភាគ និងដោះស្រាយរូបមន្ត" ដើម្បីទទួលរូបមន្ត ចម្លើយ និងការពន្យល់។'
                    : 'Select or drag an Excel screenshot on the left and click "Analyze Excel Image" to calculate formulas, results, and step-by-step guides.'}
                </p>
              </div>
            </div>
          )}

          {/* D. Structured Analysis Result View */}
          {analysisResult && !isAnalyzing && (
            <div className="space-y-5 animate-fade-slide-up">
              {/* 1. Problem Summary Banner */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-zinc-200/90 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 font-mono">
                      {isKhmer ? 'លំហាត់ដែលបានរកឃើញ' : 'Detected Exercise Task'}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-zinc-950 leading-snug">
                      {analysisResult.problem}
                    </h3>
                  </div>

                  <Badge
                    variant={
                      analysisResult.overallConfidence === 'high'
                        ? 'green'
                        : analysisResult.overallConfidence === 'medium'
                        ? 'amber'
                        : 'slate'
                    }
                    size="sm"
                  >
                    <span className="capitalize">{analysisResult.overallConfidence} Confidence</span>
                  </Badge>
                </div>

                {/* Highlighted Task Areas Tag List */}
                {analysisResult.taskAreas && analysisResult.taskAreas.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-amber-500" />
                      {isKhmer ? 'តំបន់ពណ៌លឿង/កិច្ចការ៖' : 'Highlighted Targets:'}
                    </span>
                    {analysisResult.taskAreas.map((ta, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold font-mono"
                        title={ta.description}
                      >
                        {ta.area} {ta.name ? `(${ta.name})` : ''}
                      </span>
                    ))}
                  </div>
                )}

                {/* Global Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-600 font-mono">
                      {analysisResult.calculations.length} {isKhmer ? 'រូបមន្តគណនា' : 'Calculations'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAllFormulas}
                    className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {allCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{allCopied ? (isKhmer ? 'បានចម្លងទាំងអស់!' : 'All Copied!') : (isKhmer ? 'ចម្លងគ្រប់រូបមន្ត' : 'Copy All Formulas')}</span>
                  </button>
                </div>
              </div>

              {/* 2. Detected Table Grid Representation */}
              {analysisResult.detectedTable &&
                analysisResult.detectedTable.headers &&
                analysisResult.detectedTable.headers.length > 0 && (
                  <div className="bg-white p-5 rounded-3xl border border-zinc-200/90 shadow-sm space-y-3 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Table className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wide">
                          {analysisResult.detectedTable.title || (isKhmer ? 'តារាងដែលបានវិភាគឃើញ' : 'Detected Table Structure')}
                        </h4>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono font-bold">
                        {analysisResult.detectedTable.headers.length} COLUMNS
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-zinc-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-zinc-100 border-b border-zinc-200 font-mono text-[11px] text-zinc-700">
                            {analysisResult.detectedTable.columns && analysisResult.detectedTable.columns.length > 0 ? (
                              analysisResult.detectedTable.columns.map((col, cIdx) => (
                                <th
                                  key={cIdx}
                                  className={`p-2.5 font-bold whitespace-nowrap ${
                                    col.isHighlighted
                                      ? 'bg-amber-100 text-amber-900 border-b-2 border-amber-400'
                                      : ''
                                  }`}
                                >
                                  <span className="text-[9px] px-1 py-0.5 rounded bg-white text-zinc-600 mr-1 border border-zinc-200">
                                    {col.col}
                                  </span>
                                  {col.header}
                                </th>
                              ))
                            ) : (
                              analysisResult.detectedTable.headers.map((h, hIdx) => (
                                <th key={hIdx} className="p-2.5 font-bold whitespace-nowrap">
                                  {h}
                                </th>
                              ))
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-zinc-800">
                          {analysisResult.detectedTable.sampleRows &&
                            analysisResult.detectedTable.sampleRows.map((sRow, rIdx) => (
                              <tr key={rIdx} className="hover:bg-zinc-50/70 transition-colors">
                                {analysisResult.detectedTable.columns &&
                                analysisResult.detectedTable.columns.length > 0 ? (
                                  analysisResult.detectedTable.columns.map((col, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className={`p-2.5 font-mono text-xs whitespace-nowrap ${
                                        col.isHighlighted ? 'bg-amber-50/70 font-bold text-amber-950' : ''
                                      }`}
                                    >
                                      {sRow.cells[col.col] || sRow.cells[col.header] || '-'}
                                    </td>
                                  ))
                                ) : (
                                  Object.values(sRow.cells).map((val, vIdx) => (
                                    <td key={vIdx} className="p-2.5 font-mono text-xs whitespace-nowrap">
                                      {val}
                                    </td>
                                  ))
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* 3. Calculations & Formula Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-pink-700" />
                    {isKhmer ? 'រូបមន្ត និងចម្លើយគណនា' : 'Generated Formulas & Results'}
                  </h4>
                </div>

                <div className="space-y-3">
                  {analysisResult.calculations.map((calc, idx) => {
                    const isExpanded = !!expandedRowIds[calc.id];
                    const isCopied = copiedCellId === calc.id;
                    const hasDiscrepancy = calc.status === 'discrepancy';

                    return (
                      <div
                        key={calc.id}
                        className={`bg-white rounded-3xl border transition-all overflow-hidden shadow-xs ${
                          hasDiscrepancy
                            ? 'border-amber-300 ring-2 ring-amber-100'
                            : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        {/* Card Header Bar */}
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-zinc-900 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                              {calc.cell}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-black text-zinc-950">
                                  {calc.targetColumn || `Cell ${calc.cell}`}
                                </h5>
                                {calc.programmaticVerification?.verified && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                                    {isKhmer ? 'ផ្ទៀងផ្ទាត់រួច' : 'Math Verified'}
                                  </span>
                                )}
                                {hasDiscrepancy && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200">
                                    {isKhmer ? 'មានភាពខុសគ្នា' : 'Discrepancy'}
                                  </span>
                                )}
                              </div>
                              {calc.meaning && (
                                <p className="text-xs text-zinc-500 font-medium mt-0.5">{calc.meaning}</p>
                              )}
                            </div>
                          </div>

                          {/* Formula Box & Copy Action */}
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <div className="flex items-center bg-zinc-900 text-emerald-400 font-mono text-xs font-bold px-3 py-2 rounded-xl shadow-xs border border-zinc-800">
                              <code>{calc.formula}</code>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCopyFormula(calc)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                isCopied
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200 shadow-2xs'
                              }`}
                              title={isKhmer ? 'ចម្លងរូបមន្ត' : 'Copy Formula'}
                            >
                              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleRowExpand(calc.id)}
                              className="p-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 shadow-2xs cursor-pointer"
                              title={isExpanded ? 'Collapse' : 'Expand Steps'}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Calculation & Expected Result Summary */}
                        <div className="px-5 py-3 border-t border-b border-zinc-100 flex flex-wrap items-center justify-between gap-2 bg-white text-xs">
                          {calc.mathExpression && (
                            <div className="flex items-center gap-1.5 font-mono text-zinc-600">
                              <span className="font-bold text-zinc-400">{isKhmer ? 'គណនា៖' : 'Math:'}</span>
                              <span className="font-bold text-zinc-900">{calc.mathExpression}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 font-medium">{isKhmer ? 'ចម្លើយរំពឹងទុក៖' : 'Expected Result:'}</span>
                            <span className="font-black font-mono text-sm text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-lg border border-pink-200">
                              {calc.expectedResult}
                            </span>
                          </div>
                        </div>

                        {/* Expandable Step-by-Step & Teaching Guide */}
                        {isExpanded && (
                          <div className="p-5 bg-zinc-50/60 space-y-4 text-xs animate-fade-slide-up">
                            {/* Explanation */}
                            {calc.explanation && (
                              <div className="space-y-1">
                                <span className="font-bold text-zinc-900 block">
                                  {isKhmer ? 'ការពន្យល់រូបមន្ត៖' : 'Formula Explanation:'}
                                </span>
                                <p className="text-zinc-600 leading-relaxed">{calc.explanation}</p>
                              </div>
                            )}

                            {/* Step-by-step instructions */}
                            {calc.steps && calc.steps.length > 0 && (
                              <div className="space-y-2">
                                <span className="font-bold text-zinc-900 block">
                                  {isKhmer ? 'ជំហានអនុវត្តក្នុង Excel (Step-by-Step):' : 'Excel Execution Steps:'}
                                </span>
                                <div className="space-y-1.5 pl-1">
                                  {calc.steps.map((step, sIdx) => (
                                    <div key={sIdx} className="flex items-start gap-2.5 text-zinc-700">
                                      <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-800 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                        {sIdx + 1}
                                      </span>
                                      <span className="leading-relaxed">{step}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Fill down drag guide */}
                            {calc.fillDown && calc.fillDown.applicable && (
                              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
                                <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-black text-[11px] uppercase tracking-wider block mb-0.5">
                                    {isKhmer ? 'ការអូសរូបមន្តបន្ត (Auto-Fill Handle):' : 'Fill-Down Instruction:'}
                                  </span>
                                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                                    {calc.fillDown.instruction}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Error & Discrepancy Detection Section */}
              {analysisResult.errors && analysisResult.errors.length > 0 && (
                <div className="bg-amber-50/80 p-5 sm:p-6 rounded-3xl border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                      {isKhmer ? 'កំហុស ឬភាពមិនស៊ីសង្វាក់គ្នាក្នុងរូបភាព' : 'Detected Answer Inconsistencies'}
                    </h4>
                  </div>

                  <div className="space-y-2.5">
                    {analysisResult.errors.map((err, eIdx) => (
                      <div
                        key={eIdx}
                        className="bg-white p-3.5 rounded-2xl border border-amber-200/80 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                            {err.cell || 'Worksheet Check'}
                          </span>
                          <span className="text-[10px] text-amber-700 font-bold uppercase">{err.type}</span>
                        </div>
                        <p className="text-zinc-800 font-medium">{err.description}</p>
                        {err.cause && (
                          <p className="text-zinc-500 text-[11px]">
                            <strong className="text-zinc-700">{isKhmer ? 'មូលហេតុ៖ ' : 'Cause: '}</strong>
                            {err.cause}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Teacher Assistant Pedagogical Section */}
              {analysisResult.teachingNotes && (
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-zinc-200/90 shadow-sm space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowTeacherNotes(!showTeacherNotes)}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-pink-700" />
                      <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wide">
                        {isKhmer ? 'កំណត់សម្គាល់សម្រាប់គ្រូបង្រៀន (Teacher Assistant Notes)' : 'Teacher Assistant & Pedagogical Notes'}
                      </h4>
                    </div>
                    {showTeacherNotes ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>

                  {showTeacherNotes && (
                    <div className="space-y-3 pt-2 text-xs text-zinc-700 animate-fade-slide-up border-t border-zinc-100">
                      {analysisResult.teachingNotes.summary && (
                        <p className="leading-relaxed font-medium text-zinc-800">
                          {analysisResult.teachingNotes.summary}
                        </p>
                      )}

                      {analysisResult.teachingNotes.commonMistakes &&
                        analysisResult.teachingNotes.commonMistakes.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="font-bold text-zinc-900 block">
                              {isKhmer ? 'កំហុសទូទៅដែលសិស្សតែងតែជួបប្រទះ៖' : 'Common Student Pitfalls:'}
                            </span>
                            <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                              {analysisResult.teachingNotes.commonMistakes.map((mistake, mIdx) => (
                                <li key={mIdx}>{mistake}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {analysisResult.teachingNotes.pedagogicalTips &&
                        analysisResult.teachingNotes.pedagogicalTips.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="font-bold text-zinc-900 block">
                              {isKhmer ? 'គន្លឹះក្នុងការបង្រៀន (Teaching Tips):' : 'Teaching Advice:'}
                            </span>
                            <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                              {analysisResult.teachingNotes.pedagogicalTips.map((tip, tIdx) => (
                                <li key={tIdx}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. ZOOM IMAGE PREVIEW MODAL */}
      {showZoomModal && imagePreviewUrl && (
        <Modal
          isOpen={showZoomModal}
          onClose={() => setShowZoomModal(false)}
          title={isKhmer ? 'ពង្រីករូបភាពលំហាត់ Excel' : 'Worksheet Image Inspection'}
          maxWidth="3xl"
        >
          <div className="space-y-3">
            <div className="max-h-[70vh] overflow-auto rounded-2xl bg-zinc-950 p-2 flex items-center justify-center">
              <img
                src={imagePreviewUrl}
                alt="Enlarged Excel Worksheet"
                className="max-w-full h-auto object-contain rounded-lg"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowZoomModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 cursor-pointer"
              >
                {isKhmer ? 'បិទ' : 'Close'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
