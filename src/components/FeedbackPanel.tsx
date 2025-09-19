import React, { useRef } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'
import { useFeedbackForm } from '../hooks/useFeedbackForm'
import { useFocusTrap } from '../hooks/useKeyboard'
import { FeedbackPanelProps } from '../types'
import { ARIA_LABELS } from '../utils/constants'
import { EmailCheckbox } from './EmailCheckbox'
import { EmojiSelector } from './EmojiSelector'
import { ScreenshotUpload } from './ScreenshotUpload'
import { TextInput } from './TextInput'

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
	isOpen,
	onClose,
	onSubmit,
	title,
	placeholder,
	showEmailOption,
	showScreenshotOption,
	theme,
	position,
	baseUrl,
	clientId,
}) => {
	const panelRef = useRef<HTMLDivElement>(null)

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
	} = useFeedbackForm({
		isOpen,
		onSubmit,
	})

	// Handle outside clicks and escape key
	useClickOutside(panelRef, onClose, { enabled: isOpen })
	useFocusTrap(panelRef, isOpen)

	const getPanelClass = () => {
		const baseClass = 'feedback-panel'
		const positionClass = `feedback-panel--${position}`
		const openClass = isOpen ? 'feedback-panel--open' : ''

		return [baseClass, positionClass, openClass].filter(Boolean).join(' ')
	}

	const getBackdropClass = () => {
		const baseClass = 'feedback-panel-backdrop'
		const openClass = isOpen ? 'feedback-panel-backdrop--open' : ''

		return [baseClass, openClass].filter(Boolean).join(' ')
	}

	return (
		<>
			{/* Backdrop - only render when open */}
			{isOpen && <div className={getBackdropClass()} onClick={onClose} aria-label={ARIA_LABELS.MODAL_BACKDROP} />}

			{/* Panel */}
			<div ref={panelRef} className={getPanelClass()} role='dialog' aria-modal='true' aria-labelledby='feedback-title'>
				<div className='feedback-content'>
					{/* Header */}
					<div className='feedback-header'>
						<h2 id='feedback-title' className='feedback-title'>
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
		</>
	)
}
