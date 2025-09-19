import { FeedbackSubmission, SubmissionResponse, DEFAULT_API_URL } from '../types';

/**
 * HTTP client for feedback API communication
 */
class FeedbackApiClient {
  private baseUrl: string;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(baseUrl: string = DEFAULT_API_URL, retryAttempts: number = 3, retryDelay: number = 1000) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Clean base URL only
    this.retryAttempts = retryAttempts;
    this.retryDelay = retryDelay;
  }

  /**
   * Submit feedback to the API with retry logic
   */
  async submitFeedback(data: FeedbackSubmission): Promise<SubmissionResponse> {
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}/api/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data),
          // Add timeout
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
          message: result.message || 'Feedback submitted successfully'
        };

      } catch (error) {
        console.warn(`Feedback submission attempt ${attempt} failed:`, error);

        // If this was the last attempt, throw the error
        if (attempt === this.retryAttempts) {
          if (error instanceof Error) {
            return {
              success: false,
              error: error.message
            };
          }
          return {
            success: false,
            error: 'An unexpected error occurred while submitting feedback'
          };
        }

        // Wait before retrying
        await this.delay(this.retryDelay * attempt);
      }
    }

    // This should never be reached, but TypeScript requires it
    return {
      success: false,
      error: 'Maximum retry attempts exceeded'
    };
  }

  /**
   * Validate API connectivity (optional health check)
   */
  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Update base URL for the client
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const apiClient = new FeedbackApiClient();

// Export class for custom instances
export { FeedbackApiClient };