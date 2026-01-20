import React, { useEffect, useState } from "react";
import { useFeedbackApi } from "../hooks/useFeedbackApi";
import { mergeTheme } from "../styles/themes";
import {
  FeedbackData,
  FeedbackSubmission,
  FeedbackWidgetProps,
} from "../types";
import { FeedbackApiClient } from "../utils/api";
import { injectFeedbackCSS } from "../utils/styles";
import { FeedbackButton } from "./FeedbackButton";
import { FeedbackPanel } from "./FeedbackPanel";

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  clientId,
  position = "right",
  theme: customTheme,
  title = "Share Feedback",
  placeholder = "Tell us what you think... (optional)",
  showEmailOption = true,
  showScreenshotOption = true,
  environment,
  baseUrl,
  onSubmit,
  onError,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const theme = mergeTheme(customTheme);
  const { submitFeedback, isLoading, error } = useFeedbackApi(baseUrl);

  // Initialize widget - validate client ID and inject minimal styles
  useEffect(() => {
    const initialize = async () => {
      try {
        if (!clientId || clientId.length < 3) {
          throw new Error("Invalid config. Contact admin.");
        }

        // Inject CSS file with responsive styles
        injectFeedbackCSS();

        setIsInitialized(true);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error occurred. Try again.";
        setInitError(errorMessage);

        if (onError) {
          onError(new Error(errorMessage));
        }
      }
    };

    initialize();
  }, [clientId, onError]);

  const handleOpen = () => {
    new FeedbackApiClient(baseUrl).ping();
    setIsOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = async (feedbackData: FeedbackData) => {
    try {
      // Prepare submission data
      const submissionData: FeedbackSubmission = {
        clientId,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        shareEmail: feedbackData.shareEmail,
        userEmail: feedbackData.userEmail,
        pageUrl: feedbackData.metadata.pageUrl,
        pageTitle: feedbackData.metadata.pageTitle,
        referrer: feedbackData.metadata.referrer,
        environment,
        screenshots: feedbackData.screenshots,
      };

      // Submit to API
      const response = await submitFeedback(submissionData);

      if (response.success) {
        if (onSubmit) {
          onSubmit(feedbackData);
        }
      } else {
        throw new Error(response.error || "Error occurred. Try again.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error occurred. Try again.";

      if (onError) {
        onError(new Error(errorMessage));
      }

      // Re-throw so the component can display the error
      throw err;
    }
  };

  // Don't render if initialization failed
  if (initError) {
    return null;
  }

  // Don't render until initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <div>
      {/* Trigger Button */}
      <FeedbackButton
        onClick={handleOpen}
        position={position}
        theme={theme}
        isOpen={isOpen}
      />

      {/* Feedback Panel */}
      <FeedbackPanel
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title={title}
        placeholder={placeholder}
        showEmailOption={showEmailOption}
        showScreenshotOption={showScreenshotOption}
        theme={theme}
        position={position}
        baseUrl={baseUrl || "https://usero.io"}
        clientId={clientId}
      />
    </div>
  );
};

// Default export for easier importing
export default FeedbackWidget;
