import { TranslationResult, WordBreakdown } from '@/types';
import { DICTIONARY, lookupWord } from './dictionary';

// Comprehensive pattern matchers for common life scenarios: bills, school, hospital, bank, transport, notices
interface TranslationRule {
  pattern: RegExp;
  natural: (match: RegExpMatchArray) => string;
  simple: (match: RegExpMatchArray) => string;
  explanation: string;
  category: TranslationResult['category'];
  isOfficial?: boolean;
}

export function toTeluguTerms(text: string): string {
  if (!text) return '';
  let res = text;
  const terms: Array<[RegExp, string]> = [
    // Days
    [/\bMonday\b/gi, 'సోమవారం'],
    [/\bTuesday\b/gi, 'మంగళవారం'],
    [/\bWednesday\b/gi, 'బుధవారం'],
    [/\bThursday\b/gi, 'గురువారం'],
    [/\bFriday\b/gi, 'శుక్రవారం'],
    [/\bSaturday\b/gi, 'శనివారం'],
    [/\bSunday\b/gi, 'ఆదివారం'],
    // Months
    [/\bJanuary\b/gi, 'జనవరి'],
    [/\bFebruary\b/gi, 'ఫిబ్రవరి'],
    [/\bMarch\b/gi, 'మార్చి'],
    [/\bApril\b/gi, 'ఏప్రిల్'],
    [/\bMay\b/gi, 'మే'],
    [/\bJune\b/gi, 'జూన్'],
    [/\bJuly\b/gi, 'జులై'],
    [/\bAugust\b/gi, 'ఆగస్టు'],
    [/\bSeptember\b/gi, 'సెప్టెంబర్'],
    [/\bOctober\b/gi, 'అక్టోబర్'],
    [/\bNovember\b/gi, 'నవంబర్'],
    [/\bDecember\b/gi, 'డిసెంబర్'],
    // Titles & Times
    [/\bDr\.?\s*/gi, 'డాక్టర్ '],
    [/\bAM\b/gi, 'ఉదయం'],
    [/\bPM\b/gi, 'సాయంత్రం'],
    [/\btomorrow\b/gi, 'రేపు'],
    [/\byesterday\b/gi, 'నిన్న'],
    [/\btoday\b/gi, 'ఈరోజు'],
    [/\belectricity\b/gi, 'కరెంట్'],
    [/\bbill\b/gi, 'బిల్లు'],
    [/\bmeeting\b/gi, 'సమావేశం'],
    [/\bclass\b/gi, 'తరగతి'],
    [/\bat\s+/gi, ''],
    [/\bon\s+/gi, ''],
    [/\bfor\s+/gi, ''],
    [/\bthe\s+/gi, ''],
  ];

  for (const [reg, te] of terms) {
    res = res.replace(reg, te);
  }
  return res;
}

