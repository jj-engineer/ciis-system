// Curated Word Banks, Quotes, and Generators for Monkeytype Typing Engine

export type TypingLanguage = 'english' | 'english1k' | 'khmer' | 'code' | 'computer';
export type QuoteLength = 'all' | 'short' | 'medium' | 'long';

export interface QuoteItem {
  id: string;
  text: string;
  source: string;
  length: 'short' | 'medium' | 'long';
}

export const ENGLISH_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'great', 'between', 'need', 'large', 'under', 'never', 'world', 'school', 'still', 'try',
  'last', 'call', 'keep', 'student', 'system', 'program', 'small', 'group', 'always', 'feel'
];

export const ENGLISH_1K = [
  ...ENGLISH_WORDS,
  'develop', 'industry', 'consider', 'position', 'experience', 'technology', 'keyboard', 'computer',
  'practice', 'education', 'challenge', 'progress', 'knowledge', 'accuracy', 'mastery', 'speed',
  'management', 'software', 'hardware', 'interface', 'variable', 'function', 'database', 'network',
  'algorithm', 'performance', 'document', 'formula', 'worksheet', 'calculation', 'statistics',
  'achievement', 'continuous', 'discipline', 'inspiration', 'internal', 'community', 'solution',
  'efficient', 'structure', 'operation', 'workspace', 'assignment', 'laboratory', 'evaluation',
  'creativity', 'standard', 'precision', 'navigation', 'platform', 'framework', 'intelligence'
];

export const KHMER_WORDS = [
  'សាលារៀន', 'កុំព្យូទ័រ', 'ក្តារចុច', 'វាយអក្សរ', 'សិស្ស', 'គ្រូបង្រៀន', 'មេរៀន', 'កិច្ចការ',
  'ល្បឿន', 'ភាពត្រឹមត្រូវ', 'ចំណេះដឹង', 'បច្ចេកវិទ្យា', 'អ៊ីនធឺណិត', 'ប្រព័ន្ធ', 'ឯកសារ', 'រូបភាព',
  'កម្មវិធី', 'ការងារ', 'អនុវត្ត', 'ជោគជ័យ', 'អភិវឌ្ឍន៍', 'សមត្ថភាព', 'ការរៀន', 'ការចងចាំ',
  'បន្ទប់កុំព្យូទ័រ', 'តារាង', 'រូបមន្ត', 'គណនា', 'ទិន្នន័យ', 'ព័ត៌មាន', 'ពិន្ទុ', 'ប្រឡង',
  'ការអនុវត្ត', 'ចំណាត់ថ្នាក់', 'វឌ្ឍនភាព', 'ការតស៊ូ', 'ការបង្កើតថ្មី', 'អនាគត', 'ភាពឆ្លាតវៃ'
];

export const CODE_WORDS = [
  'const', 'let', 'var', 'function', 'return', 'async', 'await', 'import', 'export',
  'class', 'interface', 'type', 'boolean', 'string', 'number', 'array', 'object',
  'Promise', 'try', 'catch', 'finally', 'map', 'filter', 'reduce', 'forEach',
  'useState', 'useEffect', 'useRef', 'useCallback', 'useMemo', 'React', 'Component',
  'if', 'else', 'switch', 'case', 'break', 'default', 'while', 'for', 'of', 'in',
  'null', 'undefined', 'true', 'false', 'throw', 'new', 'this', 'super', 'extends'
];

export const COMPUTER_WORDS = [
  'excel', 'word', 'powerpoint', 'formula', 'vlookup', 'xlookup', 'sum', 'average',
  'countif', 'concatenate', 'pivot', 'worksheet', 'column', 'header', 'shortcut',
  'keyboard', 'monitor', 'processor', 'storage', 'ram', 'motherboard', 'database',
  'network', 'ethernet', 'browser', 'security', 'password', 'folder', 'desktop'
];

export const QUOTES: QuoteItem[] = [
  {
    id: 'q1',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    source: 'Winston Churchill',
    length: 'short'
  },
  {
    id: 'q2',
    text: 'The only way to do great work is to love what you do.',
    source: 'Steve Jobs',
    length: 'short'
  },
  {
    id: 'q3',
    text: 'Knowledge is power. Information is liberating. Education is the premise of progress, in every society, in every family.',
    source: 'Kofi Annan',
    length: 'medium'
  },
  {
    id: 'q4',
    text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
    source: 'Mahatma Gandhi',
    length: 'short'
  },
  {
    id: 'q5',
    text: 'Simplicity is the soul of efficiency. Practice brings accuracy, and accuracy leads to unmatched speed in all technological craftsmanship.',
    source: 'Austin Freeman',
    length: 'medium'
  },
  {
    id: 'q6',
    text: 'Computers are magnificent tools for the realization of our dreams, but no machine can replace the human spark of spirit, compassion, and tireless determination to learn.',
    source: 'Grace Hopper',
    length: 'long'
  },
  {
    id: 'q7',
    text: 'Practice does not make perfect. Only perfect practice makes perfect. Focus on pristine accuracy first, and rapid speed will follow naturally.',
    source: 'Vince Lombardi',
    length: 'medium'
  }
];

export function generateMonkeytypeWords(options: {
  language: TypingLanguage;
  count?: number;
  punctuation?: boolean;
  numbers?: boolean;
  customWordPool?: string[];
}): string {
  const {
    language = 'english',
    count = 50,
    punctuation = false,
    numbers = false,
    customWordPool
  } = options;

  let pool: string[];
  if (customWordPool && customWordPool.length > 0) {
    pool = customWordPool;
  } else {
    switch (language) {
      case 'english1k':
        pool = ENGLISH_1K;
        break;
      case 'khmer':
        pool = KHMER_WORDS;
        break;
      case 'code':
        pool = CODE_WORDS;
        break;
      case 'computer':
        pool = COMPUTER_WORDS;
        break;
      case 'english':
      default:
        pool = ENGLISH_WORDS;
        break;
    }
  }

  const resultWords: string[] = [];
  const punctSymbols = ['.', ',', '!', '?', ';', ':', '-', '"', "'"];

  for (let i = 0; i < count; i++) {
    // Occasionally insert numbers if enabled
    if (numbers && Math.random() < 0.12 && language !== 'khmer') {
      const num = Math.floor(Math.random() * 999) + 1;
      resultWords.push(num.toString());
      continue;
    }

    let word = pool[Math.floor(Math.random() * pool.length)];

    // Apply punctuation if enabled
    if (punctuation && language !== 'khmer') {
      const rand = Math.random();
      if (rand < 0.1) {
        // Capitalize first letter
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      if (rand < 0.15) {
        const symbol = punctSymbols[Math.floor(Math.random() * punctSymbols.length)];
        if (symbol === '"' || symbol === "'") {
          word = `${symbol}${word}${symbol}`;
        } else {
          word = `${word}${symbol}`;
        }
      }
    }

    resultWords.push(word);
  }

  return resultWords.join(' ');
}

export function getRandomQuote(lengthFilter: QuoteLength = 'all'): QuoteItem {
  const matching = lengthFilter === 'all'
    ? QUOTES
    : QUOTES.filter(q => q.length === lengthFilter);
  const pool = matching.length > 0 ? matching : QUOTES;
  return pool[Math.floor(Math.random() * pool.length)];
}
