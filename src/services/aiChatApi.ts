/**
 * ====================================================================
 * AI Chat API Service & TypeScript Interfaces
 * ====================================================================
 * Connects frontend with backend /api/ai/chat (Google Gemini)
 * Specialized in Excel, Word, PowerPoint, CIIS School System & Education
 * ====================================================================
 */

export type ChatCategory = 'all' | 'excel' | 'word' | 'ppt' | 'system' | 'typing';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  category?: ChatCategory;
  modelUsed?: string;
  isError?: boolean;
}

export interface SendChatPayload {
  messages: {
    role: 'user' | 'assistant';
    content: string;
  }[];
  category?: ChatCategory;
  customContext?: any;
}

export interface AIChatResponse {
  success: boolean;
  reply?: string;
  modelUsed?: string;
  error?: string;
  message?: string;
}

export interface AIChatStatusResponse {
  success: boolean;
  configured: boolean;
  model?: string;
}

export interface QuickPrompt {
  id: string;
  icon: string;
  category: ChatCategory;
  titleKm: string;
  titleEn: string;
  promptKm: string;
  promptEn: string;
  badgeKm: string;
  badgeEn: string;
}

export const STARTER_PROMPTS: QuickPrompt[] = [
  {
    id: 'p1',
    icon: 'Table',
    category: 'excel',
    titleKm: 'របៀបប្រើរូបមន្ត VLOOKUP & XLOOKUP',
    titleEn: 'How to use VLOOKUP & XLOOKUP',
    promptKm: 'សូមពន្យល់ពីរបៀបប្រើរូបមន្ត VLOOKUP និង XLOOKUP ក្នុង Excel ជាមួយនឹងឧទាហរណ៍ជាក់ស្តែង និងរូបមន្តជាភាសាអង់គ្លេស។',
    promptEn: 'Please explain how to use VLOOKUP and XLOOKUP in Microsoft Excel with clear step-by-step examples.',
    badgeKm: 'Excel',
    badgeEn: 'Excel'
  },
  {
    id: 'p2',
    icon: 'Calculator',
    category: 'excel',
    titleKm: 'គណនាពិន្ទុសរុប មធ្យមភាគ និងចំណាត់ថ្នាក់សិស្ស',
    titleEn: 'Calculate Total, Average & Student Rank',
    promptKm: 'សូមបង្ហាញរូបមន្ត Excel សម្រាប់គណនា៖ ពិន្ទុសរុប (SUM), មធ្យមភាគ (AVERAGE), ចំណាត់ថ្នាក់ (RANK), និងនិទ្ទេស (IF/IFS)។',
    promptEn: 'Show me Excel formulas to calculate Total (SUM), Average (AVERAGE), Rank (RANK), and Letter Grade (IF/IFS) for a student grade sheet.',
    badgeKm: 'Excel រូបមន្ត',
    badgeEn: 'Excel Formulas'
  },
  {
    id: 'p3',
    icon: 'FileText',
    category: 'word',
    titleKm: 'របៀបបង្កើត មាតិការស្វ័យប្រវត្តិ (Table of Contents)',
    titleEn: 'Create Automatic Table of Contents in Word',
    promptKm: 'តើត្រូវធ្វើដូចម្តេចដើម្បីបង្កើត Table of Contents ដោយស្វ័យប្រវត្តិតាមរយៈ Heading 1, Heading 2 ក្នុង Microsoft Word?',
    promptEn: 'How do I generate an automatic Table of Contents using Heading 1 and Heading 2 styles in Microsoft Word?',
    badgeKm: 'MS Word',
    badgeEn: 'MS Word'
  },
  {
    id: 'p4',
    icon: 'Presentation',
    category: 'ppt',
    titleKm: 'គន្លឹះរចនាស្លាយ PowerPoint ឲ្យទាក់ទាញ',
    titleEn: 'Best Practices for Engaging PowerPoint Slides',
    promptKm: 'សូមផ្តល់គន្លឹះ និងក្បួន 6x6 ក្នុងការរចនាស្លាយ PowerPoint ឲ្យមានភាពទាក់ទាញ វិជ្ជាជីវៈ និងងាយស្រួលបង្រៀនសិស្ស។',
    promptEn: 'Please provide best practices and the 6x6 rule for designing professional, engaging PowerPoint presentations for teaching.',
    badgeKm: 'PowerPoint',
    badgeEn: 'PowerPoint'
  },
  {
    id: 'p5',
    icon: 'Keyboard',
    category: 'typing',
    titleKm: 'វិធីសាស្រ្តបង្កើនល្បឿនវាយអក្សរ (Touch Typing)',
    titleEn: 'Techniques to Boost Typing Speed (WPM)',
    promptKm: 'សូមណែនាំវិធីសាស្រ្តអនុវត្ត Touch Typing (Home Row, Finger placement) ដើម្បីបង្កើនល្បឿន WPM និងភាពសុក្រឹតលើ Monkeytype។',
    promptEn: 'What are the best techniques for students to practice Touch Typing (home row, finger placement) and increase their WPM on Monkeytype?',
    badgeKm: 'Touch Typing',
    badgeEn: 'Touch Typing'
  },
  {
    id: 'p6',
    icon: 'School',
    category: 'system',
    titleKm: 'របៀបកត់ត្រាវត្តមាន និងគ្រប់គ្រងថ្នាក់រៀនក្នុង CIIS',
    titleEn: 'How to Record Attendance & Manage Classes in CIIS',
    promptKm: 'សូមពន្យល់ពីរបៀបប្រើប្រាស់ប្រព័ន្ធ CIIS ដើម្បីស្រង់វត្តមានសិស្សប្រចាំថ្ងៃ និងពិនិត្យមើលរបាយការណ៍វត្តមាន។',
    promptEn: 'How do I use the CIIS system to record daily student attendance, track late arrivals, and generate attendance reports?',
    badgeKm: 'ប្រព័ន្ធ CIIS',
    badgeEn: 'CIIS System'
  }
];

const STORAGE_KEY = 'ciis_ai_chat_history_v1';

/**
 * Check backend Gemini AI service status
 */
export async function checkAIChatStatus(): Promise<AIChatStatusResponse> {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const urls = isHttps
    ? ['/api/ai/status', '/api/ai/excel/status']
    : ['/api/ai/status', `http://${window.location.hostname}:4001/api/ai/status`, '/api/ai/excel/status'];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // try next
    }
  }

  return { success: false, configured: false };
}

/**
 * Send chat conversation to Gemini AI endpoint
 */
export async function sendAIChatMessage(payload: SendChatPayload): Promise<AIChatResponse> {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const urls = isHttps
    ? ['/api/ai/chat']
    : ['/api/ai/chat', `http://${window.location.hostname}:4001/api/ai/chat`];

  let lastError: Error | null = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        try {
          const errData = await response.json();
          return errData;
        } catch {
          lastError = new Error(`Server returned status ${response.status}`);
        }
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  return {
    success: false,
    error: 'NETWORK_ERROR',
    message: lastError?.message || 'Unable to connect to AI Chat server. Please verify your connection.'
  };
}

/**
 * Load chat history from LocalStorage
 */
export function loadChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Save chat history to LocalStorage
 */
export function saveChatHistory(messages: ChatMessage[]) {
  try {
    // Keep last 60 messages to prevent storage bloat
    const trimmed = messages.slice(-60);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Failed to save chat history', e);
  }
}

/**
 * Clear chat history from LocalStorage
 */
export function clearChatHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear chat history', e);
  }
}