const RULES: TranslationRule[] = [
  // Electricity / Utility Bill Due
  {
    pattern: /(?:your\s+)?electricity\s+bill\s+(?:is\s+)?due\s+on\s+([A-Za-z0-9\s,]+)\.?\s*(?:please\s+)?(?:make\s+the\s+payment|pay)\s+before\s+(?:the\s+)?due\s+date/i,
    natural: (m) => `మీ విద్యుత్ బిల్లు ${toTeluguTerms(m[1].trim())}న చెల్లించాల్సి ఉంది. దయచేసి గడువు తేదీకి ముందే చెల్లించండి.`,
    simple: (m) => `మీ కరెంట్ బిల్లును ${toTeluguTerms(m[1].trim())} లోపు చెల్లించాలి. ఆలస్యం చేయకుండా కట్టండి.`,
    explanation: 'కరెంట్ బిల్లు చెల్లించడానికి చివరి తేదీ దగ్గరపడుతోంది, ఆ తేదీ లోపు డబ్బులు కట్టాలి.',
    category: 'bill',
    isOfficial: true,
  },
  // Generic Bill Due on Date
  {
    pattern: /(?:your\s+)?([A-Za-z\s]+)\s+bill\s+(?:of\s+(?:rs\.?|inr|₹)\s*([\d,]+))?\s*(?:is\s+)?due\s+on\s+([A-Za-z0-9\s,]+)/i,
    natural: (m) => `మీ ${toTeluguTerms(m[1].trim())} బిల్లు ${m[2] ? `(రూ. ${m[2]}) ` : ''}${toTeluguTerms(m[3].trim())}న చెల్లించవలసి ఉంది.`,
    simple: (m) => `మీ ${toTeluguTerms(m[1].trim())} బిల్లు ${m[2] ? `రూపాయలు ${m[2]} ` : ''}${toTeluguTerms(m[3].trim())} లోపు కట్టాలి.`,
    explanation: 'ఇచ్చిన తేదీ లోపు బిల్లు డబ్బులు చెల్లించాలి.',
    category: 'bill',
    isOfficial: true,
  },
  // Appointment confirmed
  {
    pattern: /(?:your\s+)?appointment\s+(?:with\s+([A-Za-z0-9\s.]+))?\s*(?:is|has\s+been)\s+confirmed\s+for\s+([A-Za-z0-9\s,:]+)/i,
    natural: (m) => `మీ అపాయింట్‌మెంట్ ${m[1] ? `${toTeluguTerms(m[1].trim())} తో ` : ''}${toTeluguTerms(m[2].trim())} సమయానికి నిర్ధారించబడింది.`,
    simple: (m) => `మీ అపాయింట్‌మెంట్ ఖరారైంది. ${m[1] ? `${toTeluguTerms(m[1].trim())} గారిని ` : ''}${toTeluguTerms(m[2].trim())} సమయానికి కలవవచ్చు.`,
    explanation: 'మీరు డాక్టర్ లేదా అధికారిని కలవడానికి కోరిన సమయం ఆమోదించబడింది.',
    category: 'medical',
  },
  // Appointment is tomorrow
  {
    pattern: /(?:your\s+)?appointment\s+is\s+tomorrow(?:\s+at\s+([0-9:]+\s*(?:am|pm)?))?/i,
    natural: (m) => `మీ అపాయింట్‌మెంట్ రేపు ${m[1] ? `${toTeluguTerms(m[1])} కి ` : ''}ఉంది.`,
    simple: (m) => `రేపు ${m[1] ? `${toTeluguTerms(m[1])} కి ` : ''}మీరు వెళ్లాల్సి ఉంటుంది. మర్చిపోకండి.`,
    explanation: 'రేపటి రోజున మీరు కలవాల్సిన సమయం నిర్ణయించబడింది.',
    category: 'medical',
  },
  // Meeting postponed
  {
    pattern: /(?:the\s+)?meeting\s+has\s+been\s+postponed(?:\s+to\s+([A-Za-z0-9\s,]+))?/i,
    natural: (m) => `సమావేశం ${m[1] ? `${toTeluguTerms(m[1].trim())} తేదీకి ` : ''}వాయిదా పడింది.`,
    simple: (m) => `సమావేశం ఇప్పుడు జరగదు, ${m[1] ? `${toTeluguTerms(m[1].trim())} న ` : 'తరువాత తేదీకి '}మార్చారు.`,
    explanation: 'ముందుగా నిర్ణయించిన సమయానికి కాకుండా సమావేశాన్ని తరువాతి సమయానికి మార్చారు.',
    category: 'notice',
  },
  // Submit documents before deadline
  {
    pattern: /(?:please\s+)?submit\s+(?:your\s+)?documents?\s+before\s+(?:the\s+)?(?:deadline|due\s+date)\s*(?:of\s+([A-Za-z0-9\s,]+))?/i,
    natural: (m) => `దయచేసి మీ పత్రాలను ${m[1] ? `${toTeluguTerms(m[1].trim())} ` : ''}గడువు ముగిసేలోగా సమర్పించండి.`,
    simple: (m) => `మీ కాగితాలు ${m[1] ? `${toTeluguTerms(m[1].trim())} ` : ''}చివరి తేదీ లోపు ఇచ్చేయండి.`,
    explanation: 'అడిగిన ముఖ్యమైన పత్రాలను లేదా సర్టిఫికెట్లను ఆఖరి తేదీ దాటకముందే ఇవ్వాలి.',
    category: 'notice',
    isOfficial: true,
  },
  // Bank OTP / Confidential
  {
    pattern: /(?:otp|one\s+time\s+password)\s+is\s+([0-9]{4,8})\.?\s*(?:do\s+not\s+share\s+with\s+anyone)/i,
    natural: (m) => `మీ వన్ టైమ్ పాస్‌వర్డ్ (OTP) ${m[1]}. దీనిని ఎవరితోనూ పంచుకోవద్దు.`,
    simple: (m) => `మీ ఓటీపీ సంఖ్య: ${m[1]}. ఈ కోడ్‌ను ఎవరికీ చెప్పకండి.`,
    explanation: 'ఇది మీ బ్యాంక్ లేదా ఖాతా భద్రత కోసం వచ్చిన రహస్య కోడ్. ఎవరికీ ఇవ్వకూడదు.',
    category: 'bank',
    isOfficial: true,
  },
  // School holiday / closure
  {
    pattern: /(?:school|college)\s+(?:will\s+remain\s+|is\s+)?closed\s+(?:on|tomorrow|due\s+to\s+([A-Za-z0-9\s]+))/i,
    natural: () => `పాఠశాలకు సెలవు ప్రకటించబడింది.`,
    simple: () => `స్కూలుకు సెలవు ఇచ్చారు, పిల్లలు వెళ్లాల్సిన అవసరం లేదు.`,
    explanation: 'పాఠశాల ఆ రోజు పనిచేయదు అని నోటీస్ ఇచ్చారు.',
    category: 'school',
    isOfficial: true,
  },
  // Please take care of yourself
  {
    pattern: /please\s+take\s+care\s+of\s+yourself/i,
    natural: () => `దయచేసి మీ ఆరోగ్యం జాగ్రత్తగా చూసుకోండి.`,
    simple: () => `మీ ఆరోగ్యాన్ని జాగ్రత్తగా చూసుకోండి.`,
    explanation: 'ఎదుటి వ్యక్తి యోగక్షేమాలను ఆకాంక్షిస్తూ క్షేమంగా ఉండాలని చెప్పే పలకరింపు.',
    category: 'conversation',
  },
  // How are you / family
  {
    pattern: /how\s+are\s+you\s*(?:and\s+your\s+family)?/i,
    natural: () => `మీరు మరియు మీ కుటుంబ సభ్యులు ఎలా ఉన్నారు?`,
    simple: () => `బాగున్నారా? ఇంట్లో అందరూ క్షేమమేనా?`,
    explanation: 'కుటుంబ క్షేమ సమాచారాలను అడిగి తెలుసుకునే మర్యాదపూర్వక ప్రశ్న.',
    category: 'conversation',
  },
  // Thank you very much
  {
    pattern: /thank\s+you\s+(?:very\s+much|so\s+much)?/i,
    natural: () => `చాలా ధన్యవాదాలు.`,
    simple: () => `చాలా థాంక్స్ / మీకు నా కృతజ్ఞతలు.`,
    explanation: 'సహాయం చేసినందుకు కృతజ్ఞత తెలియజేయడం.',
    category: 'conversation',
  },
];

