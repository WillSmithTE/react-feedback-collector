import { WidgetTheme } from '../types';


/**
 * Default theme configurations
 */
export const DEFAULT_THEME: WidgetTheme = {
  primary: '#2563eb',
  background: '#ffffff', 
  text: '#374151',
  border: '#e5e7eb',
  shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
};

export const DARK_THEME: WidgetTheme = {
  primary: '#2563eb',
  background: '#1f2937',
  text: '#f9fafb', 
  border: '#374151',
  shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
};

/**
 * Merge theme with defaults
 */
export function mergeTheme(customTheme: Partial<WidgetTheme> = {}): WidgetTheme {
  return {
    ...DARK_THEME,
    ...customTheme
  };
}

/**
 * Auto-detect system theme preference
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
}

/**
 * Apply theme based on system preference
 */
export function applyAutoTheme(customTheme: Partial<WidgetTheme> = {}): WidgetTheme {
  const systemTheme = getSystemTheme();
  const baseTheme = systemTheme === 'dark' ? DARK_THEME : DEFAULT_THEME;
  
  return mergeTheme({ ...baseTheme, ...customTheme });
}