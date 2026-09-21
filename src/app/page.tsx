'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TranslatorWorkspace } from '@/components/Translator/TranslatorWorkspace';
import { InteractiveDemo } from '@/components/InteractiveDemo';
import { StorySection } from '@/components/StorySection';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { SettingsModal } from '@/components/SettingsModal';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import {
  TranslationResult,
  UserSettings,
} from '@/types';
import {
  getSettings,
  updateSettings,
  getHistory,
  saveToHistory,
  deleteHistoryItem,
  clearHistory,
  clearFavorites,
  toggleFavorite,
  DEFAULT_SETTINGS,
} from '@/lib/storage';

export default function Home() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<TranslationResult[]>([]);
  const [currentResult, setCurrentResult] = useState<TranslationResult | null>(null);
  const [requestedText, setRequestedText] = useState<string>('');
  const [activeTabOverride, setActiveTabOverride] = useState<'type' | 'image' | 'camera' | undefined>();

  // Modals / Drawers
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'history' | 'favorites'>('history');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Hydrate settings and history on mount
  useEffect(() => {
    const loadedSettings = getSettings();
    setSettings(loadedSettings);

    // Apply theme
    if (loadedSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (loadedSettings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    setHistory(getHistory());
  }, []);

  const handleUpdateSettings = (partial: Partial<UserSettings>) => {
    const updated = updateSettings(partial);
    setSettings(updated);
  };

  const handleSaveResult = (item: TranslationResult) => {
    const updated = saveToHistory(item);
    setHistory(updated);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavorite(id);
    setHistory(updated);
    if (currentResult && currentResult.id === id) {
      setCurrentResult({
        ...currentResult,
        isFavorite: !currentResult.isFavorite,
      });
    }
  };

  const handleClearHistoryOrFavorites = () => {
    if (historyTab === 'history') {
      clearHistory();
    } else {
      clearFavorites();
    }
    setHistory(getHistory());
  };

  const scrollToTranslator = () => {
    const el = document.getElementById('translator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenFavorites = () => {
    setHistoryTab('favorites');
    setHistoryOpen(true);
  };

  const handleOpenHistory = () => {
    setHistoryTab('history');
    setHistoryOpen(true);
  };

  const handleMobileCameraClick = () => {
    setActiveTabOverride('camera');
    scrollToTranslator();
    setTimeout(() => setActiveTabOverride(undefined), 400);
  };

  const handleMobileTranslateClick = () => {
    setActiveTabOverride('type');
    scrollToTranslator();
  };

  const favoritesCount = history.filter((h) => h.isFavorite).length;

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-500/30">
      {/* Top Navbar */}
      <Navbar
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenHistory={handleOpenHistory}
        onOpenFavorites={handleOpenFavorites}
        onOpenSettings={() => setSettingsOpen(true)}
        onScrollToTranslator={scrollToTranslator}
        onScrollToHowItWorks={scrollToHowItWorks}
        historyCount={history.length}
        favoritesCount={favoritesCount}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onTranslateNow={scrollToTranslator}
          onUploadImageClick={scrollToTranslator}
        />

        {/* Core Translator Workspace */}
        <TranslatorWorkspace
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onSaveResult={handleSaveResult}
          onToggleFavorite={handleToggleFavorite}
          currentResult={currentResult}
          setCurrentResult={setCurrentResult}
          externalText={requestedText}
          activeTabOverride={activeTabOverride}
          onTabChange={(tab) => setActiveTabOverride(tab)}
        />

        {/* Live Interactive Demo (Electricity Bill with Simple Telugu switch) */}
        <InteractiveDemo
          onLoadIntoWorkspace={(text) => {
            setRequestedText(text);
            scrollToTranslator();
          }}
        />

        {/* Educational 6-Step Storytelling */}
        <StorySection onTryNow={scrollToTranslator} />
      </main>

      {/* Footer */}
      <Footer
        onScrollToTranslator={scrollToTranslator}
        onScrollToHowItWorks={scrollToHowItWorks}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* History & Favorites Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        activeTab={historyTab}
        onTabChange={setHistoryTab}
        history={history}
        onSelect={(item) => {
          setCurrentResult(item);
          scrollToTranslator();
        }}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearHistoryOrFavorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onRefreshHistory={() => setHistory(getHistory())}
      />

      {/* Fixed Mobile Bottom App Navigation */}
      <MobileBottomNav
        onTranslateClick={handleMobileTranslateClick}
        onCameraClick={handleMobileCameraClick}
        onHistoryClick={handleOpenHistory}
        onFavoritesClick={handleOpenFavorites}
        onSettingsClick={() => setSettingsOpen(true)}
        historyCount={history.length}
        favoritesCount={favoritesCount}
      />
    </div>
  );
}
