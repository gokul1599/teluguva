'use client';

import React from 'react';
import { Camera, Sparkles, Volume2, CheckCircle2, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface StorySectionProps {
  onTryNow: () => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ onTryNow }) => {
  const steps = [
    {
      num: '01',
      title: "English shouldn't be a barrier.",
      teluguTitle: 'భాష ఎప్పుడూ అడ్డంకి కాకూడదు.',
      description:
        'Official government circulars, doctor prescriptions, school WhatsApp notices, and electricity bills arrive in English. Parents and elders deserve to understand every single line with peace of mind.',
      icon: Heart,
      accent: 'border-rose-500/30 text-rose-500 bg-rose-50 dark:bg-rose-950/40',
    },
    {
      num: '02',
      title: 'Take a photo or paste.',
      teluguTitle: 'ఫోటో తీయండి లేదా పేస్ట్ చేయండి.',
      description:
        'Just snap a clear photo of any document or copy-paste text. Our smart scanner recognizes English words instantly while keeping numbers, dates, and amounts intact.',
      icon: Camera,
      accent: 'border-amber-500/30 text-amber-500 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      num: '03',
      title: 'Let AI understand the context.',
      teluguTitle: 'సందర్భాన్ని అర్థం చేసుకుంటుంది.',
      description:
        'No robotic word-by-word nonsense. Our AI identifies whether the text is a hospital appointment, a school fee notice, or an urgent bank OTP, and translates with real situational context.',
      icon: Sparkles,
      accent: 'border-purple-500/30 text-purple-500 bg-purple-50 dark:bg-purple-950/40',
    },
    {
      num: '04',
      title: 'Read it in Simple Telugu.',
      teluguTitle: 'తేలికైన తెలుగులో చదవండి.',
      description:
        'Avoid difficult literary words. With "Simple Telugu Mode" enabled, heavy formal words are automatically converted into friendly, conversational Telugu that anyone in the family can grasp.',
      icon: CheckCircle2,
      accent: 'border-emerald-500/30 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      num: '05',
      title: 'Listen whenever you want.',
      teluguTitle: 'మీకు కావలసినప్పుడు వినండి.',
      description:
        'Reading small letters on a phone screen can strain older eyes. Press 🔊 Listen to hear the translation spoken aloud at your preferred speed—0.75× slow or 1× normal.',
      icon: Volume2,
      accent: 'border-blue-500/30 text-blue-500 bg-blue-50 dark:bg-blue-950/40',
    },
    {
      num: '06',
      title: 'Now you understand.',
      teluguTitle: 'ఇప్పుడు మీకు పూర్తి స్పష్టత.',
      description:
        'No asking neighbors, no feeling hesitant, no missed deadlines. True digital empowerment for Telugu-speaking households everywhere.',
      icon: ShieldCheck,
      accent: 'border-amber-500/30 text-amber-600 bg-amber-50 dark:bg-amber-950/40',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed for real human understanding.
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 font-telugu">
            ఆంగ్ల సమాచారాన్ని తెలుగులో సులభంగా అర్థం చేసుకునే సులువైన ప్రయాణం.
          </p>
        </div>

        {/* 6-step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-amber-400/50 dark:hover:border-amber-600/50 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-200 dark:text-slate-800">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <div className="font-telugu text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5 mb-2">
                    {step.teluguTitle}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final CTA Strip */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-300/60 dark:border-amber-800/50 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Ready to understand any English document?
            </h3>
            <p className="font-telugu text-sm text-slate-600 dark:text-slate-300 mt-1">
              ఇప్పుడే ప్రయత్నించండి — టైప్ చేయండి లేదా ఫోటో అప్‌లోడ్ చేయండి.
            </p>
          </div>
          <button
            onClick={onTryNow}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-bold text-sm shadow-md shadow-orange-500/25 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Try TELUGUVA Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
