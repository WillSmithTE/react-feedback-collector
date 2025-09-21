import React, { useMemo, useRef } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { useFeedbackForm } from "../hooks/useFeedbackForm";
import { useFocusTrap } from "../hooks/useKeyboard";
import { FeedbackPanelProps } from "../types";
import { ARIA_LABELS } from "../utils/constants";
import { EmailCheckbox } from "./EmailCheckbox";
import { EmojiSelector } from "./EmojiSelector";
import { ScreenshotUpload } from "./ScreenshotUpload";
import { TextInput } from "./TextInput";

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
  const panelRef = useRef<HTMLDivElement>(null);

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
  });

  // Handle outside clicks and escape key
  useClickOutside(panelRef, onClose, { enabled: isOpen });
  useFocusTrap(panelRef, isOpen);

  const panelClasses = `fb-pnl-base fb-pnl--${position} ${isOpen ? "fb-pnl--open" : "fb-pnl--closed"}`;
  const backdropClasses = `fb-backdrop ${isOpen ? "fb-backdrop--open" : "fb-backdrop--closed"}`;

  return (
    <>
      {isOpen && (
        <div
          className={backdropClasses}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
          onClick={onClose}
          aria-label={ARIA_LABELS.MODAL_BACKDROP}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={panelClasses}
        style={{
          backgroundColor: theme.background,
          borderLeft: position === "right" ? `1px solid ${theme.border}` : undefined,
          borderRight: position === "left" ? `1px solid ${theme.border}` : undefined,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
      >
        <div className="fb-cnt">
          {/* Header */}
          <div
            className="fb-hdr"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <h2
              id="feedback-title"
              className="fb-ttl"
              style={{ color: theme.text }}
            >
              {title}
            </h2>
            <button
              className="fb-close-btn"
              style={{ color: theme.text }}
              onClick={onClose}
              aria-label={ARIA_LABELS.CLOSE_BUTTON}
              type="button"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleFormSubmit} onKeyDown={handleKeyDown}>
            {/* Success/Error Messages */}
            {submitMessage && (
              <div
                className={`fb-msg ${submitMessage.type === "success" ? "fb-msg--ok" : "fb-msg--err"}`}
              >
                {submitMessage.type === "success" ? "✓" : "⚠"}{" "}
                {submitMessage.text}
              </div>
            )}

            {/* Emoji Rating */}
            <div>
              <EmojiSelector
                selectedRating={selectedRating}
                onRatingSelect={setSelectedRating}
                theme={theme}
              />
            </div>

            {/* Comment Input */}
            <div>
              <TextInput
                value={comment}
                onChange={setComment}
                placeholder={placeholder}
                theme={theme}
              />
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
            <button
              className={`fb-sub ${!canSubmit ? "fb-sub--dis" : ""}`}
              style={!canSubmit ? {
                backgroundColor: theme.border,
                color: theme.text,
              } : {}}
              disabled={!canSubmit}
              aria-label={ARIA_LABELS.SUBMIT_BUTTON}
              type="submit"
            >
              {isSubmitting && <span className="fb-spin" />}
              {isSubmitting ? "Submitting..." : "Send Feedback 🚀"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
