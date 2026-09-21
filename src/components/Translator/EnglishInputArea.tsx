'use client';

import React, { useRef } from 'react';
import { X, Clipboard, Mic, Sparkles, ArrowRight } from 'lucide-react';
import { VoiceInputButton } from './VoiceInputButton';

interface EnglishInputAreaProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onSelectSample: (sample: string) => void;
  onWordClick?: (word: string) => void;
  onTranslate?: () => void;
  isLoading?: boolean;
}

const SAMPLE_PROMPTS = [
  {
    label: '⚡ Electricity Bill',
    text: 'Your electricity bill is due on September 25. Please make the payment before the due date to avoid penalty.',
  },
  {
    label: '🏥 Doctor Notice',
    text: 'Your appointment with Dr. Rao has been confirmed for tomorrow at 10:30 AM. Please bring your previous prescription.',
  },
  {
    label: '🏫 School Circular',
    text: 'School will remain closed tomorrow due to heavy rains. Classes will resume on Monday as usual.',
  },
  {
    label: '💳 Bank OTP',
    text: 'Your OTP is 482910 for transaction of Rs 2,500. This OTP is strictly confidential. Do not share with anyone.',
  },
  {
    label: '🌸 Warm Greeting',
    text: 'Please take care of yourself and your family. Have a peaceful and happy weekend.',
  },
];

export const EnglishInputArea: React.FC<EnglishInputAreaProps> = ({
  value,
  onChange,
  onClear,
  onSelectSample,
  onWordClick,
  onTranslate,
  isLoading = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onChange(text);
          textareaRef.current?.focus();
        }
      }
    } catch {
      // Fallback
    }
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Top action controls: Paste & Clear */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            English Input
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            (Tap any word below for Telugu meaning)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePaste}
            className="px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition flex items-center gap-1 cursor-pointer"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </button>

          {value && (
            <button
              type="button"
              onClick={onClear}
              className="px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition flex items-center gap-1 cursor-pointer"
              title="Clear input text"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Text Area */}
      <div className="relative my-3 flex-1 min-h-[140px] sm:min-h-[180px]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onTranslate?.();
            }
          }}
          placeholder="Type or paste English sentence, message, notice, bill or document text... (Press Enter to translate)"
          className="w-full h-full min-h-[140px] sm:min-h-[180px] p-2 bg-transparent text-slate-800 dark:text-slate-100 text-base sm:text-lg leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none focus:outline-hidden"
        />
      </div>

      {/* Interactive Word Tapping Helper (when text is present) */}
      {value.trim().length > 0 && onWordClick && (
        <div className="mb-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Click any word to see Telugu explanation:</span>
          </div>
          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pr-1">
            {value.split(/\s+/).slice(0, 30).map((word, idx) => {
              const clean = word.replace(/[^a-zA-Z]/g, '');
              if (!clean) return null;
              return (
                <button
                  key={`${clean}-${idx}`}
                  type="button"
                  onClick={() => onWordClick(clean)}
                  className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 hover:bg-amber-100 dark:hover:bg-amber-950/80 hover:text-amber-800 dark:hover:text-amber-300 text-slate-700 dark:text-slate-300 transition cursor-pointer border border-slate-200/60 dark:border-slate-700/50"
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sample Quick Chips */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-2">
          Try a real-world example:
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {SAMPLE_PROMPTS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => onSelectSample(sample.text)}
              className="text-xs whitespace-nowrap px-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/70 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-700 dark:hover:text-amber-300 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 transition cursor-pointer"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Word Count & Voice Input & Translate Now Button */}
      <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-2">
          <span>{charCount} characters</span>
          <span>•</span>
          <span>{wordCount} words</span>
          {isLoading && (
            <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Translating...</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Input Button */}
          <VoiceInputButton
            onTranscript={(text) => {
              const updated = value ? `${value} ${text}` : text;
              onChange(updated);
            }}
            disabled={isLoading}
          />

          {/* Direct Translate Button */}
          <button
            type="button"
            onClick={onTranslate}
            disabled={!value.trim() || isLoading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
            title="Translate to Telugu (or press Enter)"
          >
            <span>Translate Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
