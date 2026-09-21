'use client';

import React, { useState } from 'react';
import {
  X,
  History,
  Bookmark,
  Trash2,
  Volume2,
  Copy,
  Check,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { TranslationResult } from '@/types';
import { ttsService } from '@/lib/ttsService';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'history' | 'favorites';
  onTabChange: (tab: 'history' | 'favorites') => void;
  history: TranslationResult[];
  onSelect: (item: TranslationResult) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onToggleFavorite: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  history,
  onSelect,
  onDelete,
  onClearAll,
  onToggleFavorite,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const items =
    activeTab === 'favorites'
      ? history.filter((h) => h.isFavorite)
      : history;

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Fallback
    }
  };

  const handleSpeak = (text: string) => {
    ttsService.speak(text, 'te', 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-end backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab === 'history' ? (
              <History className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Bookmark className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            )}
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              {activeTab === 'history' ? 'Recent Translations' : 'Saved Favorites'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center p-3 border-b border-slate-200 dark:border-slate-800 gap-2 bg-slate-50 dark:bg-slate-950/40">
          <button
            onClick={() => onTabChange('history')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({history.length})</span>
          </button>
          <button
            onClick={() => onTabChange('favorites')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Favorites ({history.filter((h) => h.isFavorite).length})</span>
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="py-16 text-center text-slate-400 dark:text-slate-500">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                {activeTab === 'history' ? (
                  <History className="w-6 h-6 text-slate-400" />
                ) : (
                  <Bookmark className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <p className="font-medium text-sm text-slate-600 dark:text-slate-300">
                {activeTab === 'history'
                  ? 'Your translations will appear here.'
                  : 'Save translations you want to remember.'}
              </p>
              <p className="text-xs mt-1 text-slate-400">
                {activeTab === 'history'
                  ? 'Translate any text or image to build your history.'
                  : 'Click the star icon on any translation to save it here.'}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition"
              >
                {/* English source preview */}
                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 font-medium">
                  &quot;{item.englishText}&quot;
                </div>

                {/* Telugu translation */}
                <div className="font-telugu text-sm font-semibold text-slate-900 dark:text-white line-clamp-3 mb-3">
                  {item.teluguSimple || item.teluguNatural}
                </div>

                {/* Card Action Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSpeak(item.teluguSimple || item.teluguNatural)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                      title="Listen in Telugu"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        handleCopy(item.teluguSimple || item.teluguNatural, item.id)
                      }
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                      title="Copy Telugu text"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
                        item.isFavorite
                          ? 'text-amber-500'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={item.isFavorite ? 'Remove Favorite' : 'Save Favorite'}
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <span>Open</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Clear All Button */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear these items?')) {
                  onClearAll();
                }
              }}
              className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold transition cursor-pointer"
            >
              Clear All {activeTab === 'history' ? 'History' : 'Favorites'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
