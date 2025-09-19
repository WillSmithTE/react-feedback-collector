import React from 'react';
import { TextInputProps } from '../types';
import { ARIA_LABELS, MAX_COMMENT_LENGTH } from '../utils/constants';

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
  theme
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
    <div className="feedback-textarea-container">
      <textarea
        className="feedback-textarea"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ARIA_LABELS.COMMENT_INPUT}
        maxLength={MAX_COMMENT_LENGTH}
        rows={3}
      />
      <div 
        className={`feedback-char-count ${isNearLimit ? 'feedback-char-count--warning' : ''}`}
        style={{ 
          fontSize: '12px', 
          color: isNearLimit ? '#dc2626' : '#6b7280',
          textAlign: 'right',
          marginTop: '4px'
        }}
      >
        {remainingChars} characters remaining
      </div>
    </div>
  );
};