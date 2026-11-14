import { getTodayISO } from './dateUtils';

const STORAGE_KEY = 'daily_discipline_tracker_v1';

export const ACCENT_THEMES = [
  {
    id: 'sunset',
    label: 'Sunset Amber',
    primary: '#e8833a',
    secondary: '#c24d19',
    hover: '#d96b27',
    bgGradLight: 'linear-gradient(135deg, #f3b160 0%, #d86c2c 52%, #b54115 100%)',
    bgGradDark: 'linear-gradient(135deg, #0f1419 0%, #1a222b 55%, #261710 100%)',
    btnGrad: 'linear-gradient(90deg, #f2a452 0%, #c44f18 100%)',
    btnShadow: 'rgba(196, 79, 24, 0.38)',
    softLight: 'rgba(232, 131, 58, 0.14)',
    softDark: 'rgba(232, 131, 58, 0.22)'
  },
  {
    id: 'emerald',
    label: 'Emerald',
    primary: '#10b981',
    secondary: '#047857',
    hover: '#059669',
    bgGradLight: 'linear-gradient(135deg, #6ee7b7 0%, #10b981 52%, #047857 100%)',
    bgGradDark: 'linear-gradient(135deg, #0b1512 0%, #132420 55%, #062c21 100%)',
    btnGrad: 'linear-gradient(90deg, #34d399 0%, #059669 100%)',
    btnShadow: 'rgba(5, 150, 105, 0.38)',
    softLight: 'rgba(16, 185, 129, 0.14)',
    softDark: 'rgba(16, 185, 129, 0.22)'
  },
  {
    id: 'ocean',
    label: 'Ocean Blue',
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    hover: '#2563eb',
    bgGradLight: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 52%, #1e40af 100%)',
    bgGradDark: 'linear-gradient(135deg, #0b111e 0%, #152238 55%, #111c38 100%)',
    btnGrad: 'linear-gradient(90deg, #60a5fa 0%, #2563eb 100%)',
    btnShadow: 'rgba(37, 99, 235, 0.38)',
    softLight: 'rgba(59, 130, 246, 0.14)',
    softDark: 'rgba(59, 130, 246, 0.22)'
  },
  {
    id: 'violet',
    label: 'Royal Violet',
    primary: '#8b5cf6',
    secondary: '#6d28d9',
    hover: '#7c3aed',
    bgGradLight: 'linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 52%, #5b21b6 100%)',
    bgGradDark: 'linear-gradient(135deg, #120e1e 0%, #1f1934 55%, #24143d 100%)',
    btnGrad: 'linear-gradient(90deg, #a78bfa 0%, #6d28d9 100%)',
    btnShadow: 'rgba(109, 40, 217, 0.38)',
    softLight: 'rgba(139, 92, 246, 0.14)',
    softDark: 'rgba(139, 92, 246, 0.22)'
  },
  {
    id: 'rose',
    label: 'Crimson Rose',
    primary: '#f43f5e',
    secondary: '#be123c',
    hover: '#e11d48',
    bgGradLight: 'linear-gradient(135deg, #fda4af 0%, #f43f5e 52%, #9f1239 100%)',
    bgGradDark: 'linear-gradient(135deg, #190d12 0%, #2b1620 55%, #33101e 100%)',
    btnGrad: 'linear-gradient(90deg, #fb7185 0%, #e11d48 100%)',
    btnShadow: 'rgba(225, 29, 72, 0.38)',
    softLight: 'rgba(244, 63, 94, 0.14)',
    softDark: 'rgba(244, 63, 94, 0.22)'
  }
];

export const DEFAULT_CONFIG = {
  targetDays: 90,
  startDate: getTodayISO(),
  completedDates: [],
  isConfigured: false,
  themeMode: 'light',
  accentColor: 'sunset'
};

export function loadTrackerState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_CONFIG, startDate: getTodayISO() };
    }
    const parsed = JSON.parse(raw);
    const targetDays = Number(parsed.targetDays);
    const validTarget = Number.isInteger(targetDays) && targetDays >= 1 && targetDays <= 1000
      ? targetDays
      : DEFAULT_CONFIG.targetDays;
    const startDate = typeof parsed.startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(parsed.startDate)
      ? parsed.startDate
      : getTodayISO();
    const completedDates = Array.isArray(parsed.completedDates)
      ? parsed.completedDates.filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d))
      : [];
    const isConfigured = Boolean(parsed.isConfigured);
    const themeMode = parsed.themeMode === 'dark' ? 'dark' : 'light';
    const accentColor = ACCENT_THEMES.some((t) => t.id === parsed.accentColor)
      ? parsed.accentColor
      : 'sunset';

    return {
      targetDays: validTarget,
      startDate,
      completedDates,
      isConfigured,
      themeMode,
      accentColor
    };
  } catch (err) {
    return { ...DEFAULT_CONFIG, startDate: getTodayISO() };
  }
}

export function saveTrackerState(state) {
  try {
    const payload = {
      targetDays: Number(state.targetDays),
      startDate: state.startDate,
      completedDates: Array.isArray(state.completedDates) ? state.completedDates : [],
      isConfigured: Boolean(state.isConfigured),
      themeMode: state.themeMode === 'dark' ? 'dark' : 'light',
      accentColor: state.accentColor || 'sunset'
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    return false;
  }
}

export function resetCompletedDates(currentState) {
  const nextState = {
    ...currentState,
    completedDates: []
  };
  saveTrackerState(nextState);
  return nextState;
}
