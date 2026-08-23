import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  generateMonkeytypeWords,
  getRandomQuote,
  TypingLanguage,
  QuoteLength
} from '../../utils/typingWordBank';
import { MonkeytypeChart, ChartPoint } from './MonkeytypeChart';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Clock,
  Type,
  Quote,
  Award,
  Check,
  X,
  AlertCircle,
  Copy,
  Sliders,
  Play,
  FileText,
  Target
} from 'lucide-react';

export type TestMode = 'time' | 'words' | 'quote' | 'custom';
export type CaretStyle = 'line' | 'smooth' | 'block' | 'underline';

export interface MonkeytypeResultData {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  timeSpent: number;
  testMode: TestMode;
  modeOption: string | number;
  language: TypingLanguage;
  punctuation: boolean;
  numbers: boolean;
  chartData: ChartPoint[];
  missedWords: string[];
}

interface MonkeytypeArenaProps {
  onTestComplete?: (result: MonkeytypeResultData) => void;
  customInitialText?: string;
  isExamMode?: boolean;
}

export const MonkeytypeArena: React.FC<MonkeytypeArenaProps> = ({
  onTestComplete,
  customInitialText,
  isExamMode = false
}) => {
  // Test Configuration States
  const [testMode, setTestMode] = useState<TestMode>('time');
  const [timeDuration, setTimeDuration] = useState<number>(30); // 15, 30, 60, 120
  const [wordCount, setWordCount] = useState<number>(25); // 10, 25, 50, 100
  const [quoteLength, setQuoteLength] = useState<QuoteLength>('medium');
  const [language, setLanguage] = useState<TypingLanguage>('english');
  const [punctuation, setPunctuation] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>(customInitialText || '');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  // Word Stream & Input States
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [wordHistory, setWordHistory] = useState<string[]>([]); // typed strings for completed words
  const [missedWordsList, setMissedWordsList] = useState<string[]>([]);

  // Timer & Test Execution States
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeDuration);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Stats & Performance Time-series Tracking
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [rawKeystrokesCount, setRawKeystrokesCount] = useState<number>(0);
  const [errorKeystrokesCount, setErrorKeystrokesCount] = useState<number>(0);
  const [completedResult, setCompletedResult] = useState<MonkeytypeResultData | null>(null);

  // Precision Timestamp & Mutable Refs for Zero-Freeze Timer
  const startTimeRef = useRef<number | null>(null);
  const lastSampledSecondRef = useRef<number>(0);
  const timerIntervalRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);

  // Live mutable values stored in refs to avoid timer interval teardowns
  const wordsRef = useRef<string[]>([]);
  const wordHistoryRef = useRef<string[]>([]);
  const currentInputRef = useRef<string>('');
  const rawKeystrokesRef = useRef<number>(0);
  const errorKeystrokesRef = useRef<number>(0);
  const missedWordsRef = useRef<string[]>([]);
  const chartDataRef = useRef<ChartPoint[]>([]);
  const finishTestRef = useRef<() => void>(() => {});

  // Keep refs in sync with states
  wordsRef.current = words;
  wordHistoryRef.current = wordHistory;
  currentInputRef.current = currentInput;
  rawKeystrokesRef.current = rawKeystrokesCount;
  errorKeystrokesRef.current = errorKeystrokesCount;
  missedWordsRef.current = missedWordsList;

  const calculateTotalCorrectChars = (
    targetWords: string[],
    history: string[],
    activeInput: string
  ): number => {
    let correct = 0;
    history.forEach((typed, idx) => {
      const target = targetWords[idx] || '';
      for (let i = 0; i < typed.length && i < target.length; i++) {
        if (typed[i] === target[i]) correct++;
      }
      if (typed === target && idx < history.length) {
        correct++; // include correct space character
      }
    });

    const targetActive = targetWords[history.length] || '';
    for (let i = 0; i < activeInput.length && i < targetActive.length; i++) {
      if (activeInput[i] === targetActive[i]) correct++;
    }

    return correct;
  };

  // Complete the test and calculate authentic CIIS Typing Lab metrics
  const finishTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsTestActive(false);
    setIsTestCompleted(true);

    const now = performance.now();
    const finalElapsed = startTimeRef.current
      ? Math.max(1, Math.round((now - startTimeRef.current) / 1000))
      : 1;
    const minutes = finalElapsed / 60;

    const finalWords = wordsRef.current;
    const finalHistory = wordHistoryRef.current;
    const finalInput = currentInputRef.current;
    const combinedHistory = finalInput.length > 0 ? [...finalHistory, finalInput] : finalHistory;

    let correctChars = 0;
    let incorrectChars = 0;
    let extraChars = 0;
    let missedChars = 0;
    const finalMissedWords: string[] = [...missedWordsRef.current];

    // Evaluate all completed words
    combinedHistory.forEach((typed, idx) => {
      const target = finalWords[idx] || '';
      if (typed !== target && !finalMissedWords.includes(target)) {
        finalMissedWords.push(target);
      }

      for (let i = 0; i < target.length; i++) {
        if (i < typed.length) {
          if (typed[i] === target[i]) {
            correctChars++;
          } else {
            incorrectChars++;
          }
        } else {
          missedChars++;
        }
      }

      if (typed.length > target.length) {
        extraChars += typed.length - target.length;
      }

      if (typed === target) {
        correctChars++; // correct space character
      }
    });

    // Evaluate remaining uncompleted words
    if (combinedHistory.length < finalWords.length) {
      for (let i = combinedHistory.length + 1; i < finalWords.length; i++) {
        missedChars += (finalWords[i]?.length || 0) + 1;
      }
    }

    const totalTyped = correctChars + incorrectChars + extraChars;
    const netWpm = Math.max(0, Math.round((correctChars / 5) / minutes));
    const rawWpm = Math.max(0, Math.round((totalTyped / 5) / minutes));
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

    // Calculate Consistency %
    let consistency = 88;
    const currentChart = chartDataRef.current;
    if (currentChart.length > 2) {
      const wpms = currentChart.map((d) => d.wpm);
      const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      const variance = wpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpms.length;
      const stdDev = Math.sqrt(variance);
      consistency = Math.max(40, Math.min(100, Math.round(100 - (stdDev / (avg || 1)) * 100)));
    }

    const resultData: MonkeytypeResultData = {
      wpm: netWpm,
      rawWpm,
      accuracy,
      consistency,
      correctChars,
      incorrectChars,
      extraChars,
      missedChars,
      timeSpent: finalElapsed,
      testMode,
      modeOption: testMode === 'time' ? timeDuration : testMode === 'words' ? wordCount : quoteLength,
      language,
      punctuation,
      numbers,
      chartData: currentChart.length > 0 ? currentChart : [{ second: finalElapsed, wpm: netWpm, rawWpm, errors: errorKeystrokesRef.current }],
      missedWords: finalMissedWords
    };

    setCompletedResult(resultData);

    // Confetti on distinction speed or 98%+ accuracy!
    if (netWpm >= 50 || accuracy >= 98) {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#be185d', '#db2777', '#f472b6', '#9d174d']
      });
    }

    if (onTestComplete) {
      onTestComplete(resultData);
    }
  }, [testMode, timeDuration, wordCount, quoteLength, language, punctuation, numbers, onTestComplete]);

  finishTestRef.current = finishTest;

  // Generate words on config change
  const initializeTest = useCallback((overrideWords?: string[]) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    startTimeRef.current = null;
    lastSampledSecondRef.current = 0;
    chartDataRef.current = [];
    rawKeystrokesRef.current = 0;
    errorKeystrokesRef.current = 0;
    missedWordsRef.current = [];

    setIsTestActive(false);
    setIsTestCompleted(false);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setWordHistory([]);
    setMissedWordsList([]);
    setRawKeystrokesCount(0);
    setErrorKeystrokesCount(0);
    setChartData([]);
    setCompletedResult(null);
    setElapsedSeconds(0);
    setTimeLeft(timeDuration);

    if (overrideWords && overrideWords.length > 0) {
      setWords(overrideWords);
    } else if (testMode === 'custom' && customText.trim()) {
      setWords(customText.trim().split(/\s+/));
    } else if (testMode === 'quote') {
      const quote = getRandomQuote(quoteLength);
      setWords(quote.text.split(' '));
    } else {
      const count = testMode === 'words' ? wordCount : Math.max(120, timeDuration * 4);
      const generated = generateMonkeytypeWords({
        language,
        count,
        punctuation,
        numbers
      });
      setWords(generated.split(' '));
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 40);
  }, [testMode, timeDuration, wordCount, quoteLength, language, punctuation, numbers, customText]);

  useEffect(() => {
    initializeTest();
  }, [testMode, timeDuration, wordCount, quoteLength, language, punctuation, numbers]);

  // Global Keyboard Shortcuts (Tab to restart, Esc to restart)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.getModifierState) {
        setCapsLockActive(e.getModifierState('CapsLock'));
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        initializeTest();
      } else if (e.key === 'Escape') {
        initializeTest();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [initializeTest]);

  // High-Precision Zero-Freeze Timestamp Timer Engine
  useEffect(() => {
    if (isTestActive && !isTestCompleted) {
      timerIntervalRef.current = setInterval(() => {
        if (!startTimeRef.current) return;

        const now = performance.now();
        const elapsedSec = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedSeconds(elapsedSec);

        // Sample stats per second for the performance curve
        if (elapsedSec > lastSampledSecondRef.current) {
          for (let s = lastSampledSecondRef.current + 1; s <= elapsedSec; s++) {
            const currentTypedChars = wordHistoryRef.current.join(' ').length + currentInputRef.current.length;
            const currentCorrectChars = calculateTotalCorrectChars(wordsRef.current, wordHistoryRef.current, currentInputRef.current);
            const currentWpm = s > 0 ? Math.round((currentCorrectChars / 5) / (s / 60)) : 0;
            const currentRawWpm = s > 0 ? Math.round((rawKeystrokesRef.current / 5) / (s / 60)) : 0;

            chartDataRef.current.push({
              second: s,
              wpm: currentWpm,
              rawWpm: currentRawWpm,
              errors: errorKeystrokesRef.current
            });
          }
          lastSampledSecondRef.current = elapsedSec;
          setChartData([...chartDataRef.current]);
        }

        // Handle Time Mode Countdown
        if (testMode === 'time') {
          const remaining = Math.max(0, timeDuration - elapsedSec);
          setTimeLeft(remaining);

          if (remaining <= 0) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            finishTestRef.current();
          }
        }
      }, 100);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isTestActive, isTestCompleted, testMode, timeDuration]);

  // Auto-scroll active word into view within the 3-line box
  useEffect(() => {
    if (activeWordRef.current && wordsContainerRef.current) {
      const container = wordsContainerRef.current;
      const wordEl = activeWordRef.current;
      const wordTop = wordEl.offsetTop - container.offsetTop;
      
      if (wordTop > 45) {
        container.scrollTo({
          top: wordTop - 40,
          behavior: 'smooth'
        });
      } else {
        container.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  }, [currentWordIndex]);

  // Handle Keystrokes & Live Word Evaluation (Quiet/Silent - No Audio)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTestCompleted) return;

    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }

    // Start timer on first keystroke using performance.now()
    if (!isTestActive) {
      startTimeRef.current = performance.now();
      lastSampledSecondRef.current = 0;
      setIsTestActive(true);
    }

    const currentTargetWord = words[currentWordIndex] || '';

    // Spacebar Key handling -> Advance Word
    if (e.key === ' ') {
      e.preventDefault();
      if (currentInput.length === 0) return; // ignore leading multiple spaces

      setRawKeystrokesCount((prev) => prev + 1);

      // Track if word had errors
      if (currentInput !== currentTargetWord) {
        if (!missedWordsList.includes(currentTargetWord)) {
          setMissedWordsList((prev) => [...prev, currentTargetWord]);
        }
      }

      const nextHistory = [...wordHistory, currentInput];
      setWordHistory(nextHistory);
      setCurrentInput('');

      const nextWordIdx = currentWordIndex + 1;
      setCurrentWordIndex(nextWordIdx);

      // Check if finished in words/quote/custom mode
      if (nextWordIdx >= words.length) {
        finishTest();
      }
      return;
    }

    // Backspace Key handling
    if (e.key === 'Backspace') {
      setRawKeystrokesCount((prev) => prev + 1);

      if (e.ctrlKey || e.altKey) {
        setCurrentInput('');
        return;
      }

      if (currentInput.length === 0 && currentWordIndex > 0) {
        const prevWord = wordHistory[wordHistory.length - 1];
        setWordHistory((prev) => prev.slice(0, -1));
        setCurrentWordIndex((prev) => prev - 1);
        setCurrentInput(prevWord);
        return;
      }

      setCurrentInput((prev) => prev.slice(0, -1));
      return;
    }

    // Regular typing keys (No audio output)
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const nextChar = e.key;
      const expectedChar = currentTargetWord[currentInput.length];

      setRawKeystrokesCount((prev) => prev + 1);

      if (expectedChar && nextChar !== expectedChar) {
        setErrorKeystrokesCount((prev) => prev + 1);
      }

      const nextVal = currentInput + nextChar;
      setCurrentInput(nextVal);

      // Check if on the last word and user reached the exact target length
      if (
        currentWordIndex === words.length - 1 &&
        nextVal.length >= currentTargetWord.length &&
        (testMode === 'words' || testMode === 'quote' || testMode === 'custom')
      ) {
        if (nextVal === currentTargetWord) {
          finishTest();
        }
      }
    }
  };

  // Practice Missed Words Drill
  const handlePracticeMissedWords = () => {
    if (completedResult && completedResult.missedWords.length > 0) {
      const repeated = [];
      for (let i = 0; i < 4; i++) {
        repeated.push(...completedResult.missedWords);
      }
      setTestMode('words');
      setWordCount(repeated.length);
      initializeTest(repeated);
    }
  };

  const handleCopyResult = () => {
    if (!completedResult) return;
    const text = `CIIS Touch Typing Speed Lab\nSpeed: ${completedResult.wpm} WPM | Acc: ${completedResult.accuracy}% | Raw: ${completedResult.rawWpm} WPM\nMode: ${completedResult.testMode} ${completedResult.modeOption} | Consistency: ${completedResult.consistency}%`;
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // Live real-time WPM calculation during active typing
  const liveCorrectChars = useMemo(() => {
    return calculateTotalCorrectChars(words, wordHistory, currentInput);
  }, [words, wordHistory, currentInput]);

  const liveMinutes = Math.max(1, elapsedSeconds) / 60;
  const liveWpm = liveMinutes > 0 ? Math.round((liveCorrectChars / 5) / liveMinutes) : 0;
  const liveAcc = (rawKeystrokesCount > 0) ? Math.round((liveCorrectChars / rawKeystrokesCount) * 100) : 100;

  return (
    <div className="w-full max-w-5xl mx-auto select-none font-mono text-slate-400 space-y-6">
      
      {/* ============================================================== */}
      {/* 1. TOP CONFIG & MODE SELECTOR BAR (CIIS PINK / SLATE THEME)    */}
      {/* ============================================================== */}
      {!isTestCompleted && (
        <div className="bg-slate-900 p-2 sm:p-3 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between gap-2 text-xs overflow-x-auto no-scrollbar">
          
          {/* Group 1: Punctuation & Numbers Toggles */}
          <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setPunctuation(!punctuation);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                punctuation ? 'text-pink-300 bg-pink-900/60 shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Punctuation"
            >
              <span>@</span>
              <span className="hidden sm:inline">punctuation</span>
            </button>

            <button
              onClick={() => {
                setNumbers(!numbers);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                numbers ? 'text-pink-300 bg-pink-900/60 shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Numbers"
            >
              <span>#</span>
              <span className="hidden sm:inline">numbers</span>
            </button>
          </div>

          {/* Group 2: Mode Selector (time | words | quote | custom) */}
          <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setTestMode('time')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                testMode === 'time' ? 'text-white bg-pink-800 shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>time</span>
            </button>

            <button
              onClick={() => setTestMode('words')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                testMode === 'words' ? 'text-white bg-pink-800 shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>words</span>
            </button>

            <button
              onClick={() => setTestMode('quote')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                testMode === 'quote' ? 'text-white bg-pink-800 shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>quote</span>
            </button>

            <button
              onClick={() => {
                setTestMode('custom');
                setShowCustomModal(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                testMode === 'custom' ? 'text-white bg-pink-800 shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>custom</span>
            </button>
          </div>

          {/* Group 3: Sub-options (15, 30, 60, 120 OR 10, 25, 50, 100 OR Quote lengths) */}
          <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            {testMode === 'time' && (
              <>
                {[15, 30, 60, 120].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeDuration(t)}
                    className={`px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      timeDuration === t ? 'text-pink-300 bg-pink-900/50' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </>
            )}

            {testMode === 'words' && (
              <>
                {[10, 25, 50, 100].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWordCount(w)}
                    className={`px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      wordCount === w ? 'text-pink-300 bg-pink-900/50' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </>
            )}

            {testMode === 'quote' && (
              <>
                {(['all', 'short', 'medium', 'long'] as QuoteLength[]).map((ql) => (
                  <button
                    key={ql}
                    onClick={() => setQuoteLength(ql)}
                    className={`px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      quoteLength === ql ? 'text-pink-300 bg-pink-900/50' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ql}
                  </button>
                ))}
              </>
            )}

            {testMode === 'custom' && (
              <button
                onClick={() => setShowCustomModal(true)}
                className="text-pink-400 hover:underline px-2 py-0.5 font-bold cursor-pointer"
              >
                edit text
              </button>
            )}
          </div>

          {/* Group 4: Language Selector */}
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as TypingLanguage)}
              className="bg-slate-950 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold outline-none cursor-pointer hover:border-pink-500/50"
            >
              <option value="english">english</option>
              <option value="english1k">english 1k</option>
              <option value="khmer">ខ្មែរ (khmer)</option>
              <option value="code">code / dev</option>
              <option value="computer">office & formulas</option>
            </select>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 2. ACTIVE TEST ARENA                                           */}
      {/* ============================================================== */}
      {!isTestCompleted && (
        <div className="space-y-4">
          
          {/* Live Progress Bar & Real-time Live Stats */}
          <div className="flex items-center justify-between px-2 text-xs">
            {/* Primary Live Countdown / Word Counter */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-pink-400 font-mono">
                {testMode === 'time' ? `${timeLeft}s` : `${currentWordIndex}/${words.length}`}
              </span>
              {isTestActive && (
                <div className="flex items-center gap-3 text-slate-400 font-mono text-xs">
                  <span>wpm: <strong className="text-white">{liveWpm}</strong></span>
                  <span>acc: <strong className="text-white">{liveAcc}%</strong></span>
                </div>
              )}
            </div>

            {/* Caps Lock Warning Banner */}
            {capsLockActive && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 font-bold text-xs animate-bounce">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Caps Lock is ON</span>
              </div>
            )}

            {/* Quick Restart Hint */}
            <div className="text-slate-400 text-[11px] hidden sm:flex items-center gap-2">
              <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200 font-mono">tab</kbd>
              <span>+</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200 font-mono">enter</kbd>
              <span>- restart test</span>
            </div>
          </div>

          {/* Words Box Container (3-Line Viewport with Smooth Scroll & CIIS Pink Caret) */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="relative bg-slate-950 rounded-3xl border border-slate-800 p-5 sm:p-8 sm:p-10 cursor-text shadow-2xl min-h-[150px] overflow-hidden focus-within:border-pink-600/60 transition-colors"
          >
            {/* Hidden Input that captures all keystrokes */}
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={() => {}} // handled in onKeyDown
              onKeyDown={handleKeyDown}
              className="absolute opacity-0 -top-10 left-0 w-1 h-1 pointer-events-none"
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />

            {/* 3-Line Words Stream */}
            <div
              ref={wordsContainerRef}
              className="h-[120px] overflow-hidden text-xl sm:text-2xl leading-relaxed tracking-wider flex flex-wrap gap-x-3 gap-y-3.5 select-none relative monkeytype-scroll"
            >
              {words.map((word, wIdx) => {
                const isPassed = wIdx < currentWordIndex;
                const isCurrent = wIdx === currentWordIndex;
                const typedWord = isPassed ? wordHistory[wIdx] || '' : isCurrent ? currentInput : '';

                return (
                  <div
                    key={wIdx}
                    ref={isCurrent ? activeWordRef : null}
                    className={`relative inline-flex items-center transition-all ${
                      isPassed && typedWord !== word ? 'border-b-2 border-rose-500' : ''
                    }`}
                  >
                    {/* Render target word characters */}
                    {word.split('').map((char, cIdx) => {
                      let charColor = 'text-slate-500'; // default untyped gray
                      let charBg = '';

                      if (isPassed || isCurrent) {
                        if (cIdx < typedWord.length) {
                          if (typedWord[cIdx] === char) {
                            charColor = 'text-white font-medium'; // correct typed
                          } else {
                            charColor = 'text-rose-400 font-bold'; // error typed
                          }
                        }
                      }

                      // Position smooth CIIS Pink caret
                      const isCaretHere = isCurrent && cIdx === typedWord.length;

                      return (
                        <span key={cIdx} className={`relative inline-block ${charColor} ${charBg}`}>
                          {isCaretHere && (
                            <span
                              className={`absolute -left-0.5 top-0.5 bottom-0.5 w-[2.5px] bg-pink-500 rounded-full z-10 shadow-xs shadow-pink-500/50 ${
                                isTestActive ? 'animate-monkeytype-smooth-caret' : 'animate-monkeytype-caret'
                              }`}
                            />
                          )}
                          {char}
                        </span>
                      );
                    })}

                    {/* Render Extra characters typed past word length */}
                    {typedWord.length > word.length && (
                      <span className="text-rose-500 underline decoration-rose-500">
                        {typedWord.slice(word.length)}
                      </span>
                    )}

                    {/* Caret at end of word */}
                    {isCurrent && typedWord.length >= word.length && (
                      <span className="relative inline-block">
                        <span
                          className={`absolute -left-0.5 top-0.5 bottom-0.5 w-[2.5px] bg-pink-500 rounded-full z-10 shadow-xs shadow-pink-500/50 ${
                            isTestActive ? 'animate-monkeytype-smooth-caret' : 'animate-monkeytype-caret'
                          }`}
                        />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Click to Focus Overlay when idle */}
            {!isTestActive && currentInput.length === 0 && (
              <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-3xs rounded-3xl flex items-center justify-center pointer-events-none">
                <div className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-pink-300 font-bold text-xs shadow-xl flex items-center gap-2">
                  <Play className="w-4 h-4 fill-current" />
                  <span>Click or start typing to begin</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Restart Action Bar */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={() => initializeTest()}
              className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-pink-400 border border-slate-800 transition-all cursor-pointer hover:rotate-45"
              title="Restart Test (Tab or Esc)"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 3. SIGNATURE RESULTS SCREEN (CIIS BRAND PINK AESTHETIC)       */}
      {/* ============================================================== */}
      {isTestCompleted && completedResult && (
        <div className="bg-slate-950 p-4 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Hero Numbers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center border-b border-slate-800 pb-6 sm:pb-8">
            
            {/* Massive Net WPM Showcase */}
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[11px] sm:text-xs uppercase font-bold text-slate-400 tracking-widest block">wpm</span>
              <div className="text-4xl sm:text-7xl font-black text-pink-500 tracking-tighter flex items-baseline gap-2 font-mono">
                <span>{completedResult.wpm}</span>
              </div>
            </div>

            {/* Massive Accuracy Showcase */}
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[11px] sm:text-xs uppercase font-bold text-slate-400 tracking-widest block">acc</span>
              <div className="text-4xl sm:text-7xl font-black text-pink-500 tracking-tighter font-mono">
                <span>{completedResult.accuracy}%</span>
              </div>
            </div>

            {/* Secondary Breakdown Stats */}
            <div className="col-span-2 md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-bold uppercase font-sans">test type</span>
                <p className="text-sm font-black text-white">
                  {completedResult.testMode} {completedResult.modeOption}
                </p>
                <p className="text-[10px] text-slate-400">{completedResult.language}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-bold uppercase font-sans">raw wpm</span>
                <p className="text-sm font-black text-white">{completedResult.rawWpm}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-bold uppercase font-sans">characters</span>
                <p className="text-sm font-black text-white">
                  <span className="text-emerald-400">{completedResult.correctChars}</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-rose-400">{completedResult.incorrectChars}</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-rose-600">{completedResult.extraChars}</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-500">{completedResult.missedChars}</span>
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-bold uppercase font-sans">consistency</span>
                <p className="text-sm font-black text-white">{completedResult.consistency}%</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-bold uppercase font-sans">time</span>
                <p className="text-sm font-black text-white">{completedResult.timeSpent}s</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-bold uppercase font-sans">rank rating</span>
                <p className="text-sm font-black text-pink-400">
                  {completedResult.wpm >= 90
                    ? 'Godspeed'
                    : completedResult.wpm >= 70
                    ? 'Master'
                    : completedResult.wpm >= 50
                    ? 'Pro'
                    : completedResult.wpm >= 35
                    ? 'Intermediate'
                    : 'Novice'}
                </p>
              </div>
            </div>

          </div>

          {/* Interactive WPM Over Time Chart */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              typing trajectory & errors
            </h3>
            <div className="bg-slate-900/80 p-4 sm:p-6 rounded-2xl border border-slate-800">
              <MonkeytypeChart
                data={completedResult.chartData}
                maxWpm={completedResult.rawWpm}
              />
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            
            {/* Primary Actions: Next Test & Repeat */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => initializeTest()}
                className="px-5 py-2.5 rounded-xl bg-pink-700 text-white font-black text-xs hover:bg-pink-800 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>next test (tab)</span>
              </button>

              <button
                onClick={() => initializeTest(words)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs transition-all flex items-center gap-2 border border-slate-800 cursor-pointer"
              >
                <span>repeat test</span>
              </button>

              {/* Practice Missed Words Drill button */}
              {completedResult.missedWords.length > 0 && (
                <button
                  onClick={handlePracticeMissedWords}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>practice missed words ({completedResult.missedWords.length})</span>
                </button>
              )}
            </div>

            {/* Secondary Actions: Copy / Share */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyResult}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs transition-all flex items-center gap-2 border border-slate-800 cursor-pointer"
              >
                {copiedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSuccess ? 'copied!' : 'copy result'}</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 4. CUSTOM TEXT INPUT MODAL                                     */}
      {/* ============================================================== */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">custom text prompt</h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste any custom paragraph, lecture notes, or homework passage you want to practice.
            </p>

            <textarea
              rows={6}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste custom text here..."
              className="w-full bg-slate-950 text-white p-3 rounded-2xl border border-slate-800 focus:border-pink-600 text-xs font-mono outline-none resize-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                cancel
              </button>
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  setTestMode('custom');
                  initializeTest();
                }}
                disabled={!customText.trim()}
                className="px-5 py-2 rounded-xl bg-pink-700 text-white text-xs font-black hover:bg-pink-800 disabled:opacity-50 cursor-pointer"
              >
                apply & start
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
