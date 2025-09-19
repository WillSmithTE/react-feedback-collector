import React from 'react';
import { FeedbackButtonProps } from '../types';
import { ARIA_LABELS } from '../utils/constants';
import { SemiCircleButton } from './SemiCircleButton';

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  onClick,
  style,
  position,
  button,
  theme,
  isOpen
}) => {
  // If it's a semicircle button, use the SemiCircleButton component
  if (button === 'semiCircle') {
    return (
      <SemiCircleButton
        onClick={onClick}
        style={style}
        position={position}
        button={button}
        theme={theme}
        isOpen={isOpen}
      />
    );
  }

  // Otherwise, use the original speech bubble button
  const getButtonClass = () => {
    const baseClass = 'feedback-button';
    const styleClass = `feedback-button--${style}-${position}`;
    const openClass = isOpen ? `feedback-button--${style}-open` : '';
    
    return [baseClass, styleClass, openClass].filter(Boolean).join(' ');
  };

  return (
    <button
      className={getButtonClass()}
      onClick={onClick}
      aria-label={ARIA_LABELS.WIDGET_BUTTON}
      type="button"
    >
      💬
    </button>
  );
};