// Contextual dictionary replacement map for general sentences
const VOCABULARY_MAP: Record<string, { natural: string; simple: string }> = {
  'please': { natural: 'దయచేసి', simple: 'దయచేసి' },
  'submit': { natural: 'సమర్పించండి', simple: 'ఇవ్వండి' },
  'document': { natural: 'పత్రం', simple: 'కాగితం' },
  'documents': { natural: 'పత్రాలు', simple: 'కాగితాలు' },
  'appointment': { natural: 'ముందస్తు సమయం', simple: 'అపాయింట్‌మెంట్' },
  'confirmed': { natural: 'నిర్ధారించబడింది', simple: 'ఖరారైంది' },
  'cancelled': { natural: 'రద్దు చేయబడింది', simple: 'ఆగిపోయింది' },
  'postponed': { natural: 'వాయిదా పడింది', simple: 'తరువాత సమయానికి మార్చారు' },
  'mandatory': { natural: 'తప్పనిసరి', simple: 'ఖచ్చితంగా చేయాలి' },
  'urgent': { natural: 'అత్యవసరం', simple: 'వెంటనే చేయాల్సిన పని' },
  'notice': { natural: 'ప్రకటన', simple: 'సమాచారం' },
  'important': { natural: 'ముఖ్యమైనది', simple: 'చాలా ముఖ్యం' },
  'today': { natural: 'ఈరోజు', simple: 'ఈరోజు' },
  'tomorrow': { natural: 'రేపు', simple: 'రేపు' },
  'yesterday': { natural: 'నిన్న', simple: 'నిన్న' },
  'morning': { natural: 'ఉదయం', simple: 'పొద్దున్నే' },
  'evening': { natural: 'సాయంత్రం', simple: 'సాయంత్రం' },
  'night': { natural: 'రాత్రి', simple: 'రాత్రి' },
  'hospital': { natural: 'ఆసుపత్రి', simple: 'దవాఖానా' },
  'doctor': { natural: 'వైద్యులు', simple: 'డాక్టర్ గారు' },
  'medicine': { natural: 'ఔషధం', simple: 'మందు' },
  'medicines': { natural: 'మందులు', simple: 'మందులు' },
  'school': { natural: 'పాఠశాల', simple: 'స్కూలు' },
  'college': { natural: 'కళాశాల', simple: 'కాలేజీ' },
  'fee': { natural: 'రుసుము', simple: 'ఫీజు' },
  'fees': { natural: 'రుసుములు', simple: 'ఫీజులు' },
  'payment': { natural: 'చెల్లింపు', simple: 'డబ్బులు కట్టడం' },
  'money': { natural: 'ధనము', simple: 'డబ్బులు' },
  'bank': { natural: 'బ్యాంకు', simple: 'బ్యాంకు' },
  'account': { natural: 'ఖాతా', simple: 'అకౌంట్' },
  'success': { natural: 'విజయం', simple: 'విజయం' },
  'successful': { natural: 'విజయవంతమైంది', simple: 'పూర్తయింది' },
  'failed': { natural: 'విఫలమైంది', simple: 'ఫెయిల్ అయింది' },
  'error': { natural: 'లోపం', simple: 'తప్పు జరిగింది' },
  'welcome': { natural: 'స్వాగతం', simple: 'స్వాగతం' },
  'good morning': { natural: 'శుభోదయం', simple: 'నమస్కారం' },
  'good evening': { natural: 'శుభ సాయంత్రం', simple: 'నమస్కారం' },
  'good night': { natural: 'శుభరాత్రి', simple: 'శుభరాత్రి' },
};

