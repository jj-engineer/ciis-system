/**
 * ====================================================================
 * AI Excel Service — Google Gemini Vision Integration
 * ====================================================================
 * Analyzes uploaded Excel exercise images, detects worksheet structure,
 * highlighted areas, generates exact Excel formulas, verifies math,
 * and provides step-by-step student instructions & teacher notes.
 * ====================================================================
 */

/**
 * Validates base64 / mime type image input
 */
export function validateImagePayload(base64Data, mimeType) {
  if (!base64Data || typeof base64Data !== 'string') {
    throw new Error('Image data is required (base64 encoded).');
  }

  const validMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
  const cleanMime = (mimeType || 'image/jpeg').toLowerCase();

  if (!validMimes.includes(cleanMime)) {
    throw new Error(`Unsupported image format "${mimeType}". Please upload PNG, JPG, or JPEG.`);
  }

  // Calculate approximate byte size from base64 string
  const cleanBase64 = base64Data.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
  const approximateSizeBytes = (cleanBase64.length * 3) / 4;
  const maxSizeBytes = 15 * 1024 * 1024; // 15MB limit

  if (approximateSizeBytes > maxSizeBytes) {
    throw new Error('Image file is too large (maximum size is 15MB). Please upload a smaller image.');
  }

  return {
    cleanBase64,
    mimeType: cleanMime
  };
}

/**
 * Performs independent programmatic math verification for standard arithmetic formulas
 */
export function verifyCalculationProgrammatically(calc) {
  try {
    if (!calc || !calc.formula) return { verified: false, reason: 'No formula' };

    const mathExpr = calc.mathExpression || '';

    // Strip currency symbols and whitespace like "$", "៛", "€", "£", ","
    const cleanedExpr = mathExpr.replace(/[\$\u17DB\u20AC\u00A3]/g, '');

    // Match 2-term arithmetic like "50 * 15", "50 × 15.00", "100 + 25", "750 - 15"
    const match = cleanedExpr.match(/([\d.,]+)\s*([*×x+\-\/])\s*([\d.,]+)/i);
    if (match) {
      const num1 = parseFloat(match[1].replace(/,/g, ''));
      const op = match[2];
      const num2 = parseFloat(match[3].replace(/,/g, ''));

      if (!isNaN(num1) && !isNaN(num2)) {
        let expectedNum = 0;
        if (op === '*' || op === '×' || op === 'x' || op === 'X') {
          expectedNum = num1 * num2;
        } else if (op === '+') {
          expectedNum = num1 + num2;
        } else if (op === '-') {
          expectedNum = num1 - num2;
        } else if (op === '/') {
          expectedNum = num2 !== 0 ? num1 / num2 : 0;
        }

        // Compare with numericResult or parsed expectedResult
        let targetNum = calc.numericResult;
        if (typeof targetNum !== 'number' && calc.expectedResult) {
          const parsedTarget = parseFloat(String(calc.expectedResult).replace(/[^\d.-]/g, ''));
          if (!isNaN(parsedTarget)) targetNum = parsedTarget;
        }

        if (typeof targetNum === 'number') {
          const diff = Math.abs(expectedNum - targetNum);
          const isMatch = diff < 0.01;
          return {
            verified: true,
            isMatch,
            computedValue: Math.round(expectedNum * 100) / 100
          };
        }

        return {
          verified: true,
          isMatch: true,
          computedValue: Math.round(expectedNum * 100) / 100
        };
      }
    }

    return { verified: false, reason: 'Complex formula or non-arithmetic' };
  } catch {
    return { verified: false, reason: 'Evaluation error' };
  }
}

/**
 * Build System & User Instructions for Gemini Vision based on Solve Mode
 */
