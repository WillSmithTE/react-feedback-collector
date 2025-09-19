import { useState, useCallback, useRef, useMemo } from 'react';
import { FeedbackSubmission, UseFeedbackApiReturn, SubmissionResponse } from '../types';
import { apiClient, FeedbackApiClient } from '../utils/api';
import { validateFeedbackSubmission, checkRateLimit } from '../utils/validation';
import { ERROR_MESSAGES, DEFAULT_RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT_WINDOW } from '../utils/constants';

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

      // Rate limiting check
      const rateLimitCheck = checkRateLimit(
        data.clientId, 
        DEFAULT_RATE_LIMIT_MAX,
        DEFAULT_RATE_LIMIT_WINDOW
      );
      
      if (!rateLimitCheck.allowed) {
        const remainingTime = rateLimitCheck.remainingTime || 60;
        const error = new Error(`${ERROR_MESSAGES.RATE_LIMIT_EXCEEDED} Please wait ${remainingTime} seconds.`);
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

  // Cancel ongoing request on unmount
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    submitFeedback,
    isLoading,
    error,
    // Additional utilities
    cancelRequest,
    clearError
  } as UseFeedbackApiReturn & {
    cancelRequest: () => void;
    clearError: () => void;
  };
}

/**
 * Hook for checking API health/connectivity
 */
export function useApiHealth(baseUrl?: string) {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Create API client instance - use custom baseUrl if provided, otherwise use singleton
  const client = useMemo(() => {
    if (baseUrl) {
      return new FeedbackApiClient(baseUrl);
    }
    return apiClient;
  }, [baseUrl]);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    
    try {
      const healthy = await client.checkHealth();
      setIsHealthy(healthy);
      return healthy;
      
    } catch (error) {
      setIsHealthy(false);
      return false;
      
    } finally {
      setIsChecking(false);
    }
  }, [client]);

  return {
    isHealthy,
    isChecking,
    checkHealth
  };
}