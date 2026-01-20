import { FeedbackSubmission, ValidationResult } from "../types";

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

  if (data.shareEmail && !data.userEmail) {
    errors.push("Email required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

const esc: Record<string, string> = {"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"};
export function sanitizeInput(input: string): string {
  return typeof input === "string" ? input.replace(/[<>"'/]/g, c => esc[c] || c).trim() : "";
}
