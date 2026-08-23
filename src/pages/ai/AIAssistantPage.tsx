import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import { AIService, AIServiceResponse } from '../../services/aiService';
import {
  Bot,
  Send,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Code,
  FileSpreadsheet,
  Users,
  Cpu
} from 'lucide-react';

interface AIAssistantPageProps {
  setActiveTab: (tab: string) => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const { isKhmer, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; data?: AIServiceResponse }>>([
    {
      sender: 'ai',
      text: isKhmer
        ? `សួស្តីលោកគ្រូ ${currentUser.fullName}! ខ្ញុំជា **ជំនួយការ AI សាលារៀនស៊ី អាយ អាយ អេស (CIIS)** សម្រាប់គ្រូបង្រៀន។ ខ្ញុំអាចជួយវិភាគវត្តមានសិស្ស បង្កើតលំហាត់ Excel ពិនិត្យកិច្ចការដែលមិនទាន់បានប្រគល់ និងពន្យល់រូបមន្តកុំព្យូទ័រជាភាសាខ្មែរ។`
        : `Hello Teacher ${currentUser.fullName}! I am your **CIIS AI Teaching Assistant** (Community Internal Inspiration School). I can help you analyze student attendance trends, generate Excel exercises, check pending submissions, and explain formulas in Khmer.`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = isKhmer
    ? [
        'តើសិស្សណាខ្លះមានអត្រាវត្តមានក្រោម ៨០%?',
        'តើសិស្សណាខ្លះមិនទាន់បានបញ្ជូនកិច្ចការ Excel?',
        'បង្កើតលំហាត់អនុវត្តរូបមន្ត COUNTIF សម្រាប់ថ្នាក់ទី ១០',
        'ពន្យល់ពីរបៀបប្រើរូបមន្ត COUNTIFS ជាភាសាខ្មែរ',
        'សង្ខេបលទ្ធផលសិក្សារបស់ថ្នាក់ 10A ប្រចាំខែនេះ'
      ]
    : [
        'Which students have attendance below 80%?',
        'Who has not submitted the Excel assignment?',
        'Create an Excel COUNTIF exercise for Grade 10.',
        'Explain COUNTIFS in Khmer with examples.',
        'Summarize Grade 10A\'s performance this month.'
      ];

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || query;
    if (!promptText.trim() || isLoading) return;

    setMessages(prev => [...prev, { sender: 'user', text: promptText }]);
    if (!textToSend) setQuery('');
    setIsLoading(true);

    setTimeout(async () => {
      const response = await AIService.processQuery(promptText);
      setMessages(prev => [...prev, { sender: 'ai', text: response.answer, data: response }]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-pink-700" />
            {t('title.ai_assistant', undefined, 'Teacher AI Assistant')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'ជំនួយការឆ្លាតវៃជួយវិភាគទិន្នន័យថ្នាក់រៀន រៀបចំមេរៀន និងពន្យល់រូបមន្តកុំព្យូទ័រ។'
              : 'AI Assistant for student attendance analytics, exercise generation, and curriculum planning.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" size="sm">
            <Cpu className="w-3 h-3 mr-1" />
            <span>AI Model v2.4</span>
          </Badge>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 block">
          {isKhmer ? 'សំណួរគំរូរហ័ស៖' : 'Quick Prompt Suggestions:'}
        </span>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-3 py-1.5 bg-white hover:bg-pink-50 hover:text-pink-700 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition-colors text-left"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm min-h-[360px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 text-xs ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-4 rounded-2xl max-w-xl leading-relaxed whitespace-pre-line ${
                m.sender === 'user'
                  ? 'bg-pink-700 text-white font-semibold'
                  : 'bg-slate-50 text-slate-800 border border-slate-200/80 shadow-xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold p-2">
            <Bot className="w-4 h-4 text-pink-600 animate-spin" />
            <span>{isKhmer ? 'AI កំពុងគិត និងវិភាគទិន្នន័យ...' : 'AI Assistant is thinking...'}</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={isKhmer ? 'សួរសំណួរទៅកាន់ជំនួយការ AI...' : 'Ask AI to generate exercise, check attendance...'}
          className="flex-1 px-4 py-3 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 shadow-xs"
        />
        <button
          onClick={() => handleSend()}
          className="p-3 bg-pink-700 hover:bg-pink-800 text-white rounded-2xl shadow-sm transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
