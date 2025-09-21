import React from "react";
import { TextInputProps } from "../types";
import { ARIA_LABELS, MAX_COMMENT_LENGTH } from "../utils/constants";

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
  theme,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;

    // Enforce max length
    if (newValue.length <= MAX_COMMENT_LENGTH) {
      onChange(newValue);
    }
  };

  const remainingChars = MAX_COMMENT_LENGTH - value.length;
  const isNearLimit = remainingChars < 50;

  return (
    <div>
      <textarea
        className="fb-ta"
        style={{
          border: `1px solid ${theme.border}`,
          color: theme.text,
          backgroundColor: theme.background,
        }}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ARIA_LABELS.COMMENT_INPUT}
        maxLength={MAX_COMMENT_LENGTH}
        rows={3}
      />
      <div
        style={{
          fontSize: "12px",
          color: isNearLimit ? "#dc2626" : theme.text,
          opacity: isNearLimit ? 1 : 0.6,
          textAlign: "right",
          marginTop: "4px",
        }}
      >
        {remainingChars} characters remaining
      </div>
    </div>
  );
};
