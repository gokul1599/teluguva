import { WordBreakdown } from '@/types';

// Curated lexicon of commonly looked up words and difficult terminology in English
export const DICTIONARY: Record<string, WordBreakdown> = {
  postpone: {
    word: 'postpone',
    telugu: 'వాయిదా వేయడం',
    phonetic: 'పోస్ట్‌పోన్',
    simpleMeaning: 'ముందుగా అనుకున్న సమయానికి కాకుండా తరువాతి సమయానికి మార్చడం.',
    exampleEnglish: 'The meeting has been postponed.',
    exampleTelugu: 'సమావేశం వాయిదా పడింది.',
  },
  postponed: {
    word: 'postponed',
    telugu: 'వాయిదా వేయబడింది',
    phonetic: 'పోస్ట్‌పోన్డ్',
    simpleMeaning: 'ఒక పనిని తరువాతి తేదీకి లేదా సమయానికి మార్చారు.',
    exampleEnglish: 'The match was postponed due to rain.',
    exampleTelugu: 'వర్షం కారణంగా ఆట వాయిదా పడింది.',
  },
  appointment: {
    word: 'appointment',
    telugu: 'అపాయింట్‌మెంట్ / ముందస్తు సమయం',
    phonetic: 'అపాయింట్‌మెంట్',
    simpleMeaning: 'డాక్టర్ లేదా అధికారిని కలవడానికి ముందుగా నిర్ణయించుకున్న సమయం.',
    exampleEnglish: 'Your doctor appointment is tomorrow at 10 AM.',
    exampleTelugu: 'రేపు ఉదయం 10 గంటలకు మీ డాక్టర్ అపాయింట్‌మెంట్ ఉంది.',
  },
  bill: {
    word: 'bill',
    telugu: 'బిల్లు / రశీదు',
    phonetic: 'బిల్లు',
    simpleMeaning: 'మనం ఉపయోగించిన సేవలు లేదా వస్తువులకు చెల్లించాల్సిన మొత్తం చూపించే కాగితం.',
    exampleEnglish: 'Electricity bill is due tomorrow.',
    exampleTelugu: 'కరెంట్ బిల్లు రేపు చెల్లించాలి.',
  },
  due: {
    word: 'due',
    telugu: 'గడువు / చెల్లించవలసినది',
    phonetic: 'డ్యూ',
    simpleMeaning: 'ఇవ్వాల్సిన గడువు తేదీ లేదా బాకీ పడిన మొత్తం.',
    exampleEnglish: 'Payment is due on 25th.',
    exampleTelugu: '25వ తేదీ లోపు డబ్బులు చెల్లించాలి.',
  },
  deadline: {
    word: 'deadline',
    telugu: 'చివరి గడువు తేదీ',
    phonetic: 'డెడ్‌లైన్',
    simpleMeaning: 'ఏదైనా పని పూర్తి చేయడానికి లేదా చెల్లించడానికి ఆఖరి తేదీ.',
    exampleEnglish: 'The deadline to apply is Friday.',
    exampleTelugu: 'దరఖాస్తు చేసుకోవడానికి శుక్రవారం చివరి రోజు.',
  },
  mandatory: {
    word: 'mandatory',
    telugu: 'తప్పనిసరి',
    phonetic: 'మాండటరీ',
    simpleMeaning: 'ఖచ్చితంగా చేయాల్సిన నియమం, తప్పించుకోవడానికి వీల్లేదు.',
    exampleEnglish: 'Mask is mandatory.',
    exampleTelugu: 'మాస్క్ ధరించడం తప్పనిసరి.',
  },
  submit: {
    word: 'submit',
    telugu: 'సమర్పించండి / ఇవ్వండి',
    phonetic: 'సబ్మిట్',
    simpleMeaning: 'పత్రాలు లేదా దరఖాస్తును సంబంధిత ఆఫీసులో లేదా అధికారికి ఇవ్వడం.',
    exampleEnglish: 'Please submit your documents.',
    exampleTelugu: 'దయచేసి మీ కాగితాలు ఇవ్వండి.',
  },
  document: {
    word: 'document',
    telugu: 'పత్రం / దస్తావేజు',
    phonetic: 'డాక్యుమెంట్',
    simpleMeaning: 'ఆధార్, పాన్ కార్డ్, లేదా ఏదైనా అధికారిక కాగితం.',
    exampleEnglish: 'Bring all original documents.',
    exampleTelugu: 'అన్ని అసలైన పత్రాలు తీసుకురండి.',
  },
  documents: {
    word: 'documents',
    telugu: 'పత్రాలు / కాగితాలు',
    phonetic: 'డాక్యుమెంట్స్',
    simpleMeaning: 'ముఖ్యమైన అధికారిక లేదా గుర్తింపు కార్డులు/కాగితాలు.',
    exampleEnglish: 'Submit your KYC documents.',
    exampleTelugu: 'మీ కేవైసీ పత్రాలను సమర్పించండి.',
  },
  confirm: {
    word: 'confirm',
    telugu: 'నిర్ధారించు / ఖరారు చేయు',
    phonetic: 'కన్ఫర్మ్',
    simpleMeaning: 'ఒక విషయం నిజమని లేదా ఖరారైందని పక్కాగా చెప్పడం.',
    exampleEnglish: 'Your ticket is confirmed.',
    exampleTelugu: 'మీ టికెట్ ఖరారైంది.',
  },
  confirmed: {
    word: 'confirmed',
    telugu: 'నిర్ధారించబడింది',
    phonetic: 'కన్ఫర్మ్‌డ్',
    simpleMeaning: 'ఖచ్చితంగా ఖరారు చేశారు.',
    exampleEnglish: 'Your booking is confirmed.',
    exampleTelugu: 'మీ బుకింగ్ ఖరారైంది.',
  },
  cancel: {
    word: 'cancel',
    telugu: 'రద్దు చేయు',
    phonetic: 'క్యాన్సిల్',
    simpleMeaning: 'అనుకున్న పనిని లేదా బుకింగ్‌ను నిలిపివేయడం.',
    exampleEnglish: 'The train was cancelled.',
    exampleTelugu: 'రైలు రద్దు చేయబడింది.',
  },
  cancelled: {
    word: 'cancelled',
    telugu: 'రద్దు చేయబడింది',
    phonetic: 'క్యాన్సిల్డ్',
    simpleMeaning: 'ఇక ఆ కార్యక్రమం జరగదు అని ఆపేశారు.',
    exampleEnglish: 'Today class is cancelled.',
    exampleTelugu: 'ఈరోజు తరగతి రద్దు చేయబడింది.',
  },
  urgent: {
    word: 'urgent',
    telugu: 'అత్యవసరం',
    phonetic: 'అర్జెంటు',
    simpleMeaning: 'వెంటనే ఆలస్యం లేకుండా చేయాల్సిన విషయం.',
    exampleEnglish: 'This is an urgent notice.',
    exampleTelugu: 'ఇది ఒక అత్యవసరమైన సమాచారం.',
  },
  notice: {
    word: 'notice',
    telugu: 'ప్రకటన / సమాచారం',
    phonetic: 'నోటీస్',
    simpleMeaning: 'అందరికీ తెలియజేయడానికి ఇచ్చే ముఖ్యమైన సూచన లేదా లేఖ.',
    exampleEnglish: 'Read the official notice.',
    exampleTelugu: 'అధికారిక ప్రకటనను చదవండి.',
  },
  fine: {
    word: 'fine',
    telugu: 'జరిమానా',
    phonetic: 'ఫైన్',
    simpleMeaning: 'నియమాలు ఉల్లంఘించినందుకు లేదా ఆలస్యమైనందుకు చెల్లించాల్సిన అదనపు రుసుము.',
    exampleEnglish: 'Late fee fine will be applied.',
    exampleTelugu: 'ఆలస్య రుసుము లేదా జరిమానా వర్తిస్తుంది.',
  },
  penalty: {
    word: 'penalty',
    telugu: 'జరిమానా / పెనాల్టీ',
    phonetic: 'పెనాల్టీ',
    simpleMeaning: 'నిబంధనలు పాటించనందుకు వేసే శిక్ష లేదా డబ్బుల జరిమానా.',
    exampleEnglish: 'Avoid penalty by paying on time.',
    exampleTelugu: 'సమయానికి చెల్లించి జరిమానాను తప్పించుకోండి.',
  },
  receipt: {
    word: 'receipt',
    telugu: 'రసీదు / బిల్లు కాగితం',
    phonetic: 'రిసీట్',
    simpleMeaning: 'మీరు డబ్బులు చెల్లించినట్లుగా ఇచ్చే ప్రూఫ్ లేదా ఆధార కాగితం.',
    exampleEnglish: 'Keep the payment receipt safely.',
    exampleTelugu: 'డబ్బులు చెల్లించిన రసీదును భద్రంగా ఉంచుకోండి.',
  },
  eligible: {
    word: 'eligible',
    telugu: 'అర్హత కలవారు',
    phonetic: 'ఎలిజిబుల్',
    simpleMeaning: 'ఆ పథకానికి లేదా ఉద్యోగానికి కావాల్సిన అన్ని నియమాలు సరిపోయిన వారు.',
    exampleEnglish: 'You are eligible for this pension.',
    exampleTelugu: 'మీరు ఈ పెన్షన్‌కు అర్హులు.',
  },
  verify: {
    word: 'verify',
    telugu: 'పరిశీలించు / సరిచూసుకో',
    phonetic: 'వెరిఫై',
    simpleMeaning: 'సమాచారం నిజమో కాదో జాగ్రత్తగా తనిఖీ చేయడం.',
    exampleEnglish: 'Please verify your mobile number with OTP.',
    exampleTelugu: 'దయచేసి ఓటీపీ ద్వారా మీ ఫోన్ నంబర్‌ను సరిచూసుకోండి.',
  },
  caution: {
    word: 'caution',
    telugu: 'హెచ్చరిక / జాగ్రత్త',
    phonetic: 'కాషన్',
    simpleMeaning: 'ప్రమాదం జరగకుండా ముందుగానే జాగ్రత్తగా ఉండమని ఇచ్చే సూచన.',
    exampleEnglish: 'Proceed with caution.',
    exampleTelugu: 'జాగ్రత్తగా ముందుకు సాగండి.',
  },
  prescription: {
    word: 'prescription',
    telugu: 'వైద్యుని చీటీ / మందుల ప్రిస్క్రిప్షన్',
    phonetic: 'ప్రిస్క్రిప్షన్',
    simpleMeaning: 'డాక్టర్ రాసిచ్చిన మందుల వివరాలు మరియు ఎలా వేసుకోవాలో రాసిన చీటీ.',
    exampleEnglish: 'Take medicines as per prescription.',
    exampleTelugu: 'డాక్టర్ చీటీ ప్రకారం మందులు వాడండి.',
  },
  dosage: {
    word: 'dosage',
    telugu: 'మందు మోతాదు',
    phonetic: 'డోసేజ్',
    simpleMeaning: 'ఒకసారికి ఎంత మందు తీసుకోవాలో తెలిపే పరిమాణం.',
    exampleEnglish: 'Do not exceed recommended dosage.',
    exampleTelugu: 'సూచించిన మోతాదు కంటే ఎక్కువ మందులు తీసుకోకండి.',
  },
  instruction: {
    word: 'instruction',
    telugu: 'సూచన / ఆదేశం',
    phonetic: 'ఇన్‌స్ట్రక్షన్',
    simpleMeaning: 'ఒక పనిని ఎలా చేయాలో చెప్పే పద్ధతి లేదా మార్గదర్శకం.',
    exampleEnglish: 'Follow the instructions carefully.',
    exampleTelugu: 'సూచనలను జాగ్రత్తగా పాటించండి.',
  },
  instructions: {
    word: 'instructions',
    telugu: 'సూచనలు',
    phonetic: 'ఇన్‌స్ట్రక్షన్స్',
    simpleMeaning: 'ఏదైనా పని చేసేటప్పుడు పాటించాల్సిన నిబంధనలు లేదా మార్గాలు.',
    exampleEnglish: 'Exam instructions are given below.',
    exampleTelugu: 'పరీక్ష సూచనలు క్రింద ఇవ్వబడ్డాయి.',
  },
  validity: {
    word: 'validity',
    telugu: 'చెల్లుబాటు కాలం',
    phonetic: 'వ్యాలిడిటీ',
    simpleMeaning: 'ఒక కార్డు, రీఛార్జ్ లేదా డాక్యుమెంట్ ఎన్ని రోజుల వరకు పనిచేస్తుందో తెలిపే సమయం.',
    exampleEnglish: 'Plan validity is 28 days.',
    exampleTelugu: 'ఈ ప్లాన్ చెల్లుబాటు కాలం 28 రోజులు.',
  },
  expired: {
    word: 'expired',
    telugu: 'గడువు ముగిసింది',
    phonetic: 'ఎక్స్‌పైర్డ్',
    simpleMeaning: 'తేదీ దాటిపోయింది, ఇకపై ఇది పనిచేయదు.',
    exampleEnglish: 'This medicine has expired.',
    exampleTelugu: 'ఈ మందు గడువు ముగిసింది.',
  },
  confidential: {
    word: 'confidential',
    telugu: 'రహస్యమైనది',
    phonetic: 'కాన్ఫిడెన్షియల్',
    simpleMeaning: 'ఇతరులకు చెప్పకూడని, భద్రంగా దాచాల్సిన వ్యక్తిగత సమాచారం.',
    exampleEnglish: 'OTP is strictly confidential.',
    exampleTelugu: 'ఓటీపీ అనేది పూర్తిగా రహస్యమైనది, ఎవరికీ చెప్పవద్దు.',
  },
  transaction: {
    word: 'transaction',
    telugu: 'లావాదేవీ / డబ్బుల చెల్లింపు',
    phonetic: 'ట్రాన్సాక్షన్',
    simpleMeaning: 'బ్యాంకు ద్వారా డబ్బులు పంపడం లేదా తీసుకోవడం.',
    exampleEnglish: 'Transaction successful.',
    exampleTelugu: 'డబ్బుల లావాదేవీ విజయవంతమైంది.',
  },
  balance: {
    word: 'balance',
    telugu: 'మిగిలిన నిల్వ / ఖాతాలో ఉన్న సొమ్ము',
    phonetic: 'బ్యాలెన్స్',
    simpleMeaning: 'మీ బ్యాంక్ ఖాతాలో ప్రస్తుతం మిగిలి ఉన్న మొత్తం డబ్బు.',
    exampleEnglish: 'Available balance is Rs 5,420.',
    exampleTelugu: 'మీ ఖాతాలో మిగిలిన సొమ్ము ₹5,420.',
  },
  admission: {
    word: 'admission',
    telugu: 'ప్రవేశం / చేరిక',
    phonetic: 'అడ్మిషన్',
    simpleMeaning: 'స్కూల్, కాలేజ్ లేదా హాస్పిటల్‌లో చేరడానికి అనుమతి.',
    exampleEnglish: 'School admissions open.',
    exampleTelugu: 'పాఠశాల ప్రవేశాలు ప్రారంభమైనవి.',
  },
  discharged: {
    word: 'discharged',
    telugu: 'డిశ్చార్జ్ అయ్యారు / ఆసుపత్రి నుండి విడుదల',
    phonetic: 'డిశ్చార్జ్డ్',
    simpleMeaning: 'వైద్యం పూర్తయి రోగిని ఆసుపత్రి నుండి ఇంటికి పంపించారు.',
    exampleEnglish: 'Patient was discharged today.',
    exampleTelugu: 'రోగి ఈరోజే ఆసుపత్రి నుండి ఇంటికి వచ్చారు.',
  },
};

// Helper to look up a word (case-insensitive and trimmed)
export function lookupWord(rawWord: string): WordBreakdown | null {
  const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return null;
  
  if (DICTIONARY[clean]) {
    return DICTIONARY[clean];
  }

  // Check singular form if plural ending in 's'
  if (clean.endsWith('s') && DICTIONARY[clean.slice(0, -1)]) {
    return DICTIONARY[clean.slice(0, -1)];
  }

  // Check past tense if ending in 'ed'
  if (clean.endsWith('ed') && DICTIONARY[clean.slice(0, -2)]) {
    return DICTIONARY[clean.slice(0, -2)];
  }

  return null;
}
