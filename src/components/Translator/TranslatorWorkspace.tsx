'use client';

import React, { useState, useEffect } from 'react';
import { Type, Image as ImageIcon, Camera, Sparkles, ArrowRight, ArrowDown } from 'lucide-react';
import { EnglishInputArea } from './EnglishInputArea';
import { ImageUploader } from './ImageUploader';
import { CameraScanner } from './CameraScanner';
import { TeluguResultCard } from './TeluguResultCard';
import { WordExplanationModal } from './WordExplanationModal';
import { AssistantModal } from './AssistantModal';
import { ShareModal } from '../ShareModal';
import {
  TranslationResult,
  TranslationMode,
  TextSize,
  WordBreakdown,
  UserSettings,
} from '@/types';
import { lookupWord } from '@/lib/dictionary';
import { recognizeEnglishText } from '@/lib/ocrService';

interface TranslatorWorkspaceProps {
  settings: UserSettings;
  onUpdateSettings: (partial: Partial<UserSettings>) => void;
  onSaveResult: (result: TranslationResult) => void;
  onToggleFavorite: (id: string) => void;
  currentResult: TranslationResult | null;
  setCurrentResult: (result: TranslationResult | null) => void;
  externalText?: string;
  activeTabOverride?: 'type' | 'image' | 'camera';
  onTabChange?: (tab: 'type' | 'image' | 'camera') => void;
}

