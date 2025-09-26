import {
  DEFAULT_API_URL,
  FeedbackSubmission,
  SubmissionResponse,
} from "../types";

class FeedbackApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = DEFAULT_API_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async submitFeedback(data: FeedbackSubmission): Promise<SubmissionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Ignore JSON parsing errors
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
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      };
    }
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, "");
  }
}

// Export singleton instance
export const apiClient = new FeedbackApiClient();

// Export class for custom instances
export { FeedbackApiClient };
