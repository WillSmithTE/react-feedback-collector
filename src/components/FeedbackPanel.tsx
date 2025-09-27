import React, { RefObject, useEffect, useRef, useState } from "react";
import {
  EMOJI_BACKGROUNDS,
  EMOJI_MAP,
  FeedbackData,
  FeedbackPanelProps,
  FeedbackRating,
  RATING_LABELS,
  ScreenshotData,
} from "../types";
import { ScreenshotUpload } from "./ScreenshotUpload";
import { getGradientEnd } from "../utils/colorUtils";

// Local hook for focus trapping
function useFocusTrap(containerRef: RefObject<HTMLElement>, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const getFocusableElements = () => {
      const selectors =
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return Array.from(container.querySelectorAll(selectors)) as HTMLElement[];
    };

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (event.shiftKey) {
        if (
          activeElement === firstElement ||
          !container.contains(activeElement)
        ) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (
          activeElement === lastElement ||
          !container.contains(activeElement)
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    container.addEventListener("keydown", handleTabKey);
    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }, [containerRef, enabled]);
}

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
  const [hoveredRating, setHoveredRating] = useState<FeedbackRating | null>(
    null
  );

  const [selectedRating, setSelectedRating] = useState<
    FeedbackRating | undefined
  >();
  const [comment, setComment] = useState("");
  const [shareEmail, setShareEmail] = useState(false);
  const [userEmail, setUserEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return window.localStorage.getItem("feedback_user_email") || "";
    } catch {
      return "";
    }
  });

  const [localEmail, setLocalEmail] = useState(userEmail);

  const saveEmailToStorage = (email: string) => {
    setUserEmail(email);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("feedback_user_email", email);
      } catch {}
    }
  };
  const [screenshots, setScreenshots] = useState<ScreenshotData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedRating(undefined);
      setComment("");
      setShareEmail(false);
      setLocalEmail(userEmail);
      setScreenshots([]);
      setSubmitMessage(null);
    }
  }, [isOpen, userEmail]);

  const canSubmit = selectedRating !== undefined && !isSubmitting;
  const remaining = 1000 - comment.length;
  const lowChars = remaining < 50;

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const feedbackData: FeedbackData = {
        rating: selectedRating,
        comment: comment.trim() || undefined,
        shareEmail,
        userEmail: shareEmail ? localEmail : undefined,
        screenshots: screenshots.length > 0 ? screenshots : undefined,
        metadata: {
          pageUrl:
            typeof window !== "undefined" ? window.location.href : "unknown",
          pageTitle:
            typeof document !== "undefined"
              ? document.title || "Untitled Page"
              : "unknown",
          referrer:
            typeof document !== "undefined"
              ? document.referrer || undefined
              : undefined,
          timestamp: Date.now(),
        },
      };

      await onSubmit(feedbackData);

      if (shareEmail && localEmail) {
        saveEmailToStorage(localEmail);
      }

      setSubmitMessage({
        type: "success",
        text: "Thank you!",
      });
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      if (canSubmit) {
        handleFormSubmit(event as any);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!panelRef.current) return;
      const target = event.target as Node;
      if (!target || panelRef.current.contains(target)) return;
      onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useFocusTrap(panelRef, isOpen);

  const panelClasses = `fb-pnl-base fb-pnl--${position} ${
    isOpen ? "fb-pnl--open" : "fb-pnl--closed"
  }`;
  const backdropClasses = `fb-backdrop ${
    isOpen ? "fb-backdrop--open" : "fb-backdrop--closed"
  }`;

  return (
    <>
      {isOpen && (
        <div
          className={backdropClasses}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
          onClick={onClose}
          aria-label="Close modal"
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={panelClasses}
        style={{
          backgroundColor: theme.background,
          borderLeft:
            position === "right" ? `1px solid ${theme.border}` : undefined,
          borderRight:
            position === "left" ? `1px solid ${theme.border}` : undefined,
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
            {submitMessage && (
              <div
                className={`fb-msg fb-msg--header ${
                  submitMessage.type === "success"
                    ? "fb-msg--ok"
                    : "fb-msg--err"
                }`}
              >
                {submitMessage.type === "success" ? "✓" : "⚠"}{" "}
                {submitMessage.text}
              </div>
            )}
            <button
              className="fb-close-btn"
              style={{ color: theme.text }}
              onClick={onClose}
              aria-label="Close"
              type="button"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleFormSubmit} onKeyDown={handleKeyDown}>
            {/* Emoji Rating */}
            <div>
              <div
                className="fb-es"
                role="radiogroup"
                aria-label="Rate experience"
              >
                {[1, 2, 3, 4].map((rating) => {
                  const ratingValue = rating as FeedbackRating;
                  const isSelected = selectedRating === ratingValue;
                  const emoji = EMOJI_MAP[ratingValue];
                  const label = RATING_LABELS[ratingValue];
                  const backgroundColor = EMOJI_BACKGROUNDS[ratingValue];
                  const isHovered = hoveredRating === ratingValue;

                  const cardClasses = [
                    "fb-ec",
                    isSelected && "fb-ec--sel",
                    isHovered && !isSelected && "fb-ec--hov",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <div
                      key={rating}
                      className={cardClasses}
                      style={{ backgroundColor }}
                    >
                      <button
                        type="button"
                        className="fb-eb"
                        onClick={() => setSelectedRating(ratingValue)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedRating(ratingValue);
                          }
                        }}
                        onMouseEnter={() => setHoveredRating(ratingValue)}
                        onMouseLeave={() => setHoveredRating(null)}
                        aria-label={`${rating}: ${label}`}
                        aria-pressed={isSelected}
                        role="radio"
                        aria-checked={isSelected}
                      >
                        <div
                          className={`fb-ei ${isHovered ? "fb-ei--hov" : ""}`}
                        >
                          <span role="img" aria-label={label}>
                            {emoji}
                          </span>
                        </div>
                        <div className="fb-el">{label}</div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comment Input */}
            <div>
              <div>
                <textarea
                  className="fb-ta"
                  style={{
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                    backgroundColor: theme.background,
                  }}
                  value={comment}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length <= 1000) {
                      setComment(newValue);
                    }
                  }}
                  placeholder={placeholder}
                  aria-label="Comments"
                  maxLength={1000}
                  rows={3}
                />
                <div
                  style={{
                    fontSize: "12px",
                    color: lowChars ? "#dc2626" : theme.text,
                    opacity: lowChars ? 1 : 0.6,
                    textAlign: "right",
                    marginTop: "4px",
                  }}
                >
                  {remaining} characters remaining
                </div>
              </div>
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
              <div className="fb-email">
                <label className="fb-email-lbl" style={{ color: theme.text }}>
                  <input
                    type="checkbox"
                    checked={shareEmail}
                    onChange={(e) => setShareEmail(e.target.checked)}
                    aria-label="Share email"
                    className="fb-email-cb"
                  />
                  <span>Share my email</span>
                </label>

                {shareEmail && (
                  <input
                    type="email"
                    className="fb-email-inp"
                    style={{
                      border: `1px solid ${theme.border}`,
                      color: theme.text,
                      backgroundColor: theme.background,
                    }}
                    value={localEmail}
                    onChange={(e) => {
                      const newEmail = e.target.value;
                      if (newEmail.length <= 254) {
                        setLocalEmail(newEmail);
                      }
                    }}
                    placeholder="your.email@example.com"
                    aria-label="Email"
                    maxLength={254}
                    autoComplete="email"
                  />
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              className={`fb-sub ${!canSubmit ? "fb-sub--dis" : ""}`}
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${getGradientEnd(theme.primary)})`,
                color: '#ffffff',
                ...(canSubmit ? {} : { opacity: 0.6, cursor: 'not-allowed' })
              }}
              disabled={!canSubmit}
              aria-label="Submit"
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
