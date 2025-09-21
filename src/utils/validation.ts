import { FeedbackSubmission, ValidationResult } from "../types";

/**
 * Validate a complete feedback submission
 */
export function validateFeedbackSubmission(
  data: Partial<FeedbackSubmission>
): ValidationResult {
  const errors: string[] = [];
  if (data.rating === null || data.rating === undefined) {
    errors.push("Missing rating");
  } else if (![1, 2, 3, 4].includes(data.rating)) {
    errors.push("Invalid rating");
  }

  // Validate comment
  if (data.comment && typeof data.comment === "string") {
    if (data.comment.length > 1000) {
      errors.push("Comment too long");
    }
    if (/<script[^>]*>.*?<\/script>/gi.test(data.comment)) {
      errors.push("Invalid comment");
    }
  }

  if (data.shareEmail && data.userEmail) {
    if (!data.userEmail) {
      errors.push("Email required");
    } else if (typeof data.userEmail !== "string") {
      errors.push("Invalid email");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}
