import { TranslationResult, UserSettings } from '@/types';

const HISTORY_KEY = 'teluguva_history_v1';
const SETTINGS_KEY = 'teluguva_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  mode: 'simple',
  textSize: 'standard',
  speechSpeed: 1,
  autoSpeak: false,
  reduceMotion: false,
};

export function getHistory(): TranslationResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading history:', e);
    return [];
  }
}

export function saveToHistory(item: TranslationResult): TranslationResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = getHistory();
    // Filter out duplicates by english text if recent
    const filtered = history.filter(
      (h) => h.englishText.toLowerCase() !== item.englishText.toLowerCase()
    );
    const updated = [item, ...filtered].slice(0, 50); // keep 50 recent
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving history:', e);
    return [];
  }
}

export function toggleFavorite(id: string): TranslationResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = getHistory();
    const updated = history.map((item) => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error toggling favorite:', e);
    return [];
  }
}

export function deleteHistoryItem(id: string): TranslationResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = getHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error deleting history item:', e);
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getHistory();
    // Keep favorites if user just wants to clear normal history
    const favoritesOnly = history.filter((h) => h.isFavorite);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(favoritesOnly));
  } catch (e) {
    console.error('Error clearing history:', e);
  }
}

export function clearFavorites(): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getHistory();
    const unFavorited = history.map((h) => ({ ...h, isFavorite: false }));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(unFavorited));
  } catch (e) {
    console.error('Error clearing favorites:', e);
  }
}

export function clearAllStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (e) {
    console.error('Error clearing all storage:', e);
  }
}

export function getSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function updateSettings(partial: Partial<UserSettings>): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const current = getSettings();
    const updated = { ...current, ...partial };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error updating settings:', e);
    return DEFAULT_SETTINGS;
  }
}
