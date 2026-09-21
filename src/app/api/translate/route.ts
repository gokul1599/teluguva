import { NextRequest, NextResponse } from 'next/server';
import { translateEnglishToTelugu } from '@/lib/translationEngine';
import { TranslationResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, preferSimple } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'దయచేసి అనువదించడానికి ఆంగ్ల పాఠ్యాన్ని నమోదు చేయండి (Please enter English text to translate).' },
        { status: 400 }
      );
    }

    const trimmed = text.trim();
    if (trimmed.length > 25000) {
      return NextResponse.json(
        { error: 'పాఠ్య పరిమాణం చాలా ఎక్కువగా ఉంది. దయచేసి చిన్న భాగాలుగా అనువదించండి.' },
        { status: 400 }
      );
    }

    // 1. Check if GEMINI_API_KEY is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `You are TELUGUVA, an empathetic, premium English to Telugu AI translator specifically designed for Telugu speakers, parents, and older family members.
Your goal is to make English easy, respectful, and natural to understand.

Translate this English text into Telugu:
"${trimmed}"

Rules:
1. Provide TWO translations:
   - "teluguNatural": Fluent, grammatically accurate, respectful Telugu.
   - "teluguSimple": Conversational, extremely simple Telugu avoiding heavy Sanskritized or complex formal words (e.g., instead of "సమర్పించవలసిన పత్రాలు", use "ఇవ్వాల్సిన కాగితాలు"; instead of "విద్యుత్", use "కరెంట్").
2. Preserve numbers, dates, times, currency (₹, Rs, $), URLs, names, and account numbers accurately.
3. Determine category: 'bill' | 'notice' | 'school' | 'bank' | 'medical' | 'general' | 'conversation'.
4. "explanation": One clear sentence in simple Telugu explaining what the user needs to know or do.
5. "isOfficialNotice": true if it is a government, banking, legal, school, or medical document/bill.
6. "wordBreakdowns": An array of 1 to 4 key English words with their Telugu meaning, phonetic sound, and simple meaning.

Respond strictly with valid JSON only in this exact format:
{
  "teluguNatural": "...",
  "teluguSimple": "...",
  "category": "...",
  "explanation": "...",
  "isOfficialNotice": true/false,
  "wordBreakdowns": [
    {
      "word": "postpone",
      "telugu": "వాయిదా వేయడం",
      "phonetic": "పోస్ట్‌పోన్",
      "simpleMeaning": "తరువాతి సమయానికి మార్చడం",
      "exampleEnglish": "...",
      "exampleTelugu": "..."
    }
  ]
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
            signal: AbortSignal.timeout(10000),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const result: TranslationResult = {
              id: 'tr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
              englishText: trimmed,
              teluguNatural: parsed.teluguNatural || '',
              teluguSimple: parsed.teluguSimple || parsed.teluguNatural || '',
              category: parsed.category || 'general',
              explanation: parsed.explanation || '',
              wordBreakdowns: parsed.wordBreakdowns || [],
              timestamp: Date.now(),
              isOfficialNotice: Boolean(parsed.isOfficialNotice),
            };
            return NextResponse.json(result);
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to built-in translation engine:', geminiError);
      }
    }

    // 2. Built-in contextual autonomous translation engine
    const localResult = await translateEnglishToTelugu(trimmed, { preferSimple });
    return NextResponse.json(localResult);
  } catch (err: unknown) {
    console.error('Translation error:', err);
    return NextResponse.json(
      { error: 'అనువాదం పూర్తి కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి (Translation could not be completed. Please try again).' },
      { status: 500 }
    );
  }
}
