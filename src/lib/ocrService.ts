import { createWorker } from 'tesseract.js';
import { OCRProgress } from '@/types';

export async function recognizeEnglishText(
  imageSource: string | File | Blob,
  onProgress?: (progress: OCRProgress) => void
): Promise<{ text: string; confidence: number; isUnclear: boolean }> {
  try {
    onProgress?.({
      stage: 'reading',
      percent: 15,
      message: 'Reading English text...',
    });

    const worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const p = Math.round(15 + m.progress * 65);
          onProgress?.({
            stage: 'reading',
            percent: p,
            message: `Reading English text (${Math.round(m.progress * 100)}%)...`,
          });
        }
      },
    });

    const ret = await worker.recognize(imageSource);
    await worker.terminate();

    onProgress?.({
      stage: 'understanding',
      percent: 85,
      message: 'Understanding English paragraphs & formatting...',
    });

    let rawText = ret.data.text || '';
    const confidence = ret.data.confidence || 0;

    // Clean up OCR text while preserving paragraphs
    rawText = rawText
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Check if valid English text was detected
    const englishLetters = (rawText.match(/[a-zA-Z]/g) || []).length;
    const isUnclear = englishLetters < 4 || confidence < 40;

    return {
      text: rawText,
      confidence,
      isUnclear,
    };
  } catch (err) {
    console.error('OCR Error:', err);
    throw new Error('We couldn’t read this image. Try taking a clearer photo with better lighting.');
  }
}
