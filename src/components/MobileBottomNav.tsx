'use client';

import React from 'react';
import { Type, Camera, History, Bookmark, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  onTranslateClick: () => void;
  onCameraClick: () => void;
  onHistoryClick: () => void;
  onFavoritesClick: () => void;
  onSettingsClick: () => void;
  historyCount: number;
  favoritesCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onTranslateClick,
  onCameraClick,
  onHistoryClick,
  onFavoritesClick,
  onSettingsClick,
  historyCount,
  favoritesCount,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-surface border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-2xl"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Translate Tab */}
        <button
          onClick={onTranslateClick}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-700 dark:text-slate-200 active:scale-95 transition"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30">
            <span className="font-telugu font-bold text-base leading-none">తె</span>
          </div>
          <span className="text-[10px] font-bold mt-1 text-amber-600 dark:text-amber-400">
            Translate
          </span>
        </button>

        {/* Camera Scanner Tab */}
        <button
          onClick={onCameraClick}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 active:scale-95 transition"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <Camera className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[10px] font-semibold mt-1">Scan</span>
        </button>

        {/* History Tab */}
        <button
          onClick={onHistoryClick}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 active:scale-95 transition relative"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 relative">
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-700 text-white text-[9px] font-bold flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1">History</span>
        </button>

        {/* Favorites Tab */}
        <button
          onClick={onFavoritesClick}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 active:scale-95 transition relative"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 relative">
            <Bookmark className="w-5 h-5 text-amber-500" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {favoritesCount > 9 ? '9+' : favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1">Saved</span>
        </button>

        {/* Settings Tab */}
        <button
          onClick={onSettingsClick}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 active:scale-95 transition"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold mt-1">Settings</span>
        </button>
      </div>
    </nav>
  );
};
