'use client';

import React from 'react';
import { X, BookOpen, Volume2, Sparkles, Check } from 'lucide-react';
import { WordBreakdown } from '@/types';
import { ttsService } from '@/lib/ttsService';

interface WordExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordData: WordBreakdown | null;
  overallExplanation?: string;
}

export const WordExplanationModal: React.FC<WordExplanationModalProps> = ({
  isOpen,
  onClose,
  wordData,
  overallExplanation,
}) => {
  if (!isOpen) return null;

  const handleSpeakTelugu = (text: string) => {
    ttsService.speak(text, 'te', 1);
  };

  const handleSpeakEnglish = (text: string) => {
    ttsService.speak(text, 'en', 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {wordData ? (
          /* Individual Word Breakdown */
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Word Breakdown & Meaning</span>
            </div>

            <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                {wordData.word}
              </h3>
              {wordData.phonetic && (
                <span className="text-sm font-telugu text-slate-500 dark:text-slate-400">
                  ({wordData.phonetic})
                </span>
              )}
              <button
                onClick={() => handleSpeakEnglish(wordData.word)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Hear English pronunciation"
              >
                <Volume2 className="w-4 h-4 text-blue-500" />
              </button>
            </div>

            {/* Telugu Translation */}
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold mb-0.5">
                  Telugu Meaning (తెలుగు అర్థం):
                </div>
                <div className="text-xl font-telugu font-bold text-slate-900 dark:text-white">
                  {wordData.telugu}
                </div>
              </div>
              <button
                onClick={() => handleSpeakTelugu(wordData.telugu)}
                className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-xs cursor-pointer transition"
                title="Listen to Telugu pronunciation"
              >
                <Volume2 className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Simple Telugu Meaning */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Simple Meaning (సులభమైన వివరణ):
              </div>
              <p className="font-telugu text-base text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {wordData.simpleMeaning}
              </p>
            </div>

            {/* Example sentence */}
            {wordData.exampleEnglish && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="text-slate-500 dark:text-slate-400 font-semibold mb-1">
                  Example Usage:
                </div>
                <p className="text-slate-800 dark:text-slate-200 italic">
                  &quot;{wordData.exampleEnglish}&quot;
                </p>
                {wordData.exampleTelugu && (
                  <p className="font-telugu text-amber-700 dark:text-amber-300 mt-0.5">
                    &quot;{wordData.exampleTelugu}&quot;
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Overall Sentence Meaning */
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Simple Meaning Explanation</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Explain this (సరళమైన అర్థం)
            </h3>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200 dark:border-amber-800/60 mb-4">
              <p className="font-telugu text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed font-medium">
                {overallExplanation || 'ఈ వాక్యం యొక్క ముఖ్య సమాచారం పైన ఇవ్వబడిన అనువాదంలో ఉంది.'}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleSpeakTelugu(overallExplanation || '')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Explanation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
