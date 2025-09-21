import { useState, useCallback, useRef, useMemo } from 'react';
import { FeedbackSubmission, UseFeedbackApiReturn, SubmissionResponse } from '../types';
import { apiClient, FeedbackApiClient } from '../utils/api';
import { validateFeedbackSubmission } from '../utils/validation';
import { ERROR_MESSAGES } from '../utils/constants';

/**
 * Hook for handling feedback API operations
 */
export function useFeedbackApi(baseUrl?: string): UseFeedbackApiReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create API client instance - use custom baseUrl if provided, otherwise use singleton
  const client = useMemo(() => {
    if (baseUrl) {
      return new FeedbackApiClient(baseUrl);
    }
    return apiClient;
  }, [baseUrl]);


  const submitFeedback = useCallback(async (data: FeedbackSubmission): Promise<SubmissionResponse> => {
    // Reset previous error
    setError(null);
    
    try {
      // Client-side validation
      const validation = validateFeedbackSubmission(data);
      if (!validation.isValid) {
        const error = new Error(validation.errors.join(', '));
        setError(error);
        return { success: false, error: error.message };
      }

      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      setIsLoading(true);

      // Submit feedback
      const response = await client.submitFeedback(data);
      
      if (response.success) {
        // Clear any previous errors on success
        setError(null);
      } else {
        // Set error if submission failed
        const error = new Error(response.error || ERROR_MESSAGES.GENERIC_ERROR);
        setError(error);
      }
      
      return response;
      
    } catch (err) {
      // Handle network errors, timeouts, etc.
      let errorMessage: string = ERROR_MESSAGES.GENERIC_ERROR;
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request was cancelled';
        } else if (err.message.includes('fetch')) {
          errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
        } else {
          errorMessage = err.message || ERROR_MESSAGES.GENERIC_ERROR;
        }
      }
      
      const error = new Error(errorMessage);
      setError(error);
      
      return { success: false, error: error.message };
      
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  return {
    submitFeedback,
    isLoading,
    error,
  };
}

