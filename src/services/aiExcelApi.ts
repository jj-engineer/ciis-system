/**
 * ====================================================================
 * AI Excel API Client & TypeScript Interfaces
 * ====================================================================
 * Connects frontend with backend /api/ai/excel/analyze (Gemini Vision)
 * ====================================================================
 */

export type SolveMode = 'all' | 'highlighted' | 'explain' | 'check' | 'step_by_step';

export interface DetectedColumn {
  col: string;
  header: string;
  isHighlighted?: boolean;
}

export interface DetectedTableRow {
  row: number;
  cells: Record<string, string>;
}

export interface DetectedTable {
  title?: string;
  headers: string[];
  columns?: DetectedColumn[];
  sampleRows: DetectedTableRow[];
}

export interface TaskArea {
  area: string;
  name?: string;
  type: string;
  description: string;
}

export interface CalculationFillDown {
  applicable: boolean;
  targetRange?: string;
  instruction: string;
}

export interface ProgrammaticVerification {
  verified: boolean;
  isMatch?: boolean;
  computedValue?: number;
  reason?: string;
}

export interface CalculationItem {
  id: string;
  cell: string;
  targetColumn?: string;
  row?: number;
  formula: string;
  operation?: string;
  meaning?: string;
  mathExpression?: string;
  expectedResult: string;
  numericResult?: number | null;
  imageResult?: string;
  status: 'correct' | 'discrepancy' | 'unverified' | 'error' | string;
  explanation: string;
  steps: string[];
  fillDown?: CalculationFillDown;
  confidence: 'high' | 'medium' | 'low' | string;
  confidenceNote?: string;
  programmaticVerification?: ProgrammaticVerification;
}

export interface ErrorItem {
  cell?: string;
  type: string;
  description: string;
  cause?: string;
}

export interface TeachingNotes {
  summary: string;
  commonMistakes: string[];
  pedagogicalTips: string[];
}

export interface ExcelAnalysisResult {
  problem: string;
  language: 'km' | 'en' | 'mixed' | string;
  dominantLanguage: string;
  detectedTable: DetectedTable;
  taskAreas: TaskArea[];
  calculations: CalculationItem[];
  errors: ErrorItem[];
  teachingNotes: TeachingNotes;
  overallConfidence: 'high' | 'medium' | 'low' | string;
  notes: string;
}

export interface AIExcelApiResponse {
  success: boolean;
  modelUsed?: string;
  data?: ExcelAnalysisResult;
  error?: string;
  message?: string;
}

export interface AIExcelStatusResponse {
  success: boolean;
  configured: boolean;
  model?: string;
}

/**
 * Determine best API base URL (Vite proxy /api or direct port 4001)
 */
function getApiUrl(endpoint: string): string {
  // If running in development with Vite or in browser on LAN
  return endpoint;
}

/**
 * Convert browser File or Blob to base64
 */
export function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = file.type || 'image/jpeg';
      resolve({ base64: result, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Check backend Gemini AI service status
 */
export async function checkAIExcelStatus(): Promise<AIExcelStatusResponse> {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const urls = isHttps
    ? ['/api/ai/excel/status']
    : ['/api/ai/excel/status', `http://${window.location.hostname}:4001/api/ai/excel/status`];

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
 * Analyze an Excel image file via the backend Gemini Vision endpoint
 */
export async function analyzeExcelImageFile(
  file: File,
  solveMode: SolveMode = 'all'
): Promise<AIExcelApiResponse> {
  const { base64, mimeType } = await fileToBase64(file);

  const payload = {
    image: base64,
    mimeType,
    solveMode
  };

  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const urls = isHttps
    ? ['/api/ai/excel/analyze']
    : ['/api/ai/excel/analyze', `http://${window.location.hostname}:4001/api/ai/excel/analyze`];

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
    message:
      lastError?.message ||
      'Unable to connect to the AI service. Please verify your internet connection or GEMINI_API_KEY settings.'
  };
}

