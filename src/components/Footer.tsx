'use client';

import React from 'react';
import { Sparkles, Shield, Heart, Globe2 } from 'lucide-react';

interface FooterProps {
  onScrollToTranslator: () => void;
  onScrollToHowItWorks: () => void;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToTranslator,
  onScrollToHowItWorks,
  onOpenSettings,
}) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-bold font-telugu text-base shadow-xs">
                తె
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                TELUGUVA
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                తెలుగు AI
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Understand English. Hear Telugu. Translate English words, sentences, documents and
              images into simple, natural Telugu — instantly.
            </p>

            <div className="pt-2 flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-telugu font-semibold">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>తెలుగు వారి కోసం ప్రేమతో రూపొందించబడింది.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={onScrollToTranslator}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer"
                >
                  English to Telugu Translator
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToTranslator}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer"
                >
                  Image OCR Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToHowItWorks}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer"
                >
                  How Simple Telugu Works
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSettings}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer"
                >
                  Voice & Accessibility Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Privacy & Respect */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacy First</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your images and translations are processed solely to deliver instant understanding.
              History is stored privately in your browser and can be cleared anytime.
            </p>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 dark:text-slate-500">
          <p>
            © {new Date().getFullYear()} TELUGUVA. Translation is provided to assist everyday understanding and does not replace official legal or certified translations.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenSettings} className="hover:underline">
              Privacy Settings
            </button>
            <span>•</span>
            <button onClick={onOpenSettings} className="hover:underline">
              Text Readability
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
