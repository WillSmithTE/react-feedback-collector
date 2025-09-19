// Main component export
export { FeedbackWidget, FeedbackWidget as default } from './components/FeedbackWidget';

// Individual component exports (for advanced usage)
export { FeedbackButton } from './components/FeedbackButton';
export { FeedbackPanel } from './components/FeedbackPanel';
export { FeedbackModal } from './components/FeedbackModal';
export { EmojiSelector } from './components/EmojiSelector';
export { TextInput } from './components/TextInput';
export { EmailCheckbox } from './components/EmailCheckbox';

// Hook exports
export { useFeedbackApi, useApiHealth } from './hooks/useFeedbackApi';
export { useClickOutside, useClickOutsideMultiple, useCloseOnOutsideClick } from './hooks/useClickOutside';
export { useKeyboard, useFocusTrap, useArrowNavigation } from './hooks/useKeyboard';
export { 
  useLocalStorage, 
  useUserEmail, 
  useLastRating, 
  useDismissedPrompts,
  useLocalStorageSupport,
  useLocalStorageWithExpiry,
  useLocalStorageSync
} from './hooks/useLocalStorage';

// Utility exports
export { apiClient, FeedbackApiClient } from './utils/api';
export {
  collectPageMetadata,
  collectEnhancedMetadata,
  getCleanPageTitle,
  getCurrentDomain,
  isInIframe,
  getBrowserInfo,
  getScreenInfo,
  getViewportInfo
} from './utils/metadata';
export {
  validateClientId,
  validateRating,
  validateEmail,
  validateComment,
  validateFeedbackSubmission,
  sanitizeInput,
  isValidUrl,
  isDomainAllowed,
  checkRateLimit
} from './utils/validation';

// Style exports
export { 
  injectThemeStyles, 
  injectBaseStyles, 
  mergeTheme, 
  DEFAULT_THEME, 
  DARK_THEME,
  getSystemTheme,
  applyAutoTheme
} from './styles/themes';

// Type exports
export type {
  // Core types
  FeedbackRating,
  FeedbackMetadata,
  FeedbackSubmission,
  FeedbackData,
  WidgetStyle,
  WidgetPosition,
  ButtonStyle,
  WidgetTheme,
  FeedbackWidgetProps,
  
  // Component prop types
  FeedbackButtonProps,
  FeedbackPanelProps,
  FeedbackModalProps,
  EmojiSelectorProps,
  TextInputProps,
  EmailCheckboxProps,
  
  // API types
  ApiResponse,
  SubmissionResponse,
  
  // Hook types
  UseFeedbackApiReturn,
  UseClickOutsideProps,
  UseKeyboardProps,
  
  // Utility types
  DeepPartial,
  ValidationResult,
  StyleObject,
  AnimationConfig
} from './types';

// Constant exports
export {
  // API constants
  DEFAULT_API_URL,
  API_TIMEOUT,
  MAX_RETRY_ATTEMPTS,
  RETRY_DELAY_BASE,
  
  // Widget constants
  DEFAULT_TITLE,
  DEFAULT_PLACEHOLDER,
  DEFAULT_STYLE,
  DEFAULT_POSITION,
  
  // Content limits
  MAX_COMMENT_LENGTH,
  MIN_CLIENT_ID_LENGTH,
  MAX_EMAIL_LENGTH,
  
  // Rate limiting
  DEFAULT_RATE_LIMIT_MAX,
  DEFAULT_RATE_LIMIT_WINDOW,
  
  // Z-index values
  Z_INDEX,
  
  // Animation configs
  SLIDE_ANIMATION,
  POPUP_ANIMATION,
  FADE_ANIMATION,
  
  // Emoji and rating mappings
  EMOJI_MAP,
  RATING_LABELS,
  
  // Accessibility
  ARIA_LABELS,
  
  // Responsive breakpoints
  BREAKPOINTS,
  
  // Storage keys
  STORAGE_KEYS,
  
  // Messages
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  
  // Widget dimensions
  WIDGET_DIMENSIONS,
  
  // Feature flags
  FEATURE_FLAGS,
  
  // Debug config
  DEBUG_CONFIG
} from './utils/constants';

// Package version (will be replaced by build process)
export const VERSION = '1.0.0';