export function extractWordBreakdowns(text: string): WordBreakdown[] {
  const words = text.split(/\s+/);
  const seen = new Set<string>();
  const breakdowns: WordBreakdown[] = [];

  for (const w of words) {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean || seen.has(clean) || clean.length < 3) continue;
    
    seen.add(clean);
    const item = lookupWord(clean);
    if (item) {
      breakdowns.push(item);
    }
  }

  return breakdowns;
}

export function detectNoticeCategory(text: string): TranslationResult['category'] {
  const lower = text.toLowerCase();
  if (lower.includes('bill') || lower.includes('due date') || lower.includes('electricity') || lower.includes('invoice') || lower.includes('payment')) {
    return 'bill';
  }
  if (lower.includes('doctor') || lower.includes('hospital') || lower.includes('medicine') || lower.includes('prescription') || lower.includes('patient')) {
    return 'medical';
  }
  if (lower.includes('school') || lower.includes('student') || lower.includes('homework') || lower.includes('teacher') || lower.includes('exam')) {
    return 'school';
  }
  if (lower.includes('otp') || lower.includes('account') || lower.includes('bank') || lower.includes('debit') || lower.includes('credit') || lower.includes('balance')) {
    return 'bank';
  }
  if (lower.includes('notice') || lower.includes('circular') || lower.includes('deadline') || lower.includes('mandatory') || lower.includes('government')) {
    return 'notice';
  }
  return 'general';
}

export function isOfficialOrLegal(text: string): boolean {
  const lower = text.toLowerCase();
  const keywords = ['notice', 'official', 'government', 'bill', 'bank', 'court', 'legal', 'law', 'police', 'tax', 'pan', 'aadhaar', 'medical', 'hospital', 'prescription', 'policy'];
  return keywords.some((k) => lower.includes(k));
}