function buildPrompt(solveMode) {
  let modeInstruction = '';
  switch (solveMode) {
    case 'highlighted':
      modeInstruction = 'PRIORITY: Focus specifically on YELLOW or HIGHLIGHTED task areas, rows, columns, or cells in the worksheet. Solve those target calculations first.';
      break;
    case 'explain':
      modeInstruction = 'PRIORITY: Focus on explaining the formulas and calculations in depth. Explain why each formula is constructed that way and break down its logic.';
      break;
    case 'check':
      modeInstruction = 'PRIORITY: Carefully inspect any existing student answers or results displayed in the image. Compare each visible number with the exact mathematical result to flag errors or discrepancies.';
      break;
    case 'step_by_step':
      modeInstruction = 'PRIORITY: Provide clear, beginner-friendly step-by-step click/type instructions for how a student completes each step in Microsoft Excel.';
      break;
    case 'all':
    default:
      modeInstruction = 'PRIORITY: Analyze the entire worksheet, detect all calculation tasks, highlighted areas, headers, formulas, expected results, and provide step-by-step guidance.';
      break;
  }

  return `You are an expert AI Excel Problem Solver & Teaching Assistant for CIIS International School.
Analyze the provided Excel worksheet exercise image thoroughly.

${modeInstruction}

IMPORTANT RULES:
1. Understand the spreadsheet layout: detect column letters (A, B, C, D, E, F, etc.) and row numbers (1, 2, 3, 4, 5, 6, etc.).
2. Infer exact cell coordinates whenever possible (e.g. Quantity is in D6, Unit Price is in E6, Total is in F6 -> formula is '=D6*E6').
3. Detect visual highlighting: yellow cells, yellow columns, yellow rows, or exercise target areas. Never assume every yellow cell is automatically a calculation area; combine visual and semantic evidence.
4. Support standard Excel functions: SUM, AVERAGE, COUNT, COUNTA, COUNTIF, COUNTIFS, SUMIF, SUMIFS, MAX, MIN, IF, IFS, AND, OR, ROUND, RANK, VLOOKUP, XLOOKUP, INDEX/MATCH, arithmetic operations (+, -, *, /).
5. Always keep Excel formulas in standard Excel syntax (e.g. '=SUM(F6:F15)', '=D6*E6'). DO NOT translate Excel formula names into Khmer.
6. The worksheet may contain Khmer, English, or Khmer + English instructions. Detect the dominant language and provide clear explanations (if Khmer is prominent, provide Khmer explanations where appropriate, keeping formula names in English).
7. If student answers are visible in the image, compare the expected result with the student's visible answer. If there is a mismatch, identify it in the errors section.
8. If any coordinate or number is blurry or unreadable, explicitly state uncertainty rather than inventing false information.
9. Provide fill-down drag instructions (e.g. "Drag fill handle from F6 down to F15").
10. Provide teacher notes with common student mistakes and pedagogical advice.

Return your response ONLY as a single valid JSON object with the following schema:
{
  "problem": "Brief description of the exercise task and objective",
  "language": "km" | "en" | "mixed",
  "dominantLanguage": "Khmer" | "English",
  "detectedTable": {
    "title": "Optional table title",
    "headers": ["Customer", "Item", "Qty", "Unit Price", "Total", "Discount", "Payment"],
    "columns": [
      {"col": "A", "header": "No"},
      {"col": "B", "header": "Customer Name"},
      {"col": "C", "header": "Item"},
      {"col": "D", "header": "Qty"},
      {"col": "E", "header": "Unit Price"},
      {"col": "F", "header": "Total", "isHighlighted": true},
      {"col": "G", "header": "Discount", "isHighlighted": true},
      {"col": "H", "header": "Payment", "isHighlighted": true}
    ],
    "sampleRows": [
      {
        "row": 6,
        "cells": {
          "B": "Sok Dara",
          "C": "Coca Cola",
          "D": "50",
          "E": "$15.00",
          "F": "$750.00",
          "G": "2%",
          "H": "$735.00"
        }
      }
    ]
  },
  "taskAreas": [
    {
      "area": "F6:F15",
      "name": "Total Column",
      "type": "yellow_highlighted_column",
      "description": "Calculate Total by multiplying Quantity (D) by Unit Price (E)"
    }
  ],
  "calculations": [
    {
      "id": "calc-1",
      "cell": "F6",
      "targetColumn": "Total",
      "row": 6,
      "formula": "=D6*E6",
      "operation": "multiplication",
      "meaning": "D6 (Quantity) × E6 (Unit Price) = F6 (Total)",
      "mathExpression": "50 × $15.00 = $750.00",
      "expectedResult": "$750.00",
      "numericResult": 750,
      "imageResult": "$750.00",
      "status": "correct",
      "explanation": "The Total is calculated by multiplying Quantity (D6) by Unit Price (E6).",
      "steps": [
        "Select cell F6.",
        "Type '=' to begin the formula.",
        "Click cell D6 or type D6.",
        "Type '*'.",
        "Click cell E6 or type E6.",
        "Press Enter."
      ],
      "fillDown": {
        "applicable": true,
        "targetRange": "F6:F15",
        "instruction": "After entering the formula in F6, select F6 and drag the fill handle at the bottom-right corner down to F15."
      },
      "confidence": "high",
      "confidenceNote": "Coordinates and numbers are clearly readable."
    }
  ],
  "errors": [
    {
      "cell": "H8",
      "type": "discrepancy",
      "description": "Calculated payment is $735.00, but image displays $738.75.",
      "cause": "Possible rounding error or incorrect percentage deduction."
    }
  ],
  "teachingNotes": {
    "summary": "Key pedagogical points for teaching this exercise",
    "commonMistakes": [
      "Confusing discount percentage with discount amount.",
      "Writing hardcoded numbers instead of dynamic cell references."
    ],
    "pedagogicalTips": [
      "Show students how relative references update automatically when dragged down."
    ]
  },
  "overallConfidence": "high",
  "notes": "Worksheet structure and instructions analyzed successfully."
}`;
}

