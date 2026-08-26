import { analyzeExcelImage } from '../../../backend/src/aiExcelService.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
  maxDuration: 60,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {}
    }

    body = body || {};
    const base64Data = body.image || body.base64Data || body.file;
    const mimeType = body.mimeType || 'image/jpeg';
    const solveMode = body.solveMode || body.mode || 'all';

    if (!base64Data) {
      return res.status(400).json({
        success: false,
        error: 'NO_IMAGE_PROVIDED',
        message: 'Please upload an Excel exercise image.'
      });
    }

    const result = await analyzeExcelImage({
      base64Data,
      mimeType,
      solveMode
    });

    if (result.success) {
      return res.status(200).json(result);
    } else {
      const statusCode =
        result.error === 'INVALID_API_KEY'
          ? 401
          : result.error === 'RATE_LIMITED'
          ? 429
          : result.error === 'GEMINI_API_KEY_MISSING'
          ? 503
          : 400;
      return res.status(statusCode).json(result);
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: err.message || 'An unexpected error occurred during AI analysis.'
    });
  }
}
