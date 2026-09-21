'use client';

import React from 'react';
import { ArrowDown, Camera, Sparkles, Volume2, ArrowRight } from 'lucide-react';

interface HeroProps {
  onTranslateNow: () => void;
  onUploadImageClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onTranslateNow,
  onUploadImageClick,
}) => {
  return (
    <section className="relative pt-20 pb-4 sm:pt-32 sm:pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Subtle Floating Telugu Glyphs in Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* అమ్మ */}
        <div className="absolute top-16 left-[8%] text-4xl sm:text-6xl font-telugu font-bold text-slate-300/25 dark:text-slate-700/15 animate-float-slow">
          అమ్మ
        </div>
        {/* నమస్కారం */}
        <div className="absolute top-28 right-[10%] text-3xl sm:text-5xl font-telugu font-bold text-amber-500/15 dark:text-amber-400/10 animate-float-medium">
          నమస్కారం
        </div>
        {/* ధన్యవాదాలు */}
        <div className="absolute bottom-16 left-[12%] text-3xl sm:text-4xl font-telugu font-bold text-slate-400/20 dark:text-slate-700/15 animate-float-slow">
          ధన్యవాదాలు
        </div>
        {/* సంతోషం */}
        <div className="absolute bottom-24 right-[14%] text-4xl sm:text-5xl font-telugu font-bold text-emerald-500/15 dark:text-emerald-400/10 animate-float-medium">
          సంతోషం
        </div>
        {/* కుటుంబం */}
        <div className="absolute top-1/2 left-[48%] -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-8xl font-telugu font-extrabold text-slate-200/15 dark:text-slate-800/20 blur-[1px]">
          కుటుంబం
        </div>

        {/* Ambient Warm Gradient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-400/10 via-orange-300/10 to-transparent blur-3xl -z-10 rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Built for Telugu Families & Parents</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2]">
            English in. Telugu out.{' '}
            <span className="block mt-1 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 bg-clip-text text-transparent">
              Understanding made simple.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-3 sm:mt-5 text-sm sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl mx-auto">
            Type English or upload a photo. Get a clear Telugu translation and listen to it instantly.
          </p>

          {/* CTA Buttons */}
          <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onTranslateNow}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white font-semibold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Translate Now</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>

            <button
              onClick={onUploadImageClick}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-surface hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-100 font-semibold text-base border border-slate-300 dark:border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Camera className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Card: Interactive Translation Journey */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <div className="relative p-3 sm:p-5 rounded-3xl bg-gradient-to-b from-slate-200/60 to-slate-100/30 dark:from-slate-800/50 dark:to-slate-900/40 border border-slate-200/80 dark:border-slate-700/60 shadow-xl backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* English Input Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      English Source
                    </span>
                    <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      Notice Sample
                    </span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-medium leading-relaxed">
                    &quot;Your electricity bill is due on September 25. Please make the payment before the due date.&quot;
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Photo or Text input</span>
                  <span className="font-mono text-[11px]">88 characters</span>
                </div>
              </div>

              {/* Telugu Output Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border border-amber-300/60 dark:border-amber-700/40 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-medium mb-3">
                    <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      🇮🇳 తెలుగు అనువాదం (Simple Telugu)
                    </span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                      సులభంగా
                    </span>
                  </div>
                  <p className="font-telugu text-slate-900 dark:text-white text-lg sm:text-xl font-semibold leading-relaxed">
                    &quot;మీ కరెంట్ బిల్లును సెప్టెంబర్ 25 లోపు చెల్లించాలి. దయచేసి గడువు తేదీకి ముందే కట్టండి.&quot;
                  </p>
                </div>

                {/* Micro Audio player bar */}
                <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-amber-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                    <span>తెలుగు వాయిస్ (1× Speed)</span>
                  </div>
                  {/* Subtle static wave visual */}
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-amber-400 rounded-full" />
                    <span className="w-1 h-5 bg-amber-500 rounded-full" />
                    <span className="w-1 h-4 bg-orange-500 rounded-full" />
                    <span className="w-1 h-6 bg-amber-600 rounded-full" />
                    <span className="w-1 h-3 bg-amber-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
