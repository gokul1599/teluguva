'use client';

import React from 'react';
import {
  X,
  Settings,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Volume2,
  Type,
  Shield,
  Trash2,
} from 'lucide-react';
import { UserSettings, TextSize, SpeechSpeed, TranslationMode } from '@/types';
import { clearHistory, clearFavorites, clearAllStorage } from '@/lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (partial: Partial<UserSettings>) => void;
  onRefreshHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onRefreshHistory,
}) => {
  if (!isOpen) return null;

  const handleClearHistory = () => {
    if (confirm('Clear translation history? (Saved favorites will be kept)')) {
      clearHistory();
      onRefreshHistory();
      alert('History cleared successfully.');
    }
  };

  const handleClearFavorites = () => {
    if (confirm('Remove all saved favorites?')) {
      clearFavorites();
      onRefreshHistory();
      alert('Favorites cleared.');
    }
  };

  const handleClearAll = () => {
    if (confirm('Erase all saved history, favorites, and reset settings?')) {
      clearAllStorage();
      onRefreshHistory();
      alert('All local storage cleared.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Settings & Preferences</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize voice, text size, and Telugu mode
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Appearance Section */}
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              <span>Appearance (రూపం)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onUpdateSettings({ theme: t.id as any });
                      if (t.id === 'dark') {
                        document.documentElement.classList.add('dark');
                      } else if (t.id === 'light') {
                        document.documentElement.classList.remove('dark');
                      }
                    }}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Translation Mode */}
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Translation Mode (అనువాద విధానం)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ mode: 'simple' })}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  settings.mode === 'simple'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs">Simple Telugu (సులభం)</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Best for parents & elders. Replaces difficult formal terms with everyday words.
                </div>
              </button>

              <button
                onClick={() => onUpdateSettings({ mode: 'natural' })}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  settings.mode === 'natural'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs">Natural Telugu (సహజం)</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Fluent, grammatically rich, polite formal translation.
                </div>
              </button>
            </div>
          </div>

          {/* Accessibility & Font Size */}
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>Telugu Text Readability (అక్షరాల పరిమాణం)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'standard', label: 'Standard', desc: 'Default size' },
                { id: 'large', label: 'Large (+20%)', desc: 'Clear reading' },
                { id: 'xlarge', label: 'Extra Large', desc: 'For parents' },
              ].map((sz) => (
                <button
                  key={sz.id}
                  onClick={() => onUpdateSettings({ textSize: sz.id as TextSize })}
                  className={`p-2.5 rounded-2xl border text-center transition cursor-pointer ${
                    settings.textSize === sz.id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">{sz.label}</div>
                  <div className="text-[10px] text-slate-400">{sz.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Speed */}
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Telugu Speech Speed (వాయిస్ వేగం)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 0.75, label: '0.75× (Slow & Clear)' },
                { val: 1.0, label: '1× (Normal)' },
                { val: 1.25, label: '1.25× (Faster)' },
              ].map((sp) => (
                <button
                  key={sp.val}
                  onClick={() => onUpdateSettings({ speechSpeed: sp.val as SpeechSpeed })}
                  className={`py-2 px-3 rounded-2xl border text-xs font-semibold transition cursor-pointer ${
                    settings.speechSpeed === sp.val
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Data Protection */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacy & Storage (గోప్యత)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Your images and translations are processed only to provide the requested translation.
              All your recent history and saved favorites remain stored privately inside your own
              browser.
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleClearHistory}
                className="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Clear History
              </button>
              <button
                onClick={handleClearFavorites}
                className="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Clear Favorites
              </button>
              <button
                onClick={handleClearAll}
                className="py-1.5 px-3 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-400 text-xs font-semibold transition cursor-pointer"
              >
                Erase All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
