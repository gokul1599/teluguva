import { SpeechSpeed } from '@/types';

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  language: 'te' | 'en';
  progress: number;
  speed: SpeechSpeed;
}

type StateChangeCallback = (state: TTSState) => void;

class TTSService {
  private audioElement: HTMLAudioElement | null = null;
  private currentText = '';
  private state: TTSState = {
    isPlaying: false,
    isPaused: false,
    language: 'te',
    progress: 0,
    speed: 1,
  };
  private subscribers: StateChangeCallback[] = [];

  public subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.push(callback);
    callback(this.state);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private updateState(partial: Partial<TTSState>) {
    this.state = { ...this.state, ...partial };
    for (const cb of this.subscribers) {
      cb(this.state);
    }
  }

  public speak(text: string, lang: 'te' | 'en' = 'te', speed: SpeechSpeed = 1) {
    if (!text || !text.trim()) return;

    // Stop any existing playback
    this.stop();
    this.currentText = text;

    try {
      // 1. Primary Engine: High-fidelity native streaming audio via /api/tts
      const audioUrl = `/api/tts?text=${encodeURIComponent(text.trim())}&lang=${lang}`;
      const audio = new Audio(audioUrl);
      this.audioElement = audio;

      audio.playbackRate = speed;

      audio.onplay = () => {
        this.updateState({
          isPlaying: true,
          isPaused: false,
          language: lang,
          speed,
          progress: 0,
        });
      };

      audio.onpause = () => {
        // Only mark paused if not ended
        if (audio.currentTime < audio.duration) {
          this.updateState({ isPaused: true, isPlaying: false });
        }
      };

      audio.ontimeupdate = () => {
        if (audio.duration && audio.duration > 0) {
          const pct = Math.min(100, Math.round((audio.currentTime / audio.duration) * 100));
          this.updateState({ progress: pct });
        }
      };

      audio.onended = () => {
        this.updateState({ isPlaying: false, isPaused: false, progress: 100 });
        setTimeout(() => {
          if (!this.state.isPlaying) {
            this.updateState({ progress: 0 });
          }
        }, 600);
      };

      audio.onerror = (e) => {
        console.warn('Native TTS audio error, attempting browser speech fallback:', e);
        this.speakBrowserFallback(text, lang, speed);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play was interrupted or rejected:', err);
          this.speakBrowserFallback(text, lang, speed);
        });
      }
    } catch (err) {
      console.warn('Failed to start native audio, using browser fallback:', err);
      this.speakBrowserFallback(text, lang, speed);
    }
  }

  private speakBrowserFallback(text: string, lang: 'te' | 'en', speed: SpeechSpeed) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.updateState({ isPlaying: false, isPaused: false, progress: 0 });
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = lang === 'te' ? 'te-IN' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) =>
      lang === 'te'
        ? v.lang.toLowerCase().startsWith('te')
        : v.lang.toLowerCase().startsWith('en')
    );
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      this.updateState({ isPlaying: true, isPaused: false, language: lang, speed, progress: 10 });
    };

    utterance.onend = () => {
      this.updateState({ isPlaying: false, isPaused: false, progress: 100 });
      setTimeout(() => this.updateState({ progress: 0 }), 500);
    };

    utterance.onerror = () => {
      this.updateState({ isPlaying: false, isPaused: false, progress: 0 });
    };

    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.updateState({ isPaused: true, isPlaying: false });
    }
  }

  public resume() {
    if (this.audioElement && this.audioElement.paused) {
      this.audioElement.play().catch(console.warn);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.updateState({ isPaused: false, isPlaying: true });
    }
  }

  public stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.updateState({ isPlaying: false, isPaused: false, progress: 0 });
  }

  public setSpeed(speed: SpeechSpeed, currentText?: string) {
    this.updateState({ speed });
    if (this.audioElement) {
      this.audioElement.playbackRate = speed;
    }
    const textToPlay = currentText || this.currentText;
    if (this.state.isPlaying && textToPlay) {
      this.speak(textToPlay, this.state.language, speed);
    }
  }

  public getState(): TTSState {
    return this.state;
  }
}

export const ttsService = new TTSService();
