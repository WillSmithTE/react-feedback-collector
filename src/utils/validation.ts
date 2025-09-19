import { FeedbackSubmission, ValidationResult } from '../types'

/**
 * Validate a client ID format
 */
export function validateClientId(clientId: string): ValidationResult {
	const errors: string[] = []

	if (!clientId || typeof clientId !== 'string') {
		errors.push(`Client ID is required and must be a string (id=${clientId})`)
	} else if (clientId.length < 8) {
		errors.push(`Client ID must be at least 8 characters long (id=${clientId})`)
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * Validate a feedback rating
 */
export function validateRating(rating: any): ValidationResult {
	const errors: string[] = []

	if (rating === null || rating === undefined) {
		errors.push('Rating is required')
	} else if (![1, 2, 3, 4].includes(rating)) {
		errors.push('Rating must be 1, 2, or 3, 4')
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * Validate an email address
 */
export function validateEmail(email: string): ValidationResult {
	const errors: string[] = []

	if (!email) {
		errors.push('Email is required when sharing email is enabled')
		return { isValid: false, errors }
	}

	if (typeof email !== 'string') {
		errors.push('Email must be a string')
		return { isValid: false, errors }
	}

	// Basic email regex - more permissive than strict RFC compliance
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	if (!emailRegex.test(email)) {
		errors.push('Please enter a valid email address')
	}

	if (email.length > 254) {
		errors.push('Email address is too long')
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * Validate feedback comment
 */
export function validateComment(comment: string | undefined): ValidationResult {
	const errors: string[] = []

	// Comments are optional, so empty/undefined is valid
	if (comment === null || comment === undefined || comment.trim() === '') {
		return { isValid: true, errors: [] }
	}

	if (typeof comment !== 'string') {
		errors.push('Comment must be a string')
	} else {
		// Check length constraints
		if (comment.length > 1000) {
			errors.push('Comment cannot exceed 1000 characters')
		}

		// Basic content validation (no script tags, etc.)
		if (/<script[^>]*>.*?<\/script>/gi.test(comment)) {
			errors.push('Comments cannot contain script tags')
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * Validate a complete feedback submission
 */
export function validateFeedbackSubmission(data: Partial<FeedbackSubmission>): ValidationResult {
	const errors: string[] = []

	// Validate required fields
	const clientIdValidation = validateClientId(data.clientId || '')
	if (!clientIdValidation.isValid) {
		errors.push(...clientIdValidation.errors)
	}

	const ratingValidation = validateRating(data.rating)
	if (!ratingValidation.isValid) {
		errors.push(...ratingValidation.errors)
	}

	// Validate optional fields
	const commentValidation = validateComment(data.comment)
	if (!commentValidation.isValid) {
		errors.push(...commentValidation.errors)
	}

	// Validate email if sharing is enabled
	if (data.shareEmail && data.userEmail) {
		const emailValidation = validateEmail(data.userEmail)
		if (!emailValidation.isValid) {
			errors.push(...emailValidation.errors)
		}
	}

	// Validate metadata fields
	if (!data.pageUrl || typeof data.pageUrl !== 'string') {
		errors.push('Page URL is required')
	}

	if (!data.pageTitle || typeof data.pageTitle !== 'string') {
		errors.push('Page title is required')
	}


	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
	if (typeof input !== 'string') return ''

	return input
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.replace(/\//g, '&#x2F;')
		.trim()
}

/**
 * Check if a URL is valid
 */
export function isValidUrl(url: string): boolean {
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}

/**
 * Check if the current domain is allowed based on allowed domains list
 */
export function isDomainAllowed(allowedDomains: string[], currentDomain?: string): boolean {
	// If no restrictions, allow all domains
	if (!allowedDomains || allowedDomains.length === 0) {
		return true
	}

	const domain = currentDomain || (typeof window !== 'undefined' ? window.location.hostname : '')

	return allowedDomains.some(allowedDomain => {
		// Exact match
		if (domain === allowedDomain) return true

		// Wildcard subdomain match (*.example.com)
		if (allowedDomain.startsWith('*.')) {
			const baseDomain = allowedDomain.substring(2)
			return domain.endsWith('.' + baseDomain) || domain === baseDomain
		}

		return false
	})
}

/**
 * Rate limiting utility - check if too many submissions in time window
 */
export function checkRateLimit(
	clientId: string,
	maxSubmissions: number = 5,
	timeWindowMs: number = 60000,
): { allowed: boolean; remainingTime?: number } {
	if (typeof localStorage === 'undefined') {
		// If no localStorage, allow all requests
		return { allowed: true }
	}

	const key = `feedback_rate_limit_${clientId}`
	const now = Date.now()

	try {
		const stored = localStorage.getItem(key)
		const submissions = stored ? JSON.parse(stored) : []

		// Remove submissions outside the time window
		const validSubmissions = submissions.filter((timestamp: number) => now - timestamp < timeWindowMs)

		if (validSubmissions.length >= maxSubmissions) {
			const oldestSubmission = Math.min(...validSubmissions)
			const remainingTime = timeWindowMs - (now - oldestSubmission)

			return {
				allowed: false,
				remainingTime: Math.ceil(remainingTime / 1000), // Convert to seconds
			}
		}

		// Add current timestamp and save
		validSubmissions.push(now)
		localStorage.setItem(key, JSON.stringify(validSubmissions))

		return { allowed: true }
	} catch (error) {
		// If localStorage operations fail, allow the request
		console.warn('Rate limiting failed:', error)
		return { allowed: true }
	}
}
