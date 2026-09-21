export type TranslationMode = 'simple' | 'natural';

export type TextSize = 'standard' | 'large' | 'xlarge';

export type SpeechSpeed = 0.75 | 1 | 1.25;

export interface WordBreakdown {
  word: string;
  telugu: string;
  phonetic?: string;
  simpleMeaning: string;
  exampleEnglish?: string;
  exampleTelugu?: string;
}

export interface TranslationResult {
  id: string;
  englishText: string;
  teluguNatural: string;
  teluguSimple: string;
  category?: 'bill' | 'notice' | 'school' | 'bank' | 'medical' | 'general' | 'conversation';
  explanation?: string;
  wordBreakdowns: WordBreakdown[];
  timestamp: number;
  isFavorite?: boolean;
  isOfficialNotice?: boolean;
  isUnclear?: boolean;
  sourceType?: 'text' | 'image' | 'camera' | 'voice';
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  mode: TranslationMode;
  textSize: TextSize;
  speechSpeed: SpeechSpeed;
  autoSpeak: boolean;
  reduceMotion: boolean;
}

export interface ImageQualityReport {
  isAcceptable: boolean;
  isDark: boolean;
  isBlurry: boolean;
  brightness: number;
  contrast: number;
  message?: string;
}

export type OCRStage = 'idle' | 'reading' | 'understanding' | 'translating' | 'voicing' | 'ready' | 'error';

export interface OCRProgress {
  stage: OCRStage;
  percent: number;
  message: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
