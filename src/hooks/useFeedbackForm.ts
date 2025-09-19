import { useEffect, useState } from 'react'
import { FeedbackData, FeedbackRating, ScreenshotData } from '../types'
import { SUCCESS_MESSAGES } from '../utils/constants'
import { collectPageMetadata } from '../utils/metadata'
import { validateEmail } from '../utils/validation'
import { useUserEmail } from './useLocalStorage'

export interface UseFeedbackFormProps {
	isOpen: boolean
	onSubmit: (data: FeedbackData) => Promise<void>
	onSuccess?: () => void
}

export interface UseFeedbackFormReturn {
	selectedRating: FeedbackRating | undefined
	setSelectedRating: (rating: FeedbackRating | undefined) => void
	comment: string
	setComment: (comment: string) => void
	shareEmail: boolean
	setShareEmail: (share: boolean) => void
	localEmail: string
	setLocalEmail: (email: string) => void
	screenshots: ScreenshotData[]
	setScreenshots: (screenshots: ScreenshotData[]) => void
	isSubmitting: boolean
	submitMessage: { type: 'success' | 'error'; text: string } | null
	canSubmit: boolean
	handleSubmit: () => Promise<void>
	handleFormSubmit: (e: React.FormEvent) => void
	handleKeyDown: (e: React.KeyboardEvent) => void
}

export const useFeedbackForm = ({ isOpen, onSubmit, onSuccess }: UseFeedbackFormProps): UseFeedbackFormReturn => {
	const [selectedRating, setSelectedRating] = useState<FeedbackRating | undefined>()
	const [comment, setComment] = useState('')
	const [shareEmail, setShareEmail] = useState(false)
	const [userEmail, setUserEmailStorage] = useUserEmail()
	const [localEmail, setLocalEmail] = useState(userEmail)
	const [screenshots, setScreenshots] = useState<ScreenshotData[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

	// Clear form when modal opens
	useEffect(() => {
		if (isOpen) {
			setSelectedRating(undefined)
			setComment('')
			setShareEmail(false)
			setLocalEmail(userEmail)
			setScreenshots([])
			setSubmitMessage(null)
		}
	}, [isOpen, userEmail])

	const handleSubmit = async () => {
		if (!selectedRating) return

		setIsSubmitting(true)
		setSubmitMessage(null)

		try {
			// Validate email if sharing is enabled
			if (shareEmail) {
				const emailValidation = validateEmail(localEmail)
				if (!emailValidation.isValid) {
					setSubmitMessage({ type: 'error', text: emailValidation.errors[0] })
					setIsSubmitting(false)
					return
				}
			}

			const feedbackData: FeedbackData = {
				rating: selectedRating,
				comment: comment.trim() || undefined,
				shareEmail,
				userEmail: shareEmail ? localEmail : undefined,
				screenshots: screenshots.length > 0 ? screenshots : undefined,
				metadata: collectPageMetadata(),
			}

			await onSubmit(feedbackData)

			// Save email to localStorage only after successful submission
			if (shareEmail && localEmail) {
				setUserEmailStorage(localEmail)
			}

			setSubmitMessage({
				type: 'success',
				text: shareEmail ? SUCCESS_MESSAGES.EMAIL_SHARED : SUCCESS_MESSAGES.FEEDBACK_SUBMITTED,
			})

			// Call optional success callback (for auto-close functionality)
			if (onSuccess) {
				onSuccess()
			}
		} catch (error) {
			setSubmitMessage({
				type: 'error',
				text: error instanceof Error ? error.message : 'Failed to submit feedback',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const canSubmit = selectedRating !== undefined && !isSubmitting

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (canSubmit) {
			handleSubmit()
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canSubmit) {
			e.preventDefault()
			handleSubmit()
		}
	}

	return {
		selectedRating,
		setSelectedRating,
		comment,
		setComment,
		shareEmail,
		setShareEmail,
		localEmail,
		setLocalEmail,
		screenshots,
		setScreenshots,
		isSubmitting,
		submitMessage,
		canSubmit,
		handleSubmit,
		handleFormSubmit,
		handleKeyDown,
	}
}
