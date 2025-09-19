import React from 'react'
import { FeedbackButtonProps } from '../types'
import { ARIA_LABELS } from '../utils/constants'

const showSpeechBubble = false
export const SemiCircleButton: React.FC<FeedbackButtonProps> = ({ onClick, style, position, theme, isOpen }) => {
	const getButtonClass = () => {
		const baseClass = 'feedback-button-semicircle'
		const positionClass = `feedback-button-semicircle--${position}`
		const openClass = isOpen ? `feedback-button-semicircle--${style}-open` : ''

		return [baseClass, positionClass, openClass].filter(Boolean).join(' ')
	}

	// Icon changes based on position for better visual flow
	const getIcon = () => {
		if (isOpen) {
			return position === 'right' ? '✕' : '✕'
		}
		return showSpeechBubble ? '💬' : null
	}

	return (
		<button className={getButtonClass()} onClick={onClick} aria-label={ARIA_LABELS.WIDGET_BUTTON} type='button'>
			<span className='feedback-button-semicircle__icon'>{getIcon()}</span>
		</button>
	)
}
