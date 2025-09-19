import { AnimationConfig, WidgetTheme } from '../types'

// API Configuration
export const DEFAULT_API_URL = 'https://feedbee.willsmithte.com'
export const API_TIMEOUT = 10000 // 10 seconds
export const MAX_RETRY_ATTEMPTS = 3
export const RETRY_DELAY_BASE = 1000 // 1 second

// Widget Configuration
export const DEFAULT_TITLE = 'Share Your Feedback'
export const DEFAULT_PLACEHOLDER = 'Tell us what you think... (optional)'
export const DEFAULT_STYLE = 'slide' as const
export const DEFAULT_POSITION = 'right' as const

// Content Limits
export const MAX_COMMENT_LENGTH = 1000
export const MIN_CLIENT_ID_LENGTH = 8
export const MAX_EMAIL_LENGTH = 254

// Rate Limiting
export const DEFAULT_RATE_LIMIT_MAX = 5
export const DEFAULT_RATE_LIMIT_WINDOW = 60000 // 1 minute

// Theming
export const DEFAULT_THEME: WidgetTheme = {
	primary: '#ef4444', // Red
	background: '#ffffff',
	text: '#374151', // Gray-700
	border: '#e5e7eb', // Gray-200
	shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
}

export const DARK_THEME: WidgetTheme = {
	primary: '#ef4444', // Red
	background: '#1f2937', // Gray-800
	text: '#f9fafb', // Gray-50
	border: '#374151', // Gray-700
	shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
}

// Z-Index Values
export const Z_INDEX = {
	BUTTON: 9998,
	PANEL: 9999,
	MODAL: 10000,
	BACKDROP: 9999,
} as const

// Animation Configuration
export const SLIDE_ANIMATION: AnimationConfig = {
	duration: 300,
	easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // ease-out-quad
}

export const POPUP_ANIMATION: AnimationConfig = {
	duration: 200,
	easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // ease-out-quad
}

export const FADE_ANIMATION: AnimationConfig = {
	duration: 150,
	easing: 'ease-in-out',
}

// Emoji Mapping
export const EMOJI_MAP = {
	1: '😞',
	2: '😐',
	3: '😊',
} as const

export const RATING_LABELS = {
	1: 'Disappointed',
	2: 'Neutral',
	3: 'Happy',
} as const

// Accessibility
export const ARIA_LABELS = {
	WIDGET_BUTTON: 'Open feedback widget',
	CLOSE_BUTTON: 'Close feedback',
	RATING_GROUP: 'How would you rate your experience?',
	RATING_OPTION: (rating: number, label: string) => `Rate ${rating} out of 3: ${label}`,
	COMMENT_INPUT: 'Additional comments (optional)',
	EMAIL_CHECKBOX: 'Share my email address',
	EMAIL_INPUT: 'Your email address',
	SUBMIT_BUTTON: 'Submit feedback',
	MODAL_BACKDROP: 'Close feedback modal',
} as const

// Responsive Breakpoints
export const BREAKPOINTS = {
	MOBILE: 768,
	TABLET: 1024,
	DESKTOP: 1200,
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
	RATE_LIMIT: 'feedback_rate_limit_',
	USER_EMAIL: 'feedback_user_email',
	LAST_RATING: 'feedback_last_rating_',
	DISMISSED_PROMPTS: 'feedback_dismissed_prompts',
} as const

// Error Messages
export const ERROR_MESSAGES = {
	NETWORK_ERROR: 'Unable to submit feedback. Please check your internet connection and try again.',
	RATE_LIMIT_EXCEEDED: "You've submitted feedback recently. Please wait a moment before submitting again.",
	INVALID_CLIENT_ID: 'Invalid client configuration. Please contact the site administrator.',
	VALIDATION_ERROR: 'Please check your input and try again.',
	GENERIC_ERROR: 'An error occurred while submitting your feedback. Please try again.',
	DOMAIN_NOT_ALLOWED: 'Feedback submissions are not allowed from this domain.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
	FEEDBACK_SUBMITTED: 'Thank you for your feedback!',
	EMAIL_SHARED: 'Thank you for sharing your email with your feedback!',
} as const

// Widget Dimensions
export const WIDGET_DIMENSIONS = {
	BUTTON: {
		WIDTH: 60,
		HEIGHT: 60,
		OFFSET: 20,
	},
	PANEL: {
		WIDTH: 400,
		MAX_WIDTH: '90vw',
		HEIGHT: 'auto',
		MAX_HEIGHT: '80vh',
	},
	MODAL: {
		WIDTH: 480,
		MAX_WIDTH: '90vw',
		HEIGHT: 'auto',
		MAX_HEIGHT: '80vh',
	},
} as const

// Feature Flags (for future extensibility)
export const FEATURE_FLAGS = {
	ENABLE_ANALYTICS: true,
	ENABLE_SCREENSHOT: false,
	ENABLE_AUDIO_FEEDBACK: false,
	ENABLE_EMOJI_REACTIONS: false,
	ENABLE_FOLLOW_UP_QUESTIONS: false,
} as const

// Debug Configuration
export const DEBUG_CONFIG = {
	LOG_API_CALLS: false,
	LOG_USER_INTERACTIONS: false,
	LOG_VALIDATION_ERRORS: false,
	SHOW_WIDGET_BOUNDS: false,
} as const
