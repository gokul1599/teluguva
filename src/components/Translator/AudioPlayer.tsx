'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Volume2, FastForward, RotateCcw, VolumeX } from 'lucide-react';
import { ttsService, TTSState } from '@/lib/ttsService';
import { SpeechSpeed } from '@/types';

interface AudioPlayerProps {
  teluguText: string;
  englishText?: string;
  defaultSpeed?: SpeechSpeed;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  teluguText,
  englishText,
  defaultSpeed = 1,
}) => {
  const [ttsState, setTtsState] = useState<TTSState>(ttsService.getState());
  const [selectedSpeed, setSelectedSpeed] = useState<SpeechSpeed>(defaultSpeed);
  const [isSpeakingEnglish, setIsSpeakingEnglish] = useState(false);

  useEffect(() => {
    const unsubscribe = ttsService.subscribe((state) => {
      setTtsState(state);
      if (!state.isPlaying && !state.isPaused) {
        setIsSpeakingEnglish(false);
      }
    });
    return unsubscribe;
  }, []);

  const handlePlayTelugu = () => {
    if (ttsState.isPaused && ttsState.language === 'te') {
      ttsService.resume();
    } else {
      setIsSpeakingEnglish(false);
      ttsService.speak(teluguText, 'te', selectedSpeed);
    }
  };

  const handlePlayEnglish = () => {
    if (!englishText) return;
    if (ttsState.isPaused && ttsState.language === 'en') {
      ttsService.resume();
    } else {
      setIsSpeakingEnglish(true);
      ttsService.speak(englishText, 'en', selectedSpeed);
    }
  };

  const handlePause = () => {
    ttsService.pause();
  };

  const handleStop = () => {
    ttsService.stop();
    setIsSpeakingEnglish(false);
  };

  const handleSpeedChange = (speed: SpeechSpeed) => {
    setSelectedSpeed(speed);
    const activeText = isSpeakingEnglish ? englishText : teluguText;
    ttsService.setSpeed(speed, activeText);
  };

  const isCurrentActive = ttsState.isPlaying || ttsState.isPaused;
  const isTeluguActive = isCurrentActive && !isSpeakingEnglish;
  const isEnglishActive = isCurrentActive && isSpeakingEnglish;

  return (
    <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/30 border border-amber-300/70 dark:border-amber-700/50 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Speaker Title and Waveform */}
        <div className="flex items-center gap-3">
          <button
            onClick={isTeluguActive && ttsState.isPlaying ? handlePause : handlePlayTelugu}
            aria-label={isTeluguActive && ttsState.isPlaying ? 'Pause Telugu voice' : 'Listen to Telugu'}
            className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white flex items-center justify-center shadow-md shadow-orange-500/25 active:scale-95 transition cursor-pointer shrink-0"
            title="Listen to Telugu"
          >
            {isTeluguActive && ttsState.isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>తెలుగు వాయిస్ (Telugu Voice)</span>
              </span>
              {ttsState.isPlaying && (
                <span className="text-[10px] font-semibold uppercase px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 animate-pulse">
                  Playing
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Clear Telugu pronunciation (te-IN)
            </span>
          </div>
        </div>

        {/* Center: Dynamic Animated Audio Waveform */}
        <div className="hidden sm:flex items-center gap-1 h-7 px-3 py-1 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-amber-200/50 dark:border-amber-800/40 select-none">
          {[24, 60, 95, 45, 80, 100, 35, 75, 90, 50, 70, 30].map((baseHeight, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                ttsState.isPlaying
                  ? 'bg-amber-500 waveform-active'
                  : 'bg-slate-300 dark:bg-slate-700 h-2'
              }`}
              style={{
                height: ttsState.isPlaying ? `${baseHeight}%` : '6px',
                animationDelay: `${(i % 5) * 0.12}s`,
              }}
            />
          ))}
        </div>

        {/* Right: Controls & Speed Selector */}
        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200/40 dark:border-amber-800/30">
          {/* Stop Button */}
          {isCurrentActive && (
            <button
              onClick={handleStop}
              aria-label="Stop audio"
              className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Stop playback"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          )}

          {/* Speed Presets */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            {([0.75, 1, 1.25] as SpeechSpeed[]).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => handleSpeedChange(spd)}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  selectedSpeed === spd
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {spd}×
              </button>
            ))}
          </div>

          {/* Hear English Option */}
          {englishText && (
            <button
              onClick={isEnglishActive && ttsState.isPlaying ? handlePause : handlePlayEnglish}
              className="text-xs px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition cursor-pointer shrink-0"
              title="Hear original English pronunciation"
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Hear English</span>
            </button>
          )}
        </div>
      </div>

      {/* Playback Progress Indicator */}
      {ttsState.progress > 0 && (
        <div className="w-full bg-amber-200/50 dark:bg-amber-950/60 h-1 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-150"
            style={{ width: `${ttsState.progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
