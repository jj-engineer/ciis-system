import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import {
  ChatMessage,
  ChatCategory,
  STARTER_PROMPTS,
  QuickPrompt,
  sendAIChatMessage,
  checkAIChatStatus,
  loadChatHistory,
  saveChatHistory,
  clearChatHistory
} from '../../services/aiChatApi';
import {
  Sparkles,
  Send,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Table,
  Calculator,
  FileText,
  Presentation,
  Keyboard,
  School,
  ArrowRight,
  ExternalLink,
  Bot,
  User,
  Zap,
  HelpCircle,
  Code2,
  CheckCircle2,
  Flame,
  BookOpen
} from 'lucide-react';

interface AIAssistantPageProps {
  setActiveTab?: (tab: string) => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const isKhmer = language === 'km';

  // Category filter
  const [activeCategory, setActiveCategory] = useState<ChatCategory>('all');

  // Messages & Input
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = loadChatHistory();
    if (saved && saved.length > 0) return saved;
    return [];
  });
  const [inputValue, setInputValue] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Service status
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [activeModel, setActiveModel] = useState<string>('gemini-2.5-flash');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    scrollToBottom(true);
    saveChatHistory(messages);
  }, [messages]);

  // Check AI Service status
  useEffect(() => {
    checkAIChatStatus().then((res) => {
      if (res.success) {
        setIsConfigured(res.configured);
        if (res.model) setActiveModel(res.model);
      }
    }).catch(() => {});
  }, []);

  // Send message handler
  const handleSendMessage = async (textToSend?: string, categoryOverride?: ChatCategory) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isSending) return;

    const currentCat = categoryOverride || activeCategory;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
      category: currentCat
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    setErrorMessage(null);
    setIsSending(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Send past context (last 8 messages for memory)
      const payloadMessages = newHistory.slice(-8).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

      const response = await sendAIChatMessage({
        messages: payloadMessages,
        category: currentCat !== 'all' ? currentCat : undefined,
        customContext: {
          currentUser: currentUser?.fullName || 'Teacher',
          schoolName: 'CIIS International School',
          activeLanguage: language
        }
      });

      if (response.success && response.reply) {
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.reply,
          timestamp: Date.now(),
          category: currentCat,
          modelUsed: response.modelUsed || activeModel
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const fallbackMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: isKhmer
            ? `⚠️ **មិនអាចទទួលបានចម្លើយទេ៖** ${response.message || 'សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។'}`
            : `⚠️ **Unable to generate response:** ${response.message || 'Please try again later.'}`,
          timestamp: Date.now(),
          isError: true
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setErrorMessage(response.message || 'Request failed');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: isKhmer
          ? `⚠️ **បញ្ហាក្នុងការតភ្ជាប់៖** ${err.message || 'សូមពិនិត្យមើលការតភ្ជាប់អ៊ីនធឺណិត។'}`
          : `⚠️ **Connection error:** ${err.message || 'Please verify your connection.'}`,
        timestamp: Date.now(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  // Quick Prompt Click
  const handleSelectPrompt = (prompt: QuickPrompt) => {
    const text = isKhmer ? prompt.promptKm : prompt.promptEn;
    setActiveCategory(prompt.category);
    handleSendMessage(text, prompt.category);
  };

  // Clear Chat History
  const handleClearHistory = () => {
    if (messages.length === 0) return;
    if (window.confirm(isKhmer ? 'តើអ្នកពិតជាចង់សម្អាតប្រវត្តិសន្ទនានេះមែនទេ?' : 'Are you sure you want to clear the conversation history?')) {
      setMessages([]);
      clearChatHistory();
      setErrorMessage(null);
    }
  };

  // Copy message text
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Auto-resize textarea
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  // Key press listener (Enter = send, Shift+Enter = new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Categories config
  const categories: { id: ChatCategory; labelKm: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'all', labelKm: 'ទាំងអស់', labelEn: 'All Topics', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'excel', labelKm: 'Excel & រូបមន្ត', labelEn: 'Excel & Formulas', icon: <Table className="w-3.5 h-3.5" /> },
    { id: 'word', labelKm: 'MS Word', labelEn: 'MS Word', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'ppt', labelKm: 'PowerPoint', labelEn: 'PowerPoint', icon: <Presentation className="w-3.5 h-3.5" /> },
    { id: 'system', labelKm: 'ប្រព័ន្ធសាលា CIIS', labelEn: 'CIIS School System', icon: <School className="w-3.5 h-3.5" /> },
    { id: 'typing', labelKm: 'វាយអក្សរ Typing', labelEn: 'Touch Typing', icon: <Keyboard className="w-3.5 h-3.5" /> },
  ];

  // Helper: Simple Markdown Formatter
  const renderFormattedContent = (content: string) => {
    // Split by code blocks ```...```
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        let lang = 'code';
        let codeBody = lines.join('\n');

        if (lines.length > 0 && /^[a-zA-Z0-9_-]+$/.test(lines[0].trim())) {
          lang = lines[0].trim();
          codeBody = lines.slice(1).join('\n');
        }

        return (
          <div key={index} className="my-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-100 overflow-hidden shadow-md">
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-[11px] text-zinc-400 font-mono">
              <span className="uppercase tracking-wider font-semibold text-emerald-400">{lang}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(codeBody)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700"
              >
                <Copy className="w-3 h-3" />
                <span>{isKhmer ? 'ចម្លង' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-xs font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap">
              <code>{codeBody}</code>
            </pre>
          </div>
        );
      }

      // Normal text with bold, inline code, lists, headers
      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-1.5">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={lIdx} className="h-1" />;

            // Header 3 / 4 (### or ##)
            if (trimmed.startsWith('### ')) {
              return (
                <h4 key={lIdx} className="text-sm font-black text-zinc-900 dark:text-white pt-2 pb-1 border-b border-zinc-200/60 dark:border-zinc-800">
                  {trimmed.replace(/^###\s+/, '')}
                </h4>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h3 key={lIdx} className="text-base font-black text-zinc-900 dark:text-white pt-3 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                  {trimmed.replace(/^##\s+/, '')}
                </h3>
              );
            }

            // Bullet points (- or *)
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              const text = trimmed.replace(/^[-*]\s+/, '');
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="text-xs sm:text-sm leading-relaxed text-zinc-800 dark:text-zinc-200" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(text) }} />
                </div>
              );
            }

            // Numbered list (1. 2. 3.)
            if (/^\d+\.\s+/.test(trimmed)) {
              const num = trimmed.match(/^(\d+)\.\s+/)?.[1] || '1';
              const text = trimmed.replace(/^\d+\.\s+/, '');
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2">
                  <span className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {num}
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed text-zinc-800 dark:text-zinc-200" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(text) }} />
                </div>
              );
            }

            // Table row separator or markdown table row
            if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
              if (trimmed.includes('---')) return null; // Table separator line
              const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
              return (
                <div key={lIdx} className="grid grid-flow-col auto-cols-fr gap-2 py-1 px-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg text-xs font-mono border border-zinc-200/50 dark:border-zinc-800">
                  {cells.map((c, cIdx) => (
                    <div key={cIdx} className="truncate" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(c) }} />
                  ))}
                </div>
              );
            }

            return (
              <p key={lIdx} className="text-xs sm:text-sm leading-relaxed text-zinc-800 dark:text-zinc-200" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
            );
          })}
        </div>
      );
    });
  };

  // Helper for inline markdown like **bold**, `code`, and links
  const formatInlineMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-zinc-950 dark:text-white">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold border border-emerald-200/60 dark:border-emerald-800/60">$1</code>');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-fade-in pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950 text-white p-6 sm:p-7 shadow-xl border border-zinc-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-black">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>{isKhmer ? 'ជំនួយការឆ្លាតវៃ CIIS AI' : 'CIIS AI Assistant'}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Chat
                  </span>
                </h1>
                <p className="text-xs text-zinc-400">
                  {isKhmer
                    ? 'ឆ្លើយតបរាល់សំណួរទាក់ទងនឹង Microsoft Excel, Word, PowerPoint, និងប្រព័ន្ធសាលា CIIS'
                    : 'Real-time AI teacher assistant for Microsoft Excel, Word, PowerPoint & CIIS School System'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Status & Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300">
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span className="font-bold">{activeModel}</span>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-zinc-800/90 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800/60 border border-zinc-700/60 text-xs font-bold text-zinc-300 transition-all cursor-pointer shadow-sm active:scale-95"
                title={isKhmer ? 'សម្អាតប្រវត្តិសន្ទនា' : 'Clear Chat History'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'សម្អាតការសន្ទនា' : 'Clear Chat'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Category Filter Pills */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
            {isKhmer ? 'ប្រធានបទ៖' : 'Focus:'}
          </span>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/40 hover:text-white'
                }`}
              >
                {cat.icon}
                <span>{isKhmer ? cat.labelKm : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Chat Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col min-h-[580px] max-h-[780px]">
        {/* Messages Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Welcome Screen when empty */}
          {messages.length === 0 && (
            <div className="py-6 sm:py-8 space-y-6 animate-fade-slide-up">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                  <Bot className="w-7 h-7" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                  {isKhmer ? `សួស្តី ${currentUser?.fullName || 'លោកគ្រូ អ្នកគ្រូ'}!` : `Hello, ${currentUser?.fullName || 'Teacher'}!`}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {isKhmer
                    ? 'ខ្ញុំអាចជួយលោកអ្នកពន្យល់រូបមន្ត Excel, បង្កើតលំហាត់, រៀបចំឯកសារ Word & PowerPoint, ឬណែនាំការប្រើប្រាស់ប្រព័ន្ធសាលា CIIS។'
                    : 'I can assist you with Excel formulas, creating student exercises, Microsoft Word formatting, PowerPoint slides, and navigating the CIIS school system.'}
                </p>
              </div>

              {/* Starter Quick Cards */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    {isKhmer ? 'សំណួរគំរូពេញនិយម (Suggested Prompts)' : 'Suggested Starter Prompts'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => handleSelectPrompt(prompt)}
                      className="group p-4 rounded-2xl bg-zinc-50 hover:bg-emerald-50/50 dark:bg-zinc-800/50 dark:hover:bg-emerald-950/20 border border-zinc-200/80 hover:border-emerald-300 dark:border-zinc-800 dark:hover:border-emerald-800 text-left transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold uppercase">
                            {isKhmer ? prompt.badgeKm : prompt.badgeEn}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {isKhmer ? prompt.titleKm : prompt.titleEn}
                        </h4>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {isKhmer ? prompt.promptKm : prompt.promptEn}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Message List */}
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isCopied = copiedMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-slide-up`}
              >
                {/* Assistant Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 flex items-center justify-center shrink-0 shadow-md font-black mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`relative group max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm shadow-2xs ${
                    isUser
                      ? 'bg-zinc-900 text-white dark:bg-emerald-600 dark:text-white rounded-tr-md'
                      : msg.isError
                      ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 rounded-tl-md'
                      : 'bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-100 rounded-tl-md'
                  }`}
                >
                  {/* Assistant Header info */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-zinc-200/60 dark:border-zinc-700/60 text-[11px] text-zinc-400">
                      <span className="font-bold text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                        <span>CIIS AI</span>
                        {msg.modelUsed && (
                          <span className="px-1.5 py-0.2 rounded bg-zinc-200/70 dark:bg-zinc-700/70 text-[9px] font-mono text-zinc-600 dark:text-zinc-300">
                            {msg.modelUsed}
                          </span>
                        )}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="flex items-center gap-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded bg-zinc-200/50 dark:bg-zinc-700/50 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        title={isKhmer ? 'ចម្លងអត្ថបទ' : 'Copy answer'}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] text-emerald-500 font-bold">{isKhmer ? 'បានចម្លង' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">{isKhmer ? 'ចម្លង' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="leading-relaxed break-words">
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      renderFormattedContent(msg.content)
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className={`mt-2 text-[10px] ${isUser ? 'text-zinc-400 dark:text-emerald-200 text-right' : 'text-zinc-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-zinc-800 dark:bg-zinc-700 text-white flex items-center justify-center shrink-0 shadow-md font-bold text-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Thinking / Typing indicator */}
          {isSending && (
            <div className="flex gap-3 sm:gap-4 items-start animate-fade-in">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 flex items-center justify-center shrink-0 shadow-md font-black">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 rounded-3xl rounded-tl-md px-5 py-4 text-xs shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                  <span>{isKhmer ? 'CIIS AI កំពុងវិភាគ និងសរសេរចម្លើយ...' : 'CIIS AI is thinking and generating response...'}</span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. Quick Suggested Actions if relevant */}
        {setActiveTab && (
          <div className="px-4 py-2 bg-zinc-50/80 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">
              {isKhmer ? 'ផ្លូវកាត់ប្រព័ន្ធ៖' : 'System Shortcuts:'}
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('excel')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Table className="w-3 h-3 text-emerald-500" />
              <span>{isKhmer ? 'លំហាត់ Excel' : 'Excel Lab'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('typing')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Keyboard className="w-3 h-3 text-teal-500" />
              <span>{isKhmer ? 'តេស្តវាយអក្សរ' : 'Typing Test'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('attendance')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3 text-blue-500" />
              <span>{isKhmer ? 'ស្រង់វត្តមាន' : 'Attendance'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('classes')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <School className="w-3 h-3 text-purple-500" />
              <span>{isKhmer ? 'បញ្ជីថ្នាក់រៀន' : 'Classes'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('laptops')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{isKhmer ? 'កុំព្យូទ័រ Laptop' : 'Lab Laptops'}</span>
            </button>
          </div>
        )}

        {/* 5. Input Bar */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2 sm:gap-3"
          >
            <div className="flex-1 relative rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus-within:border-emerald-500 dark:focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={
                  isKhmer
                    ? 'សួរសំណួរអំពី Excel, Word, PowerPoint, ឬប្រព័ន្ធ CIIS (ចុច Enter ដើម្បីផ្ញើ)...'
                    : 'Ask anything about Excel formulas, MS Word, PowerPoint, or CIIS system (Enter to send)...'
                }
                className="w-full px-4 py-3 bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 resize-none outline-none max-h-40 leading-relaxed font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              className={`p-3.5 rounded-2xl font-black transition-all flex items-center justify-center shrink-0 shadow-md ${
                !inputValue.trim() || isSending
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/20 active:scale-95 cursor-pointer'
              }`}
              title={isKhmer ? 'ផ្ញើសំណួរ' : 'Send Message'}
            >
              {isSending ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 px-1">
            <span>
              {isKhmer ? 'ចុច Enter ដើម្បីផ្ញើ • Shift + Enter ដើម្បីចុះបន្ទាត់ថ្មី' : 'Press Enter to send • Shift + Enter for new line'}
            </span>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              Powered by Google Gemini
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AIAssistantPage;
