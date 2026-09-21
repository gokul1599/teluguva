'use client';

import React, { useState } from 'react';
import {
  Volume2,
  Copy,
  Check,
  Share2,
  RotateCw,
  Star,
  Sparkles,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  Type,
} from 'lucide-react';
import { TranslationResult, TranslationMode, TextSize } from '@/types';
import { AudioPlayer } from './AudioPlayer';

interface TeluguResultCardProps {
  result: TranslationResult | null;
  mode: TranslationMode;
  onToggleMode: () => void;
  textSize: TextSize;
  onChangeTextSize: (size: TextSize) => void;
  onTranslateAgain: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenShare: () => void;
  onOpenExplain: () => void;
  onOpenAssistant: () => void;
  isLoading: boolean;
}

export const TeluguResultCard: React.FC<TeluguResultCardProps> = ({
  result,
  mode,
  onToggleMode,
  textSize,
  onChangeTextSize,
  onTranslateAgain,
  onToggleFavorite,
  onOpenShare,
  onOpenExplain,
  onOpenAssistant,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  const activeTeluguText = result
    ? mode === 'simple'
      ? result.teluguSimple || result.teluguNatural
      : result.teluguNatural || result.teluguSimple
    : '';

  const handleCopy = async () => {
    if (!activeTeluguText) return;
    try {
      await navigator.clipboard.writeText(activeTeluguText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Text size classes
  const getTextSizeClass = () => {
    switch (textSize) {
      case 'xlarge':
        return 'text-2xl sm:text-3xl leading-relaxed';
      case 'large':
        return 'text-xl sm:text-2xl leading-relaxed';
      case 'standard':
      default:
        return 'text-lg sm:text-xl leading-relaxed';
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-base" role="img" aria-label="India flag">
            🇮🇳
          </span>
          <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
            Telugu Translation (తెలుగు అనువాదం)
          </span>
        </div>

        {/* Mode Toggle & Font Size Picker */}
        <div className="flex items-center gap-1.5">
          {/* Simple Telugu Pill Switch */}
          <button
            type="button"
            onClick={onToggleMode}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition cursor-pointer border ${
              mode === 'simple'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700'
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}
            title="Switch between Simple Telugu and Natural Telugu"
          >
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>{mode === 'simple' ? 'Simple Telugu' : 'Natural Telugu'}</span>
          </button>

          {/* Text Size Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onChangeTextSize('standard')}
              className={`px-1.5 py-0.5 text-xs rounded-md ${
                textSize === 'standard' ? 'bg-white dark:bg-slate-700 font-bold' : 'text-slate-400'
              }`}
              title="Standard Font Size"
            >
              A
            </button>
            <button
              onClick={() => onChangeTextSize('large')}
              className={`px-1.5 py-0.5 text-xs rounded-md ${
                textSize === 'large' ? 'bg-white dark:bg-slate-700 font-bold' : 'text-slate-400'
              }`}
              title="Large Font Size (+20%)"
            >
              A+
            </button>
            <button
              onClick={() => onChangeTextSize('xlarge')}
              className={`px-1.5 py-0.5 text-xs rounded-md ${
                textSize === 'xlarge' ? 'bg-white dark:bg-slate-700 font-bold' : 'text-slate-400'
              }`}
              title="Extra Large Font Size (+40% for elderly readability)"
            >
              A++
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-4 flex-1 flex flex-col justify-center min-h-[160px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <div className="w-10 h-10 rounded-full border-3 border-amber-500/20 border-t-amber-500 animate-spin" />
            <p className="font-telugu text-sm text-slate-500 dark:text-slate-400">
              అనువదిస్తోంది... (Translating to Telugu)
            </p>
          </div>
        ) : result && activeTeluguText ? (
          <div className="space-y-4">
            {/* The Telugu Result Text */}
            <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40">
              <p
                className={`font-telugu font-semibold text-slate-900 dark:text-slate-100 select-text whitespace-pre-line ${getTextSizeClass()}`}
              >
                {activeTeluguText}
              </p>
            </div>

            {/* Audio Player embedded inside */}
            <AudioPlayer
              teluguText={activeTeluguText}
              englishText={result.englishText}
            />

            {/* Official / Legal / Medical Document Safety Advisory */}
            {result.isOfficialNotice && (
              <div className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Notice: Translation is provided for easy understanding and may not replace an official translation.
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mb-3">
              <span className="font-telugu text-xl font-bold text-amber-500/60">తె</span>
            </div>
            <p className="font-telugu text-base font-medium text-slate-600 dark:text-slate-400">
              ఇక్కడ మీ తెలుగు అనువాదం కనిపిస్తుంది
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
              Type or paste English on the left or upload a photo to get clear Telugu instantly.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={!activeTeluguText}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Copy Telugu text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓ Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={onOpenShare}
            disabled={!activeTeluguText}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Share translation"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Save to Favorites */}
          {result && (
            <button
              onClick={() => onToggleFavorite(result.id)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                result.isFavorite
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title={result.isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Star
                className={`w-3.5 h-3.5 ${result.isFavorite ? 'fill-current' : ''}`}
              />
            </button>
          )}

          {/* Translate Again */}
          <button
            onClick={onTranslateAgain}
            disabled={!result || isLoading}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title="Translate Again / Refresh"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Secondary Educational Features */}
        <div className="flex items-center gap-1.5">
          {/* Explain Meaning */}
          <button
            onClick={onOpenExplain}
            disabled={!result}
            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 disabled:opacity-40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Explain meaning</span>
          </button>

          {/* Ask Assistant */}
          <button
            onClick={onOpenAssistant}
            disabled={!result}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <MessageSquare className="w-3 h-3 text-blue-500" />
            <span>Ask about this</span>
          </button>
        </div>
      </div>
    </div>
  );
};
