import { WidgetTheme } from '../types';

/**
 * CSS custom properties injection for theming
 */
export function injectThemeStyles(theme: WidgetTheme, id: string = 'feedback-theme'): void {
  if (typeof document === 'undefined') return;

  // Remove existing theme
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Create CSS custom properties
  const css = `
    .feedback-widget {
      --feedback-primary: ${theme.primary || '#ef4444'};
      --feedback-background: ${theme.background || '#ffffff'};
      --feedback-text: ${theme.text || '#374151'};
      --feedback-text-muted: ${theme.text || '#374151'}80;
      --feedback-border: ${theme.border || '#e5e7eb'};
      --feedback-border-light: ${theme.border || '#e5e7eb'}40;
      --feedback-shadow: ${theme.shadow || '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'};
    }
  `;

  // Create and inject style element
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * Inject base widget styles
 */
export function injectBaseStyles(cssContent: string, id: string = 'feedback-base'): void {
  if (typeof document === 'undefined') return;

  // Remove existing styles
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Create and inject style element
  const style = document.createElement('style');
  style.id = id;
  style.textContent = cssContent;
  document.head.appendChild(style);
}

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