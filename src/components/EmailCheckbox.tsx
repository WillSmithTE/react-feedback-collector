import React from "react";
import { EmailCheckboxProps } from "../types";
import { ARIA_LABELS, MAX_EMAIL_LENGTH } from "../utils/constants";

export const EmailCheckbox: React.FC<EmailCheckboxProps> = ({
  checked,
  onChange,
  email,
  onEmailChange,
  theme,
}) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;

    // Enforce max length
    if (newEmail.length <= MAX_EMAIL_LENGTH) {
      onEmailChange(newEmail);
    }
  };

  return (
    <div className="fb-email">
      <label className="fb-email-lbl" style={{ color: theme.text }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
          aria-label={ARIA_LABELS.EMAIL_CHECKBOX}
          className="fb-email-cb"
        />
        <span>Share my email</span>
      </label>

      {checked ? (
        <input
          type="email"
          className="fb-email-inp"
          style={{
            border: `1px solid ${theme.border}`,
            color: theme.text,
            backgroundColor: theme.background,
          }}
          value={email}
          onChange={handleEmailChange}
          placeholder="your.email@example.com"
          aria-label={ARIA_LABELS.EMAIL_INPUT}
          maxLength={MAX_EMAIL_LENGTH}
          autoComplete="email"
        />
      ) : null}
    </div>
  );
};
