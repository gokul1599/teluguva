'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { AssistantMessage } from '@/types';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  englishText: string;
  teluguText: string;
}

const QUICK_PROMPTS = [
  'What does this mean simply? (సులభంగా చెప్పండి)',
  'Is this urgent or important? (ఇది ముఖ్యమైనదా?)',
  'What action should I take? (నేను ఏమి చేయాలి?)',
  'What is the date or deadline? (గడువు తేదీ ఏమిటి?)',
];

export const AssistantModal: React.FC<AssistantModalProps> = ({
  isOpen,
  onClose,
  englishText,
  teluguText,
}) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'నమస్కారం! ఈ అనువాదం గురించి మీకు ఏదైనా సందేహం ఉంటే అడగవచ్చు. (Hello! Feel free to ask any question about this document or translation.)',
      timestamp: Date.now(),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim() || isAsking) return;

    const userMsg: AssistantMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: questionText.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText.trim(),
          englishText,
          teluguText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: AssistantMessage = {
          id: 'bot_' + Date.now(),
          role: 'assistant',
          content: data.answer || 'సమాధానం సిద్ధం కాలేదు. దయచేసి మళ్లీ అడగండి.',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          role: 'assistant',
          content: 'క్షమించండి, సమాధానం అందించడంలో సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] h-[550px] relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Ask about this (సహాయకుడు)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ask questions about your translated document
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  m.role === 'user'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}
              >
                {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-telugu rounded-tl-none border border-slate-200/60 dark:border-slate-700/40'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isAsking && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-telugu pl-9">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>ఆలోచిస్తోంది (Thinking)...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                onClick={() => handleAsk(q)}
                disabled={isAsking}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(inputQuestion);
          }}
          className="flex items-center gap-2 mt-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Type your question here (ఏదైనా అడగండి)..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden border border-slate-200 dark:border-slate-700"
            disabled={isAsking}
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isAsking}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
