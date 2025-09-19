import React, { useState, useRef } from 'react'
import { ScreenshotData, WidgetTheme } from '../types'

interface ScreenshotUploadProps {
	screenshots: ScreenshotData[]
	onScreenshotsChange: (screenshots: ScreenshotData[]) => void
	theme: WidgetTheme
	baseUrl: string
	clientId: string
}

export const ScreenshotUpload: React.FC<ScreenshotUploadProps> = ({
	screenshots,
	onScreenshotsChange,
	theme,
	baseUrl,
	clientId,
}) => {
	const [isUploading, setIsUploading] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		// Validate file
		if (!file.type.startsWith('image/')) {
			setUploadError('Please select an image file')
			return
		}

		if (file.size > 10 * 1024 * 1024) {
			setUploadError('File size must be less than 10MB')
			return
		}

		setIsUploading(true)
		setUploadError(null)

		try {
			const formData = new FormData()
			formData.append('screenshot', file)
			formData.append('clientId', clientId)

			const response = await fetch(`${baseUrl}/api/screenshots`, {
				method: 'POST',
				body: formData,
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Upload failed')
			}

			if (result.success && result.screenshot) {
				// Add the new screenshot to the list
				onScreenshotsChange([...screenshots, result.screenshot])
			}
		} catch (error) {
			console.error('Screenshot upload error:', error)
			setUploadError(error instanceof Error ? error.message : 'Upload failed')
		} finally {
			setIsUploading(false)
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
	}

	const removeScreenshot = (index: number) => {
		const newScreenshots = screenshots.filter((_, i) => i !== index)
		onScreenshotsChange(newScreenshots)
	}

	return (
		<div style={{ marginBottom: '16px' }}>
			{/* Upload Button */}
			<div style={{ marginBottom: '8px' }}>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileSelect}
					style={{ display: 'none' }}
				/>
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					disabled={isUploading || screenshots.length >= 3}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						padding: '8px 12px',
						border: '1px solid #e5e7eb',
						borderRadius: '6px',
						background: isUploading || screenshots.length >= 3 ? '#f9fafb' : '#fff',
						color: isUploading || screenshots.length >= 3 ? '#9ca3af' : '#374151',
						cursor: isUploading || screenshots.length >= 3 ? 'not-allowed' : 'pointer',
						fontSize: '14px',
						fontFamily: 'inherit',
						transition: 'all 0.2s',
					}}
				>
					{isUploading ? (
						<>
							<span style={{
								width: '14px',
								height: '14px',
								border: '2px solid #e5e7eb',
								borderTop: '2px solid #3b82f6',
								borderRadius: '50%',
								animation: 'spin 1s linear infinite',
							}} />
							Uploading...
						</>
					) : (
						<>
							📷 Add Screenshot
						</>
					)}
				</button>
			</div>

			{/* Error Message */}
			{uploadError && (
				<div style={{
					padding: '8px 12px',
					backgroundColor: '#fef2f2',
					border: '1px solid #fecaca',
					borderRadius: '6px',
					color: '#dc2626',
					fontSize: '14px',
					marginBottom: '8px',
				}}>
					⚠ {uploadError}
				</div>
			)}

			{/* Screenshot Previews */}
			{screenshots.length > 0 && (
				<div style={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '8px',
					marginBottom: '8px',
				}}>
					{screenshots.map((screenshot, index) => (
						<div key={index} style={{
							position: 'relative',
							width: '80px',
							height: '60px',
							borderRadius: '6px',
							overflow: 'hidden',
							border: '1px solid #e5e7eb',
						}}>
							<img
								src={screenshot.url}
								alt={`Screenshot ${index + 1}`}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
							/>
							<button
								type="button"
								onClick={() => removeScreenshot(index)}
								aria-label="Remove screenshot"
								style={{
									position: 'absolute',
									top: '2px',
									right: '2px',
									width: '18px',
									height: '18px',
									borderRadius: '50%',
									border: 'none',
									background: 'rgba(0, 0, 0, 0.6)',
									color: 'white',
									cursor: 'pointer',
									fontSize: '12px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									lineHeight: '1',
								}}
							>
								✕
							</button>
						</div>
					))}
				</div>
			)}

			{screenshots.length >= 3 && (
				<div style={{
					fontSize: '12px',
					color: '#6b7280',
					fontStyle: 'italic',
				}}>
					Maximum 3 screenshots allowed
				</div>
			)}

			<style>{`
				@keyframes spin {
					to { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	)
}