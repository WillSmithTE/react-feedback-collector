import React from "react";
import { FeedbackButtonProps } from "../types";
import { getGradientEnd } from "../utils/colorUtils";

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  onClick,
  position,
  theme,
  isOpen,
}) => (
  <button
    className={`fb-btn fb-btn--${position} ${isOpen ? "fb-btn--open" : ""}`}
    onClick={onClick}
    aria-label="Open feedback"
    type="button"
    style={{
      background: `linear-gradient(135deg, ${theme.primary}, ${getGradientEnd(theme.primary)})`,
    }}
  >
    <span style={{ fontSize: "20px", transition: "transform 150ms ease" }}>
      {isOpen ? "✕" : null}
    </span>
  </button>
);

