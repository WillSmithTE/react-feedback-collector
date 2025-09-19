import React, { useEffect, useRef } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'
import { useFeedbackForm } from '../hooks/useFeedbackForm'
import { useFocusTrap } from '../hooks/useKeyboard'
import { FeedbackModalProps } from '../types'
import { ARIA_LABELS } from '../utils/constants'
import { EmailCheckbox } from './EmailCheckbox'
import { EmojiSelector } from './EmojiSelector'
import { ScreenshotUpload } from './ScreenshotUpload'
import { TextInput } from './TextInput'

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	title,
	placeholder,
	showEmailOption,
	showScreenshotOption,
	theme,
	baseUrl,
	clientId,
}) => {
	const modalRef = useRef<HTMLDivElement>(null)
	const backdropRef = useRef<HTMLDivElement>(null)

	const {
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
		handleFormSubmit,
		handleKeyDown,
	} = useFeedbackForm({ isOpen, onSubmit })

	// Handle backdrop clicks and escape key
	const handleBackdropClick = (event: React.MouseEvent) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	useClickOutside(modalRef, onClose, { enabled: isOpen })
	useFocusTrap(modalRef, isOpen)

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}

		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<div
			ref={backdropRef}
			className={`feedback-backdrop ${isOpen ? 'feedback-backdrop--open' : ''}`}
			onClick={handleBackdropClick}
			aria-label={ARIA_LABELS.MODAL_BACKDROP}
			role='presentation'
		>
			<div
				ref={modalRef}
				className={`feedback-modal ${isOpen ? 'feedback-modal--open' : ''}`}
				role='dialog'
				aria-modal='true'
				aria-labelledby='feedback-modal-title'
			>
				<div className='feedback-content'>
					{/* Header */}
					<div className='feedback-header'>
						<h2 id='feedback-modal-title' className='feedback-title'>
							{title}
						</h2>
						<button className='feedback-close' onClick={onClose} aria-label={ARIA_LABELS.CLOSE_BUTTON} type='button'>
							✕
						</button>
					</div>

					<form onSubmit={handleFormSubmit} onKeyDown={handleKeyDown}>
						{/* Success/Error Messages */}
						{submitMessage && (
							<div className={`feedback-${submitMessage.type}`}>
								{submitMessage.type === 'success' ? '✓' : '⚠'} {submitMessage.text}
							</div>
						)}

						{/* Emoji Rating */}
						<div>
							<EmojiSelector selectedRating={selectedRating} onRatingSelect={setSelectedRating} theme={theme} />
						</div>

						{/* Comment Input */}
						<div>
							<TextInput value={comment} onChange={setComment} placeholder={placeholder} theme={theme} />
						</div>

						{/* Screenshot Upload */}
						{showScreenshotOption && (
							<div>
								<ScreenshotUpload
									screenshots={screenshots}
									onScreenshotsChange={setScreenshots}
									theme={theme}
									baseUrl={baseUrl}
									clientId={clientId}
								/>
							</div>
						)}

						{/* Email Option */}
						{showEmailOption && (
							<EmailCheckbox
								checked={shareEmail}
								onChange={setShareEmail}
								email={localEmail}
								onEmailChange={setLocalEmail}
								theme={theme}
							/>
						)}

						{/* Submit Button */}
						<button className='feedback-submit' disabled={!canSubmit} aria-label={ARIA_LABELS.SUBMIT_BUTTON} type='submit'>
							{isSubmitting && <span className='feedback-spinner' />}
							{isSubmitting ? 'Submitting...' : 'Send Feedback 🚀'}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
