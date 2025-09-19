import React, { useState } from 'react'
import { EMOJI_BACKGROUNDS, EMOJI_MAP, EmojiSelectorProps, FeedbackRating, RATING_LABELS } from '../types'
import { ARIA_LABELS } from '../utils/constants'

export const EmojiSelector: React.FC<EmojiSelectorProps> = ({ selectedRating, onRatingSelect, theme }) => {
	const [hoveredRating, setHoveredRating] = useState<FeedbackRating | null>(null)

	const handleRatingClick = (rating: FeedbackRating) => {
		onRatingSelect(rating)
	}

	const handleKeyDown = (event: React.KeyboardEvent, rating: FeedbackRating) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			handleRatingClick(rating)
		}
	}

	return (
		<div className='feedback-emoji-selector' role='radiogroup' aria-label={ARIA_LABELS.RATING_GROUP}>
			{[1, 2, 3, 4].map(rating => {
				const ratingValue = rating as FeedbackRating
				const isSelected = selectedRating === ratingValue
				const emoji = EMOJI_MAP[ratingValue]
				const label = RATING_LABELS[ratingValue]
				const backgroundColor = EMOJI_BACKGROUNDS[ratingValue]

				return (
					<div key={rating} className={`feedback-emoji-card ${isSelected ? 'feedback-emoji-card--selected' : ''}`} style={{}}>
						<button
							type='button'
							className='feedback-emoji-button'
							onClick={() => handleRatingClick(ratingValue)}
							onKeyDown={e => handleKeyDown(e, ratingValue)}
							onMouseEnter={() => setHoveredRating(ratingValue)}
							onMouseLeave={() => setHoveredRating(null)}
							aria-label={ARIA_LABELS.RATING_OPTION(rating, label)}
							aria-pressed={isSelected}
							role='radio'
							aria-checked={isSelected}
						>
							<div className='feedback-emoji-button__emoji'>
								<span role='img' aria-label={label}>
									{emoji}
								</span>
							</div>
							<div className='feedback-emoji-button__label'>{label}</div>
						</button>
					</div>
				)
			})}
		</div>
	)
}
