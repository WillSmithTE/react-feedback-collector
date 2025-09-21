export const DEFAULT_API_URL = "https://feedbee.willsmithte.com";

export const DEFAULT_TITLE = "Share Feedback";
export const DEFAULT_PLACEHOLDER = "Tell us what you think... (optional)";
export const DEFAULT_STYLE = "slide" as const;
export const DEFAULT_POSITION = "right" as const;

// Content Limits
export const MAX_COMMENT_LENGTH = 1000;
export const MAX_EMAIL_LENGTH = 254;

// Accessibility
export const ARIA_LABELS = {
  WIDGET_BUTTON: "Open feedback",
  CLOSE_BUTTON: "Close",
  RATING_GROUP: "Rate experience",
  RATING_OPTION: (rating: number, label: string) => `${rating}: ${label}`,
  COMMENT_INPUT: "Comments",
  EMAIL_CHECKBOX: "Share email",
  EMAIL_INPUT: "Email",
  SUBMIT_BUTTON: "Submit",
  MODAL_BACKDROP: "Close modal",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Connection error. Try again.",
  RATE_LIMIT_EXCEEDED: "Too many submissions. Wait a moment.",
  INVALID_CLIENT_ID: "Invalid config. Contact admin.",
  VALIDATION_ERROR: "Check input and retry.",
  GENERIC_ERROR: "Error occurred. Try again.",
  DOMAIN_NOT_ALLOWED: "Domain not allowed.",
} as const;
