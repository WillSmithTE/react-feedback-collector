import {
  DEFAULT_API_URL,
  FeedbackSubmission,
  SubmissionResponse,
} from "../types";

class FeedbackApiClient {
  private baseUrl: string;
  private retries: number;

  constructor(baseUrl: string = DEFAULT_API_URL, retryAttempts: number = 3) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Clean base URL only
    this.retries = retryAttempts;
  }

  async submitFeedback(data: FeedbackSubmission): Promise<SubmissionResponse> {
    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}/api/feedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(10000), // 10 seconds
        });

        if (!response.ok) {
          // Handle HTTP errors
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

          try {
            const errorData = await response.json();
            if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch {
            // Ignore JSON parsing errors for error responses
          }

          throw new Error(errorMessage);
        }

        const result = await response.json();
        return {
          success: true,
          data: result,
          message: result.message || "Feedback submitted successfully",
        };
      } catch (error) {
        console.warn(`Feedback submission attempt ${attempt} failed:`, error);

        if (attempt === this.retries) {
          if (error instanceof Error) {
            return {
              success: false,
              error: error.message,
            };
          }
          return {
            success: false,
            error: "An unexpected error occurred while submitting feedback",
          };
        }

        await this.delay(retryDelay * attempt);
      }
    }

    return {
      success: false,
      error: "Maximum retry attempts exceeded",
    };
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, "");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
const retryDelay = 1000;

// Export singleton instance
export const apiClient = new FeedbackApiClient();

// Export class for custom instances
export { FeedbackApiClient };
