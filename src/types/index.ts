// Core feedback data types
export type FeedbackRating = 1 | 2 | 3 | 4

export interface FeedbackMetadata {
	pageUrl: string
	pageTitle: string
	referrer?: string
	timestamp: number
}

export interface ScreenshotData {
	fileName: string
	url: string
	fileSize: number
	width?: number
	height?: number
	mimeType: string
}

export interface FeedbackSubmission {
	clientId: string
	rating: FeedbackRating
	comment?: string
	shareEmail: boolean
	userEmail?: string
	pageUrl: string
	pageTitle: string
	referrer?: string
	environment?: string
	screenshots?: ScreenshotData[]
}

export interface FeedbackData {
	rating: FeedbackRating
	comment?: string
	shareEmail: boolean
	userEmail?: string
	screenshots?: ScreenshotData[]
	metadata: FeedbackMetadata
}

// Widget configuration types
export type WidgetStyle = 'slide' | 'popup'
export type WidgetPosition = 'right' | 'left'
export type ButtonStyle = 'speechBubble' | 'semiCircle'

export interface WidgetTheme {
	primary?: string
	background?: string
	text?: string
	border?: string
	shadow?: string
}

export interface FeedbackWidgetProps {
	// Required
	clientId: string

	// Layout and positioning
	variant?: WidgetStyle
	position?: WidgetPosition
	button?: ButtonStyle

	// Theming
	theme?: WidgetTheme

	// Content customization
	title?: string
	placeholder?: string

	// Behavior
	showEmailOption?: boolean
	showScreenshotOption?: boolean
	autoClose?: boolean
	debug?: boolean
	environment?: string
	baseUrl?: string

	// Event handlers
	onSubmit?: (feedback: FeedbackData) => void
	onError?: (error: Error) => void
	onOpen?: () => void
	onClose?: () => void
}

// Component props
export interface FeedbackButtonProps {
	onClick: () => void
	style: WidgetStyle
	position: WidgetPosition
	button: ButtonStyle
	theme: WidgetTheme
	isOpen: boolean
}

export interface FeedbackPanelProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (data: FeedbackData) => Promise<void>
	title: string
	placeholder: string
	showEmailOption: boolean
	showScreenshotOption: boolean
	theme: WidgetTheme
	position: WidgetPosition
	baseUrl: string
	clientId: string
}

export interface FeedbackModalProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (data: FeedbackData) => Promise<void>
	title: string
	placeholder: string
	showEmailOption: boolean
	showScreenshotOption: boolean
	theme: WidgetTheme
	baseUrl: string
	clientId: string
}

export interface EmojiSelectorProps {
	selectedRating?: FeedbackRating
	onRatingSelect: (rating: FeedbackRating) => void
	theme: WidgetTheme
}

export interface TextInputProps {
	value: string
	onChange: (value: string) => void
	placeholder: string
	theme: WidgetTheme
}

export interface EmailCheckboxProps {
	checked: boolean
	onChange: (checked: boolean) => void
	email: string
	onEmailChange: (email: string) => void
	theme: WidgetTheme
}

// API response types
export interface ApiResponse<T = any> {
	success: boolean
	data?: T
	error?: string
}

export interface SubmissionResponse extends ApiResponse {
	id?: string
	message?: string
}

// Hook types
export interface UseFeedbackApiReturn {
	submitFeedback: (data: FeedbackSubmission) => Promise<SubmissionResponse>
	isLoading: boolean
	error: Error | null
}

export interface UseClickOutsideProps {
	ref: React.RefObject<HTMLElement>
	callback: () => void
	enabled?: boolean
}

export interface UseKeyboardProps {
	onEscape?: () => void
	onEnter?: () => void
	enabled?: boolean
}

// Utility types
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface ValidationResult {
	isValid: boolean
	errors: string[]
}

// Style types for CSS-in-JS
export interface StyleObject {
	[key: string]: string | number | StyleObject
}

export interface AnimationConfig {
	duration: number
	easing: string
}

// Constants
export const EMOJI_MAP: Record<FeedbackRating, string> = {
	1: '😞',
	2: '😐',
	3: '😊',
	4: '🤩',
}

export const RATING_LABELS: Record<FeedbackRating, string> = {
	1: 'Needs work',
	2: "It's okay",
	3: 'Pretty good',
	4: 'Amazing!',
}

export const EMOJI_BACKGROUNDS: Record<FeedbackRating, string> = {
	1: 'linear-gradient(135deg, rgba(255, 107, 107, 0.08), rgba(255, 107, 107, 0.12))', // Soft red gradient
	2: 'linear-gradient(135deg, rgba(156, 163, 175, 0.06), rgba(156, 163, 175, 0.1))', // Subtle gray gradient
	3: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.12))', // Soft blue gradient
	4: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.12))', // Gentle amber gradient
}

export const DEFAULT_API_URL = 'https://feedbee.willsmithte.com'

export const Z_INDEX = {
	BUTTON: 9998,
	PANEL: 9999,
	MODAL: 10000,
	BACKDROP: 9999,
} as const
