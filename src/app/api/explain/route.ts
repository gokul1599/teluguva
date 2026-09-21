import { NextRequest, NextResponse } from 'next/server';
import { lookupWord } from '@/lib/dictionary';

export async function POST(req: NextRequest) {
  try {
    const { word, context } = await req.json();

    if (!word || typeof word !== 'string') {
      return NextResponse.json({ error: 'Word is required' }, { status: 400 });
    }

    const cleanWord = word.trim().toLowerCase();

    // 1. Check local dictionary
    const dictionaryMatch = lookupWord(cleanWord);
    if (dictionaryMatch) {
      return NextResponse.json(dictionaryMatch);
    }

    // 2. If Gemini API key is present, generate deep word explanation
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `Explain the English word "${cleanWord}" (in the context of: "${context || 'general'}") for a Telugu speaker.
Format JSON only:
{
  "word": "${cleanWord}",
  "telugu": "తెలుగు అర్థం",
  "phonetic": "తెలుగులో పలికే విధానం",
  "simpleMeaning": "తెలుగులో ఒక సులభమైన వివరణ",
  "exampleEnglish": "Simple English example",
  "exampleTelugu": "ఉదాహరణ వాక్యం తెలుగులో"
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
            signal: AbortSignal.timeout(6000),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text);
          return NextResponse.json(parsed);
        }
      } catch (err) {
        console.warn('Explain Gemini error:', err);
      }
    }

    // Fallback response
    return NextResponse.json({
      word: cleanWord,
      telugu: cleanWord,
      phonetic: cleanWord,
      simpleMeaning: 'ఈ పదం సాధారణ వాడుకలో ఉన్న ఆంగ్ల పదం.',
      exampleEnglish: `Please check the meaning of ${cleanWord}.`,
      exampleTelugu: `దయచేసి ఈ పదం అర్థాన్ని గమనించండి.`,
    });
  } catch (err: unknown) {
    console.error('Explain error:', err);
    return NextResponse.json({ error: 'Failed to explain word' }, { status: 500 });
  }
}
