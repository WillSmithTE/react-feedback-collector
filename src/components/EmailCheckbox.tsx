import React from 'react'
import { EmailCheckboxProps } from '../types'
import { ARIA_LABELS, MAX_EMAIL_LENGTH } from '../utils/constants'

export const EmailCheckbox: React.FC<EmailCheckboxProps> = ({ checked, onChange, email, onEmailChange, theme }) => {
	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.checked)
	}

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newEmail = event.target.value

		// Enforce max length
		if (newEmail.length <= MAX_EMAIL_LENGTH) {
			onEmailChange(newEmail)
		}
	}


	return (
		<div className='feedback-email-section'>
			<label className='feedback-checkbox'>
				<input type='checkbox' checked={checked} onChange={handleCheckboxChange} aria-label={ARIA_LABELS.EMAIL_CHECKBOX} />
				<span>Share my email</span>
			</label>

			{checked ? (
				<input
					type='email'
					className='feedback-email-input'
					value={email}
					onChange={handleEmailChange}
					placeholder='your.email@example.com'
					aria-label={ARIA_LABELS.EMAIL_INPUT}
					maxLength={MAX_EMAIL_LENGTH}
					autoComplete='email'
				/>
			) : null}
		</div>
	)
}
