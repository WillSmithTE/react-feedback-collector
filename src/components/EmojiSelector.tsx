import React, { useState } from "react";
import {
  EMOJI_BACKGROUNDS,
  EMOJI_MAP,
  EmojiSelectorProps,
  FeedbackRating,
  RATING_LABELS,
} from "../types";
import { ARIA_LABELS } from "../utils/constants";

export const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  selectedRating,
  onRatingSelect,
  theme,
}) => {
  const [hoveredRating, setHoveredRating] = useState<FeedbackRating | null>(
    null
  );

  const handleRatingClick = (rating: FeedbackRating) => {
    onRatingSelect(rating);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    rating: FeedbackRating
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleRatingClick(rating);
    }
  };

  return (
    <div
      className="fb-es"
      role="radiogroup"
      aria-label={ARIA_LABELS.RATING_GROUP}
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
          isHovered && !isSelected && "fb-ec--hov"
        ].filter(Boolean).join(" ");

        return (
          <div
            key={rating}
            className={cardClasses}
            style={{ backgroundColor }}
          >
            <button
              type="button"
              className="fb-eb"
              onClick={() => handleRatingClick(ratingValue)}
              onKeyDown={(e) => handleKeyDown(e, ratingValue)}
              onMouseEnter={() => setHoveredRating(ratingValue)}
              onMouseLeave={() => setHoveredRating(null)}
              aria-label={ARIA_LABELS.RATING_OPTION(rating, label)}
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
              <div className="fb-el">
                {label}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
};