export const TranslatorWorkspace: React.FC<TranslatorWorkspaceProps> = ({
  settings,
  onUpdateSettings,
  onSaveResult,
  onToggleFavorite,
  currentResult,
  setCurrentResult,
  externalText,
  activeTabOverride,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<'type' | 'image' | 'camera'>('type');
  const [englishText, setEnglishText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTabOverride === 'camera') {
      setCameraOpen(true);
    } else if (activeTabOverride) {
      setActiveTab(activeTabOverride);
    }
  }, [activeTabOverride]);

  const handleTabSelect = (tab: 'type' | 'image' | 'camera') => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Sync externalText or currentResult to englishText
  useEffect(() => {
    if (externalText) {
      setEnglishText(externalText);
      setActiveTab('type');
      handleTranslate(externalText);
    }
  }, [externalText]);

  useEffect(() => {
    if (currentResult && currentResult.englishText && currentResult.englishText !== englishText) {
      setEnglishText(currentResult.englishText);
    }
  }, [currentResult]);

  // Debounced auto-translate as the user types
  useEffect(() => {
    const trimmed = englishText.trim();
    if (!trimmed) {
      if (currentResult) {
        setCurrentResult(null);
      }
      return;
    }

    // Only auto-translate if different from currently displayed result
    if (currentResult && currentResult.englishText.trim() === trimmed) {
      return;
    }

    const timer = setTimeout(() => {
      handleTranslate(trimmed);
    }, 750);

    return () => clearTimeout(timer);
  }, [englishText]);

  // Modals state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [explainOpen, setExplainOpen] = useState(false);
  const [selectedWordData, setSelectedWordData] = useState<WordBreakdown | null>(null);

  // Auto-translate on debounce or button click
  const handleTranslate = async (textToTranslate?: string) => {
    const query = (textToTranslate !== undefined ? textToTranslate : englishText).trim();
    if (!query || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: query,
          preferSimple: settings.mode === 'simple',
        }),
      });

      if (res.ok) {
        const data: TranslationResult = await res.json();
        setCurrentResult(data);
        onSaveResult(data);
      } else {
        const err = await res.json();
        alert(err.error || 'Translation failed.');
      }
    } catch (e) {
      console.error('Translation failed:', e);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setEnglishText('');
    setCurrentResult(null);
  };

  const handleSelectSample = (sample: string) => {
    setEnglishText(sample);
    handleTranslate(sample);
  };

  const handleWordClick = async (word: string) => {
    // 1. Try local dictionary lookup
    const found = lookupWord(word);
    if (found) {
      setSelectedWordData(found);
      setExplainOpen(true);
      return;
    }

    // 2. Fetch explanation from server
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, context: englishText }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedWordData(data);
        setExplainOpen(true);
      }
    } catch {
      setSelectedWordData({
        word,
        telugu: word,
        simpleMeaning: 'ఈ పదం సాధారణ వాడుకలో ఉన్న ఆంగ్ల పదం.',
      });
      setExplainOpen(true);
    }
  };

  const handleImageTextExtracted = (text: string) => {
    setEnglishText(text);
    setActiveTab('type');
    handleTranslate(text);
  };

  const handleCameraCapture = async (blob: Blob) => {
    setIsLoading(true);
    try {
      const result = await recognizeEnglishText(blob);
      if (result.text && !result.isUnclear) {
        setEnglishText(result.text);
        setActiveTab('type');
        handleTranslate(result.text);
      } else {
        alert("We couldn't find clear English text in this capture. Please try taking a photo with more light.");
      }
    } catch (e) {
      alert('Error reading text from camera capture.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="translator" className="py-4 sm:py-12 relative">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-6 lg:px-8">
        {/* Workspace Card Container */}
        <div className="glass-surface rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 shadow-xl border border-slate-200/90 dark:border-slate-800">
          {/* Top Bar: Input Mode Switcher (Type / Image / Camera) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div className="w-full sm:w-auto flex items-center justify-between gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => setActiveTab('type')}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2.5 sm:py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[44px] sm:min-h-0 ${
                  activeTab === 'type'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Type className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Type</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('image')}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2.5 sm:py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[44px] sm:min-h-0 ${
                  activeTab === 'image'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Upload</span>
              </button>

              <button
                type="button"
                onClick={() => setCameraOpen(true)}
                className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2.5 sm:py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer min-h-[44px] sm:min-h-0"
              >
                <Camera className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Scan</span>
              </button>
            </div>

            {/* Quick Translate Action Button (desktop header) */}
            <button
              onClick={() => handleTranslate()}
              disabled={!englishText.trim() || isLoading}
              className="hidden sm:flex px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 disabled:opacity-40 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 active:scale-95 transition items-center gap-2 cursor-pointer"
            >
              <span>Translate English → Telugu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Core Translator 2-Column Desktop / Stacked Mobile Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-h-[380px]">
            {/* Left Side: English Input Workspace */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              {activeTab === 'type' ? (
                <EnglishInputArea
                  value={englishText}
                  onChange={setEnglishText}
                  onClear={handleClear}
                  onSelectSample={handleSelectSample}
                  onWordClick={handleWordClick}
                  onTranslate={() => handleTranslate()}
                  isLoading={isLoading}
                />
              ) : (
                <ImageUploader
                  onTextExtracted={handleImageTextExtracted}
                  onOpenCamera={() => setCameraOpen(true)}
                  isLoading={isLoading}
                />
              )}
            </div>

            {/* Right Side: Telugu Translation Result Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <TeluguResultCard
                result={currentResult}
                mode={settings.mode}
                onToggleMode={() =>
                  onUpdateSettings({
                    mode: settings.mode === 'simple' ? 'natural' : 'simple',
                  })
                }
                textSize={settings.textSize}
                onChangeTextSize={(sz) => onUpdateSettings({ textSize: sz })}
                onTranslateAgain={() => handleTranslate()}
                onToggleFavorite={onToggleFavorite}
                onOpenShare={() => setShareOpen(true)}
                onOpenExplain={() => {
                  setSelectedWordData(null);
                  setExplainOpen(true);
                }}
                onOpenAssistant={() => setAssistantOpen(true)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CameraScanner
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      <WordExplanationModal
        isOpen={explainOpen}
        onClose={() => {
          setExplainOpen(false);
          setSelectedWordData(null);
        }}
        wordData={selectedWordData}
        overallExplanation={currentResult?.explanation}
      />

      <AssistantModal
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        englishText={englishText}
        teluguText={
          currentResult
            ? settings.mode === 'simple'
              ? currentResult.teluguSimple
              : currentResult.teluguNatural
            : ''
        }
      />

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        englishText={englishText}
        teluguText={
          currentResult
            ? settings.mode === 'simple'
              ? currentResult.teluguSimple
              : currentResult.teluguNatural
            : ''
        }
      />
    </section>
  );
};
