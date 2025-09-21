import React from "react";
import { FeedbackButtonProps } from "../types";
import { SemiCircleButton } from "./SemiCircleButton";

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  onClick,
  position,
  button,
  theme,
  isOpen,
}) => {
  return (
    <SemiCircleButton
      onClick={onClick}
      position={position}
      button={button}
      theme={theme}
      isOpen={isOpen}
    />
  );
};
