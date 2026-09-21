import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { question, englishText, teluguText } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const qLower = question.toLowerCase();
    const engLower = (englishText || '').toLowerCase();

    // 1. Try Gemini if configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `You are the TELUGUVA AI Assistant, helping a Telugu user/parent understand an English notice or document.
Document English: "${englishText || ''}"
Document Telugu: "${teluguText || ''}"

User's Question: "${question}"

Respond warmly, respectfully, and clearly in conversational Telugu.
Keep it under 3-4 sentences so elders and busy people can immediately understand what action to take.
Include an optional 1-line English summary at the bottom.`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
            signal: AbortSignal.timeout(8000),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (answer) {
            return NextResponse.json({ answer });
          }
        }
      } catch (err) {
        console.warn('Chat Gemini API error:', err);
      }
    }

    // 2. Intelligent Contextual Answers for Common Questions
    let answer = '';

    if (qLower.includes('what should i do') || qLower.includes('ఏం చేయాలి') || qLower.includes('action')) {
      if (engLower.includes('bill') || engLower.includes('pay') || engLower.includes('due')) {
        answer = 'మీరు ఇచ్చిన గడువు తేదీ లోపు సంబంధిత బిల్లు మొత్తాన్ని ఆన్‌లైన్‌లో లేదా కార్యాలయంలో చెల్లించాలి. ఆలస్యం చేయవద్దు.';
      } else if (engLower.includes('document') || engLower.includes('submit')) {
        answer = 'అడిగిన ముఖ్యమైన పత్రాలు లేదా సర్టిఫికెట్ల జిరాక్స్ ప్రతులను సిద్ధం చేసుకొని ఇచ్చిన సమయానికి అందజేయాలి.';
      } else if (engLower.includes('otp') || engLower.includes('bank')) {
        answer = 'ఇది రహస్యమైన ఓటీపీ కోడ్. దీన్ని ఎవరికీ ఫోన్‌లో లేదా మెసేజ్‌లో చెప్పకండి. మీ బ్యాంక్ ఖాతా భద్రత కోసం ఇది అవసరం.';
      } else if (engLower.includes('appointment') || engLower.includes('doctor')) {
        answer = 'ఖరారైన సమయానికి ఒక 15 నిమిషాల ముందే హాస్పిటల్ లేదా డాక్టర్ వద్దకు చేరుకోండి.';
      } else {
        answer = 'ఇందులో పేర్కొన్న సూచనలను అనుసరించండి. ముఖ్యమైన వివరాలను ఒకసారి కుటుంబ సభ్యులతో కూడా పంచుకోవచ్చు.';
      }
    } else if (qLower.includes('important') || qLower.includes('ముఖ్యమైన') || qLower.includes('urgent')) {
      if (engLower.includes('due') || engLower.includes('urgent') || engLower.includes('mandatory') || engLower.includes('deadline')) {
        answer = 'అవును, ఇది చాలా ముఖ్యమైనది! ఇందులో గడువు తేదీ లేదా తప్పనిసరి నియమం ఉంది కాబట్టి వెంటనే దృష్టి పెట్టాలి.';
      } else {
        answer = 'ఇది సాధారణ సమాచారం లేదా నోటీసు. అవసరమైనప్పుడు ఒకసారి చదివి తెలుసుకుంటే సరిపోతుంది.';
      }
    } else if (qLower.includes('date') || qLower.includes('deadline') || qLower.includes('తేదీ')) {
      // Find date in text
      const dateMatch = (englishText || '').match(/(?:due\s+on\s+|deadline\s+is\s+|date:\s*)([A-Za-z0-9\s,]+)/i);
      if (dateMatch) {
        answer = `ఇందులో పేర్కొన్న ముఖ్యమైన తేదీ: "${dateMatch[1].trim()}". ఈ తేదీ లోపే పని పూర్తి చేయాలి.`;
      } else {
        answer = 'పత్రంలో ఇచ్చిన తేదీలను జాగ్రత్తగా గమనించండి. సాధారణంగా గడువు తేదీకి 2-3 రోజుల ముందే సిద్ధం చేసుకోవడం మంచిది.';
      }
    } else {
      answer = `ఈ సందేశం ముఖ్య ఉద్దేశం: "${teluguText || 'ఇందులో ఇచ్చిన సమాచారాన్ని సులభంగా అర్థం చేసుకోండి'}". మీకు ఇంకా ఏవైనా సందేహాలు ఉంటే అడగవచ్చు.`;
    }

    return NextResponse.json({ answer });
  } catch (err: unknown) {
    console.error('Chat error:', err);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}