// High accuracy public translation API
async function fetchOnlineTranslation(text: string): Promise<string | null> {
  const clean = text.trim();
  if (!clean) return null;

  // 1. Google Translate Client Endpoint (Immediate, high accuracy Telugu)
  try {
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=te&q=${encodeURIComponent(
      clean.slice(0, 1500)
    )}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
        const result = data[0].trim();
        if (result) return result;
      }
    }
  } catch (err) {
    console.warn('Primary translation fetch error:', err);
  }

  // 2. Secondary fallback (MyMemory)
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean.slice(0, 500))}&langpair=en|te`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.responseData && data.responseData.translatedText) {
        const translated = data.responseData.translatedText;
        if (!translated.includes('MYMEMORY WARNING') && !translated.includes('QUERY LENGTH LIMIT')) {
          return translated;
        }
      }
    }
  } catch {
    // ignore
  }

  return null;
}

// Transform formal/literary Telugu into everyday Simple Telugu
export function simplifyTelugu(formalTelugu: string): string {
  let simplified = formalTelugu;
  
  const replacements: Array<[RegExp, string]> = [
    [/సమర్పించవలసిన/g, 'ఇవ్వాల్సిన'],
    [/సమర్పించాలి/g, 'ఇవ్వాలి'],
    [/నిర్దేశిత\s+గడువులోగా/g, 'ఇచ్చిన సమయానికి ముందే'],
    [/నిర్ధారించబడింది/g, 'ఖరారైంది'],
    [/రద్దు\s+చేయబడింది/g, 'ఆగిపోయింది'],
    [/విజయవంతమైంది/g, 'పూర్తయింది'],
    [/చెల్లించవలసి\s+ఉంది/g, 'కట్టాలి'],
    [/గడువు\s+తేదీకి\s+ముందే/g, 'చివరి తేదీ లోపే'],
    [/విద్యుత్/g, 'కరెంట్'],
    [/ఔషధం/g, 'మందు'],
    [/ఔషధాలు/g, 'మందులు'],
    [/పాఠశాల/g, 'స్కూలు'],
    [/కళాశాల/g, 'కాలేజీ'],
    [/రుసుము/g, 'ఫీజు'],
    [/ధనము/g, 'డబ్బులు'],
    [/ఆసుపత్రి/g, 'దవాఖానా'],
  ];

  for (const [regex, rep] of replacements) {
    simplified = simplified.replace(regex, rep);
  }

  return toTeluguTerms(simplified);
}

export async function translateEnglishToTelugu(
  englishText: string,
  options: { preferSimple?: boolean } = {}
): Promise<TranslationResult> {
  const trimmed = englishText.trim();
  const id = 'tr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const category = detectNoticeCategory(trimmed);
  const isOfficial = isOfficialOrLegal(trimmed);
  const wordBreakdowns = extractWordBreakdowns(trimmed);

  // 1. Multi-line or paragraph processing
  const lines = trimmed.split(/\r?\n/).filter((l) => l.trim().length > 0);
  
  if (lines.length > 1) {
    // Process line by line
    const naturalLines: string[] = [];
    const simpleLines: string[] = [];

    for (const line of lines) {
      let matchedRule = false;
      for (const rule of RULES) {
        const m = line.trim().match(rule.pattern);
        if (m) {
          naturalLines.push(rule.natural(m));
          simpleLines.push(rule.simple(m));
          matchedRule = true;
          break;
        }
      }
      if (!matchedRule) {
        const online = await fetchOnlineTranslation(line);
        if (online) {
          naturalLines.push(online);
          simpleLines.push(simplifyTelugu(online));
        } else {
          let nat = line;
          let sim = line;
          for (const [en, te] of Object.entries(VOCABULARY_MAP)) {
            const reg = new RegExp(`\\b${en}\\b`, 'gi');
            nat = nat.replace(reg, te.natural);
            sim = sim.replace(reg, te.simple);
          }
          naturalLines.push(nat);
          simpleLines.push(sim);
        }
      }
    }

    const naturalText = naturalLines.join('\n\n');
    const simpleText = simpleLines.join('\n\n');

    return {
      id,
      englishText: trimmed,
      teluguNatural: naturalText,
      teluguSimple: simpleText,
      category,
      explanation: 'ఈ పత్రంలో ఇచ్చిన సమాచారాన్ని జాగ్రత్తగా చదివి అర్థం చేసుకోండి.',
      wordBreakdowns,
      timestamp: Date.now(),
      isOfficialNotice: isOfficial,
    };
  }

  // 2. Check direct curated life-scenario rule match for single sentence
  for (const rule of RULES) {
    const match = trimmed.match(rule.pattern);
    if (match) {
      const natural = rule.natural(match);
      const simple = rule.simple(match);
      return {
        id,
        englishText: trimmed,
        teluguNatural: natural,
        teluguSimple: simple,
        category: rule.category,
        explanation: rule.explanation,
        wordBreakdowns,
        timestamp: Date.now(),
        isOfficialNotice: rule.isOfficial || isOfficial,
      };
    }
  }

  // 3. Single sentence / general phrase fallback
  const onlineTranslation = await fetchOnlineTranslation(trimmed);

  if (onlineTranslation) {
    const natural = onlineTranslation;
    const simple = simplifyTelugu(natural);
    return {
      id,
      englishText: trimmed,
      teluguNatural: natural,
      teluguSimple: simple,
      category,
      explanation: `ఈ వాక్యం యొక్క సరళమైన అర్థం: ${simple}`,
      wordBreakdowns,
      timestamp: Date.now(),
      isOfficialNotice: isOfficial,
    };
  }

  // 4. Vocabulary replacement fallback
  let natural = trimmed;
  let simple = trimmed;
  for (const [en, te] of Object.entries(VOCABULARY_MAP)) {
    const reg = new RegExp(`\\b${en}\\b`, 'gi');
    natural = natural.replace(reg, te.natural);
    simple = simple.replace(reg, te.simple);
  }

  return {
    id,
    englishText: trimmed,
    teluguNatural: natural,
    teluguSimple: simple,
    category,
    explanation: 'ఇందులోని ముఖ్యమైన పదాల అర్థాలను కింద చూడవచ్చు.',
    wordBreakdowns,
    timestamp: Date.now(),
    isOfficialNotice: isOfficial,
  };
}