/**
 * Call Gemini API with fallback models
 */
async function callGeminiApi(apiKey, modelName, promptText, imageBase64, mimeType) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: promptText
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      topP: 0.95,
      responseMimeType: 'application/json'
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson = null;
      try {
        errorJson = JSON.parse(errorText);
      } catch {}

      const errorMsg = errorJson?.error?.message || response.statusText || 'Gemini API Error';
      const statusCode = response.status;

      return {
        success: false,
        statusCode,
        errorMsg
      };
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        success: false,
        statusCode: 500,
        errorMsg: 'Gemini returned an empty response. Please try with a clearer image.'
      };
    }

    return {
      success: true,
      rawText: text
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        statusCode: 408,
        errorMsg: 'Gemini analysis request timed out. Please try again with a smaller or clearer image.'
      };
    }
    return {
      success: false,
      statusCode: 500,
      errorMsg: err.message || 'Network error while contacting Gemini API'
    };
  }
}

/**
 * Sanitize and validate the structured JSON returned by Gemini
 */
function sanitizeAnalysisOutput(rawJson) {
  let parsed = null;
  if (typeof rawJson === 'string') {
    // Strip markdown code fences if present
    const cleaned = rawJson
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();
    parsed = JSON.parse(cleaned);
  } else if (typeof rawJson === 'object' && rawJson !== null) {
    parsed = rawJson;
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Failed to parse structured JSON from AI model response.');
  }

  // Ensure required arrays and objects exist
  const result = {
    problem: parsed.problem || 'Excel Exercise Analysis',
    language: parsed.language || 'en',
    dominantLanguage: parsed.dominantLanguage || 'English',
    detectedTable: parsed.detectedTable || {
      headers: [],
      columns: [],
      sampleRows: []
    },
    taskAreas: Array.isArray(parsed.taskAreas) ? parsed.taskAreas : [],
    calculations: Array.isArray(parsed.calculations) ? parsed.calculations : [],
    errors: Array.isArray(parsed.errors) ? parsed.errors : [],
    teachingNotes: parsed.teachingNotes || {
      summary: '',
      commonMistakes: [],
      pedagogicalTips: []
    },
    overallConfidence: parsed.overallConfidence || 'high',
    notes: parsed.notes || ''
  };

  // Enhance calculations with programmatic math verification
  result.calculations = result.calculations.map((calc, idx) => {
    const enriched = {
      id: calc.id || `calc-${idx + 1}`,
      cell: calc.cell || `Cell ${idx + 1}`,
      targetColumn: calc.targetColumn || '',
      row: calc.row || 1,
      formula: calc.formula || '',
      operation: calc.operation || 'formula',
      meaning: calc.meaning || '',
      mathExpression: calc.mathExpression || '',
      expectedResult: calc.expectedResult != null ? String(calc.expectedResult) : '',
      numericResult: typeof calc.numericResult === 'number' ? calc.numericResult : null,
      imageResult: calc.imageResult != null ? String(calc.imageResult) : '',
      status: calc.status || 'correct',
      explanation: calc.explanation || '',
      steps: Array.isArray(calc.steps) ? calc.steps : [],
      fillDown: calc.fillDown || { applicable: false, instruction: '' },
      confidence: calc.confidence || 'high',
      confidenceNote: calc.confidenceNote || ''
    };

    // Run programmatic math verification
    const mathVerify = verifyCalculationProgrammatically(enriched);
    enriched.programmaticVerification = mathVerify;

    return enriched;
  });

  return result;
}

