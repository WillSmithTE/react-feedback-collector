// Base CSS content for the feedback widget
export const CSS_CONTENT = `/* Base widget styles - injected dynamically */
.feedback-widget {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}

.feedback-widget *,
.feedback-widget *::before,
.feedback-widget *::after {
  box-sizing: border-box;
}

/* Button styles */
.feedback-button {
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 150ms ease;
  z-index: 9998;
  background: linear-gradient(135deg, #2563eb, #14b8a6);
  color: #ffffff;
  box-shadow: var(--feedback-shadow);
}

.feedback-button:hover {
  transform: scale(1.05);
}

.feedback-button:active {
  transform: scale(0.95);
}

/* Button positioning */
.feedback-button--slide-right {
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

.feedback-button--slide-right.feedback-button--slide-open {
}

.feedback-button--slide-left {
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
}

.feedback-button--slide-left.feedback-button--slide-open {
}

.feedback-button--popup-right {
  bottom: 20px;
  right: 20px;
}

.feedback-button--popup-left {
  bottom: 20px;
  left: 20px;
}

/* SemiCircle Button styles */
.feedback-button-semicircle {
  position: fixed;
  width: 50px;
  height: 50px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 9998;
  background: linear-gradient(135deg, #2563eb, #14b8a6);
  color: #ffffff;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
}

.feedback-button-semicircle--right {
  right: -25px;
  border-radius: 40px 0 0 40px;
  padding-right: 8px;
  box-shadow: -4px 0 15px rgba(37, 99, 235, 0.3);
}

.feedback-button-semicircle--left {
  left: -25px;
  border-radius: 0 40px 40px 0;
  padding-left: 8px;
  box-shadow: 4px 0 15px rgba(37, 99, 235, 0.3);
}

.feedback-button-semicircle:hover.feedback-button-semicircle--right {
  right: -15px;
  transform: translateY(-50%) scale(1.05);
  box-shadow: -6px 0 20px rgba(37, 99, 235, 0.4);
}

.feedback-button-semicircle:hover.feedback-button-semicircle--left {
  left: -15px;
  transform: translateY(-50%) scale(1.05);
  box-shadow: 6px 0 20px rgba(37, 99, 235, 0.4);
}

.feedback-button-semicircle__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 200ms ease;
}

.feedback-button-semicircle:hover .feedback-button-semicircle__icon {
  transform: rotate(10deg);
}

.feedback-button-semicircle--slide-open.feedback-button-semicircle--right {
}

.feedback-button-semicircle--slide-open.feedback-button-semicircle--left {
}

/* Panel styles (slide layout) */
.feedback-panel {
  position: fixed;
  top: 20vh;
  width: 400px;
  max-width: 90vw;
  height: auto;
  max-height: 60vh;
  background-color: var(--feedback-background);
  box-shadow: var(--feedback-shadow);
  transition: transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 16px;
}

.feedback-panel--right {
  right: 0;
  border-left: 1px solid var(--feedback-border);
  transform: translateX(100%);
}

.feedback-panel--left {
  left: 0;
  border-right: 1px solid var(--feedback-border);
  transform: translateX(-100%);
}

.feedback-panel--open.feedback-panel--right {
  transform: translateX(0px);
}

.feedback-panel--open.feedback-panel--left {
  transform: translateX(0px);
}

/* Panel backdrop (for enhanced slide layout) */
.feedback-panel-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 300ms ease;
  z-index: 9999;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feedback-panel-backdrop--open {
  opacity: 1;
}

/* Modal styles (popup layout) */
.feedback-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 150ms ease;
  z-index: 9999;
  backdrop-filter: blur(2px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20vh;
}

.feedback-backdrop--open {
  opacity: 1;
}

.feedback-modal {
  width: 480px;
  max-width: 90vw;
  max-height: 60vh;
  background-color: var(--feedback-background);
  border: 1px solid var(--feedback-border);
  border-radius: 12px;
  box-shadow: var(--feedback-shadow);
  transform: scale(0.95);
  opacity: 0;
  transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.feedback-modal--open {
  transform: scale(1);
  opacity: 1;
}

/* Content area */
.feedback-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  color: var(--feedback-text);
}

/* Header */
.feedback-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--feedback-border);
  margin-bottom: 4px;
}

.feedback-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--feedback-text);
  margin: 0;
}

.feedback-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: var(--feedback-text);
  opacity: 0.7;
  transition: opacity 150ms ease;
  line-height: 1;
}

.feedback-close:hover {
  opacity: 1;
}

/* Emoji selector */
.feedback-emoji-selector {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding-bottom: 10px;
}

.feedback-emoji-card {
  border-radius: 16px;
  padding: 5px;
  transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  border: 3px solid transparent;
  cursor: pointer;
  text-align: center;
}

.feedback-emoji-card:hover {
  transform: scale(1.05);
}

.feedback-emoji-card--selected {
  border-color: #2563eb;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
}

.feedback-emoji-button {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 100%;
  padding: 0;
  transition: all 200ms ease;
}

.feedback-emoji-button__emoji {
  font-size: 36px;
  transition: transform 200ms ease;
}
@media (max-width: 768px) {
  .feedback-emoji-button__emoji {
    font-size: 24px;
  }
}

.feedback-emoji-button:hover .feedback-emoji-button__emoji {
  transform: scale(1.1);
}

.feedback-emoji-button__label {
  font-size: 13px;
  font-weight: 600;
  color: currentColor;
  line-height: 1.2;
}

/* Emoji card colors based on rating */
.feedback-emoji-card[style*="255, 107, 107"] .feedback-emoji-button__label {
  color: #ef4444;
}

.feedback-emoji-card[style*="156, 163, 175"] .feedback-emoji-button__label {
  color: #6b7280;
}

.feedback-emoji-card[style*="59, 130, 246"] .feedback-emoji-button__label {
  color: #3b82f6;
}

.feedback-emoji-card[style*="245, 158, 11"] .feedback-emoji-button__label {
  color: #f59e0b;
}

/* Text input */
.feedback-textarea {
  width: 100%;
  min-height: 90px;
  padding: 16px;
  border: 2px solid var(--feedback-border);
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.4;
  color: var(--feedback-text);
  resize: vertical;
  font-family: inherit;
  transition: all 200ms ease;
  outline: none;
}

.feedback-textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.feedback-textarea::placeholder {
  color: var(--feedback-text-muted);
}

/* Email section */
.feedback-email-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.feedback-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--feedback-text);
  cursor: pointer;
}

.feedback-checkbox input {
  margin: 0;
  cursor: pointer;
  color-scheme: light;
}

.feedback-email-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--feedback-border);
  border-radius: 4px;
  font-size: 14px;
  color: var(--feedback-text);
  background-color: var(--feedback-background);
  outline: none;
  transition: border-color 150ms ease;
}

.feedback-email-input:focus {
  border-color: var(--feedback-primary);
}

/* Submit button */
.feedback-submit {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #2563eb, #14b8a6);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transform: perspective(1px) translateZ(0);
}

.feedback-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
}

.feedback-submit:disabled {
  background-color: var(--feedback-border);
  color: var(--feedback-text);
  cursor: not-allowed;
  opacity: 0.7;
}

/* Messages */
.feedback-error {
  padding: 12px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feedback-success {
  padding: 12px;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  color: #16a34a;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

/* Loading spinner */
.feedback-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: feedback-spin 1s linear infinite;
}

/* Animations */
@keyframes feedback-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Focus styles for accessibility */
.feedback-widget *:focus {
  outline: 2px solid var(--feedback-primary);
  outline-offset: 2px;
}

.feedback-widget *:focus:not(:focus-visible) {
  outline: none;
}

.feedback-widget *:focus-visible {
  outline: 2px solid var(--feedback-primary);
  outline-offset: 2px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .feedback-panel {
    width: 100% !important;
    max-width: none !important;
    top: 10vh !important;
    max-height: 70vh !important;
  }
  
  .feedback-modal {
    width: 95% !important;
    max-width: none !important;
    margin: 10px !important;
    max-height: 70vh !important;
  }
  
  .feedback-backdrop {
    padding-top: 10vh !important;
  }
  
  .feedback-button {
    width: 50px !important;
    height: 50px !important;
    font-size: 20px !important;
  }
  
  .feedback-button--slide-right.feedback-button--slide-open {
    right: 10px !important;
  }
  
  .feedback-button--slide-left.feedback-button--slide-open {
    left: 10px !important;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .feedback-panel,
  .feedback-modal,
  .feedback-button,
  .feedback-backdrop,
  .feedback-emoji-button,
  .feedback-submit {
    transition: none !important;
    animation: none !important;
  }
}`
