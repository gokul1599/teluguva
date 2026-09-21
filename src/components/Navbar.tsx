'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, History, Bookmark, Settings, Sun, Moon, Menu, X, Globe2 } from 'lucide-react';
import { UserSettings } from '@/types';

interface NavbarProps {
  settings: UserSettings;
  onUpdateSettings: (partial: Partial<UserSettings>) => void;
  onOpenHistory: () => void;
  onOpenFavorites: () => void;
  onOpenSettings: () => void;
  onScrollToTranslator: () => void;
  onScrollToHowItWorks: () => void;
  historyCount: number;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onUpdateSettings,
  onOpenHistory,
  onOpenFavorites,
  onOpenSettings,
  onScrollToTranslator,
  onScrollToHowItWorks,
  historyCount,
  favoritesCount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ theme: nextTheme });
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-surface shadow-xs py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo & Brand */}
        <div
          onClick={onScrollToTranslator}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <span className="font-telugu font-bold text-lg">తె</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                TELUGUVA
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60">
                తెలుగు AI
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              Understand English. Hear Telugu.
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-300/40 dark:border-slate-700/40 backdrop-blur-md">
          <button
            onClick={onScrollToTranslator}
            className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/80 dark:hover:bg-slate-700/60 transition"
          >
            Translate
          </button>
          <button
            onClick={onOpenHistory}
            className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/80 dark:hover:bg-slate-700/60 transition flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenFavorites}
            className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/80 dark:hover:bg-slate-700/60 transition flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-semibold">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={onScrollToHowItWorks}
            className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/80 dark:hover:bg-slate-700/60 transition"
          >
            How It Works
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Simple Telugu Mode Quick Pill */}
          <button
            onClick={() =>
              onUpdateSettings({
                mode: settings.mode === 'simple' ? 'natural' : 'simple',
              })
            }
            title="Toggle Simple Telugu Mode"
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
              settings.mode === 'simple'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Simple Telugu: {settings.mode === 'simple' ? 'ON' : 'OFF'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-slate-700" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition"
            aria-label="Open Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-surface border-b border-slate-200 dark:border-slate-800 px-6 py-4 space-y-3 mt-2 animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              onScrollToTranslator();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-base font-medium text-slate-800 dark:text-slate-100 flex items-center justify-between"
          >
            <span>Translate English → Telugu</span>
            <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full">
              Main
            </span>
          </button>
          <button
            onClick={() => {
              onOpenHistory();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-base font-medium text-slate-800 dark:text-slate-100 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <History className="w-4 h-4" /> History
            </span>
            {historyCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              onOpenFavorites();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-base font-medium text-slate-800 dark:text-slate-100 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" /> Saved Favorites
            </span>
            {favoritesCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white font-semibold">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              onScrollToHowItWorks();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-base font-medium text-slate-800 dark:text-slate-100"
          >
            How It Works
          </button>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Simple Telugu Mode</span>
            <button
              onClick={() =>
                onUpdateSettings({
                  mode: settings.mode === 'simple' ? 'natural' : 'simple',
                })
              }
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                settings.mode === 'simple'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {settings.mode === 'simple' ? 'Active' : 'Off'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
