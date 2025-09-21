import { useEffect, useState } from "react";
import { FeedbackData, FeedbackRating, ScreenshotData } from "../types";
import { collectPageMetadata } from "../utils/metadata";
import { useUserEmail } from "./useLocalStorage";

interface UseFeedbackFormProps {
  isOpen: boolean;
  onSubmit: (data: FeedbackData) => Promise<void>;
  onSuccess?: () => void;
}

export const useFeedbackForm = ({
  isOpen,
  onSubmit,
  onSuccess,
}: UseFeedbackFormProps) => {
  const [selectedRating, setSelectedRating] = useState<
    FeedbackRating | undefined
  >();
  const [comment, setComment] = useState("");
  const [shareEmail, setShareEmail] = useState(false);
  const [userEmail, setUserEmailStorage] = useUserEmail();
  const [localEmail, setLocalEmail] = useState(userEmail);
  const [screenshots, setScreenshots] = useState<ScreenshotData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Clear form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRating(undefined);
      setComment("");
      setShareEmail(false);
      setLocalEmail(userEmail);
      setScreenshots([]);
      setSubmitMessage(null);
    }
  }, [isOpen, userEmail]);

  const handleSubmit = async () => {
    if (!selectedRating) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const feedbackData: FeedbackData = {
        rating: selectedRating,
        comment: comment.trim() || undefined,
        shareEmail,
        userEmail: shareEmail ? localEmail : undefined,
        screenshots: screenshots.length > 0 ? screenshots : undefined,
        metadata: collectPageMetadata(),
      };

      await onSubmit(feedbackData);

      // Save email to localStorage only after successful submission
      if (shareEmail && localEmail) {
        setUserEmailStorage(localEmail);
      }

      setSubmitMessage({
        type: "success",
        text: "Thank you for your feedback!",
      });

      // Call optional success callback (for auto-close functionality)
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to submit feedback",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = selectedRating !== undefined && !isSubmitting;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      handleSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canSubmit) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return {
    selectedRating,
    setSelectedRating,
    comment,
    setComment,
    shareEmail,
    setShareEmail,
    localEmail,
    setLocalEmail,
    screenshots,
    setScreenshots,
    isSubmitting,
    submitMessage,
    canSubmit,
    handleSubmit,
    handleFormSubmit,
    handleKeyDown,
  };
};
