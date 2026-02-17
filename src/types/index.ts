// Core feedback data types
export type FeedbackRating = 1 | 2 | 3 | 4;

export interface FeedbackMetadata {
  pageUrl: string;
  pageTitle: string;
  referrer?: string;
  timestamp: number;
}

export interface ScreenshotData {
  fileName: string;
  url: string;
  fileSize: number;
  width?: number;
  height?: number;
  mimeType: string;
}

export interface FeedbackSubmission {
  clientId: string;
  rating?: FeedbackRating;
  comment?: string;
  userEmail?: string;
  pageUrl: string;
  pageTitle: string;
  referrer?: string;
  environment?: string;
  screenshots?: ScreenshotData[];
  metadata?: Record<string, unknown>;
}

export interface FeedbackData {
  rating?: FeedbackRating;
  comment?: string;
  userEmail?: string;
  screenshots?: ScreenshotData[];
  metadata: FeedbackMetadata;
}

export type WidgetPosition = "right" | "left";

export interface WidgetTheme {
  primary: string;
  background: string;
  text: string;
  border: string;
  shadow: string;
}

export interface FeedbackWidgetProps {
  // Required
  clientId: string;

  // Layout and positioning
  position?: WidgetPosition;

  // Theming
  theme?: Partial<WidgetTheme>;

  // Content customization
  title?: string;
  placeholder?: string;

  // Behavior
  showEmailOption?: boolean;
  showScreenshotOption?: boolean;
  environment?: string;
  baseUrl?: string;

  // Data
  metadata?: Record<string, unknown>;

  // Event handlers
  onSubmit?: (feedback: FeedbackData) => void;
  onError?: (error: Error) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

// Component props (internal)
export interface FeedbackButtonProps {
  onClick: () => void;
  position: WidgetPosition;
  theme: WidgetTheme;
  isOpen: boolean;
}

export interface FeedbackPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackData) => Promise<void>;
  title: string;
  placeholder: string;
  showEmailOption: boolean;
  showScreenshotOption: boolean;
  theme: WidgetTheme;
  position: WidgetPosition;
  baseUrl: string;
  clientId: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SubmissionResponse extends ApiResponse {
  id?: string;
  message?: string;
}

// Hook types
export interface UseFeedbackApiReturn {
  submitFeedback: (data: FeedbackSubmission) => Promise<SubmissionResponse>;
  isLoading: boolean;
  error: Error | null;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Constants
export const EMOJI_MAP: Record<FeedbackRating, string> = {
  1: "😞",
  2: "😐",
  3: "😊",
  4: "🤩",
};

export const RATING_LABELS: Record<FeedbackRating, string> = {
  1: "Needs work",
  2: "It's okay",
  3: "Pretty good",
  4: "Amazing!",
};

export const EMOJI_BACKGROUNDS: Record<FeedbackRating, string> = {
  1: "linear-gradient(135deg,#ff6b6b14,#ff6b6b1f)",
  2: "linear-gradient(135deg,#9ca3af0f,#9ca3af1a)",
  3: "linear-gradient(135deg,#3b82f614,#3b82f61f)",
  4: "linear-gradient(135deg,#f59e0b14,#f59e0b1f)",
};

export const DEFAULT_API_URL = "https://usero.io";

export const Z_INDEX = {
  BUTTON: 9998,
  PANEL: 9999,
  MODAL: 10000,
  BACKDROP: 9999,
} as const;
