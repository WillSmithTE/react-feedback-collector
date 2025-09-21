import React, { useEffect, useState } from "react";
import { useFeedbackApi } from "../hooks/useFeedbackApi";
import { mergeTheme } from "../styles/themes";
import {
  DEFAULT_API_URL,
  FeedbackData,
  FeedbackSubmission,
  FeedbackWidgetProps,
} from "../types";
import {
  DEFAULT_PLACEHOLDER,
  DEFAULT_POSITION,
  DEFAULT_TITLE,
  ERROR_MESSAGES,
} from "../utils/constants";
import { injectFeedbackCSS } from "../utils/styles";
import { FeedbackButton } from "./FeedbackButton";
import { FeedbackPanel } from "./FeedbackPanel";

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  clientId,
  position = DEFAULT_POSITION,
  button = "semiCircle",
  theme: customTheme,
  title = DEFAULT_TITLE,
  placeholder = DEFAULT_PLACEHOLDER,
  showEmailOption = true,
  showScreenshotOption = true,
  autoClose = true,
  debug = false,
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
          throw new Error(ERROR_MESSAGES.INVALID_CLIENT_ID);
        }

        // Inject CSS file with responsive styles
        injectFeedbackCSS();

        setIsInitialized(true);

        if (debug) {
          console.log("FeedbackWidget initialized", {
            clientId,
            position,
            button,
            theme,
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
        setInitError(errorMessage);

        if (onError) {
          onError(new Error(errorMessage));
        }

        if (debug) {
          console.error("FeedbackWidget initialization failed:", err);
        }
      }
    };

    initialize();
  }, [clientId, debug, onError]);

  const handleOpen = () => {
    setIsOpen(true);
    if (onOpen) {
      onOpen();
    }
    if (debug) {
      console.log("FeedbackWidget opened");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
    if (debug) {
      console.log("FeedbackWidget closed");
    }
  };

  const handleSubmit = async (feedbackData: FeedbackData) => {
    try {
      if (debug) {
        console.log("Submitting feedback:", feedbackData);
      }

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

        if (debug) {
          console.log("Feedback submitted successfully:", response);
        }
      } else {
        throw new Error(response.error || ERROR_MESSAGES.GENERIC_ERROR);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;

      if (onError) {
        onError(new Error(errorMessage));
      }

      if (debug) {
        console.error("Feedback submission failed:", err);
      }

      // Re-throw so the component can display the error
      throw err;
    }
  };

  // Don't render if initialization failed
  if (initError) {
    if (debug) {
      return (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#fee",
            border: "1px solid #fcc",
            padding: "10px",
            borderRadius: "4px",
            color: "#c44",
            fontSize: "12px",
            maxWidth: "300px",
            zIndex: 10001,
          }}
        >
          FeedbackWidget Error: {initError}
        </div>
      );
    }
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
        button={button}
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
        baseUrl={baseUrl || DEFAULT_API_URL}
        clientId={clientId}
      />
    </div>
  );
};

// Default export for easier importing
export default FeedbackWidget;
