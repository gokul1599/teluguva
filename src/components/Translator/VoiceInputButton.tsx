'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  disabled = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = 'en-IN'; // Prefer Indian English speech recognition
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          onTranscript(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions.');
        } else {
          setErrorMessage('Could not hear speech clearly. Please try again.');
        }
        setTimeout(() => setErrorMessage(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsListening(false);
    }
  };

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        aria-label={isListening ? 'Stop listening' : 'Speak English'}
        className={`px-3 py-1.5 rounded-xl font-medium text-xs transition flex items-center gap-1.5 cursor-pointer select-none ${
          isListening
            ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30 ring-2 ring-red-400'
            : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300'
        }`}
        title={isListening ? 'Click to stop listening' : 'Click to speak English'}
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5" />
            <span>Listening...</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Speak English</span>
          </>
        )}
      </button>

      {errorMessage && (
        <div className="absolute right-0 bottom-8 z-20 whitespace-nowrap bg-red-600 text-white text-[11px] px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