/**
 * Helper: sleep for a given number of milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Call Gemini API with retry + exponential backoff for rate limits (429)
 */
async function callGeminiApiWithRetry(apiKey, modelName, promptText, imageBase64, mimeType, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await callGeminiApi(apiKey, modelName, promptText, imageBase64, mimeType);

    if (result.success) {
      return result;
    }

    // If rate limited and we have retries left, wait with exponential backoff
    if (result.statusCode === 429 && attempt < maxRetries) {
      const delayMs = Math.min(2000 * Math.pow(2, attempt), 16000); // 2s, 4s, 8s, max 16s
      await sleep(delayMs);
      continue;
    }

    // For non-retryable errors or last attempt, return the error
    return result;
  }
}

/**
 * Main Analysis Entry Point
 */
export async function analyzeExcelImage({ base64Data, mimeType, solveMode = 'all' }) {
  // 1. Validate Image Payload
  const { cleanBase64, mimeType: validatedMime } = validateImagePayload(base64Data, mimeType);

  // 2. Check API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key') {
    return {
      success: false,
      error: 'GEMINI_API_KEY_MISSING',
      message: 'Gemini API key is not configured on the server. Please add GEMINI_API_KEY to your server environment or .env file.'
    };
  }

  // 3. Build Prompt
  const promptText = buildPrompt(solveMode);

  // 4. Candidate Models (in priority order)
  const configuredModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const modelsToTry = [
    configuredModel,
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ];

  // Remove duplicates
  const uniqueModels = [...new Set(modelsToTry)];

  let lastError = null;
  let allRateLimited = true;

  for (const model of uniqueModels) {
    // Use retry with backoff — each model gets up to 3 retries for 429 errors
    const apiResult = await callGeminiApiWithRetry(apiKey.trim(), model, promptText, cleanBase64, validatedMime, 3);

    if (apiResult.success) {
      try {
        const structuredData = sanitizeAnalysisOutput(apiResult.rawText);
        return {
          success: true,
          modelUsed: model,
          data: structuredData
        };
      } catch (parseErr) {
        lastError = `Failed to parse structured model response: ${parseErr.message}`;
        allRateLimited = false;
        // continue to next model if JSON was malformed
      }
    } else {
      lastError = apiResult.errorMsg;

      // If invalid API key (400 or 403), do not retry with other models
      if (apiResult.statusCode === 400 && apiResult.errorMsg.toLowerCase().includes('api key')) {
        return {
          success: false,
          error: 'INVALID_API_KEY',
          message: 'The configured Gemini API key is invalid. Please verify your GEMINI_API_KEY in the server .env file.'
        };
      }

      // If rate limited (429), try the next fallback model instead of giving up
      if (apiResult.statusCode === 429) {
        // allRateLimited stays true — continue to next model
        continue;
      }

      allRateLimited = false;
    }
  }

  // If every model was rate limited after all retries
  if (allRateLimited) {
    return {
      success: false,
      error: 'RATE_LIMITED',
      message: 'Gemini API rate limit exceeded across all models. Please wait 1-2 minutes and try again.'
    };
  }

  return {
    success: false,
    error: 'ANALYSIS_FAILED',
    message: lastError || 'AI analysis could not be completed for this image. Please upload a clearer screenshot or try again.'
  };
}
