'use client';

import React, { useState } from 'react';
import { Volume2, Sparkles, Check, ArrowRight, Zap } from 'lucide-react';
import { ttsService } from '@/lib/ttsService';

interface InteractiveDemoProps {
  onLoadIntoWorkspace: (text: string) => void;
}

export const InteractiveDemo: React.FC<InteractiveDemoProps> = ({
  onLoadIntoWorkspace,
}) => {
  const [activeTab, setActiveTab] = useState<'simple' | 'natural'>('simple');
  const [isPlaying, setIsPlaying] = useState(false);

  const sampleEnglish =
    'Your electricity bill is due on September 25. Please make the payment before the due date.';
  
  const naturalTelugu =
    'మీ విద్యుత్ బిల్లు సెప్టెంబర్ 25న చెల్లించాలి. దయచేసి గడువు తేదీకి ముందే చెల్లించండి.';
  
  const simpleTelugu =
    'మీ కరెంట్ బిల్లును సెప్టెంబర్ 25లోపు చెల్లించాలి.';

  const handleListen = () => {
    const textToSpeak = activeTab === 'simple' ? simpleTelugu : naturalTelugu;
    setIsPlaying(true);
    ttsService.speak(textToSpeak, 'te', 1);
    setTimeout(() => setIsPlaying(false), 3500);
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-100/50 dark:bg-slate-950/40 border-y border-slate-200/60 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Live Demo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            See the difference: Formal vs. Simple Telugu
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 font-telugu">
            సాధారణ అనువాదాలకు మరియు మా సులభమైన తెలుగుకు ఉన్న తేడాను గమనించండి.
          </p>
        </div>

        <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Original Notice Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Original English Notice</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px]">
                  Electricity Bill
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 text-slate-800 dark:text-slate-200 font-medium text-base sm:text-lg leading-relaxed">
                &quot;{sampleEnglish}&quot;
              </div>

              <div className="text-xs text-slate-400">
                Notice received on SMS or bill envelope.
              </div>
            </div>

            {/* Right: Telugu Output with Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Telugu Output:
                </span>

                {/* Mode Selector */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setActiveTab('simple')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'simple'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Simple Telugu
                  </button>
                  <button
                    onClick={() => setActiveTab('natural')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'natural'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Natural Telugu
                  </button>
                </div>
              </div>

              {/* Translation Text Card */}
              <div
                className={`p-5 rounded-2xl border transition-all duration-200 ${
                  activeTab === 'simple'
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300/80 dark:border-emerald-800/60'
                    : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300/80 dark:border-amber-800/60'
                }`}
              >
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {activeTab === 'simple'
                    ? '✓ Simple Telugu (సులువుగా అర్థమయ్యేలా):'
                    : 'Formal Natural Telugu (సాధారణ అనువాదం):'}
                </div>
                <p className="font-telugu text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  &quot;{activeTab === 'simple' ? simpleTelugu : naturalTelugu}&quot;
                </p>
              </div>

              {/* Audio Listen & Test Button */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleListen}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlaying ? 'Speaking...' : '🔊 Listen to Audio'}</span>
                </button>

                <button
                  onClick={() => onLoadIntoWorkspace(sampleEnglish)}
                  className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open in Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
