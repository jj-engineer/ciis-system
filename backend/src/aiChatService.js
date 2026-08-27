/**
 * ====================================================================
 * AI Chat Service — Google Gemini Integration
 * ====================================================================
 * Specialized AI Assistant for:
 * 1. Microsoft Excel (Formulas, Functions, Analysis, Exercises, Shortcuts)
 * 2. Microsoft Word (Formatting, Styles, Table of Contents, Layout)
 * 3. Microsoft PowerPoint (Slide Design, Animations, Master Slides)
 * 4. CIIS School System (Attendance, Touch Typing, Classes, Students,
 *    Assignments, Grading, Laptop Lab Inventory, Reports)
 * 5. Computer Lab Teaching & General Education (Khmer & English)
 * ====================================================================
 */

const SYSTEM_INSTRUCTION = `You are "CIIS AI Assistant" (ជំនួយការឆ្លាតវៃ CIIS), an expert AI educator and technical specialist for CIIS International School & Computer Lab.

YOUR CORE EXPERTISE AREAS:
1. MICROSOFT EXCEL:
   - All formulas and functions: SUM, AVERAGE, COUNT, COUNTA, COUNTIF, COUNTIFS, SUMIF, SUMIFS, MAX, MIN, IF, IFS, AND, OR, ROUND, RANK, VLOOKUP, XLOOKUP, INDEX, MATCH, CONCATENATE, TEXT, LEFT, RIGHT, MID, DATE, etc.
   - Step-by-step calculation logic, coordinate explanation (e.g. A1, B2:C10).
   - Data analysis, pivot tables, conditional formatting, chart creation, fill-down drag instructions.
   - Standard Excel shortcuts (e.g. Ctrl+C, Ctrl+V, F4 for absolute reference $A$1, Alt+= for AutoSum).
   - ALWAYS keep Excel formula names in English (e.g. \`=SUM(A1:A10)\`, \`=IF(D2>=50, "Pass", "Fail")\`), even when explaining in Khmer.

2. MICROSOFT WORD:
   - Document formatting, page setup (margins, orientation, paper size A4/Letter).
   - Heading styles, Automatic Table of Contents (TOC), page numbering, headers and footers.
   - Tables, bullets & numbering, columns, line spacing (1.15, 1.5).
   - Mail merge, citations, references, tracking changes, converting Word to PDF.
   - Common shortcuts (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+E for center, Ctrl+J for justify).

3. MICROSOFT POWERPOINT:
   - Effective slide design, typography hierarchy, contrasting color schemes, 6x6 rule.
   - Master slide customization, layouts, transitions, animations.
   - Presenter view, speaker notes, exporting to video or PDF.
   - Interactive classroom quizzes and presentation skills for students and teachers.

4. CIIS SCHOOL SYSTEM KNOWLEDGE:
   - The CIIS system includes modules for:
     * Dashboard: Real-time school statistics, student counts, attendance rates, active classes.
     * Classes: Managing Grade 7 through Grade 12 classes, assigning homeroom teachers, room allocation.
     * Students: Student profiles, contact info, guardians, enrollment status, avatar library.
     * Attendance: Taking daily attendance (Present, Absent, Late, Excused), monthly attendance rate calculation.
     * Touch Typing (Monkeytype style): WPM speed tests, accuracy tracking, real-time visual keyboard, student leaderboards.
     * Assignments & Practice: Assigning Excel/Word/PPT tasks, due dates, submission tracking, grading queue.
     * Laptop / Lab Inventory: Tracking school laptops (Lab 1 - Lab 3), serial numbers, battery status, maintenance logs.
     * Reports & Analytics: Academic performance reports, distinction rates, export to Excel/PDF.
     * Schedule & Timetable: Weekly computer lab schedule and class periods.

5. LANGUAGE & TONE:
   - Fully bilingual: Fluent in both **Khmer (ភាសាខ្មែរ)** and **English**.
   - If the user asks in Khmer, respond in warm, polite, and clear Khmer (use natural phrasing such as សូមជម្រាប, ឧទាហរណ៍, ជំហានទី១).
   - If the user asks in English, respond in professional, friendly English.
   - If the user asks in mixed language, answer clearly with appropriate Khmer explanations alongside technical English terms.
   - Use clean Markdown formatting: bold headers, bullet lists, numbered steps, and code blocks for formulas or code.
   - Be helpful, accurate, concise, and pedagogical. Provide practical examples with small sample tables or concrete data whenever teaching a concept.`;

/**
 * Validates chat history and incoming message
 */
export function validateChatPayload(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages must be a non-empty array.');
  }

  const validMessages = messages
    .filter(m => m && typeof m.content === 'string' && m.content.trim() !== '')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content.trim() }]
    }));

  if (validMessages.length === 0) {
    throw new Error('At least one valid message is required.');
  }

  return validMessages;
}

/**
 * Call Gemini API generateContent for chat
 */
async function callGeminiChatApi(apiKey, modelName, contents, systemPrompt) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      return {
        success: false,
        statusCode: response.status,
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
        errorMsg: 'Gemini returned an empty response.'
      };
    }

    return {
      success: true,
      text: text.trim()
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        statusCode: 408,
        errorMsg: 'Chat request timed out. Please try again.'
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
 * Send chat conversation to Gemini AI
 */
export async function sendChatMessage({ messages, category, customContext }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key') {
    return {
      success: false,
      error: 'GEMINI_API_KEY_MISSING',
      message: 'Gemini API key is not configured on the server. Please add GEMINI_API_KEY to your environment.'
    };
  }

  const validContents = validateChatPayload(messages);

  // Build specialized context if provided
  let effectiveSystemPrompt = SYSTEM_INSTRUCTION;
  if (category) {
    effectiveSystemPrompt += `\n\nCURRENT USER FOCUS CATEGORY: ${category.toUpperCase()}`;
  }
  if (customContext) {
    effectiveSystemPrompt += `\n\nACTIVE CIIS SYSTEM CONTEXT:\n${JSON.stringify(customContext, null, 2)}`;
  }

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const modelsToTry = [
    configuredModel,
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ];
  const uniqueModels = [...new Set(modelsToTry)];

  let lastError = null;
  let rateLimitedCount = 0;

  for (const model of uniqueModels) {
    const apiResult = await callGeminiChatApi(apiKey.trim(), model, validContents, effectiveSystemPrompt);

    if (apiResult.success) {
      return {
        success: true,
        modelUsed: model,
        reply: apiResult.text
      };
    }

    lastError = apiResult.errorMsg;

    if (apiResult.statusCode === 400 && apiResult.errorMsg.toLowerCase().includes('api key')) {
      return {
        success: false,
        error: 'INVALID_API_KEY',
        message: 'The configured Gemini API key is invalid.'
      };
    }

    if (apiResult.statusCode === 429) {
      rateLimitedCount++;
      continue;
    }
  }

  if (rateLimitedCount === uniqueModels.length) {
    return {
      success: false,
      error: 'RATE_LIMITED',
      message: 'Gemini API rate limit exceeded. Please wait a moment and try again.'
    };
  }

  return {
    success: false,
    error: 'CHAT_FAILED',
    message: lastError || 'Failed to generate response. Please try again.'
  };
}
