import React from "react";
import { FeedbackButtonProps } from "../types";

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  onClick,
  position,
  theme,
  isOpen,
}) => {
  const buttonClasses = `fb-btn fb-btn--${position} ${
    isOpen ? "fb-btn--open" : ""
  }`;

  const getIcon = () => {
    if (isOpen) return "✕";
    return null;
  };

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      aria-label="Open feedback"
      type="button"
      style={{
        background: `linear-gradient(135deg, ${theme.primary}, ${getSecondary(
          theme.primary
        )})`,
      }}
    >
      <span style={{ fontSize: "20px", transition: "transform 150ms ease" }}>
        {getIcon()}
      </span>
    </button>
  );
};

const colorNameToHex = (color: string): string => {
  if (color.startsWith('#')) return color;
  if (typeof document === 'undefined') return color;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return color;

  ctx.fillStyle = color;
  return ctx.fillStyle;
};

const getSecondary = (color: string) => {
  const hex = colorNameToHex(color);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${Math.min(255, Math.round(r * 0.3))
    .toString(16)
    .padStart(2, "0")}${Math.min(255, Math.round(g * 1.2))
    .toString(16)
    .padStart(2, "0")}${Math.min(255, Math.round(b * 1.1))
    .toString(16)
    .padStart(2, "0")}`;
};
