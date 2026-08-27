import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
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
  Send,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  ArrowRight
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
  const [, setErrorMessage] = useState<string | null>(null);

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
            ? `[Error] មិនអាចទទួលបានចម្លើយទេ៖ ${response.message || 'សូមព្យាយាមម្តងទៀត។'}`
            : `[Error] Unable to generate response: ${response.message || 'Please try again.'}`,
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
          ? `[Error] បញ្ហាក្នុងការតភ្ជាប់៖ ${err.message || 'សូមពិនិត្យមើលបណ្តាញអ៊ីនធឺណិត។'}`
          : `[Error] Connection error: ${err.message || 'Please verify your network connection.'}`,
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
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  // Key press listener
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clean category definitions (no emoji, clean text labels)
  const categories: { id: ChatCategory; labelKm: string; labelEn: string }[] = [
    { id: 'all', labelKm: 'ទាំងអស់', labelEn: 'All' },
    { id: 'excel', labelKm: 'Excel', labelEn: 'Excel' },
    { id: 'word', labelKm: 'MS Word', labelEn: 'Word' },
    { id: 'ppt', labelKm: 'PowerPoint', labelEn: 'PowerPoint' },
    { id: 'system', labelKm: 'ប្រព័ន្ធ CIIS', labelEn: 'CIIS System' },
    { id: 'typing', labelKm: 'វាយអក្សរ', labelEn: 'Typing' },
  ];

  // Helper: Clean Markdown Formatter without bold overload
  const renderFormattedContent = (content: string) => {
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
          <div key={index} className="my-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
              <span className="uppercase tracking-wider text-slate-300">{lang}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(codeBody)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px]"
              >
                <Copy className="w-3 h-3" />
                <span>{isKhmer ? 'ចម្លង' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 overflow-x-auto font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
              <code>{codeBody}</code>
            </pre>
          </div>
        );
      }

      // Normal text
      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-1">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={lIdx} className="h-0.5" />;

            // Header (### or ##)
            if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
              const cleanTitle = trimmed.replace(/^#{2,3}\s+/, '');
              return (
                <h4 key={lIdx} className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 pt-2 pb-0.5">
                  {cleanTitle}
                </h4>
              );
            }

            // Bullet points (- or *)
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              const text = trimmed.replace(/^[-*]\s+/, '');
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-1">
                  <span className="text-slate-400 select-none mt-0.5 text-xs">•</span>
                  <span className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(text) }} />
                </div>
              );
            }

            // Numbered list (1. 2. 3.)
            if (/^\d+\.\s+/.test(trimmed)) {
              const match = trimmed.match(/^(\d+)\.\s+(.*)/);
              const num = match?.[1] || '1';
              const text = match?.[2] || trimmed;
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-1">
                  <span className="text-slate-500 font-mono text-xs select-none mt-0.5">{num}.</span>
                  <span className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(text) }} />
                </div>
              );
            }

            // Simple table
            if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
              if (trimmed.includes('---')) return null;
              const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
              return (
                <div key={lIdx} className="grid grid-flow-col auto-cols-fr gap-2 py-1 px-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs font-mono border border-slate-200/60 dark:border-slate-800">
                  {cells.map((c, cIdx) => (
                    <div key={cIdx} className="truncate" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(c) }} />
                  ))}
                </div>
              );
            }

            return (
              <p key={lIdx} className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
            );
          })}
        </div>
      );
    });
  };

  // Helper for inline markdown: subtle font-medium instead of heavy font-black
  const formatInlineMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold text-slate-900 dark:text-slate-100">$1</span>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px] border border-slate-200 dark:border-slate-700">$1</code>');
  };

  return (
    <div className="space-y-4">
      {/* 1. Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isKhmer ? 'ជំនួយការ AI' : 'CIIS AI Assistant'}
            </h1>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {isConfigured ? `Online (${activeModel})` : 'Offline'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'ឆ្លើយតបសំណួរទាក់ទងនឹង Microsoft Excel, Word, PowerPoint, និងប្រព័ន្ធសាលា CIIS'
              : 'AI Assistant for Microsoft Excel, Word, PowerPoint, and CIIS School System'}
          </p>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isKhmer ? 'សម្អាតការសន្ទនា' : 'Clear Chat'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Category Navigation (Simple, clean pills without extra icons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        <span className="text-slate-400 font-mono text-[11px] mr-1 select-none">Topic:</span>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {isKhmer ? cat.labelKm : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* 3. Main Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col min-h-[540px] max-h-[760px]">
        {/* Messages Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Welcome screen when empty */}
          {messages.length === 0 && (
            <div className="py-6 space-y-6">
              <div className="space-y-1 max-w-xl">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isKhmer ? `សួស្តី ${currentUser?.fullName || ''}` : `Hello, ${currentUser?.fullName || 'User'}`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {isKhmer
                    ? 'ជ្រើសរើសប្រធានបទ ឬវាយសំណួររបស់អ្នកខាងក្រោម ដើម្បីសាកសួរអំពីរូបមន្ត Excel, ការប្រើប្រាស់ Word, PowerPoint, ឬប្រព័ន្ធគ្រប់គ្រងសាលា CIIS។'
                    : 'Choose a starter question below or type your query in the chat to ask about Excel formulas, Word, PowerPoint, or CIIS system modules.'}
                </p>
              </div>

              {/* Starter Quick Cards (Clean, readable, no emojis) */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  {isKhmer ? 'សំណួរគំរូ [Suggestions]' : 'Suggested Questions:'}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => handleSelectPrompt(prompt)}
                      className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors cursor-pointer flex flex-col justify-between gap-2.5 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>[{isKhmer ? prompt.badgeKm : prompt.badgeEn}]</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                          {isKhmer ? prompt.titleKm : prompt.titleEn}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {isKhmer ? prompt.promptKm : prompt.promptEn}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages Thread */}
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isCopied = copiedMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-xl p-4 text-xs sm:text-sm ${
                    isUser
                      ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white'
                      : msg.isError
                      ? 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                      : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {/* Assistant Header Info */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200/80 dark:border-slate-700 text-[11px] text-slate-400 font-mono">
                      <span>CIIS AI</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700 text-[10px]"
                        title={isKhmer ? 'ចម្លង' : 'Copy'}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{isKhmer ? 'បានចម្លង' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{isKhmer ? 'ចម្លង' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Content */}
                  <div className="leading-relaxed break-words">
                    {isUser ? (
                      <p className="whitespace-pre-wrap font-normal">{msg.content}</p>
                    ) : (
                      renderFormattedContent(msg.content)
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className={`mt-2 text-[10px] font-mono ${isUser ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Thinking Indicator */}
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-600 dark:text-slate-300" />
                <span>{isKhmer ? 'កំពុងបង្កើតចម្លើយ...' : 'Generating response...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. Quick System Navigation Bar (Simple text links) */}
        {setActiveTab && (
          <div className="px-4 py-2 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-mono text-slate-400 shrink-0">Quick Link:</span>
            <button
              type="button"
              onClick={() => setActiveTab('excel')}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 cursor-pointer font-medium"
            >
              {isKhmer ? 'លំហាត់ Excel' : 'Excel Lab'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('typing')}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 cursor-pointer font-medium"
            >
              {isKhmer ? 'តេស្តវាយអក្សរ' : 'Typing Test'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('attendance')}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 cursor-pointer font-medium"
            >
              {isKhmer ? 'ស្រង់វត្តមាន' : 'Attendance'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('classes')}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 cursor-pointer font-medium"
            >
              {isKhmer ? 'បញ្ជីថ្នាក់រៀន' : 'Classes'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('laptops')}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 cursor-pointer font-medium"
            >
              {isKhmer ? 'កុំព្យូទ័រ Laptop' : 'Lab Laptops'}
            </button>
          </div>
        )}

        {/* 5. Clean Input Bar */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-slate-400 dark:focus-within:border-slate-500 transition-colors">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={
                  isKhmer
                    ? 'សួរសំណួរអំពី Excel, Word, PowerPoint, ឬប្រព័ន្ធ CIIS (ចុច Enter ដើម្បីផ្ញើ)...'
                    : 'Ask anything about Excel, Word, PowerPoint, or CIIS system (Enter to send)...'
                }
                className="w-full px-3.5 py-2.5 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-none outline-none max-h-36 leading-relaxed font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              className={`p-2.5 rounded-xl transition-colors flex items-center justify-center shrink-0 ${
                !inputValue.trim() || isSending
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 cursor-pointer'
              }`}
              title={isKhmer ? 'ផ្ញើ' : 'Send'}
            >
              {isSending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
            <span>
              {isKhmer ? 'Enter ដើម្បីផ្ញើ • Shift + Enter ដើម្បីចុះបន្ទាត់' : 'Enter to send • Shift + Enter for new line'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AIAssistantPage;
