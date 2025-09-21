import React from "react";
import { FeedbackButtonProps } from "../types";
import { ARIA_LABELS } from "../utils/constants";

const showSpeechBubble = false;
export const SemiCircleButton: React.FC<FeedbackButtonProps> = ({
  onClick,
  position,
  theme,
  isOpen,
}) => {
  const buttonClasses = `fb-btn fb-btn--${position} ${isOpen ? "fb-btn--open" : ""}`;

  // Icon changes based on position for better visual flow
  const getIcon = () => {
    if (isOpen) {
      return position === "right" ? "✕" : "✕";
    }
    return showSpeechBubble ? "💬" : null;
  };

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      aria-label={ARIA_LABELS.WIDGET_BUTTON}
      type="button"
    >
      <span style={{ fontSize: "20px", transition: "transform 150ms ease" }}>
        {getIcon()}
      </span>
    </button>
  );
};
